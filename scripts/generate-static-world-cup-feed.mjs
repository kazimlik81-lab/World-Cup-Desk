import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const FEED_REVALIDATE_SECONDS = 300;
const MAXIMUM_SUMMARY_LENGTH = 240;
const REPORT_SUMMARY =
  "Official FIFA Training Centre PDF report: lineups, xG, phases, passing, pressing, and extended match statistics.";
const REQUEST_USER_AGENT =
  "WorldCupDesk/0.1 (+public static GitHub Pages build; contact: GitHub repository)";
const DEFAULT_GUARDIAN_WORLD_CUP_RSS_URL =
  "https://www.theguardian.com/football/world-cup-2026/rss";
const DEFAULT_ESPN_SOCCER_RSS_URL = "https://www.espn.com/espn/rss/soccer/news";
const DEFAULT_FIFA_REPORT_HUB_URL =
  "https://www.fifatrainingcentre.com/en/fifa-world-cup-2026/match-report-hub.php";
const WORLD_CUP_RELEVANCE_TERMS = [
  "world cup",
  "fifa world cup",
  "worldcup",
  "canada mexico usa",
  "mexico 2026",
  "united states 2026",
  "canada 2026",
  "matchday",
  "group a",
  "group b",
  "group c",
  "group d",
  "group e",
  "group f",
  "group g",
  "group h",
  "group i",
  "group j",
  "group k",
  "group l"
];

const fallbackItems = [
  {
    id: "static-fallback-group-stage",
    type: "news",
    sourceName: "World Cup Desk",
    title: "World Cup Desk is ready for public World Cup 2026 coverage",
    summary:
      "The public desk keeps the tournament schedule, group tables, results, statistics, and report links available as a fast static site.",
    link: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
    publishedAt: "2026-06-28T00:00:00.000Z",
    imageUrl: null,
    groupName: null
  }
];

export async function generateStaticWorldCupFeed(projectRoot) {
  const feedPayload = await buildWorldCupFeed();
  const publicDirectory = path.join(projectRoot, "public");
  const feedPath = path.join(publicDirectory, "world-cup-feed.json");

  await mkdir(publicDirectory, { recursive: true });
  await writeFile(feedPath, `${JSON.stringify(feedPayload, null, 2)}\n`, "utf8");
}

async function buildWorldCupFeed() {
  const sourceStatuses = [];
  const collectedItems = [];
  const sources = [
    {
      name: "The Guardian World Cup",
      url: requireHttpsUrl(process.env.WORLD_CUP_DESK_GUARDIAN_RSS_URL ?? DEFAULT_GUARDIAN_WORLD_CUP_RSS_URL),
      alwaysInclude: true,
      acceptHeader: "application/rss+xml, application/xml, text/xml",
      parser: parseRssItems
    },
    {
      name: "ESPN Soccer",
      url: requireHttpsUrl(process.env.WORLD_CUP_DESK_ESPN_RSS_URL ?? DEFAULT_ESPN_SOCCER_RSS_URL),
      alwaysInclude: false,
      acceptHeader: "application/rss+xml, application/xml, text/xml",
      parser: parseRssItems
    },
    {
      name: "FIFA Training Centre reports",
      url: requireHttpsUrl(process.env.WORLD_CUP_DESK_FIFA_REPORT_HUB_URL ?? DEFAULT_FIFA_REPORT_HUB_URL),
      alwaysInclude: true,
      acceptHeader: "text/html",
      parser: parseReportHubItems
    }
  ];

  for (const source of sources) {
    const fetchResult = await fetchTextSource(source);
    sourceStatuses.push(toSourceStatus(fetchResult));

    if (fetchResult.succeeded) {
      collectedItems.push(...source.parser(fetchResult.text, source));
    }
  }

  const uniqueItems = removeDuplicateItems(collectedItems);
  uniqueItems.sort(compareNewestFirst);

  return {
    fetchedAt: new Date().toISOString(),
    items: uniqueItems.length > 0 ? uniqueItems : fallbackItems,
    sources: sourceStatuses
  };
}

async function fetchTextSource(source) {
  try {
    const response = await fetch(source.url, {
      headers: {
        Accept: source.acceptHeader,
        "User-Agent": REQUEST_USER_AGENT
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return {
        succeeded: false,
        source,
        message: `${response.status} ${response.statusText}`.trim()
      };
    }

    return {
      succeeded: true,
      source,
      text: await response.text()
    };
  } catch (error) {
    return {
      succeeded: false,
      source,
      message: error instanceof Error ? error.message : "Unknown source fetch error"
    };
  }
}

function toSourceStatus(fetchResult) {
  return {
    name: fetchResult.source.name,
    url: fetchResult.source.url,
    status: fetchResult.succeeded ? "ok" : "error",
    message: fetchResult.succeeded ? null : fetchResult.message
  };
}

function parseRssItems(feedXml, source) {
  const parsedItems = [];
  const itemBlocks = feedXml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  for (const itemBlock of itemBlocks) {
    const title = extractXmlTagText(itemBlock, "title");
    const link = extractXmlTagText(itemBlock, "link");

    if (!title || !link) {
      continue;
    }

    const rawDescription =
      extractXmlTagText(itemBlock, "description") ||
      extractXmlTagText(itemBlock, "content:encoded");
    const summary = truncateText(stripMarkup(rawDescription), MAXIMUM_SUMMARY_LENGTH);
    const publishedAt = normalizeDate(
      extractXmlTagText(itemBlock, "pubDate") || extractXmlTagText(itemBlock, "dc:date")
    );
    const imageUrl = extractMediaImageUrl(itemBlock);

    if (!source.alwaysInclude && !isWorldCupRelevant(`${title} ${summary}`)) {
      continue;
    }

    parsedItems.push({
      id: stableIdentifier(`${source.name}:${link}`),
      type: "news",
      sourceName: source.name,
      title,
      summary,
      link,
      publishedAt,
      imageUrl,
      groupName: null
    });
  }

  return parsedItems;
}

function parseReportHubItems(reportHubHtml, reportHubSource) {
  const reportItems = [];
  const reportHubPublishedAt = extractReportHubPublishedAt(reportHubHtml);
  const anchorExpression =
    /<a\b[^>]*href=(["'])(?<href>[^"']+\.pdf)\1[^>]*>(?<content>[\s\S]*?)<\/a>/gi;
  const anchorMatches = reportHubHtml.matchAll(anchorExpression);

  for (const anchorMatch of anchorMatches) {
    const groups = anchorMatch.groups;

    if (!groups) {
      continue;
    }

    const rawTitle = normalizeWhitespace(stripMarkup(groups.content));

    if (!/\d+\s*-\s*\d+/.test(rawTitle)) {
      continue;
    }

    const reportLink = toAbsoluteUrl(groups.href, reportHubSource.url);
    const groupName = findNearestGroupName(reportHubHtml, anchorMatch.index ?? 0);

    reportItems.push({
      id: stableIdentifier(`${reportHubSource.name}:${reportLink}`),
      type: "report",
      sourceName: reportHubSource.name,
      title: rawTitle,
      summary: REPORT_SUMMARY,
      link: reportLink,
      publishedAt: reportHubPublishedAt,
      imageUrl: null,
      groupName
    });
  }

  return reportItems;
}

function extractXmlTagText(xmlBlock, tagName) {
  const tagExpression = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const tagMatch = xmlBlock.match(tagExpression);

  if (!tagMatch) {
    return "";
  }

  return normalizeWhitespace(stripCdata(decodeHtmlEntities(tagMatch[1])));
}

function extractMediaImageUrl(xmlBlock) {
  const mediaContentMatch = xmlBlock.match(/<media:content\b[^>]*url=(["'])(.*?)\1/i);
  const mediaThumbnailMatch = xmlBlock.match(/<media:thumbnail\b[^>]*url=(["'])(.*?)\1/i);
  const enclosureMatch = xmlBlock.match(/<enclosure\b[^>]*url=(["'])(.*?)\1/i);
  const imageMatch = mediaContentMatch ?? mediaThumbnailMatch ?? enclosureMatch;

  if (!imageMatch || !imageMatch[2]) {
    return null;
  }

  return normalizeImageUrl(decodeHtmlEntities(imageMatch[2]));
}

function extractReportHubPublishedAt(reportHubHtml) {
  const publishedAtMatch = reportHubHtml.match(/FIFA,\s*([^<\n]+?2026)/i);

  if (!publishedAtMatch) {
    return null;
  }

  return normalizeDate(publishedAtMatch[1]);
}

function findNearestGroupName(reportHubHtml, anchorIndex) {
  const searchWindowStart = Math.max(0, anchorIndex - 5000);
  const precedingHtml = reportHubHtml.slice(searchWindowStart, anchorIndex);
  const groupMatches = Array.from(precedingHtml.matchAll(/Group\s+([A-L])/gi));
  const latestGroupMatch = groupMatches.at(-1);

  if (!latestGroupMatch) {
    return null;
  }

  return `Group ${latestGroupMatch[1].toUpperCase()}`;
}

function normalizeDate(rawDate) {
  if (!rawDate) {
    return null;
  }

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function isWorldCupRelevant(text) {
  const normalizedText = text.toLowerCase();

  for (const relevanceTerm of WORLD_CUP_RELEVANCE_TERMS) {
    if (normalizedText.includes(relevanceTerm)) {
      return true;
    }
  }

  return false;
}

function removeDuplicateItems(items) {
  const seenLinks = new Set();
  const uniqueItems = [];

  for (const item of items) {
    if (seenLinks.has(item.link)) {
      continue;
    }

    seenLinks.add(item.link);
    uniqueItems.push(item);
  }

  return uniqueItems;
}

function compareNewestFirst(firstItem, secondItem) {
  const firstTime = firstItem.publishedAt ? new Date(firstItem.publishedAt).getTime() : 0;
  const secondTime = secondItem.publishedAt ? new Date(secondItem.publishedAt).getTime() : 0;

  return secondTime - firstTime;
}

function stripCdata(text) {
  return text.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function stripMarkup(text) {
  return decodeHtmlEntities(text.replace(/<[^>]*>/g, " "));
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function truncateText(text, maximumLength) {
  const normalizedText = normalizeWhitespace(text);

  if (normalizedText.length <= maximumLength) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, maximumLength - 1).trim()}...`;
}

function decodeHtmlEntities(text) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\""
  };

  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, entityBody) => {
    if (entityBody.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(entityBody.slice(2), 16));
    }

    if (entityBody.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(entityBody.slice(1), 10));
    }

    return namedEntities[entityBody.toLowerCase()] ?? entity;
  });
}

function toAbsoluteUrl(link, baseUrl) {
  return new URL(decodeHtmlEntities(link), baseUrl).toString();
}

function normalizeImageUrl(imageUrl) {
  const parsedUrl = new URL(imageUrl);

  if (parsedUrl.hostname === "i.guim.co.uk") {
    parsedUrl.searchParams.set("width", "700");
  }

  return parsedUrl.toString();
}

function stableIdentifier(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function requireHttpsUrl(rawUrl) {
  const parsedUrl = new URL(rawUrl);

  if (parsedUrl.protocol !== "https:") {
    throw new Error(`Feed URL must use HTTPS. Received: ${rawUrl}`);
  }

  parsedUrl.hash = "";
  return parsedUrl.toString();
}
