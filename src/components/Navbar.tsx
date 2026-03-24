"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { useDemo } from "@/hooks/useDemo";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDemo, toggleDemo } = useDemo();

  const prefix = isDemo ? "/demo" : "";

  const leftLinks = [
    { href: `${prefix}/marketplace`, label: "Buy" },
    { href: `${prefix}/sell`, label: "Sell" },
    { href: `${prefix}/dealers`, label: "Dealers" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[64px] items-center">
          {/* Left nav links */}
          <div className="hidden md:flex items-center gap-7">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-teal-500 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center logo */}
          <Link
            href={isDemo ? "/demo" : "/"}
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-gray-900"
          >
            <ShoppingCart size={24} className="text-teal-600" />
            Cart<span className="text-teal-600">Market</span>
          </Link>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDemo}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                isDemo
                  ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isDemo ? "Exit Demo" : "Try Demo"}
            </button>
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-full transition-colors"
            >
              <User size={15} />
              Sign In
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 animate-fade-in">
          {leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-gray-900 hover:text-teal-600 text-sm font-semibold border-b border-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => {
                toggleDemo();
                setMobileOpen(false);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                isDemo
                  ? "bg-teal-100 text-teal-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isDemo ? "Exit Demo" : "Try Demo"}
            </button>
            <Link
              href="/login"
              className="text-white bg-teal-600 hover:bg-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
