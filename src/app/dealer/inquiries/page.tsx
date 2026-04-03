"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ListingSnippet = { id: string; title: string; price: number; year: number; make: string; model: string };
type Inquiry = {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
  listing: ListingSnippet | null;
};

type FilterTab = "all" | "unread" | "read";

export default function DealerInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<FilterTab>("all");

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: myListings } = await supabase
      .from("listings").select("id").eq("seller_id", user.id);
    const ids = (myListings ?? []).map((l: { id: string }) => l.id);

    if (ids.length === 0) { setLoading(false); return; }

    const { data } = await supabase
      .from("inquiries")
      .select("*, listing:listings(id, title, price, year, make, model)")
      .in("listing_id", ids)
      .order("created_at", { ascending: false });

    setInquiries((data ?? []) as Inquiry[]);
    setLoading(false);
  }

  async function openInquiry(inq: Inquiry) {
    setSelected(inq.id);
    if (inq.is_read) return;
    const supabase = createClient();
    await supabase.from("inquiries").update({ is_read: true }).eq("id", inq.id);
    setInquiries((prev) => prev.map((i) => i.id === inq.id ? { ...i, is_read: true } : i));
  }

  const filtered =
    filter === "unread" ? inquiries.filter((i) => !i.is_read) :
    filter === "read"   ? inquiries.filter((i) => i.is_read) :
    inquiries;

  const active = inquiries.find((i) => i.id === selected) ?? null;
  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {(["all", "unread", "read"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === tab ? "bg-teal-700 text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-teal-700" />
        </div>
      ) : (
        <div className="flex gap-5" style={{ height: "calc(100vh - 260px)", minHeight: "400px" }}>
          {/* List */}
          <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-400">No {filter !== "all" ? filter + " " : ""}inquiries.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {filtered.map((inq) => (
                  <li
                    key={inq.id}
                    onClick={() => openInquiry(inq)}
                    className={`px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selected === inq.id ? "bg-teal-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-1.5 w-2 flex-shrink-0">
                        {!inq.is_read && (
                          <span className="block w-2 h-2 rounded-full bg-teal-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-sm font-semibold text-gray-900 truncate">{inq.buyer_name}</p>
                          <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {new Date(inq.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mb-1 truncate">
                          {inq.listing?.title ?? "Listing"}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-2">{inq.message}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail panel */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto">
            {active ? (
              <div className="p-6">
                {/* Listing context */}
                <div className="flex items-start justify-between mb-6 pb-5 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Re: Listing</p>
                    <a
                      href={`/marketplace/${active.listing?.id}`}
                      target="_blank"
                      className="text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                    >
                      {active.listing?.title ?? "Listing"}
                    </a>
                    {active.listing && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        ${Number(active.listing.price).toLocaleString()} ·{" "}
                        {active.listing.year} {active.listing.make} {active.listing.model}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(active.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Buyer */}
                <div className="mb-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">From</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center text-white text-sm font-bold">
                      {active.buyer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{active.buyer_name}</p>
                      <p className="text-xs text-gray-400">{active.buyer_email}</p>
                      {active.buyer_phone && (
                        <p className="text-xs text-gray-400">{active.buyer_phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Message</p>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                    {active.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${active.buyer_email}?subject=Re: ${encodeURIComponent(active.listing?.title ?? "Your Inquiry on Carteroo")}`}
                    className="bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors"
                  >
                    Reply via Email
                  </a>
                  {active.buyer_phone && (
                    <a
                      href={`tel:${active.buyer_phone}`}
                      className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:border-teal-200 transition-colors"
                    >
                      Call {active.buyer_name.split(" ")[0]}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-300 text-4xl mb-3">✉</p>
                  <p className="text-sm text-gray-400">Select an inquiry to view it</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
