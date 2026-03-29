import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://itsusan558.github.io/good-news-site";

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  for (const cat of CATEGORIES) {
    if (cat.slug === "all") continue;
    routes.push({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    });
  }

  return routes;
}
