"use client";

import {
  Activity,
  CalendarDays,
  Gamepad2,
  Plane,
  RefreshCw,
  Search,
  ShieldCheck,
  Trophy,
  Users
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import { ErrorBanner } from "@/app/components/error-banner";
import { HeroSecurityPanel } from "@/app/components/hero-security-panel";
import { LanguageSelector } from "@/app/components/language-selector";
import { MatchReportModal } from "@/app/components/match-report-modal";
import { MatchRow } from "@/app/components/match-row";
import { MetricCard } from "@/app/components/metric-card";
import { NewsCard } from "@/app/components/news-card";
import { NewsModal } from "@/app/components/news-modal";
import { SiteHeader } from "@/app/components/site-header";
import { StatisticsPanel } from "@/app/components/statistics-panel";
import { TournamentTable } from "@/app/components/tournament-table";
import { APPLICATION_TIME_ZONE } from "@/lib/constants";
import { appCopies, languageDateLocales, type AppCopy } from "@/lib/localization";
import { useLanguagePreference } from "@/lib/use-language-preference";
import {
  allMatches,
  playerStatistics,
  teamStatistics,
  tournamentGroups,
  type ChampionshipNewsItem,
  type GroupCode,
  type MatchEntry,
  type TournamentGroup
} from "@/lib/tournament-data";
import type { WorldCupFeedItem, WorldCupFeedPayload } from "@/lib/types";

type MatchFilter = "all" | "finished" | "scheduled";

export default function Home(): ReactElement {
  const [selectedLanguage, setSelectedLanguage] = useLanguagePreference();
  const [feedPayload, setFeedPayload] = useState<WorldCupFeedPayload | null>(null);
  const [selectedGroupCode, setSelectedGroupCode] = useState<GroupCode>("A");
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<MatchFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [selectedMatchReport, setSelectedMatchReport] = useState<MatchEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const copy = appCopies[selectedLanguage];
  const dateLocale = languageDateLocales[selectedLanguage];
  const matchFilters: Array<{ value: MatchFilter; label: string }> = [
    { value: "all", label: copy.matchFilters.all },
    { value: "finished", label: copy.matchFilters.finished },
    { value: "scheduled", label: copy.matchFilters.scheduled }
  ];

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

  useEffect(() => {
    if (!isNewsModalOpen && !selectedMatchReport) {
      return;
    }

    const closeOnEscape = (keyboardEvent: KeyboardEvent): void => {
      if (keyboardEvent.key === "Escape") {
        setIsNewsModalOpen(false);
        setSelectedMatchReport(null);
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isNewsModalOpen, selectedMatchReport]);

  const selectedGroup = useMemo<TournamentGroup>(() => {
    const matchingGroup = tournamentGroups.find((group) => group.groupCode === selectedGroupCode);

    if (!matchingGroup) {
      throw new Error(`Unknown group selected: ${selectedGroupCode}`);
    }

    return matchingGroup;
  }, [selectedGroupCode]);

  const liveNewsItems = useMemo<ChampionshipNewsItem[]>(() => {
    const feedNewsItems = feedPayload?.items.filter((feedItem) => feedItem.type === "news") ?? [];

    if (feedNewsItems.length === 0) {
      return toLocalizedChampionshipNewsItems(copy.fallbackNews);
    }

    return feedNewsItems.slice(0, 6).map(toChampionshipNewsItem);
  }, [copy.fallbackNews, feedPayload]);

  const visibleMatches = useMemo<MatchEntry[]>(() => {
    return filterMatches(searchText, selectedMatchFilter);
  }, [searchText, selectedMatchFilter]);

  const localizedTeamStatistics = useMemo(() => {
    return teamStatistics.map((teamStatistic, teamStatisticIndex) => {
      const statisticCopy = copy.teamStatistics[teamStatisticIndex];

      if (!statisticCopy) {
        return teamStatistic;
      }

      return {
        ...teamStatistic,
        label: statisticCopy.label,
        value: statisticCopy.value
      };
    });
  }, [copy.teamStatistics]);

  const finishedMatchCount = allMatches.filter((matchEntry) => matchEntry.status === "finished").length;
  const scheduledMatchCount = allMatches.length - finishedMatchCount;

  return (
    <>
      <SiteHeader copy={copy} selectedLanguage={selectedLanguage} onSelectLanguage={setSelectedLanguage} />

      <main id="top" className="application-shell">
      <section className="hero-panel" aria-label={copy.home.heroLabel}>
        <div className="hero-content">
          <div className="brand-row">
            <div className="brand-mark">
              <Trophy size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="eyebrow">{copy.home.eyebrow}</p>
              <h1>{copy.home.title}</h1>
            </div>
          </div>
          <p className="hero-copy">{copy.home.copy}</p>
          <div className="hero-actions" aria-label={copy.home.actionsLabel}>
            <button
              className="primary-action"
              type="button"
              onClick={() => setIsNewsModalOpen(true)}
              aria-haspopup="dialog"
            >
              <Plane size={18} aria-hidden="true" />
              {copy.home.openNews}
            </button>
            <button className="secondary-action" type="button" onClick={loadFeed} disabled={isLoading}>
              <RefreshCw className={isLoading ? "spin" : ""} size={18} aria-hidden="true" />
              {copy.home.refreshFeed}
            </button>
            <Link className="icon-action" href="/jumdo-javelin" aria-label={copy.home.openGameLabel}>
              <Gamepad2 size={18} aria-hidden="true" />
            </Link>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              ariaLabel={copy.language.selectorLabel}
            />
          </div>
        </div>

        <HeroSecurityPanel
          copy={copy.home}
          finishedMatchCount={finishedMatchCount}
          scheduledMatchCount={scheduledMatchCount}
        />
      </section>

      <section id="overview" className="metric-grid" aria-label={copy.home.summaryLabel}>
        <MetricCard label={copy.home.metricGroups} value="12" icon={<Users size={19} />} />
        <MetricCard label={copy.home.metricFinished} value={finishedMatchCount.toString()} icon={<Activity size={19} />} />
        <MetricCard label={copy.home.metricScheduled} value={scheduledMatchCount.toString()} icon={<CalendarDays size={19} />} />
        <MetricCard
          label={copy.home.metricFeed}
          value={formatDateTime(feedPayload?.fetchedAt ?? null, dateLocale, copy.common.noDate)}
          icon={<ShieldCheck size={19} />}
        />
      </section>

      {loadError ? <ErrorBanner message={loadError} /> : null}

      <section className="facts-strip" aria-label={copy.home.factsLabel}>
        {copy.tournamentFacts.map((fact) => (
          <article key={fact.label} className="fact-item">
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </article>
        ))}
      </section>

      <section id="data" className="dashboard-grid" aria-label={copy.home.dataLabel}>
        <TournamentTable
          selectedGroup={selectedGroup}
          selectedGroupCode={selectedGroupCode}
          onSelectGroup={setSelectedGroupCode}
          copy={copy.tournamentTable}
        />
        <StatisticsPanel
          playerStatistics={playerStatistics}
          teamStatistics={localizedTeamStatistics}
          copy={copy.statisticsPanel}
        />
      </section>

      <section id="calendar" className="panel-section" aria-labelledby="calendar-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.home.matchesEyebrow}</p>
            <h2 id="calendar-title">{copy.home.matchesTitle}</h2>
          </div>
          <div className="match-controls">
            <div className="search-box">
              <Search size={18} aria-hidden="true" />
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder={copy.home.searchPlaceholder}
                aria-label={copy.home.searchLabel}
              />
            </div>
            <div className="segmented-control" aria-label={copy.home.matchFilterLabel}>
              {matchFilters.map((filterOption) => (
                <button
                  key={filterOption.value}
                  type="button"
                  className={selectedMatchFilter === filterOption.value ? "active" : ""}
                  onClick={() => setSelectedMatchFilter(filterOption.value)}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="match-list" aria-live="polite">
          {visibleMatches.map((matchEntry) => (
            <MatchRow
              key={`${matchEntry.groupCode}-${matchEntry.homeTeam}-${matchEntry.awayTeam}`}
              matchEntry={matchEntry}
              onOpenReport={setSelectedMatchReport}
              copy={copy.matchRow}
              commonCopy={copy.common}
              dateLocale={dateLocale}
            />
          ))}
        </div>
      </section>

      <section id="news" className="panel-section" aria-labelledby="news-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.home.newsEyebrow}</p>
            <h2 id="news-title">{copy.home.newsTitle}</h2>
          </div>
          <button className="secondary-action compact" type="button" onClick={() => setIsNewsModalOpen(true)}>
            <Plane size={17} aria-hidden="true" />
            {copy.common.open}
          </button>
        </div>

        <div className="news-grid">
          {liveNewsItems.slice(0, 3).map((newsItem) => (
            <NewsCard key={`${newsItem.title}-${newsItem.publishedAt}`} newsItem={newsItem} dateLocale={dateLocale} />
          ))}
        </div>
      </section>

      {isNewsModalOpen ? (
        <NewsModal
          newsItems={liveNewsItems}
          onClose={() => setIsNewsModalOpen(false)}
          copy={copy.newsModal}
          dateLocale={dateLocale}
        />
      ) : null}
      {selectedMatchReport ? (
        <MatchReportModal
          matchEntry={selectedMatchReport}
          onClose={() => setSelectedMatchReport(null)}
          copy={copy.matchReport}
          commonCopy={copy.common}
          dateLocale={dateLocale}
        />
      ) : null}
      </main>
    </>
  );
}

function filterMatches(searchText: string, selectedMatchFilter: MatchFilter): MatchEntry[] {
  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredMatches: MatchEntry[] = [];

  for (const matchEntry of allMatches) {
    if (selectedMatchFilter !== "all" && matchEntry.status !== selectedMatchFilter) {
      continue;
    }

    if (normalizedSearchText && !matchesSearchText(matchEntry, normalizedSearchText)) {
      continue;
    }

    filteredMatches.push(matchEntry);
  }

  return filteredMatches;
}

function matchesSearchText(matchEntry: MatchEntry, normalizedSearchText: string): boolean {
  const searchableMatchText = [
    matchEntry.homeTeam,
    matchEntry.awayTeam,
    matchEntry.groupCode,
    matchEntry.city,
    matchEntry.venue
  ]
    .join(" ")
    .toLowerCase();

  return searchableMatchText.includes(normalizedSearchText);
}

function toChampionshipNewsItem(feedItem: WorldCupFeedItem): ChampionshipNewsItem {
  return {
    title: feedItem.title,
    summary: feedItem.summary,
    sourceName: feedItem.sourceName,
    publishedAt: feedItem.publishedAt ?? new Date().toISOString()
  };
}

function toLocalizedChampionshipNewsItems(newsCopies: AppCopy["fallbackNews"]): ChampionshipNewsItem[] {
  return newsCopies.map((newsCopy) => ({
    title: newsCopy.title,
    summary: newsCopy.summary,
    sourceName: newsCopy.sourceName,
    publishedAt: newsCopy.publishedAt
  }));
}

function formatDateTime(value: string | null, dateLocale: string, noDateLabel: string): string {
  if (!value) {
    return noDateLabel;
  }

  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: APPLICATION_TIME_ZONE
  }).format(new Date(value));
}
