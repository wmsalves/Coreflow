"use client";

import { useEffect } from "react";
import type { LandingLocale, LandingTheme } from "@/features/landing/types";

export function useLandingReveal(locale: LandingLocale, theme: LandingTheme) {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".landing-reveal"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.18,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [locale, theme]);
}