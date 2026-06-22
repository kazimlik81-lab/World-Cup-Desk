"use client";

import { Anchor, ArrowLeft, Crosshair, Download, Hash, Shield, Ship, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { LanguageSelector } from "@/app/components/language-selector";
import styles from "@/app/jumdo-javelin/page.module.css";
import { appCopies, type AppCopy, type MissionId, type ShipClassCode } from "@/lib/localization";
import { useLanguagePreference } from "@/lib/use-language-preference";

type FleetShip = {
  id: string;
  lane: number;
  size: "small" | "medium" | "large";
  tone: "green" | "blue" | "yellow" | "red";
  shipClass: ShipClass;
  offset: number;
  armor: number;
  speed: number;
  firepower: number;
};

type ShipClass = {
  name: string;
  role: string;
  code: ShipClassCode;
};

type Mission = {
  id: MissionId;
  shipCount: number;
  laneCount: number;
  codePrefix: string;
};

const GAME_SERIAL_NUMBER = "JUMDO-JAVELIN-2026-0615-SEA-0048";

const SHIP_TONES: FleetShip["tone"][] = ["green", "blue", "yellow", "red"];
const SHIP_SIZES: FleetShip["size"][] = ["small", "medium", "large"];
const SHIP_CLASSES: ShipClass[] = [
  { name: "Scout", role: "Fast recon", code: "SC" },
  { name: "Destroyer", role: "Attack line", code: "DS" },
  { name: "Carrier", role: "Command deck", code: "CA" },
  { name: "Cargo", role: "Supply run", code: "CG" },
  { name: "Rescue", role: "Repair team", code: "RS" },
  { name: "Submarine", role: "Hidden strike", code: "SM" },
  { name: "Icebreaker", role: "Heavy push", code: "IB" },
  { name: "Missile Boat", role: "Long shot", code: "MB" }
];
const MISSIONS: Mission[] = [
  {
    id: "custom",
    shipCount: 72,
    laneCount: 9,
    codePrefix: "CM"
  },
  {
    id: "harbor-rush",
    shipCount: 44,
    laneCount: 7,
    codePrefix: "HR"
  },
  {
    id: "night-escort",
    shipCount: 56,
    laneCount: 8,
    codePrefix: "NE"
  },
  {
    id: "storm-wall",
    shipCount: 96,
    laneCount: 10,
    codePrefix: "SW"
  }
];

export default function JumdoJavelinPage(): ReactElement {
  const [selectedLanguage, setSelectedLanguage] = useLanguagePreference();
  const [selectedMissionId, setSelectedMissionId] = useState(MISSIONS[0].id);
  const copy = appCopies[selectedLanguage];
  const selectedMission = getSelectedMission(selectedMissionId);
  const selectedMissionCopy = copy.game.missions[selectedMission.id];
  const fleetShips = useMemo(() => buildFleetShips(selectedMission), [selectedMission]);
  const downloadSelectedMissionScreen = (): void => {
    const missionScreenHtml = buildMissionScreenHtml(selectedMission, fleetShips, copy.game, selectedLanguage);
    const missionScreenBlob = new Blob([missionScreenHtml], { type: "text/html;charset=utf-8" });
    const missionScreenUrl = URL.createObjectURL(missionScreenBlob);
    const downloadAnchor = document.createElement("a");

    downloadAnchor.href = missionScreenUrl;
    downloadAnchor.download = `${selectedMission.id}-screen.html`;
    downloadAnchor.rel = "noopener";
    downloadAnchor.click();
    URL.revokeObjectURL(missionScreenUrl);
  };

  return (
    <main className={styles.shell}>
      <section className={styles.topBar} aria-label="Jumdo Javelin">
        <Link className={styles.backLink} href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          {copy.game.back}
        </Link>

        <div className={styles.titleBlock}>
          <p>{copy.game.eyebrow}</p>
          <h1>Jumdo Javelin</h1>
        </div>

        <div className={styles.serialBadge} aria-label={copy.game.serialLabel}>
          <Hash size={16} aria-hidden="true" />
          <span>{GAME_SERIAL_NUMBER}</span>
        </div>

        <button
          className={styles.downloadButton}
          type="button"
          onClick={downloadSelectedMissionScreen}
          aria-label={copy.game.downloadAriaLabel}
        >
          <Download size={16} aria-hidden="true" />
          <span>{copy.game.downloadLabel}</span>
        </button>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          ariaLabel={copy.language.selectorLabel}
        />
      </section>

      <section className={styles.statusGrid} aria-label={copy.game.statusLabel}>
        <StatusTile label={copy.game.shipsLabel} value={fleetShips.length.toString()} />
        <StatusTile label={copy.game.lanesLabel} value={selectedMission.laneCount.toString()} />
        <StatusTile label={copy.game.missionLabel} value={selectedMissionCopy.name} />
        <StatusTile label={copy.game.statusLabel} value={copy.game.readyStatus} />
      </section>

      <section className={styles.gameBoard} aria-label={copy.game.boardLabel}>
        <div className={styles.radar} aria-hidden="true">
          <Crosshair size={28} />
        </div>

        <div className={styles.seaLanes}>
          {fleetShips.map((fleetShip) => (
            <div
              key={fleetShip.id}
              className={[
                styles.ship,
                styles[fleetShip.size],
                styles[fleetShip.tone],
                styles[`lane${fleetShip.lane}`]
              ].join(" ")}
              style={{ "--ship-offset": `${fleetShip.offset}%` } as React.CSSProperties}
              title={fleetShip.id}
            >
              <Ship size={fleetShip.size === "large" ? 28 : 22} aria-hidden="true" />
              <span>{fleetShip.id}</span>
              <small>{copy.game.shipClasses[fleetShip.shipClass.code].name}</small>
              <b aria-label={`Armor ${fleetShip.armor}, speed ${fleetShip.speed}, firepower ${fleetShip.firepower}`}>
                <Shield size={12} aria-hidden="true" />
                {fleetShip.armor}
                <Zap size={12} aria-hidden="true" />
                {fleetShip.firepower}
              </b>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.missionPanel} aria-label="Custom mission">
        <div className={styles.missionHeader}>
          <span>{selectedMissionCopy.name}</span>
          <strong>{selectedMissionCopy.objective}</strong>
        </div>

        <div className={styles.missionButtons} aria-label={copy.game.missionChooserLabel}>
          {MISSIONS.map((mission) => (
            <button
              key={mission.id}
              type="button"
              className={mission.id === selectedMission.id ? styles.activeMission : ""}
              onClick={() => setSelectedMissionId(mission.id)}
            >
              <span>{copy.game.missions[mission.id].name}</span>
              <strong>
                {mission.shipCount} {copy.game.shipsLabel.toLowerCase()}
              </strong>
            </button>
          ))}
        </div>
      </section>

      <section className={styles.catalogPanel} aria-label={copy.game.catalogLabel}>
        <div className={styles.catalogTitle}>
          <Anchor size={18} aria-hidden="true" />
          <span>{copy.game.catalogTitle}</span>
        </div>

        <div className={styles.catalogGrid}>
          {SHIP_CLASSES.map((shipClass) => (
            <article key={shipClass.code} className={styles.catalogItem}>
              <strong>{copy.game.shipClasses[shipClass.code].name}</strong>
              <span>{copy.game.shipClasses[shipClass.code].role}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

type StatusTileProperties = {
  label: string;
  value: string;
};

function StatusTile(properties: StatusTileProperties): ReactElement {
  return (
    <article className={styles.statusTile}>
      <span>{properties.label}</span>
      <strong>{properties.value}</strong>
    </article>
  );
}

function getSelectedMission(selectedMissionId: MissionId): Mission {
  for (const mission of MISSIONS) {
    if (mission.id === selectedMissionId) {
      return mission;
    }
  }

  throw new Error(`Unknown Jumdo Javelin mission: ${selectedMissionId}`);
}

function buildFleetShips(mission: Mission): FleetShip[] {
  const fleetShips: FleetShip[] = [];

  for (let shipIndex = 0; shipIndex < mission.shipCount; shipIndex += 1) {
    const serialPart = (shipIndex + 1).toString().padStart(2, "0");
    const shipClass = SHIP_CLASSES[shipIndex % SHIP_CLASSES.length];

    fleetShips.push({
      id: `${mission.codePrefix}-${shipClass.code}-${serialPart}`,
      lane: (shipIndex % mission.laneCount) + 1,
      size: SHIP_SIZES[shipIndex % SHIP_SIZES.length],
      tone: SHIP_TONES[shipIndex % SHIP_TONES.length],
      shipClass,
      offset: (shipIndex * 17) % 92,
      armor: 40 + ((shipIndex * 9) % 60),
      speed: 18 + ((shipIndex * 7) % 34),
      firepower: 25 + ((shipIndex * 11) % 70)
    });
  }

  return fleetShips;
}

function buildMissionScreenHtml(
  mission: Mission,
  fleetShips: FleetShip[],
  gameCopy: AppCopy["game"],
  languageCode: string
): string {
  const fleetRows: string[] = [];
  const missionCopy = gameCopy.missions[mission.id];

  for (const fleetShip of fleetShips) {
    const shipClassCopy = gameCopy.shipClasses[fleetShip.shipClass.code];

    fleetRows.push(`
      <tr>
        <td>${escapeHtml(fleetShip.id)}</td>
        <td>${fleetShip.lane}</td>
        <td>${escapeHtml(shipClassCopy.name)}</td>
        <td>${fleetShip.armor}</td>
        <td>${fleetShip.speed}</td>
        <td>${fleetShip.firepower}</td>
      </tr>`);
  }

  return `<!doctype html>
<html lang="${escapeHtml(languageCode)}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(missionCopy.name)} | Jumdo Javelin</title>
    <style>
      body {
        margin: 0;
        background:
          linear-gradient(128deg, rgba(15, 159, 141, 0.2), rgba(15, 159, 141, 0) 34%),
          linear-gradient(42deg, rgba(255, 247, 232, 0) 0 18%, rgba(255, 210, 127, 0.24) 18% 39%, rgba(255, 247, 232, 0) 39% 72%, rgba(179, 61, 82, 0.12) 72%),
          linear-gradient(180deg, #f8fffd 0%, #eef8ff 47%, #fff8ea 100%);
        color: #10201e;
        font-family: Arial, sans-serif;
      }

      main {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 32px 0;
      }

      header {
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.68);
        backdrop-filter: blur(18px);
        box-shadow: 0 18px 48px rgba(16, 64, 66, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95);
        padding: 20px;
      }

      h1,
      p {
        margin: 0;
      }

      p {
        margin-top: 10px;
        color: rgba(16, 32, 30, 0.62);
      }

      table {
        width: 100%;
        margin-top: 18px;
        border-collapse: collapse;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.68);
        backdrop-filter: blur(18px);
        box-shadow: 0 18px 48px rgba(16, 64, 66, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95);
      }

      th,
      td {
        border: 1px solid rgba(16, 64, 66, 0.14);
        padding: 10px;
        text-align: left;
      }

      th {
        background: rgba(233, 255, 250, 0.58);
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>${escapeHtml(missionCopy.name)}</h1>
        <p>${escapeHtml(missionCopy.objective)}</p>
        <p>${escapeHtml(GAME_SERIAL_NUMBER)}</p>
      </header>
      <table>
        <thead>
          <tr>
            <th>${escapeHtml(gameCopy.downloadColumns.ship)}</th>
            <th>${escapeHtml(gameCopy.downloadColumns.lane)}</th>
            <th>${escapeHtml(gameCopy.downloadColumns.className)}</th>
            <th>${escapeHtml(gameCopy.downloadColumns.armor)}</th>
            <th>${escapeHtml(gameCopy.downloadColumns.speed)}</th>
            <th>${escapeHtml(gameCopy.downloadColumns.fire)}</th>
          </tr>
        </thead>
        <tbody>${fleetRows.join("")}
        </tbody>
      </table>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}
