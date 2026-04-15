"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ChartColumnIncreasing,
  Dumbbell,
  Flame,
  LayoutDashboard,
  TimerReset,
} from "lucide-react";
import { LandingHeader } from "@/components/marketing/landing-header";
import {
  landingCopy,
  type LandingLocale,
} from "@/components/marketing/landing-copy";
import { type LandingTheme } from "@/components/marketing/theme-toggle";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "coreflow:landing-theme";
const LOCALE_STORAGE_KEY = "coreflow:landing-locale";
const LANDING_PREFERENCES_EVENT = "coreflow:landing-preferences";

const landingThemeStyles = {
  dark: {
    "--landing-accent": "#8f9cff",
    "--landing-accent-pink": "rgba(198,132,255,0.14)",
    "--landing-accent-soft": "rgba(143,156,255,0.15)",
    "--landing-accent-strong": "rgba(143,156,255,0.28)",
    "--landing-accent-warm": "rgba(255,168,104,0.18)",
    "--landing-accent-warm-soft": "rgba(255,168,104,0.14)",
    "--landing-accent-warm-strong": "rgba(255,168,104,0.26)",
    "--landing-accent-ember": "rgba(255,214,186,0.12)",
    "--landing-bg": "#05070b",
    "--landing-bg-elevated": "rgba(10,13,20,0.88)",
    "--landing-border": "rgba(255,255,255,0.09)",
    "--landing-border-strong": "rgba(255,255,255,0.16)",
    "--landing-button-primary": "#f5f7fb",
    "--landing-button-primary-text": "#06070b",
    "--landing-button-secondary": "rgba(255,255,255,0.045)",
    "--landing-button-secondary-hover": "rgba(255,255,255,0.08)",
    "--landing-glow": "rgba(114,124,255,0.14)",
    "--landing-header": "rgba(8,10,15,0.56)",
    "--landing-logo-frame": "rgba(255,255,255,0.04)",
    "--landing-panel":
      "linear-gradient(180deg, rgba(18,16,20,0.9), rgba(9,10,14,0.94))",
    "--landing-panel-muted": "rgba(255,255,255,0.03)",
    "--landing-preview-frame": "rgba(255,255,255,0.08)",
    "--landing-preview-glass": "rgba(255,255,255,0.04)",
    "--landing-hover-shadow-soft": "0 22px 72px rgba(0,0,0,0.24)",
    "--landing-hover-shadow-strong": "0 34px 110px rgba(0,0,0,0.34)",
    "--landing-progress-end": "#8e9bff",
    "--landing-progress-start": "#ffffff",
    "--landing-shadow": "0 30px 100px rgba(0,0,0,0.42)",
    "--landing-shadow-soft": "0 18px 60px rgba(0,0,0,0.22)",
    "--landing-surface": "rgba(255,255,255,0.032)",
    "--landing-surface-alt": "#10131a",
    "--landing-surface-strong": "rgba(255,255,255,0.06)",
    "--landing-text": "#f7f8fb",
    "--landing-text-faint": "rgba(247,248,251,0.4)",
    "--landing-text-muted": "rgba(247,248,251,0.62)",
    "--landing-text-soft": "rgba(247,248,251,0.8)",
    "--status-done-bg": "#9ae6b4",
    "--status-done-text": "#083a28",
    "--status-live-bg": "#f7f8fb",
    "--status-live-text": "#05070a",
    "--status-next-bg": "rgba(255,255,255,0.1)",
    "--status-next-text": "rgba(247,249,252,0.68)",
    "--track-bg": "rgba(255,255,255,0.08)",
  },
  light: {
    "--landing-accent": "#586cff",
    "--landing-accent-pink": "rgba(196,113,255,0.08)",
    "--landing-accent-soft": "rgba(88,108,255,0.14)",
    "--landing-accent-strong": "rgba(88,108,255,0.22)",
    "--landing-accent-warm": "rgba(245,164,112,0.16)",
    "--landing-accent-warm-soft": "rgba(245,164,112,0.12)",
    "--landing-accent-warm-strong": "rgba(245,164,112,0.22)",
    "--landing-accent-ember": "rgba(255,222,197,0.22)",
    "--landing-bg": "#f3f5fb",
    "--landing-bg-elevated": "rgba(255,255,255,0.92)",
    "--landing-border": "rgba(15,23,42,0.08)",
    "--landing-border-strong": "rgba(15,23,42,0.14)",
    "--landing-button-primary": "#111827",
    "--landing-button-primary-text": "#f8fafc",
    "--landing-button-secondary": "rgba(255,255,255,0.72)",
    "--landing-button-secondary-hover": "rgba(255,255,255,0.96)",
    "--landing-glow": "rgba(88,108,255,0.12)",
    "--landing-header": "rgba(255,255,255,0.68)",
    "--landing-logo-frame": "rgba(255,255,255,0.96)",
    "--landing-panel":
      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,247,252,0.9))",
    "--landing-panel-muted": "rgba(255,255,255,0.7)",
    "--landing-preview-frame": "rgba(255,255,255,0.78)",
    "--landing-preview-glass": "rgba(255,255,255,0.48)",
    "--landing-hover-shadow-soft": "0 20px 60px rgba(15,23,42,0.12)",
    "--landing-hover-shadow-strong": "0 28px 82px rgba(15,23,42,0.16)",
    "--landing-progress-end": "#6d80ff",
    "--landing-progress-start": "#111827",
    "--landing-shadow": "0 30px 90px rgba(15,23,42,0.12)",
    "--landing-shadow-soft": "0 18px 50px rgba(15,23,42,0.08)",
    "--landing-surface": "rgba(255,255,255,0.72)",
    "--landing-surface-alt": "#eef2f8",
    "--landing-surface-strong": "rgba(255,255,255,0.96)",
    "--landing-text": "#0f172a",
    "--landing-text-faint": "rgba(15,23,42,0.38)",
    "--landing-text-muted": "rgba(15,23,42,0.66)",
    "--landing-text-soft": "rgba(15,23,42,0.82)",
    "--status-done-bg": "#d1fae5",
    "--status-done-text": "#065f46",
    "--status-live-bg": "#0f172a",
    "--status-live-text": "#f8fafc",
    "--status-next-bg": "rgba(15,23,42,0.08)",
    "--status-next-text": "rgba(15,23,42,0.62)",
    "--track-bg": "rgba(15,23,42,0.08)",
  },
} satisfies Record<LandingTheme, Record<string, string>>;

const pillarIcons: Record<"habits" | "focus" | "fitness", LucideIcon> = {
  fitness: Dumbbell,
  focus: TimerReset,
  habits: Flame,
};

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

function revealStyle(delay: number): CSSProperties {
  return { transitionDelay: `${delay}ms` };
}

export function LandingPage() {
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
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    const main = mainRef.current;

    if (!main) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const setCursor = (x: number, y: number) => {
      main.style.setProperty("--cursor-x", `${x}px`);
      main.style.setProperty("--cursor-y", `${y}px`);
    };

    const restingX = window.innerWidth * 0.5;
    const restingY = window.innerHeight * 0.18;

    if (reduceMotion || !finePointer) {
      setCursor(restingX, restingY);
      return;
    }

    const state = {
      currentX: restingX,
      currentY: restingY,
      frame: 0,
      targetX: restingX,
      targetY: restingY,
    };

    const tick = () => {
      state.currentX += (state.targetX - state.currentX) * 0.12;
      state.currentY += (state.targetY - state.currentY) * 0.12;
      setCursor(state.currentX, state.currentY);

      if (
        Math.abs(state.targetX - state.currentX) < 0.6 &&
        Math.abs(state.targetY - state.currentY) < 0.6
      ) {
        state.frame = 0;
        return;
      }

      state.frame = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!state.frame) {
        state.frame = window.requestAnimationFrame(tick);
      }
    };

    const handleMove = (event: PointerEvent) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      schedule();
    };

    const handleLeave = () => {
      state.targetX = restingX;
      state.targetY = restingY;
      schedule();
    };

    setCursor(restingX, restingY);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);

      if (state.frame) {
        window.cancelAnimationFrame(state.frame);
      }
    };
  }, []);

  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-card-motion]"),
    ).filter((card) => !card.closest(".landing-preview"));

    if (!cards.length) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const resetCard = (card: HTMLElement) => {
      card.style.removeProperty("transform");
    };

    if (reduceMotion || !finePointer) {
      cards.forEach(resetCard);
      return;
    }

    const cleanups = cards.map((card) => {
      const motion = card.dataset.cardMotion === "panel" ? "panel" : "follow";
      const strength =
        motion === "panel"
          ? { rotateX: 0.82, rotateY: 1.08, shiftY: -4.2 }
          : { rotateX: 0.24, rotateY: 0.34, shiftY: -1.65 };

      const state = {
        currentRotateX: 0,
        currentRotateY: 0,
        currentShiftY: 0,
        frame: 0,
        targetRotateX: 0,
        targetRotateY: 0,
        targetShiftY: 0,
      };

      const apply = () => {
        card.style.transform = `perspective(1400px) translate3d(0, ${state.currentShiftY}px, 0) rotateX(${state.currentRotateX}deg) rotateY(${state.currentRotateY}deg)`;
      };

      const tick = () => {
        state.currentRotateX +=
          (state.targetRotateX - state.currentRotateX) * 0.14;
        state.currentRotateY +=
          (state.targetRotateY - state.currentRotateY) * 0.14;
        state.currentShiftY +=
          (state.targetShiftY - state.currentShiftY) * 0.14;

        apply();

        if (
          Math.abs(state.targetRotateX - state.currentRotateX) < 0.03 &&
          Math.abs(state.targetRotateY - state.currentRotateY) < 0.03 &&
          Math.abs(state.targetShiftY - state.currentShiftY) < 0.03
        ) {
          state.frame = 0;
          return;
        }

        state.frame = window.requestAnimationFrame(tick);
      };

      const schedule = () => {
        if (!state.frame) {
          state.frame = window.requestAnimationFrame(tick);
        }
      };

      const handleMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const easedX = Math.sign(x) * Math.pow(Math.abs(x), 1.35);
        const easedY = Math.sign(y) * Math.pow(Math.abs(y), 1.15);

        state.targetRotateX = easedY * -strength.rotateX;
        state.targetRotateY = easedX * strength.rotateY;
        state.targetShiftY = easedY * strength.shiftY;
        schedule();
      };

      const reset = () => {
        state.targetRotateX = 0;
        state.targetRotateY = 0;
        state.targetShiftY = 0;
        schedule();
      };

      resetCard(card);
      card.addEventListener("pointermove", handleMove);
      card.addEventListener("pointerleave", reset);

      return () => {
        card.removeEventListener("pointermove", handleMove);
        card.removeEventListener("pointerleave", reset);
        resetCard(card);

        if (state.frame) {
          window.cancelAnimationFrame(state.frame);
        }
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const preview = previewRef.current;

    if (!preview) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (reduceMotion || !finePointer) {
      preview.style.setProperty("--preview-rotate-x", "0deg");
      preview.style.setProperty("--preview-rotate-y", "0deg");
      preview.style.setProperty("--preview-shift-y", "0px");
      return;
    }

    const state = {
      currentRotateX: 0,
      currentRotateY: 0,
      currentShiftY: 0,
      frame: 0,
      targetRotateX: 0,
      targetRotateY: 0,
      targetShiftY: 0,
    };

    const apply = () => {
      preview.style.setProperty(
        "--preview-rotate-x",
        `${state.currentRotateX}deg`,
      );
      preview.style.setProperty(
        "--preview-rotate-y",
        `${state.currentRotateY}deg`,
      );
      preview.style.setProperty(
        "--preview-shift-y",
        `${state.currentShiftY}px`,
      );
    };

    const tick = () => {
      state.currentRotateX +=
        (state.targetRotateX - state.currentRotateX) * 0.14;
      state.currentRotateY +=
        (state.targetRotateY - state.currentRotateY) * 0.14;
      state.currentShiftY += (state.targetShiftY - state.currentShiftY) * 0.14;
      apply();

      if (
        Math.abs(state.targetRotateX - state.currentRotateX) < 0.08 &&
        Math.abs(state.targetRotateY - state.currentRotateY) < 0.08 &&
        Math.abs(state.targetShiftY - state.currentShiftY) < 0.08
      ) {
        state.frame = 0;
        return;
      }

      state.frame = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!state.frame) {
        state.frame = window.requestAnimationFrame(tick);
      }
    };

    const handleMove = (event: PointerEvent) => {
      const rect = preview.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      state.targetRotateX = y * -4.6;
      state.targetRotateY = x * 6.4;
      state.targetShiftY = y * -7;
      schedule();
    };

    const reset = () => {
      state.targetRotateX = 0;
      state.targetRotateY = 0;
      state.targetShiftY = 0;
      schedule();
    };

    apply();
    preview.addEventListener("pointermove", handleMove);
    preview.addEventListener("pointerleave", reset);

    return () => {
      preview.removeEventListener("pointermove", handleMove);
      preview.removeEventListener("pointerleave", reset);

      if (state.frame) {
        window.cancelAnimationFrame(state.frame);
      }
    };
  }, []);

  const copy = landingCopy[locale];
  const heroStats = [copy.showcase.stats[0], copy.showcase.stats[1]];
  const heroHeadlineStyle = {
    maxWidth: locale === "pt-BR" ? "11.5ch" : "10ch",
  } satisfies CSSProperties;

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen overflow-x-hidden bg-[color:var(--landing-bg)] text-[color:var(--landing-text)]"
      style={landingThemeStyles[theme] as CSSProperties}
    >
      <LandingBackdrop theme={theme} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
        <LandingHeader
          controls={copy.controls}
          copy={copy.header}
          locale={locale}
          onLocaleChange={updateLocalePreference}
          scrolled={isScrolled}
          onThemeChange={updateThemePreference}
          theme={theme}
        />

        <section className="relative grid flex-1 items-center gap-14 pb-20 pt-12 lg:grid-cols-[minmax(0,0.98fr)_minmax(480px,1.02fr)] lg:gap-14 lg:pt-16">
          <div className="relative max-w-[35rem] space-y-10">
            <div
              className="landing-reveal inline-flex items-center gap-2 rounded-full border border-[color:var(--landing-border-strong)] bg-[color:var(--landing-surface)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--landing-text-muted)] shadow-[var(--landing-shadow-soft)]"
              style={revealStyle(40)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--landing-accent)] shadow-[0_0_18px_var(--landing-glow)]" />
              {copy.hero.badge}
            </div>

            <div className="space-y-7">
              <div
                className="landing-reveal space-y-6"
                style={revealStyle(120)}
              >
                <h1
                  className="text-[clamp(3.4rem,8vw,6.9rem)] leading-[0.9] font-semibold tracking-[-0.068em] text-[color:var(--landing-text)]"
                  style={heroHeadlineStyle}
                >
                  {copy.hero.headline}
                </h1>
                <p className="max-w-[34rem] text-[1.05rem] leading-8 text-[color:var(--landing-text-muted)] sm:text-[1.14rem]">
                  {copy.hero.subheadline}
                </p>
              </div>

              <div
                className="landing-reveal flex flex-col gap-3 sm:flex-row"
                style={revealStyle(200)}
              >
                <Link
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--landing-button-primary)] px-5 text-sm font-medium text-[color:var(--landing-button-primary-text)] shadow-[0_12px_30px_var(--landing-accent-soft)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_var(--landing-accent-strong)]"
                  href="/signup"
                >
                  {copy.hero.ctaPrimary}
                  <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-button-secondary)] px-5 text-sm font-medium text-[color:var(--landing-text-soft)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--landing-border-strong)] hover:bg-[color:var(--landing-button-secondary-hover)] hover:text-[color:var(--landing-text)]"
                  href="#showcase"
                >
                  {copy.hero.ctaSecondary}
                </Link>
              </div>
            </div>
            <div
              className="landing-reveal grid gap-3 sm:max-w-[34rem] sm:grid-cols-3"
              style={revealStyle(280)}
            >
              {copy.hero.principles.map((principle, index) => (
                <div
                  key={principle}
                  className="landing-card-soft group rounded-[1.4rem] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,var(--landing-surface),transparent)] px-4 py-4 shadow-[var(--landing-shadow-soft)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
                    0{index + 1}
                  </p>
                  <div className="mt-3 h-px w-8 bg-[linear-gradient(90deg,var(--landing-accent),transparent)] opacity-80" />
                  <p className="mt-3 text-sm text-[color:var(--landing-text-soft)]">
                    {principle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-2">
            <div
              ref={previewRef}
              className="landing-preview landing-reveal relative mx-auto max-w-[43rem]"
              style={revealStyle(140)}
            >
              <div className="absolute left-1/2 top-[46%] -z-20 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-glow),transparent_62%)] blur-[150px] opacity-55" />

              <div className="landing-preview-shell relative rounded-[2.85rem] border border-[color:var(--landing-preview-frame)] p-[1px] shadow-[0_42px_130px_rgba(0,0,0,0.38)]">
                <div className="landing-preview-glass absolute inset-0 rounded-[inherit]" />
                <div className="landing-preview-reactive absolute inset-0 rounded-[inherit]" />
                <div className="relative overflow-hidden rounded-[calc(2.85rem-1px)] bg-[var(--landing-panel)] p-4 sm:p-5">
                  <div className="relative rounded-[2.15rem] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)] sm:p-6">
                    <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--landing-accent-ember),transparent)] opacity-70" />
                    <div className="pointer-events-none absolute right-5 top-5 hidden items-center gap-3 rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elevated)] px-3 py-2 text-xs shadow-[var(--landing-shadow-soft)] sm:flex">
                      <span className="h-2 w-2 rounded-full bg-[color:var(--landing-accent)] shadow-[0_0_14px_var(--landing-glow)]" />
                      <span className="text-[color:var(--landing-text-soft)]">
                        {copy.hero.preview.aligned}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 border-b border-[color:var(--landing-border)] pb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--landing-text-faint)]/50" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--landing-text-faint)]/35" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--landing-accent)]/65 shadow-[0_0_18px_var(--landing-glow)]" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
                          {copy.hero.preview.today}
                        </p>
                        <p className="mt-2 text-xl font-medium text-[color:var(--landing-text)]">
                          {copy.hero.preview.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                      <div className="space-y-4">
                        {copy.hero.preview.metrics.map((metric) => (
                          <PreviewMetric key={metric.label} {...metric} />
                        ))}

                        <div className="landing-card-soft rounded-[1.6rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-5 shadow-[var(--landing-shadow-soft)]">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[color:var(--landing-text-faint)]">
                            <span>{copy.hero.preview.consistencyLabel}</span>
                            <span>{copy.hero.preview.consistencyPeriod}</span>
                          </div>
                          <ProgressBar className="mt-5" value="82%" />
                          <p className="mt-4 text-sm leading-7 text-[color:var(--landing-text-muted)]">
                            {copy.hero.preview.consistencyBody}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="landing-card-soft rounded-[1.7rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-alt)] p-5 shadow-[var(--landing-shadow-soft)]">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[color:var(--landing-text)]">
                              {copy.hero.preview.dailyFlow}
                            </p>
                            <p className="text-xs text-[color:var(--landing-text-faint)]">
                              {copy.hero.preview.dailyFlowCaption}
                            </p>
                          </div>

                          <div className="mt-5 space-y-3">
                            {copy.hero.preview.rows.map((row) => (
                              <FlowRow key={row.title} {...row} />
                            ))}
                          </div>
                        </div>

                        <div className="landing-card-soft rounded-[1.7rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-5 shadow-[var(--landing-shadow-soft)]">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--landing-text-faint)]">
                                {copy.showcase.weeklySummary}
                              </p>
                              <p className="mt-2 text-lg font-medium text-[color:var(--landing-text)]">
                                {copy.showcase.systemHealth.title}
                              </p>
                            </div>
                            <ChartColumnIncreasing className="size-5 text-[color:var(--landing-text-faint)]" />
                          </div>

                          <div className="mt-6 space-y-4">
                            {copy.showcase.systemHealth.rows.map((row) => (
                              <ChartRow key={row.label} {...row} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {heroStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="landing-card-soft rounded-[1.4rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-4 py-4 shadow-[var(--landing-shadow-soft)]"
                        >
                          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--landing-text-faint)]">
                            {stat.label}
                          </p>
                          <p className="mt-2 text-lg font-medium text-[color:var(--landing-text)]">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-6 left-6 hidden rounded-[1.4rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-bg-elevated)] px-4 py-3 text-xs text-[color:var(--landing-text-soft)] shadow-[var(--landing-shadow-soft)] backdrop-blur-xl xl:flex xl:items-center xl:gap-3">
                <span className="h-2 w-2 rounded-full bg-[color:var(--landing-accent-warm)] shadow-[0_0_18px_var(--landing-accent-warm)]" />
                {copy.hero.preview.consistencyLabel}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-22" id="problem">
          <SectionDivider />
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <SectionIntro
              description={copy.problem.description}
              eyebrow={copy.problem.eyebrow}
              title={copy.problem.title}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {copy.problem.panels.map((panel, index) => (
                <ProblemPanel
                  key={panel.title}
                  style={revealStyle(60 + index * 80)}
                  {...panel}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-22">
          <SectionDivider />
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="landing-reveal" style={revealStyle(60)}>
              <div
                data-card-motion="panel"
                className="landing-card-strong overflow-hidden rounded-[2.4rem] border border-[color:var(--landing-border)] bg-[var(--landing-panel)] px-7 py-8 shadow-[var(--landing-shadow-soft)]"
              >
                <div className="max-w-2xl space-y-5">
                  <SectionLabel>{copy.solution.eyebrow}</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--landing-text)] sm:text-[2.6rem]">
                    {copy.solution.title}
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-[color:var(--landing-text-muted)]">
                    {copy.solution.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {copy.solution.points.map((point, index) => (
                <SignalPanel
                  key={point.title}
                  style={revealStyle(120 + index * 70)}
                  {...point}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-22" id="pillars">
          <SectionDivider />
          <SectionIntro
            centered
            description={copy.pillars.description}
            eyebrow={copy.pillars.eyebrow}
            title={copy.pillars.title}
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {copy.pillars.cards.map((pillar, index) => (
              <PillarCard
                footerLabel={copy.pillars.footerLabel}
                key={pillar.kicker}
                description={pillar.description}
                icon={pillarIcons[pillar.key]}
                kicker={pillar.kicker}
                stat={pillar.stat}
                style={revealStyle(80 + index * 70)}
                value={pillar.value}
              />
            ))}
          </div>
        </section>

        <section className="relative py-22" id="daily-flow">
          <SectionDivider />
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-8">
              <SectionIntro
                description={copy.workflow.description}
                eyebrow={copy.workflow.eyebrow}
                title={copy.workflow.title}
              />

              <div className="space-y-4">
                {copy.workflow.rows.map((item, index) => (
                  <div
                    key={item.step}
                    className="landing-card-soft landing-reveal flex gap-4 rounded-[1.8rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-5 shadow-[var(--landing-shadow-soft)]"
                    style={revealStyle(80 + index * 80)}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] text-sm text-[color:var(--landing-text-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      0{index + 1}
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-[color:var(--landing-text)]">
                        {item.step}
                      </p>
                      <p className="text-sm leading-7 text-[color:var(--landing-text-muted)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="landing-reveal" style={revealStyle(90)}>
                <div
                  data-card-motion="panel"
                  className="landing-card-strong overflow-hidden rounded-[2.3rem] border border-[color:var(--landing-border)] bg-[var(--landing-panel)] p-6 shadow-[var(--landing-shadow)]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
                        {copy.workflow.todayView.label}
                      </p>
                      <p className="mt-2 text-2xl font-medium text-[color:var(--landing-text)]">
                        {copy.workflow.todayView.title}
                      </p>
                    </div>
                    <LayoutDashboard className="size-5 text-[color:var(--landing-text-faint)]" />
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-[0.82fr_1.18fr]">
                    <div className="space-y-3 rounded-[1.6rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4">
                      {copy.workflow.todayView.stats.map((stat) => (
                        <MiniStat key={stat.label} {...stat} />
                      ))}
                    </div>

                    <div className="space-y-3">
                      {copy.workflow.todayView.unifiedRows.map((row) => (
                        <UnifiedRow key={row.label} {...row} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {copy.workflow.highlights.map((highlight, index) => (
                  <SignalPanel
                    key={highlight.title}
                    style={revealStyle(140 + index * 60)}
                    {...highlight}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="relative py-22" id="showcase">
          <SectionDivider />
          <SectionIntro
            centered
            description={copy.showcase.description}
            eyebrow={copy.showcase.eyebrow}
            title={copy.showcase.title}
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.24fr_0.76fr]">
            <div className="landing-reveal" style={revealStyle(80)}>
              <div
                data-card-motion="panel"
                className="landing-card-strong overflow-hidden rounded-[2.4rem] border border-[color:var(--landing-border)] bg-[var(--landing-panel)] p-6 shadow-[var(--landing-shadow)]"
              >
                <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-[1.7rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-5 shadow-[var(--landing-shadow-soft)]">
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
                      {copy.showcase.weeklySummary}
                    </p>
                    <div className="mt-7 space-y-6">
                      {copy.showcase.stats.map((stat) => (
                        <MetricBlock key={stat.label} {...stat} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.8rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-alt)] p-5 shadow-[var(--landing-shadow-soft)]">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[color:var(--landing-text)]">
                        {copy.showcase.systemHealth.title}
                      </p>
                      <ChartColumnIncreasing className="size-5 text-[color:var(--landing-text-faint)]" />
                    </div>

                    <div className="mt-8 space-y-6">
                      {copy.showcase.systemHealth.rows.map((row) => (
                        <ChartRow key={row.label} {...row} />
                      ))}
                    </div>

                    <div className="mt-8 grid gap-3 md:grid-cols-3">
                      {copy.showcase.summaryChips.map((chip) => (
                        <ShowcaseChip key={chip.label} {...chip} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {copy.showcase.highlightCards.map((card, index) => (
                <SignalPanel
                  key={card.title}
                  style={revealStyle(120 + index * 70)}
                  {...card}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-22" id="pricing">
          <SectionDivider />
          <SectionIntro
            centered
            description={copy.pricing.description}
            eyebrow={copy.pricing.eyebrow}
            title={copy.pricing.title}
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {copy.pricing.plans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                highlight={plan.name === "Pro"}
                style={revealStyle(90 + index * 80)}
                {...plan}
              />
            ))}
          </div>
        </section>

        <section className="relative py-22">
          <SectionDivider />
          <div className="landing-reveal" style={revealStyle(80)}>
            <div
              data-card-motion="panel"
              className="landing-card-strong overflow-hidden rounded-[2.5rem] border border-[color:var(--landing-border)] bg-[var(--landing-panel)] px-6 py-10 shadow-[var(--landing-shadow)] sm:px-10 sm:py-12"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,var(--landing-glow),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(255,255,255,0.06),transparent_22%)] opacity-70" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <SectionLabel>{copy.finalCta.eyebrow}</SectionLabel>
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--landing-text)] sm:text-[2.7rem]">
                    {copy.finalCta.title}
                  </h2>
                  <p className="text-base leading-7 text-[color:var(--landing-text-muted)]">
                    {copy.finalCta.body}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--landing-button-primary)] px-5 text-sm font-medium text-[color:var(--landing-button-primary-text)] shadow-[0_12px_30px_var(--landing-accent-soft)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_var(--landing-accent-strong)]"
                    href="/signup"
                  >
                    {copy.finalCta.primaryCta}
                    <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-button-secondary)] px-5 text-sm font-medium text-[color:var(--landing-text-soft)] transition duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--landing-button-secondary-hover)] hover:text-[color:var(--landing-text)]"
                    href="/login"
                  >
                    {copy.finalCta.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LandingBackdrop({ theme }: { theme: LandingTheme }) {
  const cursorLayer = {
    background:
      "radial-gradient(360px circle at var(--cursor-x, 50%) var(--cursor-y, 18%), rgba(255,168,104,0.05), transparent 62%)",
  } satisfies CSSProperties;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.022),transparent_18%,transparent_74%,rgba(255,255,255,0.015))]" />
      {theme === "dark" ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-18%,rgba(112,120,255,0.16),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(255,170,112,0.12),transparent_26%),radial-gradient(circle_at_18%_18%,rgba(92,108,255,0.11),transparent_28%),radial-gradient(circle_at_68%_28%,rgba(255,208,180,0.06),transparent_18%)]" />
          <div className="absolute left-[-18rem] top-[-8rem] h-[44rem] w-[44rem] rounded-full bg-[rgba(94,108,255,0.09)] blur-[210px]" />
          <div className="absolute right-[-18rem] top-[-4rem] h-[42rem] w-[42rem] rounded-full bg-[rgba(255,166,103,0.09)] blur-[220px]" />
          <div className="absolute right-[8%] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-[rgba(255,219,196,0.07)] blur-[170px]" />
          <div className="absolute inset-x-0 top-[46rem] h-[24rem] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.022),transparent)] opacity-75" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-16%,rgba(88,108,255,0.15),transparent_38%),radial-gradient(circle_at_82%_10%,rgba(244,169,120,0.14),transparent_24%),radial-gradient(circle_at_16%_16%,rgba(88,108,255,0.09),transparent_24%),radial-gradient(circle_at_70%_28%,rgba(255,223,201,0.18),transparent_18%)]" />
          <div className="absolute left-[-16rem] top-[-6rem] h-[40rem] w-[40rem] rounded-full bg-[rgba(255,255,255,0.84)] blur-[135px]" />
          <div className="absolute right-[-14rem] top-[-2rem] h-[36rem] w-[36rem] rounded-full bg-[rgba(245,168,120,0.13)] blur-[170px]" />
          <div className="absolute right-[10%] top-[18rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(118,136,255,0.1)] blur-[150px]" />
          <div className="absolute inset-x-0 top-[46rem] h-[22rem] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.44),transparent)] opacity-50" />
        </>
      )}
      <div className="absolute inset-0 hidden md:block" style={cursorLayer} />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mb-8 h-px w-full bg-[linear-gradient(90deg,transparent,var(--landing-border-strong),transparent)]" />
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--landing-text-faint)]">
      {children}
    </p>
  );
}

function SectionIntro({
  centered = false,
  description,
  eyebrow,
  title,
}: {
  centered?: boolean;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "landing-reveal",
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
      )}
    >
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--landing-text)] sm:text-[2.7rem]">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--landing-text-muted)]">
        {description}
      </p>
    </div>
  );
}
function PreviewMetric({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div className="landing-card-strong rounded-[1.45rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4 shadow-[var(--landing-shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[color:var(--landing-text)]">
            {label}
          </p>
          <p className="mt-1 text-sm text-[color:var(--landing-text-faint)]">
            {detail}
          </p>
        </div>
        <p className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--landing-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function FlowRow({
  badge,
  detail,
  status,
  title,
}: {
  badge: string;
  detail: string;
  status: "done" | "live" | "next";
  title: string;
}) {
  const statusClasses = {
    done: "bg-[color:var(--status-done-bg)] text-[color:var(--status-done-text)]",
    live: "bg-[color:var(--status-live-bg)] text-[color:var(--status-live-text)]",
    next: "bg-[color:var(--status-next-bg)] text-[color:var(--status-next-text)]",
  };

  return (
    <div className="landing-card-soft flex items-center justify-between gap-4 rounded-[1.3rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-4 py-3 shadow-[var(--landing-shadow-soft)]">
      <div>
        <p className="text-sm font-medium text-[color:var(--landing-text)]">
          {title}
        </p>
        <p className="mt-1 text-sm text-[color:var(--landing-text-faint)]">
          {detail}
        </p>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
          statusClasses[status],
        )}
      >
        {badge}
      </span>
    </div>
  );
}

function ProblemPanel({
  body,
  style,
  title,
}: {
  body: string;
  style?: CSSProperties;
  title: string;
}) {
  return (
    <div className="landing-reveal h-full" style={style}>
      <div
        data-card-motion="follow"
        className="landing-card-strong h-full rounded-[2rem] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] p-6 shadow-[var(--landing-shadow-soft)]"
      >
        <p className="text-xl font-medium tracking-[-0.04em] text-[color:var(--landing-text)]">
          {title}
        </p>
        <p className="mt-4 text-sm leading-7 text-[color:var(--landing-text-muted)]">
          {body}
        </p>
      </div>
    </div>
  );
}

function SignalPanel({
  body,
  kicker,
  style,
  title,
}: {
  body: string;
  kicker: string;
  style?: CSSProperties;
  title: string;
}) {
  return (
    <div
      className="landing-card-soft landing-reveal group rounded-[1.8rem] border border-[color:var(--landing-border)] bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] p-5 shadow-[var(--landing-shadow-soft)]"
      style={style}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--landing-text-faint)]">
        {kicker}
      </p>
      <p className="mt-3 text-lg font-medium text-[color:var(--landing-text)]">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-[color:var(--landing-text-muted)]">
        {body}
      </p>
    </div>
  );
}

function PillarCard({
  description,
  footerLabel,
  icon: Icon,
  kicker,
  stat,
  style,
  value,
}: {
  description: string;
  footerLabel: string;
  icon: LucideIcon;
  kicker: string;
  stat: string;
  style?: CSSProperties;
  value: string;
}) {
  return (
    <div className="landing-reveal h-full" style={style}>
      <div
        data-card-motion="follow"
        className="landing-card-strong group relative h-full overflow-hidden rounded-[2.1rem] border border-[color:var(--landing-border)] bg-[var(--landing-panel)] p-6 shadow-[var(--landing-shadow-soft)]"
      >
        <div className="relative flex items-center justify-between">
          <div className="rounded-[1.25rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-3 shadow-[var(--landing-shadow-soft)]">
            <Icon className="size-5 text-[color:var(--landing-text-soft)]" />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
            {stat}
          </p>
        </div>
        <p className="relative mt-8 text-2xl font-medium tracking-[-0.04em] text-[color:var(--landing-text)]">
          {kicker}
        </p>
        <p className="relative mt-4 text-sm leading-7 text-[color:var(--landing-text-muted)]">
          {description}
        </p>
        <div className="relative mt-8 border-t border-[color:var(--landing-border)] pt-4">
          <p className="text-sm text-[color:var(--landing-text-faint)]">
            {footerLabel}
          </p>
          <p className="mt-2 text-base font-medium text-[color:var(--landing-text)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="landing-card-soft rounded-[1.25rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-alt)] px-4 py-4 shadow-[var(--landing-shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--landing-text-faint)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--landing-text)]">
        {value}
      </p>
    </div>
  );
}

function UnifiedRow({
  label,
  note,
  progress,
}: {
  label: string;
  note: string;
  progress: string;
}) {
  return (
    <div className="landing-card-soft rounded-[1.4rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4 shadow-[var(--landing-shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[color:var(--landing-text)]">
          {label}
        </p>
        <p className="text-sm text-[color:var(--landing-text-faint)]">
          {progress}
        </p>
      </div>
      <p className="mt-2 text-sm text-[color:var(--landing-text-muted)]">
        {note}
      </p>
      <ProgressBar className="mt-4" value={progress} />
    </div>
  );
}
function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
        {label}
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--landing-text)]">
        {value}
      </p>
    </div>
  );
}

function ChartRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[color:var(--landing-text-soft)]">{label}</span>
        <span className="text-[color:var(--landing-text-faint)]">{value}</span>
      </div>
      <ProgressBar className="mt-3" value={width} />
    </div>
  );
}

function ShowcaseChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="landing-card-soft rounded-[1.25rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-4 py-4 shadow-[var(--landing-shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--landing-text-faint)]">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-[color:var(--landing-text)]">
        {value}
      </p>
    </div>
  );
}

function PricingCard({
  cta,
  detail,
  features,
  highlight = false,
  name,
  price,
  style,
}: {
  cta: string;
  detail: string;
  features: string[];
  highlight?: boolean;
  name: string;
  price: string;
  style?: CSSProperties;
}) {
  return (
    <div className="landing-reveal h-full" style={style}>
      <div
        data-card-motion="follow"
        className={cn(
          "landing-card-strong relative h-full overflow-hidden rounded-[2.2rem] border p-6 shadow-[var(--landing-shadow-soft)]",
          highlight
            ? "border-[color:var(--landing-border-strong)] bg-[var(--landing-panel)]"
            : "border-[color:var(--landing-border)] bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))]",
        )}
      >
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[color:var(--landing-text)]">
              {name}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[color:var(--landing-text-muted)]">
              {detail}
            </p>
          </div>
          <p className="text-4xl font-semibold tracking-[-0.06em] text-[color:var(--landing-text)]">
            {price}
          </p>
        </div>

        <div className="relative mt-8 space-y-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-[color:var(--landing-text-soft)]"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-[color:var(--landing-surface-strong)]">
                <span className="size-1.5 rounded-full bg-[color:var(--landing-accent)] shadow-[0_0_12px_var(--landing-glow)]" />
              </span>
              {feature}
            </div>
          ))}
        </div>

        <Link
          className={cn(
            "relative mt-8 inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium transition duration-300",
            highlight
              ? "bg-[color:var(--landing-button-primary)] text-[color:var(--landing-button-primary-text)] shadow-[0_12px_28px_var(--landing-accent-soft)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_var(--landing-accent-strong)]"
              : "border border-[color:var(--landing-border)] bg-[color:var(--landing-button-secondary)] text-[color:var(--landing-text-soft)] hover:-translate-y-0.5 hover:bg-[color:var(--landing-button-secondary-hover)] hover:text-[color:var(--landing-text)]",
          )}
          href="/signup"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

function ProgressBar({
  className,
  value,
}: {
  className?: string;
  value: string;
}) {
  return (
    <div
      className={cn("h-2 rounded-full bg-[color:var(--track-bg)]", className)}
    >
      <div
        className="h-2 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, var(--landing-progress-start), var(--landing-progress-end))",
          boxShadow: "0 0 28px var(--landing-accent-soft)",
          width: value,
        }}
      />
    </div>
  );
}
