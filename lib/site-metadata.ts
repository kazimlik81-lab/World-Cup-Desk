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

const LOCAL_DEVELOPMENT_SITE_URL = "http://localhost:3000";

export function getPublicSiteUrl(): URL {
  const configuredSiteUrl = getConfiguredSiteUrl();
  const parsedSiteUrl = parsePublicSiteUrl(
    configuredSiteUrl ?? LOCAL_DEVELOPMENT_SITE_URL,
    configuredSiteUrl ? "public site URL" : "local development site URL"
  );

  parsedSiteUrl.pathname = "/";
  parsedSiteUrl.search = "";
  parsedSiteUrl.hash = "";

  return parsedSiteUrl;
}

export function buildCanonicalUrl(pathname: string): string {
  return new URL(pathname, getPublicSiteUrl()).toString();
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
