export type RemoteTextSource = {
  name: string;
  url: string;
  alwaysInclude: boolean;
  acceptHeader: string;
};

export const APPLICATION_TIME_ZONE = "Europe/Moscow";

export const FEED_REVALIDATE_SECONDS = 300;

export const REQUEST_USER_AGENT =
  "WorldCupDesk/0.1 (+local news reader; contact: local)";

export const GUARDIAN_WORLD_CUP_SOURCE_NAME = "The Guardian World Cup";

export const ESPN_SOCCER_SOURCE_NAME = "ESPN Soccer";

export const FIFA_REPORT_HUB_SOURCE_NAME = "FIFA Training Centre reports";

export const DEFAULT_GUARDIAN_WORLD_CUP_RSS_URL =
  "https://www.theguardian.com/football/world-cup-2026/rss";

export const DEFAULT_ESPN_SOCCER_RSS_URL =
  "https://www.espn.com/espn/rss/soccer/news";

export const DEFAULT_FIFA_REPORT_HUB_URL =
  "https://www.fifatrainingcentre.com/en/fifa-world-cup-2026/match-report-hub.php";

export const FIFA_OFFICIAL_NEWS_URL =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/news";

export const WORLD_CUP_RELEVANCE_TERMS = [
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

export const REPORT_SUMMARY =
  "Official FIFA Training Centre PDF report: lineups, xG, phases, passing, pressing, and extended match statistics.";

export const MAXIMUM_SUMMARY_LENGTH = 240;
