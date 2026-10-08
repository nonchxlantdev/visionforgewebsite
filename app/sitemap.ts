import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const pageRoutes = ["/automation", "/websites", "/pricing", "/how-we-work", "/contact"] as const;
const legalRoutes = ["/terms", "/privacy", "/disclaimer", "/cookies"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-10-08",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...pageRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: "2026-10-08",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...legalRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: "2026-10-06",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
