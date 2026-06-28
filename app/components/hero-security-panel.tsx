import { LockKeyhole } from "lucide-react";
import type { ReactElement } from "react";
import type { AppCopy } from "@/lib/localization";

type HeroSecurityPanelProperties = {
  copy: AppCopy["home"];
  finishedMatchCount: number;
  scheduledMatchCount: number;
};

export function HeroSecurityPanel(properties: HeroSecurityPanelProperties): ReactElement {
  return (
    <div className="security-panel" aria-label={properties.copy.securityLabel}>
      <div className="security-icon">
        <LockKeyhole size={22} aria-hidden="true" />
      </div>
      <div className="security-copy">
        <span>{properties.copy.httpsEnabled}</span>
        <strong>{properties.copy.secureByDefault}</strong>
        <p>{properties.copy.secureCopy}</p>
      </div>
      <div className="signal-grid" aria-label={properties.copy.summaryLabel}>
        <div>
          <span>{properties.copy.metricGroups}</span>
          <strong>12</strong>
        </div>
        <div>
          <span>{properties.copy.metricFinished}</span>
          <strong>{properties.finishedMatchCount}</strong>
        </div>
        <div>
          <span>{properties.copy.metricScheduled}</span>
          <strong>{properties.scheduledMatchCount}</strong>
        </div>
      </div>
    </div>
  );
}
