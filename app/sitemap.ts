import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const legalRoutes = ["/terms", "/privacy", "/disclaimer", "/cookies"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-10-06",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...legalRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: "2026-10-06",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
