import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabase/admin";
import { Dealer } from "@/lib/types";

function toDealer(row: Record<string, unknown>): Dealer {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    address: (row.address as string) ?? "",
    city: (row.city as string) ?? "",
    state: (row.state as string) ?? "FL",
    phone: (row.phone as string) ?? "",
    email: row.email as string,
    website: (row.website as string) ?? undefined,
    logo: (row.logo_url as string) ?? undefined,
    image: (row.image_url as string) ?? "",
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    specialties: (row.specialties as string[]) ?? [],
    brands: (row.brands as string[]) ?? [],
  };
}

export async function GET() {
  const { data, error } = await getAdmin()
    .from("dealers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dealers: (data ?? []).map(toDealer) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }

  const { data, error } = await getAdmin()
    .from("dealers")
    .insert({
      name: body.name,
      description: body.description ?? "",
      address: body.address ?? "",
      city: body.city ?? "",
      state: body.state ?? "FL",
      phone: body.phone ?? "",
      email: body.email,
      website: body.website ?? null,
      logo_url: body.logoUrl ?? null,
      image_url: body.imageUrl ?? null,
      specialties: body.specialties ?? [],
      brands: body.brands ?? [],
      user_id: body.userId ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dealer: toDealer(data) }, { status: 201 });
}
