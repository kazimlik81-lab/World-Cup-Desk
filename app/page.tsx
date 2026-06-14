"use client";

import {
  AlertTriangle,
  CalendarDays,
  ExternalLink,
  FileText,
  Newspaper,
  RefreshCw,
  Rss,
  Search
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { APPLICATION_TIME_ZONE, FIFA_OFFICIAL_NEWS_URL } from "@/lib/constants";
import type { FeedItemType, WorldCupFeedItem, WorldCupFeedPayload } from "@/lib/types";

type FeedFilter = FeedItemType | "all";

const TYPE_FILTERS: Array<{ value: FeedFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "news", label: "Новости" },
  { value: "report", label: "Отчеты" }
];

export default function Home(): ReactElement {
  const [feedPayload, setFeedPayload] = useState<WorldCupFeedPayload | null>(null);
  const [selectedType, setSelectedType] = useState<FeedFilter>("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadFeed = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch(`/api/world-cup?cacheBust=${Date.now()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Feed request failed: ${response.status} ${response.statusText}`);
      }

      const nextPayload = (await response.json()) as WorldCupFeedPayload;
      setFeedPayload(nextPayload);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown feed load error";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeed();
    const refreshInterval = window.setInterval(() => {
      void loadFeed();
    }, 300000);

    return () => window.clearInterval(refreshInterval);
  }, [loadFeed]);

  const sourceOptions = useMemo<string[]>(() => {
    if (!feedPayload) {
      return ["all"];
    }

    const sourceNames = new Set<string>();
    for (const feedItem of feedPayload.items) {
      sourceNames.add(feedItem.sourceName);
    }

    return ["all", ...Array.from(sourceNames).sort()];
  }, [feedPayload]);

  const visibleItems = useMemo<WorldCupFeedItem[]>(() => {
    if (!feedPayload) {
      return [];
    }

    const normalizedSearchText = searchText.trim().toLowerCase();
    const filteredItems: WorldCupFeedItem[] = [];

    for (const feedItem of feedPayload.items) {
      if (selectedType !== "all" && feedItem.type !== selectedType) {
        continue;
      }

      if (selectedSource !== "all" && feedItem.sourceName !== selectedSource) {
        continue;
      }

      if (normalizedSearchText) {
        const searchableText = `${feedItem.title} ${feedItem.summary} ${feedItem.sourceName}`
          .toLowerCase()
          .trim();

        if (!searchableText.includes(normalizedSearchText)) {
          continue;
        }
      }

      filteredItems.push(feedItem);
    }

    return filteredItems;
  }, [feedPayload, searchText, selectedSource, selectedType]);

  const newsCount = feedPayload?.items.filter((feedItem) => feedItem.type === "news").length ?? 0;
  const reportCount =
    feedPayload?.items.filter((feedItem) => feedItem.type === "report").length ?? 0;
  const activeSourceCount =
    feedPayload?.sources.filter((sourceStatus) => sourceStatus.status === "ok").length ?? 0;

  return (
    <main className="application-shell">
      <section className="top-panel" aria-label="World Cup Desk">
        <div className="brand-block">
          <div className="brand-mark">
            <Rss size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">Локальная программа</p>
            <h1>World Cup Desk</h1>
          </div>
        </div>

        <div className="toolbar">
          <a className="source-link" href={FIFA_OFFICIAL_NEWS_URL} target="_blank" rel="noreferrer">
            FIFA.com
            <ExternalLink size={16} aria-hidden="true" />
          </a>
          <button className="refresh-button" type="button" onClick={loadFeed} disabled={isLoading}>
            <RefreshCw className={isLoading ? "spin" : ""} size={17} aria-hidden="true" />
            Обновить
          </button>
        </div>
      </section>

      <section className="status-grid" aria-label="Сводка">
        <MetricCard label="Новости" value={newsCount.toString()} icon={<Newspaper size={19} />} />
        <MetricCard label="Отчеты PDF" value={reportCount.toString()} icon={<FileText size={19} />} />
        <MetricCard
          label="Источники"
          value={`${activeSourceCount}/${feedPayload?.sources.length ?? 0}`}
          icon={<Rss size={19} />}
        />
        <MetricCard
          label="Обновлено"
          value={formatDateTime(feedPayload?.fetchedAt ?? null)}
          icon={<CalendarDays size={19} />}
        />
      </section>

      <section className="controls-panel" aria-label="Фильтры">
        <div className="search-box">
          <Search size={18} aria-hidden="true" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Поиск по команде, матчу или теме"
            aria-label="Поиск"
          />
        </div>

        <div className="segmented-control" aria-label="Тип материалов">
          {TYPE_FILTERS.map((filterOption) => (
            <button
              key={filterOption.value}
              type="button"
              className={selectedType === filterOption.value ? "active" : ""}
              onClick={() => setSelectedType(filterOption.value)}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        <select
          className="source-select"
          value={selectedSource}
          onChange={(event) => setSelectedSource(event.target.value)}
          aria-label="Источник"
        >
          {sourceOptions.map((sourceName) => (
            <option key={sourceName} value={sourceName}>
              {sourceName === "all" ? "Все источники" : sourceName}
            </option>
          ))}
        </select>
      </section>

      {loadError ? <ErrorBanner message={loadError} /> : null}
      {feedPayload ? <SourceStatusList feedPayload={feedPayload} /> : null}

      <section className="content-grid" aria-live="polite">
        {isLoading && !feedPayload ? <LoadingState /> : null}
        {!isLoading && visibleItems.length === 0 ? <EmptyState /> : null}
        {visibleItems.map((feedItem) => (
          <FeedCard key={feedItem.id} feedItem={feedItem} />
        ))}
      </section>
    </main>
  );
}

type MetricCardProperties = {
  label: string;
  value: string;
  icon: ReactElement;
};

function MetricCard(properties: MetricCardProperties): ReactElement {
  return (
    <article className="metric-card">
      <div className="metric-icon">{properties.icon}</div>
      <div>
        <span>{properties.label}</span>
        <strong>{properties.value}</strong>
      </div>
    </article>
  );
}

type FeedCardProperties = {
  feedItem: WorldCupFeedItem;
};

function FeedCard(properties: FeedCardProperties): ReactElement {
  const { feedItem } = properties;
  const typeLabel = feedItem.type === "news" ? "Новость" : "Отчет";

  return (
    <article className={`feed-card ${feedItem.type}`}>
      {feedItem.imageUrl ? (
        <img className="feed-image" src={feedItem.imageUrl} alt="" loading="lazy" />
      ) : (
        <div className="feed-image report-image" aria-hidden="true">
          <FileText size={42} />
        </div>
      )}

      <div className="feed-body">
        <div className="feed-meta">
          <span>{typeLabel}</span>
          <span>{feedItem.sourceName}</span>
          {feedItem.groupName ? <span>{feedItem.groupName}</span> : null}
        </div>
        <h2>{feedItem.title}</h2>
        <p>{feedItem.summary}</p>
        <div className="feed-footer">
          <time>{formatDateTime(feedItem.publishedAt)}</time>
          <a href={feedItem.link} target="_blank" rel="noreferrer">
            Открыть
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

type SourceStatusListProperties = {
  feedPayload: WorldCupFeedPayload;
};

function SourceStatusList(properties: SourceStatusListProperties): ReactElement | null {
  const failedSources = properties.feedPayload.sources.filter(
    (sourceStatus) => sourceStatus.status === "error"
  );

  if (failedSources.length === 0) {
    return null;
  }

  return (
    <section className="source-errors" aria-label="Проблемы источников">
      {failedSources.map((sourceStatus) => (
        <div key={sourceStatus.url} className="source-error">
          <AlertTriangle size={17} aria-hidden="true" />
          <span>{sourceStatus.name}: {sourceStatus.message}</span>
        </div>
      ))}
    </section>
  );
}

type ErrorBannerProperties = {
  message: string;
};

function ErrorBanner(properties: ErrorBannerProperties): ReactElement {
  return (
    <section className="error-banner" role="alert">
      <AlertTriangle size={18} aria-hidden="true" />
      <span>{properties.message}</span>
    </section>
  );
}

function LoadingState(): ReactElement {
  return (
    <div className="state-card">
      <RefreshCw className="spin" size={24} aria-hidden="true" />
      <span>Загрузка свежей ленты</span>
    </div>
  );
}

function EmptyState(): ReactElement {
  return (
    <div className="state-card">
      <Search size={24} aria-hidden="true" />
      <span>Материалы не найдены</span>
    </div>
  );
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "нет даты";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APPLICATION_TIME_ZONE
  }).format(new Date(value));
}
