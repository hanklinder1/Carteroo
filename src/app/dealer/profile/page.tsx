"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DealerRecord = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string;
  phone: string | null;
  email: string;
  website: string | null;
  logo_url: string | null;
  specialties: string[];
  brands: string[];
};

export default function DealerProfilePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dealer, setDealer]       = useState<DealerRecord | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");

  const [form, setForm] = useState({
    name: "", description: "", address: "", city: "", state: "FL",
    phone: "", email: "", website: "", logo_url: "",
    specialties: "", brands: "",
  });

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("dealers").select("*").eq("user_id", user.id).single();
      if (data) {
        setDealer(data);
        setForm({
          name:         data.name ?? "",
          description:  data.description ?? "",
          address:      data.address ?? "",
          city:         data.city ?? "",
          state:        data.state ?? "FL",
          phone:        data.phone ?? "",
          email:        data.email ?? "",
          website:      data.website ?? "",
          logo_url:     data.logo_url ?? "",
          specialties:  (data.specialties ?? []).join(", "),
          brands:       (data.brands ?? []).join(", "),
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const supabase = createClient();
    const ext  = file.name.split(".").pop();
    const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("listings")
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      setError("Logo upload failed: " + uploadErr.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from("listings").getPublicUrl(path);
      setForm((prev) => ({ ...prev, logo_url: publicUrl }));
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dealer) return;
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: saveErr } = await supabase
      .from("dealers")
      .update({
        name:         form.name.trim(),
        description:  form.description.trim() || null,
        address:      form.address.trim() || null,
        city:         form.city.trim() || null,
        state:        form.state,
        phone:        form.phone.trim() || null,
        email:        form.email.trim(),
        website:      form.website.trim() || null,
        logo_url:     form.logo_url || null,
        specialties:  form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
        brands:       form.brands.split(",").map((s) => s.trim()).filter(Boolean),
      })
      .eq("id", dealer.id);

    if (saveErr) {
      setError(saveErr.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  const INPUT =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-gray-400";
  const LABEL = "block text-sm font-medium text-gray-700 mb-1";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-teal-700" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dealership Profile</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          This information appears on your public dealer page.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Logo</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
              {form.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-gray-300">🏪</span>
              )}
            </div>
            <div>
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:border-teal-200 transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Logo"}
              </button>
              <p className="text-xs text-gray-400 mt-1">PNG or JPG, square preferred</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Basic Information</h2>
          <div>
            <label className={LABEL}>
              Dealership Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Sunshine Golf Carts"
              className={INPUT}
              value={form.name}
              onChange={set("name")}
            />
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea
              rows={3}
              placeholder="Tell buyers about your dealership..."
              className={INPUT}
              value={form.description}
              onChange={set("description")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Phone</label>
              <input
                type="tel"
                placeholder="(407) 555-0100"
                className={INPUT}
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
            <div>
              <label className={LABEL}>
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="sales@yourdealership.com"
                className={INPUT}
                value={form.email}
                onChange={set("email")}
              />
            </div>
          </div>
          <div>
            <label className={LABEL}>Website</label>
            <input
              type="url"
              placeholder="https://yourdealership.com"
              className={INPUT}
              value={form.website}
              onChange={set("website")}
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Location</h2>
          <div>
            <label className={LABEL}>Street Address</label>
            <input
              type="text"
              placeholder="123 Golf Cart Way"
              className={INPUT}
              value={form.address}
              onChange={set("address")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>City</label>
              <input
                type="text"
                placeholder="Orlando"
                className={INPUT}
                value={form.city}
                onChange={set("city")}
              />
            </div>
            <div>
              <label className={LABEL}>State</label>
              <select className={INPUT} value={form.state} onChange={set("state")}>
                {["FL","GA","SC","NC","TX","AZ","CA","TN","AL","LA","MS"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Inventory &amp; Specialties</h2>
          <div>
            <label className={LABEL}>
              Brands Carried{" "}
              <span className="text-gray-400 font-normal text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="Club Car, EZ-GO, Yamaha, Star EV"
              className={INPUT}
              value={form.brands}
              onChange={set("brands")}
            />
          </div>
          <div>
            <label className={LABEL}>
              Specialties{" "}
              <span className="text-gray-400 font-normal text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="Custom builds, Street legal, Lifted carts"
              className={INPUT}
              value={form.specialties}
              onChange={set("specialties")}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-700 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {saved && (
            <p className="text-sm text-teal-700 font-medium">✓ Profile saved</p>
          )}
        </div>
      </form>
    </div>
  );
}
