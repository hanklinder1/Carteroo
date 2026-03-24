"use client";

import Link from "next/link";
import Image from "next/image";
import { demoCarts } from "@/data/demo-carts";
import CartCard from "@/components/CartCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoHome() {
  const featured = demoCarts.slice(0, 4);
  const trending = demoCarts.slice(0, 8);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/demo/marketplace");
  };

  return (
    <div>
      {/* Demo banner */}
      <div className="bg-blue-50 border-b border-blue-100 py-2 text-center">
        <p className="text-blue-700 text-xs font-medium">
          You&apos;re viewing the demo — these are sample listings.{" "}
          <Link href="/" className="underline font-bold">
            Exit demo
          </Link>
        </p>
      </div>

      {/* Zillow-style Hero */}
      <section className="relative h-[480px] sm:h-[520px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/carts/golf-cart-sunset.jpg"
          alt="Golf cart on course"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-2 tracking-tight leading-tight">
            Golf Carts.
            <br />
            Buy. Sell. Ride.
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Florida&apos;s #1 golf cart marketplace
          </p>

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
        </div>
      </section>

      {/* Trending Carts — Zillow-style horizontal scroll section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Trending Carts in Florida
            </h2>
            <p className="text-gray-500 text-sm">
              Most viewed listings over the past 24 hours
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x"
        >
          {trending.map((cart) => (
            <div key={cart.id} className="min-w-[280px] max-w-[300px] snap-start flex-shrink-0">
              <CartCard cart={cart} linkPrefix="/demo" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Grid */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">Featured Listings</h2>
            <Link
              href="/demo/marketplace"
              className="text-blue-600 hover:text-blue-700 text-sm font-bold"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((cart) => (
              <CartCard key={cart.id} cart={cart} linkPrefix="/demo" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
