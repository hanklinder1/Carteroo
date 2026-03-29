import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { GolfCart } from "@/lib/types";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await getAdmin()
    .from("listings")
    .select("*")
    .eq("id", params.id)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ listing: toGolfCart(data) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify the user owns this listing
  const { data: existing } = await getAdmin()
    .from("listings")
    .select("seller_id")
    .eq("id", params.id)
    .single();

  if (!existing || existing.seller_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const { data, error } = await getAdmin()
    .from("listings")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ listing: toGolfCart(data) });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await getAdmin()
    .from("listings")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
