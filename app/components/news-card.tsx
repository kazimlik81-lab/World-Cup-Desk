import { Newspaper } from "lucide-react";
import type { ReactElement } from "react";
import { APPLICATION_TIME_ZONE } from "@/lib/constants";
import type { ChampionshipNewsItem } from "@/lib/tournament-data";

type NewsCardProperties = {
  newsItem: ChampionshipNewsItem;
  dateLocale: string;
};

export function NewsCard(properties: NewsCardProperties): ReactElement {
  return (
    <article className="news-card">
      <div className="news-icon">
        <Newspaper size={18} aria-hidden="true" />
      </div>
      <div>
        <span>{properties.newsItem.sourceName}</span>
        <h3>{properties.newsItem.title}</h3>
        <p>{properties.newsItem.summary}</p>
        <time>{formatDateTime(properties.newsItem.publishedAt, properties.dateLocale)}</time>
      </div>
    </article>
  );
}

function formatDateTime(value: string, dateLocale: string): string {
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APPLICATION_TIME_ZONE
  }).format(new Date(value));
}
