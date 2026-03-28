"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, ChevronRight, ChevronLeft, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const steps = ["Details", "Specs", "Photos", "Review"];

export default function SellPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    year: "",
    make: "",
    model: "",
    condition: "",
    seats: "",
    topSpeed: "",
    range: "",
    powerType: "",
    location: "",
    features: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login?next=/sell"); return; }
      setUserId(user.id);
      // Pre-fill seller info from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email, phone")
        .eq("id", user.id)
        .single();
      if (profile) {
        setForm((prev) => ({
          ...prev,
          sellerName: profile.name ?? prev.sellerName,
          sellerEmail: profile.email ?? user.email ?? prev.sellerEmail,
          sellerPhone: profile.phone ?? prev.sellerPhone,
        }));
      } else {
        setForm((prev) => ({ ...prev, sellerEmail: user.email ?? prev.sellerEmail }));
      }
    });
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 10 - images.length);
    if (!files.length) return;
    setUploading(true);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("listings").upload(path, file, { upsert: false });
      if (!error) {
        const { data } = supabase.storage.from("listings").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    // Reset input so same file can be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        year: Number(form.year),
        make: form.make,
        model: form.model,
        condition: form.condition,
        seats: form.seats ? Number(form.seats) : null,
        topSpeed: form.topSpeed ? Number(form.topSpeed) : null,
        range: form.range,
        powerType: form.powerType,
        location: form.location,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        images,
        sellerName: form.sellerName,
        sellerEmail: form.sellerEmail,
        sellerPhone: form.sellerPhone,
        userId,
      }),
    });

    if (res.ok) {
      const { id } = await res.json();
      router.push(`/marketplace/${id}`);
    } else {
      const { error } = await res.json();
      setSubmitError(error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const canPublish =
    form.title &&
    form.price &&
    form.year &&
    form.make &&
    form.condition &&
    form.powerType &&
    form.sellerName &&
    form.sellerEmail;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Sell Your Cart</h1>
      <p className="text-gray-400 text-sm mb-8">
        Create a listing to reach thousands of buyers in your area.
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                i <= currentStep
                  ? "bg-teal-700 text-white"
                  : "bg-teal-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                i <= currentStep ? "text-gray-800 font-medium" : "text-gray-400"
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-teal-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 1: Details */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cart Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g., 2024 Club Car Onward - Custom Build"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                placeholder="Describe your cart, including any modifications, recent maintenance, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="12000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="The Villages, FL"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Contact Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={form.sellerName}
                    onChange={(e) => update("sellerName", e.target.value)}
                    placeholder="John Smith"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input
                    type="tel"
                    value={form.sellerPhone}
                    onChange={(e) => update("sellerPhone", e.target.value)}
                    placeholder="(352) 555-0100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.sellerEmail}
                  onChange={(e) => update("sellerEmail", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <p className="text-gray-400 text-xs mt-1">Buyers will contact you at this address.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Specs */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="2024"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <select
                  value={form.make}
                  onChange={(e) => update("make", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="">Select make</option>
                  <option value="Club Car">Club Car</option>
                  <option value="EZGO">EZGO</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Icon">Icon</option>
                  <option value="Evolution">Evolution</option>
                  <option value="Bintelli">Bintelli</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => update("model", e.target.value)}
                  placeholder="Onward"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => update("condition", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <select
                  value={form.seats}
                  onChange={(e) => update("seats", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="">Select</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Power Type</label>
                <select
                  value={form.powerType}
                  onChange={(e) => update("powerType", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <option value="">Select</option>
                  <option value="electric">Electric</option>
                  <option value="gas">Gas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Top Speed (mph)</label>
                <input
                  type="number"
                  value={form.topSpeed}
                  onChange={(e) => update("topSpeed", e.target.value)}
                  placeholder="25"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Range</label>
                <input
                  type="text"
                  value={form.range}
                  onChange={(e) => update("range", e.target.value)}
                  placeholder="40 miles"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
              <input
                type="text"
                value={form.features}
                onChange={(e) => update("features", e.target.value)}
                placeholder="Lift Kit, LED Lights, Bluetooth Speakers"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Photos</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-teal-300 transition-colors"
            >
              <Upload className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="text-gray-500 text-sm font-medium mb-1">
                {uploading ? "Uploading..." : "Click to add photos"}
              </p>
              <p className="text-gray-400 text-xs mb-4">
                Max 10 photos, 5 MB each · JPG, PNG, WebP
              </p>
              <button
                type="button"
                disabled={uploading}
                className="bg-teal-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-200 transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Choose Files"}
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} className="text-white" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-400 text-xs mt-3">
              {images.length}/10 photos added. First photo will be the cover image.
            </p>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Your Listing</h2>
            <div className="space-y-3">
              {[
                ["Title", form.title],
                ["Price", form.price ? `$${Number(form.price).toLocaleString()}` : ""],
                ["Year", form.year],
                ["Make / Model", `${form.make} ${form.model}`.trim()],
                ["Condition", form.condition],
                ["Seats", form.seats],
                ["Power", form.powerType],
                ["Top Speed", form.topSpeed ? `${form.topSpeed} mph` : ""],
                ["Range", form.range],
                ["Location", form.location],
                ["Features", form.features],
                ["Photos", images.length > 0 ? `${images.length} photo${images.length !== 1 ? "s" : ""}` : ""],
                ["Seller", form.sellerName],
                ["Contact Email", form.sellerEmail],
              ].map(
                ([label, value]) =>
                  value && (
                    <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">{label}</span>
                      <span className="text-gray-900 text-sm font-medium">{value}</span>
                    </div>
                  )
              )}
            </div>

            {!canPublish && (
              <p className="text-amber-600 text-xs mt-4">
                Please complete all required fields: title, price, year, make, condition, power type, your name, and email.
              </p>
            )}
            {submitError && (
              <p className="text-red-500 text-xs mt-4">{submitError}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canPublish || submitting}
              className="mt-6 w-full bg-teal-700 text-white font-medium py-3 rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Listing"}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm font-medium disabled:opacity-0"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          {currentStep < steps.length - 1 && (
            <button
              onClick={next}
              className="flex items-center gap-1 bg-teal-700 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-teal-800 transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
