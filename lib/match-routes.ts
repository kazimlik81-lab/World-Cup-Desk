import { allMatches, type MatchEntry } from "@/lib/tournament-data";

export function buildMatchSlug(matchEntry: MatchEntry): string {
  return [
    matchEntry.matchDate,
    slugifyRouteSegment(matchEntry.homeTeam),
    slugifyRouteSegment(matchEntry.awayTeam)
  ].join("-");
}

export function findMatchBySlug(matchSlug: string): MatchEntry | null {
  for (const matchEntry of allMatches) {
    if (buildMatchSlug(matchEntry) === matchSlug) {
      return matchEntry;
    }
  }

  return null;
}

export function slugifyRouteSegment(value: string): string {
  const normalizedValue = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const routeSafeCharacters = normalizedValue.replace(/[^a-z0-9]+/g, "-");

  return routeSafeCharacters.replace(/^-+|-+$/g, "");
}
