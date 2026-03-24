import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star } from "lucide-react";
import { getAdmin } from "@/lib/supabase/admin";
import { Dealer } from "@/lib/types";
import CartCard from "@/components/CartCard";
import { GolfCart } from "@/lib/types";

export default async function DealerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, error } = await getAdmin()
    .from("dealers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) return notFound();

  const dealer: Dealer = {
    id: data.id,
    name: data.name,
    description: data.description ?? "",
    address: data.address ?? "",
    city: data.city ?? "",
    state: data.state ?? "FL",
    phone: data.phone ?? "",
    email: data.email,
    website: data.website ?? undefined,
    logo: data.logo_url ?? undefined,
    image: data.image_url ?? "",
    rating: Number(data.rating ?? 0),
    reviewCount: Number(data.review_count ?? 0),
    specialties: data.specialties ?? [],
    brands: data.brands ?? [],
  };

  // Fetch dealer's listings
  const { data: listingRows } = await getAdmin()
    .from("listings")
    .select("*")
    .eq("seller_id", data.user_id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const listings: GolfCart[] = (listingRows ?? []).map((row) => ({
    id: row.id, title: row.title, description: row.description,
    price: Number(row.price), year: Number(row.year), make: row.make,
    model: row.model, condition: row.condition, seats: Number(row.seats),
    topSpeed: Number(row.top_speed), range: row.range, powerType: row.power_type,
    images: row.images ?? [], features: row.features ?? [], location: row.location,
    sellerId: row.seller_id ?? "", sellerName: row.seller_name,
    sellerEmail: row.seller_email, sellerPhone: row.seller_phone ?? "",
    createdAt: row.created_at,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dealers"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dealers
      </Link>

      {/* Dealer header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{dealer.name}</h1>
            {dealer.rating > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-gray-500 fill-gray-500" />
                  <span className="text-gray-800 text-sm font-medium">{dealer.rating}</span>
                </div>
                <span className="text-gray-400 text-xs">({dealer.reviewCount} reviews)</span>
              </div>
            )}
            <p className="text-gray-600 text-sm leading-relaxed">{dealer.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
          {dealer.address && (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin size={14} className="text-teal-500" />
              {dealer.address}, {dealer.city}, {dealer.state}
            </div>
          )}
          {dealer.phone && (
            <a href={`tel:${dealer.phone}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
              <Phone size={14} className="text-teal-500" />
              {dealer.phone}
            </a>
          )}
          <a href={`mailto:${dealer.email}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
            <Mail size={14} className="text-teal-500" />
            {dealer.email}
          </a>
          {dealer.website && (
            <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
              <Globe size={14} className="text-teal-500" />
              {dealer.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

        {dealer.brands.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dealer.brands.map((brand) => (
              <span key={brand} className="text-xs bg-teal-50 text-gray-700 px-2.5 py-1 rounded-full">
                {brand}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dealer listings */}
      {listings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Current Inventory ({listings.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((cart) => (
              <CartCard key={cart.id} cart={cart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
