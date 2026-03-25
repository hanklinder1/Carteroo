"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Shield,
  Handshake,
  ChevronRight,
  Zap,
  Star,
  TrendingUp,
  BadgeCheck,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { demoCarts } from "@/data/demo-carts";
import CartCard from "@/components/CartCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const featured = demoCarts.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/demo/marketplace`);
  };

  const stats = [
    { value: "2,500+", label: "Active Listings", icon: TrendingUp },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
    { value: "150+", label: "Verified Dealers", icon: BadgeCheck },
    { value: "50+", label: "Florida Cities", icon: MapPin },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[520px] sm:h-[580px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/carts/golfcart-white-luxury.jpg"
          alt="Luxury golf cart"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-600/20 backdrop-blur-sm border border-teal-400/30 text-teal-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap size={14} />
            Welcome to Whrrly
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight leading-tight">
            Find Your Perfect
            <br />
            <span className="text-teal-400">Golf Cart</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Buy and sell golf carts from trusted sellers and dealers across Florida
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/20">
              <div className="pl-5">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by make, model, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-4 text-gray-700 text-base placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-4 bg-teal-600 hover:bg-teal-700 transition-colors m-1.5 rounded-xl"
              >
                <Search className="text-white" size={20} />
              </button>
            </div>
          </form>

          <div className="mt-5 flex items-center justify-center gap-4 text-white/60 text-sm">
            <span>Popular:</span>
            <Link href="/demo/marketplace" className="hover:text-teal-400 transition-colors underline underline-offset-2">Club Car</Link>
            <Link href="/demo/marketplace" className="hover:text-teal-400 transition-colors underline underline-offset-2">EZGO</Link>
            <Link href="/demo/marketplace" className="hover:text-teal-400 transition-colors underline underline-offset-2">Yamaha</Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-50 rounded-xl mb-2">
                    <stat.icon size={20} className="text-teal-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Browse</span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                  Featured Listings
                </h2>
              </div>
              <Link
                href="/demo/marketplace"
                className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-bold group"
              >
                View all
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((cart) => (
                <CartCard key={cart.id} cart={cart} linkPrefix="/demo" />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Simple Process</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                How It Works
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ScrollReveal delay={0}>
              <div className="text-center group">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-teal-100 transition-colors group-hover:scale-110 transition-transform duration-300">
                  <Search className="text-teal-600" size={28} />
                </div>
                <div className="text-teal-600 text-xs font-bold mb-2">Step 1</div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Browse Listings</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Search through carts from private sellers and authorized dealers.
                  Filter by price, make, condition, and more.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="text-center group">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-teal-100 transition-colors group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-teal-600" size={28} />
                </div>
                <div className="text-teal-600 text-xs font-bold mb-2">Step 2</div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Verified Sellers</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every dealer is verified and reviewed. Private sellers create
                  profiles so you know who you&apos;re buying from.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="text-center group">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-teal-100 transition-colors group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="text-teal-600" size={28} />
                </div>
                <div className="text-teal-600 text-xs font-bold mb-2">Step 3</div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">Close the Deal</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Message sellers directly, schedule test drives, and finalize
                  your purchase — all through Whrrly.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trust badges section */}
      <section className="bg-teal-600 py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
                  <Shield size={24} className="text-white" />
                </div>
                <h3 className="text-white font-bold mb-1">Buyer Protection</h3>
                <p className="text-teal-100 text-sm">Every transaction backed by our guarantee</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
                  <BadgeCheck size={24} className="text-white" />
                </div>
                <h3 className="text-white font-bold mb-1">Verified Dealers</h3>
                <p className="text-teal-100 text-sm">All dealers are vetted and reviewed</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
                  <Star size={24} className="text-white" />
                </div>
                <h3 className="text-white font-bold mb-1">5-Star Support</h3>
                <p className="text-teal-100 text-sm">Dedicated team to help you every step</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-3xl p-10 sm:p-14 text-center border border-teal-100">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                Ready to list your cart?
              </h2>
              <p className="text-gray-500 text-base mb-8 max-w-lg mx-auto">
                Create a free account and post your listing in minutes. Reach thousands
                of potential buyers across Florida.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 bg-teal-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-teal-700 transition-all hover:shadow-lg hover:shadow-teal-600/20"
                >
                  Start Selling
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 bg-white text-gray-700 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  Explore Demo
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
