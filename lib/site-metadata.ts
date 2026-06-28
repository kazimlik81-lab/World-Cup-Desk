import { supportedLanguageCodes, type LanguageCode } from "@/lib/localization";

export const SITE_NAME = "World Cup Desk";

export const SITE_TITLE =
  "World Cup Desk | World Cup 2026 news, schedule, tables, and reports";

export const SITE_DESCRIPTION =
  "A public, secure, multilingual World Cup 2026 desk with live news, match schedule, group tables, statistics, and FIFA Training Centre report links.";

export const SITE_SHORT_DESCRIPTION =
  "World Cup 2026 news, schedule, tables, statistics, and match reports.";

export const SITE_KEYWORDS = [
  "World Cup 2026",
  "FIFA World Cup",
  "World Cup schedule",
  "World Cup news",
  "World Cup tables",
  "World Cup results",
  "match reports",
  "football statistics"
];

export const SITE_THEME_COLOR = "#050812";

export const SITE_BACKGROUND_COLOR = "#050812";

export const SITE_IMAGE_PATH = "/assets/world-cup-command-center.png";

export const SITE_IMAGE_WIDTH = 1672;

export const SITE_IMAGE_HEIGHT = 941;

export const SITE_IMAGE_ALT = "World Cup Desk tournament dashboard preview";

export const languageHreflangCodes: Record<LanguageCode, string> = {
  ru: "ru",
  en: "en",
  az: "az",
  tr: "tr"
};

const LOCAL_DEVELOPMENT_SITE_URL = "http://localhost:3000";

export function getPublicSiteUrl(): URL {
  const configuredSiteUrl = getConfiguredSiteUrl();
  const parsedSiteUrl = parsePublicSiteUrl(
    configuredSiteUrl ?? LOCAL_DEVELOPMENT_SITE_URL,
    configuredSiteUrl ? "public site URL" : "local development site URL"
  );

  parsedSiteUrl.pathname = normalizeSitePathname(parsedSiteUrl.pathname);
  parsedSiteUrl.search = "";
  parsedSiteUrl.hash = "";

  return parsedSiteUrl;
}

export function buildCanonicalUrl(pathname: string): string {
  const siteUrl = getPublicSiteUrl();
  const siteBasePath = siteUrl.pathname.endsWith("/")
    ? siteUrl.pathname
    : `${siteUrl.pathname}/`;
  const requestedPathname = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const canonicalUrl = new URL(siteUrl.toString());

  canonicalUrl.pathname = normalizeJoinedPathname(siteBasePath, requestedPathname);

  return canonicalUrl.toString();
}

export function buildLanguageHomePath(languageCode: LanguageCode): string {
  return `/${languageCode}`;
}

export function buildLanguageMatchPath(languageCode: LanguageCode, matchSlug: string): string {
  return `/${languageCode}/matches/${matchSlug}`;
}

export function buildLanguageAlternates(
  buildPathForLanguage: (languageCode: LanguageCode) => string,
  xDefaultPathname = "/"
): Record<string, string> {
  const languageAlternates: Record<string, string> = {
    "x-default": buildCanonicalUrl(xDefaultPathname)
  };

  for (const languageCode of supportedLanguageCodes) {
    languageAlternates[languageHreflangCodes[languageCode]] = buildCanonicalUrl(
      buildPathForLanguage(languageCode)
    );
  }

  return languageAlternates;
}

function getConfiguredSiteUrl(): string | null {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (explicitSiteUrl) {
    return explicitSiteUrl;
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelProductionUrl) {
    return toHttpsUrl(vercelProductionUrl);
  }

  const vercelDeploymentUrl = process.env.VERCEL_URL;

  if (vercelDeploymentUrl) {
    return toHttpsUrl(vercelDeploymentUrl);
  }

  return null;
}

function toHttpsUrl(hostOrUrl: string): string {
  if (hostOrUrl.startsWith("https://") || hostOrUrl.startsWith("http://")) {
    return hostOrUrl;
  }

  return `https://${hostOrUrl}`;
}

function parsePublicSiteUrl(rawUrl: string, sourceName: string): URL {
  const parsedUrl = new URL(rawUrl);

  if (parsedUrl.protocol === "https:") {
    return parsedUrl;
  }

  if (parsedUrl.protocol === "http:" && isLocalHttpHost(parsedUrl.hostname)) {
    return parsedUrl;
  }

  throw new Error(`${sourceName} must be HTTPS. Received: ${rawUrl}`);
}

function isLocalHttpHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function normalizeSitePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function normalizeJoinedPathname(basePathname: string, requestedPathname: string): string {
  const normalizedBasePathname = normalizeSitePathname(basePathname);

  if (!requestedPathname) {
    return normalizedBasePathname;
  }

  return `${normalizedBasePathname}${requestedPathname}`.replace(/\/{2,}/g, "/");
}
