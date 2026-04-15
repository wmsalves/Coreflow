"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { LandingLocale, LandingTheme } from "@/features/landing/types";

const THEME_STORAGE_KEY = "coreflow:landing-theme";
const LOCALE_STORAGE_KEY = "coreflow:landing-locale";
const LANDING_PREFERENCES_EVENT = "coreflow:landing-preferences";

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
    return "dark";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "light" ? "light" : "dark";
}

function resolveLocalePreference(): LandingLocale {
  if (typeof window === "undefined") {
    return "en";
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
  const theme = useSyncExternalStore<LandingTheme>(
    subscribeLandingPreferences,
    resolveThemePreference,
    () => "dark",
  );
  const locale = useSyncExternalStore<LandingLocale>(
    subscribeLandingPreferences,
    resolveLocalePreference,
    () => "en",
  );

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
