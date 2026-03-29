"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import Image from "next/image";
import { useDemo } from "@/hooks/useDemo";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { isDemo, toggleDemo } = useDemo();

  const prefix = isDemo ? "/demo" : "";

  const leftLinks = [
    { href: `${prefix}/marketplace`, label: "Buy" },
    { href: `${prefix}/sell`, label: "Sell" },
    { href: `${prefix}/dealers`, label: "Dealers" },
    { href: "/about", label: "About" },
  ];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Account";

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
            <Image
              src="/images/golf-cart.png"
              alt="Carteroo logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span>Carter<span className="text-teal-600">oo</span></span>
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

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center">
                    <User size={13} className="text-teal-700" />
                  </div>
                  {displayName}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-full transition-colors"
              >
                <User size={15} />
                Sign In
              </Link>
            )}
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
              onClick={() => { toggleDemo(); setMobileOpen(false); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                isDemo ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {isDemo ? "Exit Demo" : "Try Demo"}
            </button>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 text-sm font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="text-gray-400 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-white bg-teal-600 hover:bg-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
