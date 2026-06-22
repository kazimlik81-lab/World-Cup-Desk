import { BarChart3 } from "lucide-react";
import type { ReactElement } from "react";
import type { AppCopy } from "@/lib/localization";
import type { PlayerStatistic, TeamStatistic } from "@/lib/tournament-data";

type StatisticsPanelProperties = {
  playerStatistics: PlayerStatistic[];
  teamStatistics: TeamStatistic[];
  copy: AppCopy["statisticsPanel"];
};

export function StatisticsPanel(properties: StatisticsPanelProperties): ReactElement {
  return (
    <section className="panel-section stats-panel" aria-labelledby="stats-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{properties.copy.eyebrow}</p>
          <h2 id="stats-title">{properties.copy.title}</h2>
        </div>
        <BarChart3 size={22} aria-hidden="true" />
      </div>

      <div className="stat-columns">
        <div className="stat-column">
          <h3>{properties.copy.scorersTitle}</h3>
          {properties.playerStatistics.map((playerStatistic) => (
            <div key={playerStatistic.playerName} className="stat-row">
              <span>{playerStatistic.playerName}</span>
              <strong>
                {playerStatistic.goals} {properties.copy.goalsLabel}
              </strong>
              <small>
                {playerStatistic.teamName}, {playerStatistic.assists} {properties.copy.assistsShortLabel}
              </small>
            </div>
          ))}
        </div>
        <div className="stat-column">
          <h3>{properties.copy.teamsTitle}</h3>
          {properties.teamStatistics.map((teamStatistic) => (
            <div key={teamStatistic.label} className="stat-row">
              <span>{teamStatistic.label}</span>
              <strong>{teamStatistic.value}</strong>
              <small>{teamStatistic.teamName}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
