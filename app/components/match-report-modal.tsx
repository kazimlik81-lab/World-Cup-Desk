import { ClipboardList, MapPin, X } from "lucide-react";
import type { MouseEvent, ReactElement } from "react";
import { APPLICATION_TIME_ZONE } from "@/lib/constants";
import { interpolateMatchText, type AppCopy } from "@/lib/localization";
import type { MatchEntry } from "@/lib/tournament-data";

type MatchReportModalProperties = {
  matchEntry: MatchEntry;
  onClose: () => void;
  copy: AppCopy["matchReport"];
  commonCopy: AppCopy["common"];
  dateLocale: string;
};

export function MatchReportModal(properties: MatchReportModalProperties): ReactElement {
  const { matchEntry } = properties;
  const stopModalClose = (mouseEvent: MouseEvent<HTMLElement>): void => {
    mouseEvent.stopPropagation();
  };
  const reportParagraphs = buildReportParagraphs(matchEntry, properties.copy);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={properties.onClose}>
      <section
        className="news-modal match-report-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-report-title"
        onMouseDown={stopModalClose}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{properties.copy.eyebrow}</p>
            <h2 id="match-report-title">{properties.copy.title}</h2>
          </div>
          <button className="icon-action" type="button" onClick={properties.onClose} aria-label={properties.copy.closeLabel}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="report-header-card">
          <div className="report-icon">
            <ClipboardList size={22} aria-hidden="true" />
          </div>
          <div>
            <span className="group-pill">
              {properties.commonCopy.group} {matchEntry.groupCode}
            </span>
            <h3>
              {matchEntry.homeTeam} {properties.commonCopy.versus} {matchEntry.awayTeam}
            </h3>
            <p>
              <MapPin size={15} aria-hidden="true" />
              {matchEntry.venue}, {matchEntry.city}
            </p>
          </div>
          <strong className={`match-score ${matchEntry.status}`}>
            {matchEntry.scoreLabel ?? properties.commonCopy.soon}
          </strong>
        </div>

        <div className="report-meta-grid">
          <ReportMeta label={properties.copy.dateLabel} value={formatMatchDate(matchEntry.matchDate, properties.dateLocale)} />
          <ReportMeta label={properties.copy.timeLabel} value={matchEntry.timeLabel} />
          <ReportMeta
            label={properties.copy.statusLabel}
            value={matchEntry.status === "finished" ? properties.copy.finishedStatus : properties.copy.scheduledStatus}
          />
        </div>

        <div className="report-body">
          {reportParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

type ReportMetaProperties = {
  label: string;
  value: string;
};

function ReportMeta(properties: ReportMetaProperties): ReactElement {
  return (
    <div className="report-meta-item">
      <span>{properties.label}</span>
      <strong>{properties.value}</strong>
    </div>
  );
}

function buildReportParagraphs(matchEntry: MatchEntry, copy: AppCopy["matchReport"]): string[] {
  if (matchEntry.status === "finished" && matchEntry.scoreLabel) {
    return [
      interpolateMatchText(copy.finishedIntro, matchEntry),
      copy.finishedInsight,
      copy.finishedStorage
    ];
  }

  return [
    interpolateMatchText(copy.scheduledIntro, matchEntry),
    copy.scheduledInsight,
    copy.scheduledStorage
  ];
}

function formatMatchDate(matchDate: string, dateLocale: string): string {
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "long",
    timeZone: APPLICATION_TIME_ZONE
  }).format(new Date(`${matchDate}T12:00:00Z`));
}
