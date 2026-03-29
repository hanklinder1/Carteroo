import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";
import { getAdmin } from "@/lib/supabase/admin";

function tierFromPriceId(priceId: string): string {
  if (priceId === STRIPE_PRICES.dealerStandard) return "standard";
  if (priceId === STRIPE_PRICES.dealerPremium)  return "premium";
  if (priceId === STRIPE_PRICES.dealerPro)      return "pro";
  return "free";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getAdmin();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, type, listingId } = session.metadata ?? {};

    // Featured listing boost (one-time payment)
    if ((type === "boostWeek" || type === "boostMonth") && listingId) {
      const days = type === "boostWeek" ? 7 : 30;
      const featuredUntil = new Date();
      featuredUntil.setDate(featuredUntil.getDate() + days);

      await db.from("listings").update({
        is_featured: true,
        featured_until: featuredUntil.toISOString(),
      }).eq("id", listingId);
    }

    // Dealer subscription started
    if (["dealerStandard", "dealerPremium", "dealerPro"].includes(type)) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id ?? "";
      const tier = tierFromPriceId(priceId);

      await db.from("dealers")
        .update({
          subscription_tier: tier,
          subscription_status: "active",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq("user_id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    await db.from("dealers")
      .update({ subscription_tier: "free", subscription_status: "inactive" })
      .eq("stripe_subscription_id", sub.id);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    await db.from("dealers")
      .update({ subscription_status: "past_due" })
      .eq("stripe_customer_id", invoice.customer as string);
  }

  return NextResponse.json({ received: true });
}
