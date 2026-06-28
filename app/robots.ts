import type { MetadataRoute } from "next";
import { buildCanonicalUrl, getPublicSiteUrl } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      }
    ],
    sitemap: buildCanonicalUrl("/sitemap.xml"),
    host: getPublicSiteUrl().origin
  };
}
