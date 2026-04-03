"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Inquiry = {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_email: string;
  message: string;
  created_at: string;
  is_read: boolean;
  listing: { id: string; title: string } | null;
};

export default function DealerOverviewPage() {
  const [stats, setStats] = useState({
    active: 0, total: 0, unread: 0, viewsMonth: 0,
  });
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: listings } = await supabase
        .from("listings")
        .select("id, status")
        .eq("seller_id", user.id);

      const ids = (listings ?? []).map((l: { id: string }) => l.id);
      const active = (listings ?? []).filter((l: { status: string }) => l.status === "active").length;

      let unread = 0;
      let recentInq: Inquiry[] = [];

      if (ids.length > 0) {
        const { count } = await supabase
          .from("inquiries")
          .select("id", { count: "exact", head: true })
          .in("listing_id", ids)
          .eq("is_read", false);
        unread = count ?? 0;

        const { data: inqData } = await supabase
          .from("inquiries")
          .select("*, listing:listings(id, title)")
          .in("listing_id", ids)
          .order("created_at", { ascending: false })
          .limit(5);
        recentInq = (inqData ?? []) as Inquiry[];
      }

      // Views this month
      const monthStart = new Date();
      monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
      let viewsMonth = 0;
      if (ids.length > 0) {
        const { count } = await supabase
          .from("listing_views")
          .select("id", { count: "exact", head: true })
          .in("listing_id", ids)
          .gte("viewed_at", monthStart.toISOString());
        viewsMonth = count ?? 0;
      }

      setStats({ active, total: listings?.length ?? 0, unread, viewsMonth });
      setRecent(recentInq);
      setLoading(false);
    }

    load();
  }, []);

  const cards = [
    { label: "Active Listings",   value: stats.active,     href: "/dealer/listings",  color: "text-teal-700" },
    { label: "Unread Inquiries",  value: stats.unread,     href: "/dealer/inquiries", color: "text-orange-500" },
    { label: "Views This Month",  value: stats.viewsMonth, href: "/dealer/analytics", color: "text-blue-600" },
    { label: "Total Listings",    value: stats.total,      href: "/dealer/listings",  color: "text-gray-700" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-400 mb-8">Here&apos;s what&apos;s happening with your listings.</p>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-teal-700" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-200 transition-colors"
              >
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                  {card.label}
                </p>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </Link>
            ))}
          </div>

          {/* Recent inquiries */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
              <Link
                href="/dealer/inquiries"
                className="text-sm text-teal-700 hover:text-teal-800 font-medium"
              >
                View all →
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-400 text-sm">No inquiries yet.</p>
                <p className="text-gray-400 text-xs mt-1">
                  Buyer messages will appear here once your listings are live.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {recent.map((inq) => (
                  <li key={inq.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50">
                    <div className="mt-1.5 flex-shrink-0 w-2">
                      {!inq.is_read && (
                        <span className="block w-2 h-2 rounded-full bg-teal-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-gray-900">{inq.buyer_name}</p>
                        <span className="text-gray-300">·</span>
                        <p className="text-xs text-gray-400">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        Re: {inq.listing?.title ?? "Listing"}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1">{inq.message}</p>
                    </div>
                    <Link
                      href="/dealer/inquiries"
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-teal-200 flex-shrink-0"
                    >
                      Reply
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
