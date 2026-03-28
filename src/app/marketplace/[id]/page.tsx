import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Zap, Fuel, Users, Gauge, Battery, Calendar, User } from "lucide-react";
import ContactForm from "./ContactForm";
import { GolfCart } from "@/lib/types";
import type { Metadata } from "next";

async function fetchListing(id: string) {
  const { getAdmin } = await import("@/lib/supabase/admin");
  const { data } = await getAdmin()
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await fetchListing(params.id);
  if (!data) return { title: "Listing Not Found" };
  return {
    title: `${data.title} — $${Number(data.price).toLocaleString()}`,
    description: `${data.year} ${data.make} ${data.model} for sale in ${data.location}. ${data.description?.slice(0, 120) ?? ""}`,
    openGraph: {
      title: `${data.title} — $${Number(data.price).toLocaleString()}`,
      description: `${data.year} ${data.make} ${data.model} for sale in ${data.location}.`,
      images: data.images?.[0] ? [data.images[0]] : [],
    },
  };
}

export default async function CartDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await fetchListing(params.id);
  if (!data) return notFound();

  const cart: GolfCart = {
    id: data.id,
    title: data.title,
    description: data.description,
    price: Number(data.price),
    year: Number(data.year),
    make: data.make,
    model: data.model,
    condition: data.condition,
    seats: Number(data.seats),
    topSpeed: Number(data.top_speed),
    range: data.range,
    powerType: data.power_type,
    images: data.images ?? [],
    features: data.features ?? [],
    location: data.location,
    sellerId: data.seller_id ?? "",
    sellerName: data.seller_name,
    sellerEmail: data.seller_email,
    sellerPhone: data.seller_phone ?? "",
    createdAt: data.created_at,
  };

  const listedDate = new Date(cart.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-teal-50">
            {cart.images[0] ? (
              <Image
                src={cart.images[0]}
                alt={cart.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Photos</span>
              </div>
            )}
          </div>
          {cart.images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
              {cart.images.slice(1).map((img, i) => (
                <div key={i} className="w-20 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={img} alt={`Photo ${i + 2}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                cart.condition === "new" || cart.condition === "like-new"
                  ? "bg-teal-100 text-gray-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {cart.condition === "like-new" ? "Like New" : cart.condition.charAt(0).toUpperCase() + cart.condition.slice(1)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{cart.title}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            ${cart.price.toLocaleString()}
          </p>

          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
            <MapPin size={14} />
            {cart.location}
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-6">{cart.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Calendar, label: "Year", value: cart.year },
              { icon: cart.powerType === "electric" ? Zap : Fuel, label: "Power", value: cart.powerType === "electric" ? "Electric" : "Gas" },
              { icon: Users, label: "Seats", value: cart.seats },
              { icon: Gauge, label: "Top Speed", value: `${cart.topSpeed} mph` },
              { icon: Battery, label: "Range", value: cart.range },
            ]
              .filter((s) => s.value)
              .map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-teal-50 rounded-xl p-3 flex items-center gap-3">
                  <Icon size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-xs">{label}</p>
                    <p className="text-gray-800 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Features */}
          {cart.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-gray-800 font-semibold text-sm mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {cart.features.map((f) => (
                  <span key={f} className="text-xs bg-teal-50 text-gray-700 px-3 py-1 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact seller */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
              <div>
                <p className="text-gray-800 font-medium text-sm">{cart.sellerName}</p>
                <p className="text-gray-400 text-xs">Listed {listedDate}</p>
              </div>
            </div>
            <ContactForm listingId={cart.id} sellerName={cart.sellerName} />
          </div>
        </div>
      </div>
    </div>
  );
}
