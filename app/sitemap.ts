import type { MetadataRoute } from "next";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  buildLanguageHomePath,
  buildLanguageMatchPath
} from "@/lib/site-metadata";
import { supportedLanguageCodes } from "@/lib/localization";
import { buildMatchSlug } from "@/lib/match-routes";
import { allMatches } from "@/lib/tournament-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: buildCanonicalUrl("/"),
      lastModified,
      changeFrequency: "hourly",
      priority: 1,
      alternates: {
        languages: buildLanguageAlternates(buildLanguageHomePath)
      }
    }
  ];

  for (const languageCode of supportedLanguageCodes) {
    sitemapEntries.push({
      url: buildCanonicalUrl(buildLanguageHomePath(languageCode)),
      lastModified,
      changeFrequency: "hourly",
      priority: 0.95,
      alternates: {
        languages: buildLanguageAlternates(buildLanguageHomePath)
      }
    });
  }

  for (const matchEntry of allMatches) {
    const matchSlug = buildMatchSlug(matchEntry);

    for (const languageCode of supportedLanguageCodes) {
      sitemapEntries.push({
        url: buildCanonicalUrl(buildLanguageMatchPath(languageCode, matchSlug)),
        lastModified,
        changeFrequency: matchEntry.status === "finished" ? "daily" : "hourly",
        priority: matchEntry.status === "finished" ? 0.82 : 0.78,
        alternates: {
          languages: buildLanguageAlternates(
            (alternateLanguageCode) => buildLanguageMatchPath(alternateLanguageCode, matchSlug),
            buildLanguageMatchPath("en", matchSlug)
          )
        }
      });
    }
  }

  sitemapEntries.push({
    url: buildCanonicalUrl("/jumdo-javelin"),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.4
  });

  return sitemapEntries;
}
