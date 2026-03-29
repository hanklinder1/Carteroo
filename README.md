# Carteroo

**The nationwide golf cart marketplace.** Buy, sell, and discover golf carts anywhere in the USA — built with a Zillow/AutoTrader-style model for private sellers, dealers, and enthusiasts.

Live at [carteroo.com](https://carteroo.com)

---

## What It Does

Carteroo is a full-stack marketplace where users can:

- **Browse** active golf cart listings with filters for make, condition, power type, and price
- **List** their own cart for sale with photos, specs, and contact info
- **Contact sellers** directly via an inquiry form (email sent to seller + confirmation to buyer)
- **Boost listings** to the top of the marketplace with a featured placement (7-day or 30-day, paid via Stripe)
- **Save** favorite listings to a personal profile
- **Register as a dealer** with a subscription tier (Standard, Premium, Pro)
- **Manage listings** — mark as sold, delete, or boost from the profile dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (listing photos) |
| Payments | [Stripe](https://stripe.com) (Checkout, Subscriptions, Webhooks) |
| Email | [Resend](https://resend.com) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) |
| Deployment | [Vercel](https://vercel.com) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage with live stats + featured listings
│   ├── marketplace/
│   │   ├── page.tsx              # Listings grid with filters
│   │   └── [id]/page.tsx         # Individual listing detail + contact form
│   ├── sell/page.tsx             # Multi-step listing creation form
│   ├── profile/page.tsx          # User dashboard (listings, saved, boost)
│   ├── dealers/page.tsx          # Dealer directory
│   ├── about/page.tsx            # About page
│   ├── login/page.tsx            # Auth (login)
│   ├── register/page.tsx         # Auth (sign up)
│   ├── terms/page.tsx            # Terms of Service
│   ├── privacy/page.tsx          # Privacy Policy
│   ├── sitemap.ts                # Dynamic SEO sitemap
│   ├── robots.ts                 # robots.txt config
│   └── api/
│       ├── listings/
│       │   ├── route.ts          # GET (filtered list) + POST (create listing)
│       │   └── [id]/route.ts     # GET, PATCH, DELETE single listing
│       ├── inquiries/route.ts    # POST inquiry → emails seller + buyer
│       ├── stats/route.ts        # GET live marketplace stats
│       └── stripe/
│           ├── checkout/route.ts # POST → create Stripe checkout session
│           └── webhook/route.ts  # POST → handle Stripe events
├── components/
│   ├── CartCard.tsx              # Listing card with featured badge
│   ├── Navbar.tsx                # Top navigation
│   ├── Footer.tsx                # Site footer
│   └── marketplace/[id]/
│       └── ContactForm.tsx       # Buyer inquiry form (client component)
└── lib/
    ├── types.ts                  # GolfCart and related TypeScript types
    ├── stripe.ts                 # Stripe client + price ID constants
    └── supabase/
        ├── client.ts             # Browser Supabase client
        ├── server.ts             # Server Supabase client (SSR)
        └── admin.ts              # Service role client (bypasses RLS)

supabase/
└── migrations/
    ├── 001_initial.sql           # listings + inquiries tables
    ├── 002_profiles_dealers_favorites.sql
    ├── 003_stripe.sql            # Subscription fields + featured listing columns
    └── 004_require_auth_for_listings.sql  # RLS: only authenticated users can post
```

---

## Monetization Model

Carteroo has two revenue streams, similar to Zillow/AutoTrader:

### 1. Featured Listing Boosts (One-Time)
Private sellers can pay to pin their listing to the top of the marketplace:
- **7-day boost** — $9.99
- **30-day boost** — $19.99

Boosted listings display an amber "Featured" badge and sort above standard listings.

### 2. Dealer Subscriptions (Recurring)
Golf cart dealers can subscribe for a verified dealer profile and enhanced visibility:
- **Standard** — $29/month
- **Premium** — $79/month
- **Pro** — $149/month

Subscription status is managed via Stripe webhooks and stored in the `dealers` table.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account with a verified domain

### 1. Clone and install

```bash
git clone https://github.com/your-username/carteroo.git
cd carteroo
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Carteroo <marketplace@yourdomain.com>
```

### 3. Set up the database

Run all migrations in order in the Supabase SQL editor:

```
supabase/migrations/001_initial.sql
supabase/migrations/002_profiles_dealers_favorites.sql
supabase/migrations/003_stripe.sql
supabase/migrations/004_require_auth_for_listings.sql
```

### 4. Set up Supabase Storage

Create a public bucket named `listings` in Supabase Storage for listing photos.

### 5. Set up Stripe

1. Create the following products in the Stripe dashboard and copy their **Price IDs**
2. Update `src/lib/stripe.ts` with your price IDs:

```ts
export const STRIPE_PRICES = {
  dealerStandard: "price_...",
  dealerPremium:  "price_...",
  dealerPro:      "price_...",
  boostWeek:      "price_...",
  boostMonth:     "price_...",
} as const;
```

3. Add a webhook endpoint pointing to `https://yourdomain.com/api/stripe/webhook` with these events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

The app is deployed on Vercel. Set all environment variables from step 2 in the Vercel project settings.

```bash
# Production build check
npm run build
```

---

## Key Features & Workflows

### Listing a cart
1. User signs up / logs in
2. Navigates to `/sell` — multi-step form: Details → Specs → Photos → Review
3. Photos upload directly to Supabase Storage
4. Listing is created via `POST /api/listings` and goes live immediately

### Boosting a listing
1. Seller visits `/profile` → My Listings
2. Clicks "Boost" on any listing and selects 7-day or 30-day
3. Redirected to Stripe Checkout
4. On success, webhook fires → listing's `is_featured` set to `true`, `featured_until` set
5. Seller returns to profile and sees amber "Boosted until [date]" indicator
6. Featured listings automatically expire (cleaned up on next marketplace load)

### Buyer inquiry flow
1. Buyer visits a listing page at `/marketplace/[id]`
2. Fills out the contact form (name, email, phone, message)
3. Inquiry saved to `inquiries` table in Supabase
4. Seller receives email notification via Resend
5. Buyer receives a confirmation email with their message

---

## License

Private — all rights reserved.
