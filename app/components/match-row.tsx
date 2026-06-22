import { MapPin } from "lucide-react";
import type { ReactElement } from "react";
import { APPLICATION_TIME_ZONE } from "@/lib/constants";
import type { AppCopy } from "@/lib/localization";
import type { MatchEntry } from "@/lib/tournament-data";

type MatchRowProperties = {
  matchEntry: MatchEntry;
  onOpenReport: (matchEntry: MatchEntry) => void;
  copy: AppCopy["matchRow"];
  commonCopy: AppCopy["common"];
  dateLocale: string;
};

export function MatchRow(properties: MatchRowProperties): ReactElement {
  const { matchEntry } = properties;
  const dateLabel = new Intl.DateTimeFormat(properties.dateLocale, {
    day: "2-digit",
    month: "short",
    timeZone: APPLICATION_TIME_ZONE
  }).format(new Date(`${matchEntry.matchDate}T12:00:00Z`));

  return (
    <button className="match-row" type="button" onClick={() => properties.onOpenReport(matchEntry)}>
      <div className="match-date">
        <span>{dateLabel}</span>
        <small>{matchEntry.timeLabel}</small>
      </div>
      <div className="match-main">
        <span className="group-pill">
          {properties.commonCopy.group} {matchEntry.groupCode}
        </span>
        <strong>
          {matchEntry.homeTeam} {properties.commonCopy.versus} {matchEntry.awayTeam}
        </strong>
        <small>
          <MapPin size={14} aria-hidden="true" />
          {matchEntry.venue}, {matchEntry.city}
        </small>
        <em>{properties.copy.reportHint}</em>
      </div>
      <div className={`match-score ${matchEntry.status}`}>{matchEntry.scoreLabel ?? properties.commonCopy.soon}</div>
    </button>
  );
}
