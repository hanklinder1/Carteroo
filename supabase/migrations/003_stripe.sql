-- Add Stripe fields to dealers table
ALTER TABLE dealers
  ADD COLUMN IF NOT EXISTS subscription_tier    TEXT    NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status  TEXT    NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS stripe_customer_id   TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add featured listing fields to listings table
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS is_featured    BOOLEAN     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;