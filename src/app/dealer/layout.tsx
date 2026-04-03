"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type DealerRecord = {
  id: string;
  user_id: string;
  name: string;
  city: string | null;
  state: string;
  logo_url: string | null;
};

const NAV_ITEMS = [
  { href: "/dealer",           label: "Overview",  icon: "▤" },
  { href: "/dealer/listings",  label: "Listings",  icon: "🛒" },
  { href: "/dealer/inquiries", label: "Inquiries", icon: "✉" },
  { href: "/dealer/analytics", label: "Analytics", icon: "📈" },
  { href: "/dealer/profile",   label: "Profile",   icon: "⚙" },
];

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [dealer, setDealer]   = useState<DealerRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread]   = useState(0);

  const isLoginPage = pathname === "/dealer/login";

  const isDemo = typeof window !== "undefined" && localStorage.getItem("dealer_demo") === "true";

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }

    // Demo mode — skip auth, use mock data
    if (typeof window !== "undefined" && localStorage.getItem("dealer_demo") === "true") {
      setDealer({
        id: "demo",
        user_id: "demo",
        name: "Demo Dealership",
        city: "Naples",
        state: "FL",
        logo_url: null,
      });
      setUnread(3);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function bootstrap() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/dealer/login"); return; }

      const { data } = await supabase
        .from("dealers")
        .select("id, user_id, name, city, state, logo_url")
        .eq("user_id", user.id)
        .single();

      if (!data) { router.replace("/dealer/login"); return; }
      setDealer(data);

      // Count unread inquiries
      const { data: myListings } = await supabase
        .from("listings")
        .select("id")
        .eq("seller_id", user.id);

      const ids = (myListings ?? []).map((l: { id: string }) => l.id);
      if (ids.length > 0) {
        const { count } = await supabase
          .from("inquiries")
          .select("id", { count: "exact", head: true })
          .in("listing_id", ids)
          .eq("is_read", false);
        setUnread(count ?? 0);
      }

      setLoading(false);
    }

    bootstrap();
  }, [pathname]);

  async function signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("dealer_demo");
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/dealer/login");
  }

  // Login page — no sidebar
  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-teal-700" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 bg-gray-900 flex flex-col">
        {/* Dealer identity */}
        <div className="px-4 py-4 border-b border-white/10">
          {dealer?.logo_url ? (
            <img
              src={dealer.logo_url}
              alt={dealer.name}
              className="w-8 h-8 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white text-sm font-bold mb-2">
              {dealer?.name?.charAt(0) ?? "D"}
            </div>
          )}
          <p className="text-white text-sm font-semibold truncate">{dealer?.name ?? "Dealer"}</p>
          <p className="text-gray-400 text-xs truncate">
            {dealer?.city ? `${dealer.city}, ${dealer.state}` : dealer?.state ?? ""}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dealer" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors relative ${
                  active
                    ? "bg-teal-700 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
                {item.href === "/dealer/inquiries" && unread > 0 && (
                  <span className="ml-auto bg-teal-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-2 py-3 border-t border-white/10">
          {isDemo && (
            <div className="mx-1 mb-2 px-2 py-1.5 rounded-lg bg-teal-900/60 text-teal-300 text-xs text-center font-medium">
              👀 Demo Mode
            </div>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>↩</span> {isDemo ? "Exit Demo" : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
