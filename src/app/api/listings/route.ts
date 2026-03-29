import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { GolfCart } from "@/lib/types";

// Map DB row → GolfCart
function toGolfCart(row: Record<string, unknown>): GolfCart {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    price: Number(row.price),
    year: Number(row.year),
    make: row.make as string,
    model: row.model as string,
    condition: row.condition as GolfCart["condition"],
    seats: Number(row.seats),
    topSpeed: Number(row.top_speed),
    range: row.range as string,
    powerType: row.power_type as GolfCart["powerType"],
    images: (row.images as string[]) ?? [],
    features: (row.features as string[]) ?? [],
    location: row.location as string,
    sellerId: (row.seller_id as string) ?? "",
    sellerName: row.seller_name as string,
    sellerEmail: row.seller_email as string,
    sellerPhone: (row.seller_phone as string) ?? "",
    createdAt: row.created_at as string,
    isFeatured: (row.is_featured as boolean) ?? false,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const make = searchParams.get("make");
  const condition = searchParams.get("condition");
  const powerType = searchParams.get("powerType");
  const priceRange = searchParams.get("price");

  const now = new Date().toISOString();

  // Un-feature any listings whose boost has expired
  await getAdmin()
    .from("listings")
    .update({ is_featured: false })
    .eq("is_featured", true)
    .lt("featured_until", now);

  let query = getAdmin()
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (make) query = query.ilike("make", make);
  if (condition) query = query.eq("condition", condition);
  if (powerType) query = query.eq("power_type", powerType);
  if (priceRange) {
    const [min, max] = priceRange.split("-");
    if (min) query = query.gte("price", Number(min));
    if (max && max !== "+") query = query.lte("price", Number(max));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ listings: (data ?? []).map(toGolfCart) });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Must be logged in to create a listing" }, { status: 401 });
  }

  const body = await req.json();

  const required = ["title", "price", "year", "make", "model", "condition", "powerType", "sellerName", "sellerEmail"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const { data, error } = await getAdmin()
    .from("listings")
    .insert({
      title: body.title,
      description: body.description ?? "",
      price: Number(body.price),
      year: Number(body.year),
      make: body.make,
      model: body.model,
      condition: body.condition,
      seats: body.seats ? Number(body.seats) : null,
      top_speed: body.topSpeed ? Number(body.topSpeed) : null,
      range: body.range ?? "",
      power_type: body.powerType,
      images: body.images ?? [],
      features: body.features ?? [],
      location: body.location ?? "",
      seller_name: body.sellerName,
      seller_email: body.sellerEmail,
      seller_phone: body.sellerPhone ?? "",
      seller_id: user.id,
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id, listing: toGolfCart(data) }, { status: 201 });
}
