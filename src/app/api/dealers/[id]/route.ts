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

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await getAdmin()
    .from("dealers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
  }
  return NextResponse.json({ dealer: toDealer(data) });
}
