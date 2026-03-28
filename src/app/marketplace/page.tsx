"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CartCard from "@/components/CartCard";
import { GolfCart } from "@/lib/types";
import Link from "next/link";

const makes = ["Club Car", "EZGO", "Yamaha", "Icon", "Evolution", "Bintelli"];
const conditions = ["new", "like-new", "good", "fair"];
const priceRanges = [
  { label: "Under $5,000", value: "0-5000" },
  { label: "$5,000 – $10,000", value: "5000-10000" },
  { label: "$10,000 – $15,000", value: "10000-15000" },
  { label: "$15,000 – $20,000", value: "15000-20000" },
  { label: "$20,000+", value: "20000-+" },
];

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<GolfCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [make, setMake] = useState(searchParams.get("make") ?? "");
  const [condition, setCondition] = useState(searchParams.get("condition") ?? "");
  const [price, setPrice] = useState(searchParams.get("price") ?? "");
  const [powerType, setPowerType] = useState(searchParams.get("powerType") ?? "");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (condition) params.set("condition", condition);
    if (price) params.set("price", price);
    if (powerType) params.set("powerType", powerType);

    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings ?? []))
      .finally(() => setLoading(false));
  }, [make, condition, price, powerType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Marketplace</h1>
        <p className="text-gray-400 text-sm">
          Browse golf carts for sale from private sellers and dealers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="bg-white border border-teal-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
        >
          <option value="">All Makes</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="bg-white border border-teal-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
        >
          <option value="">Any Condition</option>
          {conditions.map((c) => (
            <option key={c} value={c}>{c === "like-new" ? "Like New" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        <select
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-white border border-teal-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
        >
          <option value="">Any Price</option>
          {priceRanges.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={powerType}
          onChange={(e) => setPowerType(e.target.value)}
          className="bg-white border border-teal-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
        >
          <option value="">Power Type</option>
          <option value="electric">Electric</option>
          <option value="gas">Gas</option>
        </select>

        {(make || condition || price || powerType) && (
          <button
            onClick={() => { setMake(""); setCondition(""); setPrice(""); setPowerType(""); }}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/3] animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium mb-2">No listings found</p>
          <p className="text-gray-400 text-sm mb-6">
            Be the first to list a golf cart, or check out the demo.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/sell"
              className="bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-800 transition-colors"
            >
              Sell Your Cart
            </Link>
            <Link
              href="/demo/marketplace"
              className="border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl hover:border-teal-200 transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-4">{listings.length} listing{listings.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((cart) => (
              <CartCard key={cart.id} cart={cart} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
