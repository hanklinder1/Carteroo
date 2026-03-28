import Stripe from "stripe";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// ⚠️ Replace these with PRICE IDs (price_...) not Product IDs (prod_...)
// In Stripe Dashboard → Product Catalog → click each product → copy the ID under "Pricing"
export const STRIPE_PRICES = {
  dealerStandard: "price_1TG2tfE9nsr5lND0H70EeFZT",
  dealerPremium:  "price_1TG2u7E9nsr5lND0GcBYPx6g",
  dealerPro:      "price_1TG2uSE9nsr5lND0u3n3TGcS",
  boostWeek:      "price_1TG2uyE9nsr5lND0CEZmmbyk",
  boostMonth:     "price_1TG2vHE9nsr5lND0z3C6OOPw",
} as const;

export type DealerTier = "free" | "standard" | "premium" | "pro";