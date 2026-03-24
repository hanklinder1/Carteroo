"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
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

  const rightLinks = [
    { href: "/login", label: "Sign In" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[60px] items-center">
          {/* Left nav links */}
          <div className="hidden md:flex items-center gap-6">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center logo */}
          <Link
            href={isDemo ? "/demo" : "/"}
            className="text-2xl font-extrabold tracking-tight text-gray-900"
          >
            Cart<span className="text-blue-600">Market</span>
          </Link>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDemo}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                isDemo
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isDemo ? "Exit Demo" : "Try Demo"}
            </button>
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <User size={16} />
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
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          {leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-gray-800 hover:text-blue-600 text-sm font-bold border-b border-gray-50"
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
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isDemo ? "Exit Demo" : "Try Demo"}
            </button>
            <Link
              href="/login"
              className="text-gray-800 hover:text-blue-600 text-sm font-bold"
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
