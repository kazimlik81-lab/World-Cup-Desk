import type { MetadataRoute } from "next";
import { buildCanonicalUrl, getPublicSiteUrl } from "@/lib/site-metadata";

export const dynamic = "force-static";

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
