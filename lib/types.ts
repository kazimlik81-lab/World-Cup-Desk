export type FeedItemType = "news" | "report";

export type SourceStatus = "ok" | "error";

export type FeedSourceStatus = {
  name: string;
  url: string;
  status: SourceStatus;
  message: string | null;
};

export type WorldCupFeedItem = {
  id: string;
  type: FeedItemType;
  sourceName: string;
  title: string;
  summary: string;
  link: string;
  publishedAt: string | null;
  imageUrl: string | null;
  groupName: string | null;
};

export type WorldCupFeedPayload = {
  fetchedAt: string;
  items: WorldCupFeedItem[];
  sources: FeedSourceStatus[];
};
