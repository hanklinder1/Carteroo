import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/profile", "/demo/", "/auth/"],
      },
    ],
    sitemap: "https://carteroo.com/sitemap.xml",
  };
}
