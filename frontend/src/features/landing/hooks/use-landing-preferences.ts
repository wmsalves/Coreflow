"use client";

import { useCallback, useEffect, useState } from "react";
import type { LandingLocale, LandingTheme } from "@/features/landing/types";

const THEME_STORAGE_KEY = "coreflow:landing-theme";
const LOCALE_STORAGE_KEY = "coreflow:landing-locale";
const LANDING_PREFERENCES_EVENT = "coreflow:landing-preferences";
const DEFAULT_THEME: LandingTheme = "dark";
const DEFAULT_LOCALE: LandingLocale = "en";

function subscribeLandingPreferences(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(LANDING_PREFERENCES_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANDING_PREFERENCES_EVENT, callback);
  };
}

function resolveThemePreference(): LandingTheme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "light" ? "light" : "dark";
}

function resolveLocalePreference(): LandingLocale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  if (savedLocale === "en" || savedLocale === "pt-BR") {
    return savedLocale;
  }

  return window.navigator.language.toLowerCase().startsWith("pt")
    ? "pt-BR"
    : "en";
}

function updateThemePreference(theme: LandingTheme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(LANDING_PREFERENCES_EVENT));
}

function updateLocalePreference(locale: LandingLocale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  window.dispatchEvent(new Event(LANDING_PREFERENCES_EVENT));
}

export function useLandingPreferences() {
  const [theme, setThemeState] = useState<LandingTheme>(DEFAULT_THEME);
  const [locale, setLocaleState] = useState<LandingLocale>(DEFAULT_LOCALE);

  const syncPreferences = useCallback(() => {
    setThemeState(resolveThemePreference());
    setLocaleState(resolveLocalePreference());
  }, []);

  useEffect(() => {
    let active = true;
    const hydratePreferences = () => {
      if (active) {
        syncPreferences();
      }
    };
    const timeoutId = window.setTimeout(hydratePreferences, 0);
    const unsubscribe = subscribeLandingPreferences(hydratePreferences);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [syncPreferences]);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return {
    locale,
    setLocale: updateLocalePreference,
    setTheme: updateThemePreference,
    theme,
  };
}
