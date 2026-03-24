"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Shield, Handshake, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/demo/marketplace`);
  };

  return (
    <div>
      {/* Zillow-style Hero with background image */}
      <section className="relative h-[480px] sm:h-[520px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/carts/golf-cart-sunset.jpg"
          alt="Golf cart on course"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-2 tracking-tight leading-tight">
            Golf Carts.
            <br />
            <span className="text-white">Buy. Sell. Ride.</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Florida&apos;s #1 golf cart marketplace
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search by make, model, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-4 text-gray-700 text-base placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-4 bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Search className="text-white" size={22} />
              </button>
            </div>
          </form>

          <div className="mt-4">
            <Link
              href="/demo"
              className="text-white/90 hover:text-white text-sm font-medium underline underline-offset-4"
            >
              See demo with sample listings
            </Link>
          </div>
        </div>
      </section>

      {/* How it works — Zillow-style clean section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-blue-600" size={24} />
              </div>
              <h3 className="text-gray-900 font-bold mb-2">Browse Listings</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Search through carts from private sellers and authorized dealers.
                Filter by price, make, condition, and more.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="text-gray-900 font-bold mb-2">Verified Sellers</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every dealer is verified and reviewed. Private sellers create
                profiles so you know who you&apos;re buying from.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="text-blue-600" size={24} />
              </div>
              <h3 className="text-gray-900 font-bold mb-2">Close the Deal</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Message sellers directly, schedule test drives, and finalize
                your purchase — all through CartMarket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Ready to list your cart?
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
            Create a free account and post your listing in minutes. Reach thousands
            of potential buyers in your area.
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Selling
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
