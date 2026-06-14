import {
  DEFAULT_ESPN_SOCCER_RSS_URL,
  DEFAULT_FIFA_REPORT_HUB_URL,
  DEFAULT_GUARDIAN_WORLD_CUP_RSS_URL,
  ESPN_SOCCER_SOURCE_NAME,
  FIFA_REPORT_HUB_SOURCE_NAME,
  GUARDIAN_WORLD_CUP_SOURCE_NAME,
  type RemoteTextSource
} from "@/lib/constants";
import { requireHttpsUrl } from "@/lib/url-policy";

export function getNewsFeedSources(): RemoteTextSource[] {
  const guardianSource = buildSource(
    GUARDIAN_WORLD_CUP_SOURCE_NAME,
    process.env.WORLD_CUP_DESK_GUARDIAN_RSS_URL ?? DEFAULT_GUARDIAN_WORLD_CUP_RSS_URL,
    true,
    "application/rss+xml, application/xml, text/xml"
  );
  const espnSource = buildSource(
    ESPN_SOCCER_SOURCE_NAME,
    process.env.WORLD_CUP_DESK_ESPN_RSS_URL ?? DEFAULT_ESPN_SOCCER_RSS_URL,
    false,
    "application/rss+xml, application/xml, text/xml"
  );

  return [guardianSource, espnSource];
}

export function getFifaReportHubSource(): RemoteTextSource {
  return buildSource(
    FIFA_REPORT_HUB_SOURCE_NAME,
    process.env.WORLD_CUP_DESK_FIFA_REPORT_HUB_URL ?? DEFAULT_FIFA_REPORT_HUB_URL,
    true,
    "text/html"
  );
}

function buildSource(
  name: string,
  url: string,
  alwaysInclude: boolean,
  acceptHeader: string
): RemoteTextSource {
  return {
    name,
    url: requireHttpsUrl(url, name),
    alwaysInclude,
    acceptHeader
  };
}
