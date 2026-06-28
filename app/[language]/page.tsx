import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import Home from "@/app/page";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  buildLanguageHomePath,
  SITE_IMAGE_PATH,
  SITE_NAME
} from "@/lib/site-metadata";
import {
  isSupportedLanguage,
  supportedLanguageCodes,
  type LanguageCode
} from "@/lib/localization";
import { seoCopies } from "@/lib/seo-copy";

type LanguagePageProperties = {
  params: Promise<{
    language: string;
  }>;
};

export function generateStaticParams(): Array<{ language: LanguageCode }> {
  return supportedLanguageCodes.map((languageCode) => ({ language: languageCode }));
}

export async function generateMetadata(properties: LanguagePageProperties): Promise<Metadata> {
  const { language } = await properties.params;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  const seoCopy = seoCopies[language];
  const canonicalPath = buildLanguageHomePath(language);

  return {
    title: seoCopy.homeTitle,
    description: seoCopy.homeDescription,
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
      languages: buildLanguageAlternates(buildLanguageHomePath)
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: seoCopy.homeTitle,
      description: seoCopy.homeDescription,
      url: buildCanonicalUrl(canonicalPath),
      images: [SITE_IMAGE_PATH]
    },
    twitter: {
      card: "summary_large_image",
      title: seoCopy.homeTitle,
      description: seoCopy.homeDescription,
      images: [SITE_IMAGE_PATH]
    }
  };
}

export default async function LanguagePage(properties: LanguagePageProperties): Promise<ReactElement> {
  const { language } = await properties.params;

  if (!isSupportedLanguage(language)) {
    notFound();
  }

  return <Home initialLanguage={language} readStoredLanguage={false} />;
}
