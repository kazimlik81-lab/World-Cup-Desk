import type { ReactElement } from "react";

type MetricCardProperties = {
  label: string;
  value: string;
  icon: ReactElement;
};

export function MetricCard(properties: MetricCardProperties): ReactElement {
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
