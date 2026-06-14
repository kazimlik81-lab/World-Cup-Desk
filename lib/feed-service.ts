import { createHash } from "node:crypto";
import {
  FEED_REVALIDATE_SECONDS,
  MAXIMUM_SUMMARY_LENGTH,
  REPORT_SUMMARY,
  REQUEST_USER_AGENT,
  WORLD_CUP_RELEVANCE_TERMS,
  type RemoteTextSource
} from "@/lib/constants";
import { getFifaReportHubSource, getNewsFeedSources } from "@/lib/feed-sources";
import type { FeedSourceStatus, WorldCupFeedItem, WorldCupFeedPayload } from "@/lib/types";

type FetchTextResult =
  | {
      succeeded: true;
      source: RemoteTextSource;
      text: string;
    }
  | {
      succeeded: false;
      source: RemoteTextSource;
      message: string;
    };

export async function buildWorldCupFeed(): Promise<WorldCupFeedPayload> {
  const sourceStatuses: FeedSourceStatus[] = [];
  const collectedItems: WorldCupFeedItem[] = [];
  const newsFeedSources = getNewsFeedSources();
  const fifaReportHubSource = getFifaReportHubSource();

  for (const feedSource of newsFeedSources) {
    const feedFetchResult = await fetchTextSource(feedSource);
    sourceStatuses.push(toSourceStatus(feedFetchResult));

    if (feedFetchResult.succeeded) {
      const parsedNewsItems = parseRssItems(feedFetchResult.text, feedSource);
      collectedItems.push(...parsedNewsItems);
    }
  }

  const reportHubFetchResult = await fetchTextSource(fifaReportHubSource);
  sourceStatuses.push(toSourceStatus(reportHubFetchResult));

  if (reportHubFetchResult.succeeded) {
    const parsedReportItems = parseReportHubItems(reportHubFetchResult.text, fifaReportHubSource);
    collectedItems.push(...parsedReportItems);
  }

  const uniqueItems = removeDuplicateItems(collectedItems);
  uniqueItems.sort(compareNewestFirst);

  return {
    fetchedAt: new Date().toISOString(),
    items: uniqueItems,
    sources: sourceStatuses
  };
}

async function fetchTextSource(source: RemoteTextSource): Promise<FetchTextResult> {
  try {
    const response = await fetch(source.url, {
      headers: {
        Accept: source.acceptHeader,
        "User-Agent": REQUEST_USER_AGENT
      },
      next: {
        revalidate: FEED_REVALIDATE_SECONDS
      }
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown source fetch error";
    return {
      succeeded: false,
      source,
      message
    };
  }
}

function toSourceStatus(fetchTextResult: FetchTextResult): FeedSourceStatus {
  return {
    name: fetchTextResult.source.name,
    url: fetchTextResult.source.url,
    status: fetchTextResult.succeeded ? "ok" : "error",
    message: fetchTextResult.succeeded ? null : fetchTextResult.message
  };
}

function parseRssItems(feedXml: string, source: RemoteTextSource): WorldCupFeedItem[] {
  const parsedItems: WorldCupFeedItem[] = [];
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

function parseReportHubItems(
  reportHubHtml: string,
  reportHubSource: RemoteTextSource
): WorldCupFeedItem[] {
  const reportItems: WorldCupFeedItem[] = [];
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

function extractXmlTagText(xmlBlock: string, tagName: string): string {
  const tagExpression = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const tagMatch = xmlBlock.match(tagExpression);

  if (!tagMatch) {
    return "";
  }

  return normalizeWhitespace(stripCdata(decodeHtmlEntities(tagMatch[1])));
}

function extractMediaImageUrl(xmlBlock: string): string | null {
  const mediaContentMatch = xmlBlock.match(/<media:content\b[^>]*url=(["'])(.*?)\1/i);
  const mediaThumbnailMatch = xmlBlock.match(/<media:thumbnail\b[^>]*url=(["'])(.*?)\1/i);
  const enclosureMatch = xmlBlock.match(/<enclosure\b[^>]*url=(["'])(.*?)\1/i);
  const imageMatch = mediaContentMatch ?? mediaThumbnailMatch ?? enclosureMatch;

  if (!imageMatch || !imageMatch[2]) {
    return null;
  }

  return normalizeImageUrl(decodeHtmlEntities(imageMatch[2]));
}

function extractReportHubPublishedAt(reportHubHtml: string): string | null {
  const publishedAtMatch = reportHubHtml.match(/FIFA,\s*([^<\n]+?2026)/i);

  if (!publishedAtMatch) {
    return null;
  }

  return normalizeDate(publishedAtMatch[1]);
}

function findNearestGroupName(reportHubHtml: string, anchorIndex: number): string | null {
  const searchWindowStart = Math.max(0, anchorIndex - 5000);
  const precedingHtml = reportHubHtml.slice(searchWindowStart, anchorIndex);
  const groupMatches = Array.from(precedingHtml.matchAll(/Group\s+([A-L])/gi));
  const latestGroupMatch = groupMatches.at(-1);

  if (!latestGroupMatch) {
    return null;
  }

  return `Group ${latestGroupMatch[1].toUpperCase()}`;
}

function normalizeDate(rawDate: string): string | null {
  if (!rawDate) {
    return null;
  }

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function isWorldCupRelevant(text: string): boolean {
  const normalizedText = text.toLowerCase();

  for (const relevanceTerm of WORLD_CUP_RELEVANCE_TERMS) {
    if (normalizedText.includes(relevanceTerm)) {
      return true;
    }
  }

  return false;
}

function removeDuplicateItems(items: WorldCupFeedItem[]): WorldCupFeedItem[] {
  const seenLinks = new Set<string>();
  const uniqueItems: WorldCupFeedItem[] = [];

  for (const item of items) {
    if (seenLinks.has(item.link)) {
      continue;
    }

    seenLinks.add(item.link);
    uniqueItems.push(item);
  }

  return uniqueItems;
}

function compareNewestFirst(firstItem: WorldCupFeedItem, secondItem: WorldCupFeedItem): number {
  const firstTime = firstItem.publishedAt ? new Date(firstItem.publishedAt).getTime() : 0;
  const secondTime = secondItem.publishedAt ? new Date(secondItem.publishedAt).getTime() : 0;

  return secondTime - firstTime;
}

function stripCdata(text: string): string {
  return text.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function stripMarkup(text: string): string {
  return decodeHtmlEntities(text.replace(/<[^>]*>/g, " "));
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function truncateText(text: string, maximumLength: number): string {
  const normalizedText = normalizeWhitespace(text);

  if (normalizedText.length <= maximumLength) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, maximumLength - 1).trim()}…`;
}

function decodeHtmlEntities(text: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\""
  };

  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, entityBody: string) => {
    if (entityBody.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(entityBody.slice(2), 16));
    }

    if (entityBody.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(entityBody.slice(1), 10));
    }

    return namedEntities[entityBody.toLowerCase()] ?? entity;
  });
}

function toAbsoluteUrl(link: string, baseUrl: string): string {
  return new URL(decodeHtmlEntities(link), baseUrl).toString();
}

function normalizeImageUrl(imageUrl: string): string {
  const parsedUrl = new URL(imageUrl);

  if (parsedUrl.hostname === "i.guim.co.uk") {
    parsedUrl.searchParams.set("width", "700");
  }

  return parsedUrl.toString();
}

function stableIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}
