import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: buildCanonicalUrl("/"),
      lastModified,
      changeFrequency: "hourly",
      priority: 1
    },
    {
      url: buildCanonicalUrl("/jumdo-javelin"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.4
    }
  ];
}
