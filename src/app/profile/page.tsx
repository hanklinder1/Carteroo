"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, MapPin, Calendar, Plus, Pencil, Trash2, CheckCircle, Heart, Zap, PartyPopper } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CartCard from "@/components/CartCard";
import type { GolfCart } from "@/lib/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  created_at: string;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myListings, setMyListings] = useState<GolfCart[]>([]);
  const [favorites, setFavorites] = useState<GolfCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "saved">("listings");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [boosting, setBoosting] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setUser(user);

      // Fetch profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (prof) {
        setProfile(prof);
        setEditForm({ name: prof.name ?? "", phone: prof.phone ?? "", location: prof.location ?? "" });
      }

      // Fetch my listings
      const { data: listings } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (listings) {
        setMyListings(listings.map((row) => ({
          id: row.id, title: row.title, description: row.description,
          price: Number(row.price), year: Number(row.year), make: row.make,
          model: row.model, condition: row.condition, seats: Number(row.seats),
          topSpeed: Number(row.top_speed), range: row.range, powerType: row.power_type,
          images: row.images ?? [], features: row.features ?? [], location: row.location,
          sellerId: row.seller_id ?? "", sellerName: row.seller_name,
          sellerEmail: row.seller_email, sellerPhone: row.seller_phone ?? "",
          createdAt: row.created_at, isFeatured: row.is_featured ?? false,
        })));
      }

      // Fetch favorites
      const { data: favs } = await supabase
        .from("favorites")
        .select("listing_id, listings(*)")
        .eq("user_id", user.id);

      if (favs) {
        const favListings = favs
          .map((f) => f.listings as unknown as Record<string, unknown> | null)
          .filter(Boolean)
          .map((row) => ({
            id: row!.id as string, title: row!.title as string,
            description: row!.description as string, price: Number(row!.price),
            year: Number(row!.year), make: row!.make as string,
            model: row!.model as string, condition: row!.condition as GolfCart["condition"],
            seats: Number(row!.seats), topSpeed: Number(row!.top_speed),
            range: row!.range as string, powerType: row!.power_type as GolfCart["powerType"],
            images: (row!.images as string[]) ?? [], features: (row!.features as string[]) ?? [],
            location: row!.location as string, sellerId: (row!.seller_id as string) ?? "",
            sellerName: row!.seller_name as string, sellerEmail: row!.seller_email as string,
            sellerPhone: (row!.seller_phone as string) ?? "", createdAt: row!.created_at as string,
            isFeatured: (row!.is_featured as boolean) ?? false,
          }));
        setFavorites(favListings);
      }

      setLoading(false);
    });
  }, []);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").upsert({
      id: user.id,
      name: editForm.name,
      phone: editForm.phone,
      location: editForm.location,
      email: user.email,
    });
    setProfile((prev) => prev ? { ...prev, ...editForm } : null);
    setEditing(false);
    setSaving(false);
  }

  async function deleteListing(id: string) {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setMyListings((prev) => prev.filter((l) => l.id !== id));
  }

  async function boostListing(id: string, type: "boostWeek" | "boostMonth") {
    setBoosting(id);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, listingId: id }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setBoosting(null); return; }
    window.location.href = url;
  }

  async function markSold(id: string) {
    await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sold" }),
    });
    setMyListings((prev) => prev.filter((l) => l.id !== id));
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-gray-400" size={28} />
        </div>
        <h2 className="text-gray-800 font-semibold mb-2">Sign in to view your profile</h2>
        <p className="text-gray-400 text-sm mb-6">Access your listings, saved carts, and account settings.</p>
        <Link href="/login" className="bg-teal-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-teal-800 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

      {paymentStatus === "success" && (
        <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
          <PartyPopper size={18} className="text-teal-600 flex-shrink-0" />
          Payment successful! Your listing has been boosted and will appear at the top of the marketplace.
        </div>
      )}
      {paymentStatus === "cancelled" && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl px-4 py-3 mb-6 text-sm">
          Payment cancelled — no charge was made.
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="text-gray-400" size={28} />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-lg">{profile?.name || user.email}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>

        {editing ? (
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input
                value={editForm.location}
                onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="City, State"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-xl hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
            {profile?.location && (
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={14} className="text-teal-500" />
                {profile.location}
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={14} className="text-teal-500" />
              Member since {joinedDate}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            activeTab === "listings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Listings
          {myListings.length > 0 && (
            <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
              {myListings.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            activeTab === "saved" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Heart size={14} />
          Saved
          {favorites.length > 0 && (
            <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* My Listings */}
      {activeTab === "listings" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm">{myListings.length} listing{myListings.length !== 1 ? "s" : ""}</p>
            <Link
              href="/sell"
              className="flex items-center gap-1 bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-800 transition-colors"
            >
              <Plus size={14} />
              New Listing
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm mb-4">You haven&apos;t listed any carts yet.</p>
              <Link href="/sell" className="text-teal-700 text-sm font-medium hover:text-teal-800">
                Create your first listing →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((cart) => (
                <div key={cart.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      {cart.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cart.images[0]} alt={cart.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-teal-50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-900 font-medium text-sm truncate">{cart.title}</p>
                      <p className="text-gray-400 text-xs">${cart.price.toLocaleString()} · {cart.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/marketplace/${cart.id}`}
                      className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      View
                    </Link>
                    <div className="relative group">
                      <button
                        disabled={boosting === cart.id}
                        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
                      >
                        <Zap size={13} />
                        {boosting === cart.id ? "..." : "Boost"}
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-1 hidden group-hover:block z-10 w-40">
                        <button
                          onClick={() => boostListing(cart.id, "boostWeek")}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors"
                        >
                          7 days — $9.99
                        </button>
                        <button
                          onClick={() => boostListing(cart.id, "boostMonth")}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-colors"
                        >
                          30 days — $19.99
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => markSold(cart.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-700 px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <CheckCircle size={13} />
                      Sold
                    </button>
                    <button
                      onClick={() => deleteListing(cart.id)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved */}
      {activeTab === "saved" && (
        <div>
          {favorites.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm mb-4">No saved carts yet.</p>
              <Link href="/marketplace" className="text-teal-700 text-sm font-medium hover:text-teal-800">
                Browse marketplace →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((cart) => (
                <CartCard key={cart.id} cart={cart} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}
