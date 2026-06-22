import { Languages } from "lucide-react";
import type { ChangeEvent, ReactElement } from "react";
import { languageOptions, type LanguageCode } from "@/lib/localization";

type LanguageSelectorProperties = {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (languageCode: LanguageCode) => void;
  ariaLabel: string;
};

export function LanguageSelector(properties: LanguageSelectorProperties): ReactElement {
  const selectLanguage = (changeEvent: ChangeEvent<HTMLSelectElement>): void => {
    properties.onSelectLanguage(changeEvent.target.value as LanguageCode);
  };

  return (
    <label className="language-selector">
      <Languages size={17} aria-hidden="true" />
      <span className="language-selector-label">{properties.ariaLabel}</span>
      <select value={properties.selectedLanguage} onChange={selectLanguage} aria-label={properties.ariaLabel}>
        {languageOptions.map((languageOption) => (
          <option key={languageOption.code} value={languageOption.code}>
            {languageOption.shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
