import { createClient } from "@supabase/supabase-js";

// Call getAdmin() inside functions — never at module level — so env vars
// are only read at runtime, not during Vercel's build-time static analysis.
export function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
