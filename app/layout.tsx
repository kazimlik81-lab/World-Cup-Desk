import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";
import "@/app/site-header.css";
import "@/app/dashboard-layout.css";
import "@/app/dashboard-components.css";
import "@/app/dashboard-modals.css";
import {
  buildCanonicalUrl,
  getPublicSiteUrl,
  SITE_DESCRIPTION,
  SITE_IMAGE_ALT,
  SITE_IMAGE_HEIGHT,
  SITE_IMAGE_PATH,
  SITE_IMAGE_WIDTH,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TITLE
} from "@/lib/site-metadata";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: getPublicSiteUrl(),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: buildCanonicalUrl("/")
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["en_US", "az_AZ", "tr_TR"],
    url: buildCanonicalUrl("/"),
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_IMAGE_PATH,
        width: SITE_IMAGE_WIDTH,
        height: SITE_IMAGE_HEIGHT,
        alt: SITE_IMAGE_ALT
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE_PATH]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/favicon.svg",
    apple: SITE_IMAGE_PATH
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: SITE_THEME_COLOR
};

type RootLayoutProperties = {
  children: ReactNode;
};

export default function RootLayout(properties: RootLayoutProperties): ReactNode {
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: buildCanonicalUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: ["ru", "en", "az", "tr"],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME
    }
  };

  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body className={inter.variable}>{properties.children}</body>
    </html>
  );
}
