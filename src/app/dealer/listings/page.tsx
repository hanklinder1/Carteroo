"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Listing = {
  id: string;
  title: string;
  price: number;
  year: number;
  make: string;
  model: string;
  condition: string;
  images: string[];
  location: string | null;
  status: string;
  created_at: string;
};

const CONDITION_LABEL: Record<string, string> = {
  "new": "New", "like-new": "Like New", "excellent": "Excellent", "good": "Good", "fair": "Fair",
};

const STATUS_STYLE: Record<string, string> = {
  active:   "bg-teal-50 text-teal-700",
  sold:     "bg-yellow-50 text-yellow-700",
  inactive: "bg-gray-100 text-gray-500",
};

type FilterType = "all" | "active" | "sold" | "inactive";

export default function DealerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<FilterType>("all");
  const [busy, setBusy]         = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("listings")
      .select("id, title, price, year, make, model, condition, images, location, status, created_at")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    setListings((data ?? []) as Listing[]);
    setLoading(false);
  }

  async function setStatus(id: string, status: string) {
    setBusy(id);
    const supabase = createClient();
    await supabase.from("listings").update({ status }).eq("id", id);
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    setBusy(null);
  }

  async function deleteListing(id: string) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setBusy(id);
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    setBusy(null);
  }

  const filtered = filter === "all" ? listings : listings.filter((l) => l.status === filter);
  const counts = {
    all: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    sold: listings.filter((l) => l.status === "sold").length,
    inactive: listings.filter((l) => l.status === "inactive").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
          <p className="text-sm text-gray-400 mt-0.5">{listings.length} total</p>
        </div>
        <a
          href="/sell"
          className="bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors"
        >
          + Add Listing
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {(["all", "active", "sold", "inactive"] as FilterType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === tab ? "bg-teal-700 text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}{" "}
            <span className="opacity-60">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-teal-700" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-400 text-sm">
            {filter === "all" ? "No listings yet." : `No ${filter} listings.`}
          </p>
          {filter === "all" && (
            <a
              href="/sell"
              className="inline-block mt-4 bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-800 transition-colors"
            >
              Add Your First Listing
            </a>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Cart</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Condition</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Listed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-gray-50 transition-colors"
                  style={{ opacity: busy === listing.id ? 0.5 : 1 }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {listing.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-9 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="text-gray-300 text-lg">🛒</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-gray-400">
                          {listing.year} {listing.make} {listing.model}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    ${Number(listing.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {CONDITION_LABEL[listing.condition] ?? listing.condition}
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">{listing.location ?? "—"}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        STATUS_STYLE[listing.status] ?? STATUS_STYLE.inactive
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-xs">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={`/marketplace/${listing.id}`}
                        target="_blank"
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-teal-200"
                      >
                        View
                      </a>
                      {listing.status === "active" ? (
                        <button
                          onClick={() => setStatus(listing.id, "sold")}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-teal-200"
                        >
                          Mark Sold
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatus(listing.id, "active")}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-teal-200"
                        >
                          Relist
                        </button>
                      )}
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
