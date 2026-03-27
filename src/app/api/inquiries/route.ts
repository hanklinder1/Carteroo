import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: Add your verified Resend domain email here, e.g. "Carteroo <noreply@yourdomain.com>"
// Until your domain is verified, use "onboarding@resend.dev" (sends only to your Resend account email)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { listingId, buyerName, buyerEmail, buyerPhone, message } = body;

  if (!listingId || !buyerName || !buyerEmail || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Fetch the listing to get seller info
  const { data: listing, error: listingError } = await getAdmin()
    .from("listings")
    .select("title, seller_name, seller_email")
    .eq("id", listingId)
    .single();

  if (listingError || !listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Save inquiry to DB
  const { error: inquiryError } = await getAdmin().from("inquiries").insert({
    listing_id: listingId,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    buyer_phone: buyerPhone ?? "",
    message,
  });

  if (inquiryError) {
    return NextResponse.json({ error: inquiryError.message }, { status: 500 });
  }

  // Send email to seller via Resend
  const { error: emailError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: listing.seller_email,
    subject: `New inquiry on your listing: ${listing.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f766e;">New Inquiry — Carteroo</h2>
        <p>Hi <strong>${listing.seller_name}</strong>,</p>
        <p>Someone is interested in your listing: <strong>${listing.title}</strong></p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p><strong>From:</strong> ${buyerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${buyerEmail}">${buyerEmail}</a></p>
        ${buyerPhone ? `<p><strong>Phone:</strong> ${buyerPhone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9fafb; border-left: 4px solid #0f766e; padding: 12px 16px; margin: 0; border-radius: 4px;">
          ${message}
        </blockquote>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 13px;">Reply directly to this email to respond to the buyer.</p>
      </div>
    `,
    replyTo: buyerEmail,
  });

  if (emailError) {
    // Inquiry saved, but email failed — don't block the user
    console.error("Resend error:", emailError);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
