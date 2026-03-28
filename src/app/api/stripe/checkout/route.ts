import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
  }

  const body = await req.json();
  const { type, listingId } = body;
  // type: "dealerStandard" | "dealerPremium" | "dealerPro" | "boostWeek" | "boostMonth"

  const priceId = STRIPE_PRICES[type as keyof typeof STRIPE_PRICES];
  if (!priceId || priceId.startsWith("price_REPLACE_ME")) {
    return NextResponse.json({ error: "Invalid product type or price not configured" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const isSubscription = ["dealerStandard", "dealerPremium", "dealerPro"].includes(type);

  const session = await stripe.checkout.sessions.create({
    mode: isSubscription ? "subscription" : "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    metadata: {
      userId: user.id,
      type,
      ...(listingId ? { listingId } : {}),
    },
    success_url: `${origin}/profile?payment=success`,
    cancel_url:  `${origin}/profile?payment=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
