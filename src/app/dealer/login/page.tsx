"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DealerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [resetSent, setResetSent] = useState(false);

  function handleDemo() {
    if (typeof window !== "undefined") {
      localStorage.setItem("dealer_demo", "true");
    }
    router.push("/dealer");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dealer");
      router.refresh();
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dealer`,
    });

    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  }

  const INPUT =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-gray-400";

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dealer Portal</h1>
        <p className="text-gray-400 text-sm">Sign in to manage your Carteroo listings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {mode === "login" ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@dealership.com"
                  className={INPUT}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={INPUT}
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 text-white font-medium py-2.5 rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <button
              type="button"
              onClick={handleDemo}
              className="mt-4 w-full border border-teal-200 text-teal-700 font-medium py-2.5 rounded-xl hover:bg-teal-50 transition-colors text-sm"
            >
              👀 Preview Demo Portal
            </button>

            <button
              onClick={() => setMode("reset")}
              className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-700"
            >
              Forgot your password?
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Not set up yet?{" "}
              <a href="mailto:marketplace@carteroo.com" className="text-teal-700 hover:text-teal-800">
                Contact us to get listed
              </a>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-base font-semibold text-gray-800 mb-1">Reset your password</h2>
            <p className="text-xs text-gray-400 mb-4">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {resetSent ? (
              <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-sm text-teal-700">
                Check your inbox — a reset link is on its way.
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@dealership.com"
                  className={INPUT}
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-700 text-white font-medium py-2.5 rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <button
              onClick={() => setMode("login")}
              className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-700"
            >
              ← Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
