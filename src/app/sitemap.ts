import { MetadataRoute } from "next";
import { getAdmin } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://carteroo.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/marketplace`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/dealers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/sell`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const db = getAdmin();

  const [listingsRes, dealersRes] = await Promise.all([
    db.from("listings").select("id, updated_at").eq("status", "active"),
    db.from("dealers").select("id, created_at"),
  ]);

  const listingRoutes: MetadataRoute.Sitemap = (listingsRes.data ?? []).map((l) => ({
    url: `${base}/marketplace/${l.id}`,
    lastModified: new Date(l.updated_at ?? Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const dealerRoutes: MetadataRoute.Sitemap = (dealersRes.data ?? []).map((d) => ({
    url: `${base}/dealers/${d.id}`,
    lastModified: new Date(d.created_at ?? Date.now()),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...listingRoutes, ...dealerRoutes];
}
