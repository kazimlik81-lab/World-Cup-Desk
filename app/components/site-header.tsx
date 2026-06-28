import { Gamepad2, Trophy } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { LanguageSelector } from "@/app/components/language-selector";
import type { AppCopy, LanguageCode } from "@/lib/localization";

type SiteHeaderProperties = {
  copy: AppCopy;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (languageCode: LanguageCode) => void;
};

export function SiteHeader(properties: SiteHeaderProperties): ReactElement {
  return (
    <header className="site-header">
      <a className="site-brand" href="#top" aria-label={properties.copy.home.title}>
        <span className="brand-mark site-brand-mark">
          <Trophy size={18} aria-hidden="true" />
        </span>
        <span>{properties.copy.home.title}</span>
      </a>

      <nav className="site-nav" aria-label={properties.copy.home.dataLabel}>
        <a href="#overview">{properties.copy.home.summaryLabel}</a>
        <a href="#data">{properties.copy.home.dataLabel}</a>
        <a href="#calendar">{properties.copy.home.matchesTitle}</a>
        <a href="#news">{properties.copy.home.newsTitle}</a>
      </nav>

      <div className="site-header-actions">
        <Link className="icon-action" href="/jumdo-javelin" aria-label={properties.copy.home.openGameLabel}>
          <Gamepad2 size={18} aria-hidden="true" />
        </Link>
        <LanguageSelector
          selectedLanguage={properties.selectedLanguage}
          onSelectLanguage={properties.onSelectLanguage}
          ariaLabel={properties.copy.language.selectorLabel}
        />
      </div>
    </header>
  );
}
