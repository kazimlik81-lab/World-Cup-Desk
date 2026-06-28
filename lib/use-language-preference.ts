"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_LANGUAGE, getSupportedLanguage, type LanguageCode } from "@/lib/localization";

const LANGUAGE_STORAGE_KEY = "worldCupDeskLanguage";

type LanguagePreferenceOptions = {
  readStoredLanguage?: boolean;
};

export function useLanguagePreference(
  initialLanguage: LanguageCode = DEFAULT_LANGUAGE,
  options: LanguagePreferenceOptions = {}
): readonly [LanguageCode, (languageCode: LanguageCode) => void] {
  const shouldReadStoredLanguage = options.readStoredLanguage ?? true;
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(initialLanguage);

  useEffect(() => {
    if (!shouldReadStoredLanguage) {
      return;
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    setSelectedLanguage(getSupportedLanguage(storedLanguage));
  }, [shouldReadStoredLanguage]);

  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
  }, [selectedLanguage]);

  const updateSelectedLanguage = useCallback((languageCode: LanguageCode): void => {
    setSelectedLanguage(languageCode);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  }, []);

  return [selectedLanguage, updateSelectedLanguage] as const;
}
