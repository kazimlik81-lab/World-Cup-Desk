import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { APPLICATION_TIME_ZONE } from "@/lib/constants";
import {
  appCopies,
  isSupportedLanguage,
  languageDateLocales,
  supportedLanguageCodes,
  type LanguageCode
} from "@/lib/localization";
import { buildMatchSlug, findMatchBySlug } from "@/lib/match-routes";
import { seoCopies } from "@/lib/seo-copy";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  buildLanguageHomePath,
  buildLanguageMatchPath,
  SITE_IMAGE_PATH,
  SITE_NAME
} from "@/lib/site-metadata";
import { allMatches, type MatchEntry } from "@/lib/tournament-data";

type MatchPageProperties = {
  params: Promise<{
    language: string;
    matchSlug: string;
  }>;
};

export function generateStaticParams(): Array<{ language: LanguageCode; matchSlug: string }> {
  const staticParams: Array<{ language: LanguageCode; matchSlug: string }> = [];

  for (const languageCode of supportedLanguageCodes) {
    for (const matchEntry of allMatches) {
      staticParams.push({
        language: languageCode,
        matchSlug: buildMatchSlug(matchEntry)
      });
    }
  }

  return staticParams;
}

export async function generateMetadata(properties: MatchPageProperties): Promise<Metadata> {
  const { language, matchSlug } = await properties.params;

  if (!isSupportedLanguage(language)) {
    return {};
  }

  const matchEntry = findMatchBySlug(matchSlug);

  if (!matchEntry) {
    return {};
  }

  const seoCopy = seoCopies[language];
  const canonicalPath = buildLanguageMatchPath(language, matchSlug);

  return {
    title: seoCopy.buildMatchTitle(matchEntry),
    description: seoCopy.buildMatchDescription(matchEntry),
    alternates: {
      canonical: buildCanonicalUrl(canonicalPath),
      languages: buildLanguageAlternates(
        (languageCode) => buildLanguageMatchPath(languageCode, matchSlug),
        buildLanguageMatchPath("en", matchSlug)
      )
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: seoCopy.buildMatchTitle(matchEntry),
      description: seoCopy.buildMatchDescription(matchEntry),
      url: buildCanonicalUrl(canonicalPath),
      images: [SITE_IMAGE_PATH]
    },
    twitter: {
      card: "summary_large_image",
      title: seoCopy.buildMatchTitle(matchEntry),
      description: seoCopy.buildMatchDescription(matchEntry),
      images: [SITE_IMAGE_PATH]
    }
  };
}

export default async function MatchPage(properties: MatchPageProperties): Promise<ReactElement> {
  const { language, matchSlug } = await properties.params;

  if (!isSupportedLanguage(language)) {
    notFound();
  }

  const matchEntry = findMatchBySlug(matchSlug);

  if (!matchEntry) {
    notFound();
  }

  const seoCopy = seoCopies[language];
  const appCopy = appCopies[language];
  const dateLocale = languageDateLocales[language];
  const relatedMatches = allMatches.filter(
    (candidateMatch) =>
      candidateMatch.groupCode === matchEntry.groupCode && buildMatchSlug(candidateMatch) !== matchSlug
  );
  const structuredData = buildSportsEventStructuredData(matchEntry, language, matchSlug);

  return (
    <main className="match-detail-shell" lang={language}>
      <section className="match-detail-hero" aria-labelledby="match-detail-title">
        <Link className="match-detail-back" href={buildLanguageHomePath(language)}>
          {seoCopy.matchPageBack}
        </Link>
        <p className="eyebrow">{seoCopy.matchPageEyebrow}</p>
        <h1 id="match-detail-title">
          {matchEntry.homeTeam} {appCopy.common.versus} {matchEntry.awayTeam}
        </h1>
        <p className="match-detail-lead">{seoCopy.buildMatchLead(matchEntry)}</p>
      </section>

      <section className="match-detail-grid" aria-label={seoCopy.matchPageSummaryTitle}>
        <MatchDetailCard label={seoCopy.matchPageGroup} value={matchEntry.groupCode} />
        <MatchDetailCard label={seoCopy.matchPageVenue} value={`${matchEntry.venue}, ${matchEntry.city}`} />
        <MatchDetailCard
          label={seoCopy.matchPageStatus}
          value={matchEntry.status === "finished" ? seoCopy.matchPageFinished : seoCopy.matchPageScheduled}
        />
        <MatchDetailCard label={seoCopy.matchPageScore} value={matchEntry.scoreLabel ?? appCopy.common.soon} />
      </section>

      <section className="panel-section match-summary-section" aria-labelledby="match-summary-title">
        <h2 id="match-summary-title">{seoCopy.matchPageSummaryTitle}</h2>
        <p>
          {formatMatchDate(matchEntry.matchDate, dateLocale)} · {matchEntry.timeLabel} · {matchEntry.venue},{" "}
          {matchEntry.city}. {seoCopy.buildMatchDescription(matchEntry)}
        </p>
      </section>

      <section className="panel-section related-matches-section" aria-labelledby="related-matches-title">
        <h2 id="related-matches-title">{seoCopy.matchPageRelatedTitle}</h2>
        <div className="related-match-grid">
          {relatedMatches.map((relatedMatch) => (
            <Link
              key={buildMatchSlug(relatedMatch)}
              className="related-match-card"
              href={buildLanguageMatchPath(language, buildMatchSlug(relatedMatch))}
            >
              <span>
                {appCopy.common.group} {relatedMatch.groupCode}
              </span>
              <strong>
                {relatedMatch.homeTeam} {appCopy.common.versus} {relatedMatch.awayTeam}
              </strong>
              <small>{relatedMatch.scoreLabel ?? appCopy.common.soon}</small>
            </Link>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}

type MatchDetailCardProperties = {
  label: string;
  value: string;
};

function MatchDetailCard(properties: MatchDetailCardProperties): ReactElement {
  return (
    <article className="match-detail-card">
      <span>{properties.label}</span>
      <strong>{properties.value}</strong>
    </article>
  );
}

function formatMatchDate(matchDate: string, dateLocale: string): string {
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "long",
    timeZone: APPLICATION_TIME_ZONE
  }).format(new Date(`${matchDate}T12:00:00Z`));
}

function buildSportsEventStructuredData(
  matchEntry: MatchEntry,
  language: LanguageCode,
  matchSlug: string
): Record<string, unknown> {
  const eventUrl = buildCanonicalUrl(buildLanguageMatchPath(language, matchSlug));
  const eventStatus =
    matchEntry.status === "finished"
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled";

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${matchEntry.homeTeam} vs ${matchEntry.awayTeam}`,
    description: seoCopies[language].buildMatchDescription(matchEntry),
    url: eventUrl,
    startDate: `${matchEntry.matchDate}T${toTwentyFourHourTime(matchEntry.timeLabel)}-04:00`,
    eventStatus,
    sport: "Football",
    inLanguage: language,
    homeTeam: {
      "@type": "SportsTeam",
      name: matchEntry.homeTeam
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: matchEntry.awayTeam
    },
    competitor: [
      {
        "@type": "SportsTeam",
        name: matchEntry.homeTeam
      },
      {
        "@type": "SportsTeam",
        name: matchEntry.awayTeam
      }
    ],
    location: {
      "@type": "Place",
      name: matchEntry.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: matchEntry.city
      }
    },
    image: buildCanonicalUrl(SITE_IMAGE_PATH)
  };
}

function toTwentyFourHourTime(timeLabel: string): string {
  const hour = Number.parseInt(timeLabel.split(":")[0] ?? "12", 10);
  const minute = timeLabel.split(":")[1]?.slice(0, 2) ?? "00";
  const normalizedHour = Number.isFinite(hour) ? hour % 24 : 12;

  return `${normalizedHour.toString().padStart(2, "0")}:${minute}:00`;
}
