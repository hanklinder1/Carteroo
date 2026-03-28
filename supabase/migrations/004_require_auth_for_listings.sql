-- Require authentication to create listings (previously anyone could insert)
DROP POLICY IF EXISTS "Anyone can create listing" ON listings;

CREATE POLICY "Authenticated users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
