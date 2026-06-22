import type { ReactElement } from "react";
import type { AppCopy } from "@/lib/localization";
import {
  tournamentGroups,
  type GroupCode,
  type StandingTeam,
  type TournamentGroup
} from "@/lib/tournament-data";

type TournamentTableProperties = {
  selectedGroup: TournamentGroup;
  selectedGroupCode: GroupCode;
  onSelectGroup: (groupCode: GroupCode) => void;
  copy: AppCopy["tournamentTable"];
};

export function TournamentTable(properties: TournamentTableProperties): ReactElement {
  return (
    <section className="panel-section table-panel" aria-labelledby="table-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{properties.copy.eyebrow}</p>
          <h2 id="table-title">
            {properties.copy.titlePrefix} {properties.selectedGroup.groupCode}
          </h2>
        </div>
        <select
          className="group-select"
          value={properties.selectedGroupCode}
          onChange={(event) => properties.onSelectGroup(event.target.value as GroupCode)}
          aria-label={properties.copy.selectLabel}
        >
          {tournamentGroups.map((group) => (
            <option key={group.groupCode} value={group.groupCode}>
              {properties.copy.titlePrefix} {group.groupCode}
            </option>
          ))}
        </select>
      </div>

      <div
        className="standings-table"
        role="table"
        aria-label={`${properties.copy.tableLabelPrefix} ${properties.selectedGroup.groupCode}`}
      >
        <div className="standings-row standings-header" role="row">
          <span role="columnheader">{properties.copy.columns.team}</span>
          <span role="columnheader">{properties.copy.columns.played}</span>
          <span role="columnheader">{properties.copy.columns.won}</span>
          <span role="columnheader">{properties.copy.columns.drawn}</span>
          <span role="columnheader">{properties.copy.columns.lost}</span>
          <span role="columnheader">{properties.copy.columns.goals}</span>
          <span role="columnheader">{properties.copy.columns.points}</span>
        </div>
        {properties.selectedGroup.teams.map((standingTeam) => (
          <StandingRow key={standingTeam.teamName} standingTeam={standingTeam} />
        ))}
      </div>
    </section>
  );
}

type StandingRowProperties = {
  standingTeam: StandingTeam;
};

function StandingRow(properties: StandingRowProperties): ReactElement {
  const { standingTeam } = properties;
  const goalDifferenceLabel =
    standingTeam.goalDifference > 0
      ? `+${standingTeam.goalDifference}`
      : standingTeam.goalDifference.toString();

  return (
    <div className="standings-row" role="row">
      <strong role="cell">{standingTeam.teamName}</strong>
      <span role="cell">{standingTeam.played}</span>
      <span role="cell">{standingTeam.won}</span>
      <span role="cell">{standingTeam.drawn}</span>
      <span role="cell">{standingTeam.lost}</span>
      <span role="cell">
        {standingTeam.goalsFor}:{standingTeam.goalsAgainst} ({goalDifferenceLabel})
      </span>
      <span role="cell">{standingTeam.points}</span>
    </div>
  );
}
