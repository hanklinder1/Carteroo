"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ListingSnippet = { id: string; title: string; price: number; images: string[] };
type ViewRow = { listing_id: string; viewed_at: string };

type ListingStat = {
  listing: ListingSnippet;
  views7d: number;
  views30d: number;
  viewsTotal: number;
  inquiries: number;
};

type DayBucket = { date: string; views: number };

export default function DealerAnalyticsPage() {
  const [stats, setStats]     = useState<ListingStat[]>([]);
  const [daily, setDaily]     = useState<DayBucket[]>([]);
  const [range, setRange]     = useState<7 | 30>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [range]);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: listingsData } = await supabase
      .from("listings")
      .select("id, title, price, images")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    const listings = (listingsData ?? []) as ListingSnippet[];
    const ids = listings.map((l) => l.id);
    if (ids.length === 0) { setLoading(false); return; }

    const daysAgo = (n: number) => {
      const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
    };

    const { data: rangeViewsData } = await supabase
      .from("listing_views")
      .select("listing_id, viewed_at")
      .in("listing_id", ids)
      .gte("viewed_at", daysAgo(range))
      .order("viewed_at", { ascending: true });
    const rangeViews = (rangeViewsData ?? []) as ViewRow[];

    const { data: allViewsData } = await supabase
      .from("listing_views").select("listing_id").in("listing_id", ids);
    const allViews = (allViewsData ?? []) as { listing_id: string }[];

    const { data: inqData } = await supabase
      .from("inquiries").select("listing_id").in("listing_id", ids);
    const inqCounts: Record<string, number> = {};
    (inqData ?? []).forEach((i: { listing_id: string }) => {
      inqCounts[i.listing_id] = (inqCounts[i.listing_id] ?? 0) + 1;
    });

    const listingStats: ListingStat[] = listings.map((listing) => ({
      listing,
      viewsTotal: allViews.filter((v) => v.listing_id === listing.id).length,
      views30d:   rangeViews.filter((v) => v.listing_id === listing.id).length,
      views7d:    rangeViews.filter(
        (v) => v.listing_id === listing.id && new Date(v.viewed_at) >= new Date(daysAgo(7))
      ).length,
      inquiries: inqCounts[listing.id] ?? 0,
    })).sort((a, b) => b.views30d - a.views30d);

    // Daily buckets
    const buckets: Record<string, number> = {};
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      buckets[d.toISOString().slice(0, 10)] = 0;
    }
    rangeViews.forEach((v) => {
      const day = v.viewed_at.slice(0, 10);
      if (day in buckets) buckets[day]++;
    });

    setStats(listingStats);
    setDaily(Object.entries(buckets).map(([date, views]) => ({ date, views })));
    setLoading(false);
  }

  const totalViews     = stats.reduce((s, l) => s + l.views30d, 0);
  const totalInquiries = stats.reduce((s, l) => s + l.inquiries, 0);
  const maxViews       = Math.max(...daily.map((d) => d.views), 1);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Listing views and buyer engagement</p>
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {([7, 30] as const).map((n) => (
            <button
              key={n}
              onClick={() => setRange(n)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                range === n ? "bg-teal-700 text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {n}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-teal-700" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                Views ({range}d)
              </p>
              <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                Inquiries (all time)
              </p>
              <p className="text-3xl font-bold text-teal-700">{totalInquiries}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                View → Inquiry Rate
              </p>
              <p className="text-3xl font-bold text-gray-700">
                {totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : "0.0"}%
              </p>
            </div>
          </div>

          {/* Daily chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Daily Views — Last {range} Days
            </h2>
            {daily.every((d) => d.views === 0) ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">No views recorded yet.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add the view-tracking snippet to your listing detail page to start collecting data.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-1 h-28">
                  {daily.map((bucket) => (
                    <div
                      key={bucket.date}
                      className="flex-1 rounded-sm transition-all"
                      title={`${bucket.date}: ${bucket.views} views`}
                      style={{
                        height: `${Math.max((bucket.views / maxViews) * 100, bucket.views > 0 ? 4 : 0)}%`,
                        backgroundColor: bucket.views > 0 ? "#0d9488" : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>{daily[0]?.date}</span>
                  <span>{daily[daily.length - 1]?.date}</span>
                </div>
              </>
            )}
          </div>

          {/* Per-listing table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Performance by Listing</h2>
            </div>
            {stats.length === 0 ? (
              <p className="text-sm text-gray-400 py-10 text-center">No listings yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                    <th className="text-left px-5 py-3 font-medium">Listing</th>
                    <th className="text-center px-4 py-3 font-medium">7d Views</th>
                    <th className="text-center px-4 py-3 font-medium">{range}d Views</th>
                    <th className="text-center px-4 py-3 font-medium">All-Time</th>
                    <th className="text-center px-4 py-3 font-medium">Inquiries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.map(({ listing, views7d, views30d, viewsTotal, inquiries }) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {listing.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-10 h-8 object-cover rounded flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-8 bg-gray-100 rounded flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-xs line-clamp-1">
                              {listing.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              ${Number(listing.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 font-medium">{views7d}</td>
                      <td className="px-4 py-4 text-center text-gray-700 font-medium">{views30d}</td>
                      <td className="px-4 py-4 text-center text-gray-700 font-medium">{viewsTotal}</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`font-medium ${
                            inquiries > 0 ? "text-teal-700" : "text-gray-300"
                          }`}
                        >
                          {inquiries}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
