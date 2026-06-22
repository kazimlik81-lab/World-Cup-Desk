import { AlertTriangle } from "lucide-react";
import type { ReactElement } from "react";

type ErrorBannerProperties = {
  message: string;
};

export function ErrorBanner(properties: ErrorBannerProperties): ReactElement {
  return (
    <section className="error-banner" role="alert">
      <AlertTriangle size={18} aria-hidden="true" />
      <span>{properties.message}</span>
    </section>
  );
}
