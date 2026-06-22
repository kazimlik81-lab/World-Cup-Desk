"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_LANGUAGE, getSupportedLanguage, type LanguageCode } from "@/lib/localization";

const LANGUAGE_STORAGE_KEY = "worldCupDeskLanguage";

export function useLanguagePreference(): readonly [LanguageCode, (languageCode: LanguageCode) => void] {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    setSelectedLanguage(getSupportedLanguage(storedLanguage));
  }, []);

  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
  }, [selectedLanguage]);

  const updateSelectedLanguage = useCallback((languageCode: LanguageCode): void => {
    setSelectedLanguage(languageCode);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  }, []);

  return [selectedLanguage, updateSelectedLanguage] as const;
}
