"use client";

import { analyticsEvents, type AnalyticsEventName, type AnalyticsEventProps } from "@/lib/analytics/events";

declare global {
  interface Window {
    plausible?: PlausibleTracker;
  }
}

type PlausibleTracker = {
  (eventName: string, options?: { props?: Record<string, unknown> }): void;
  q?: unknown[];
};

const PLAUSIBLE_ENABLED = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim());
const MILESTONE_STORAGE_KEY = "coreflow.analytics.milestones";

function getStoredMilestones() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const rawValue = window.localStorage.getItem(MILESTONE_STORAGE_KEY);
    if (!rawValue) {
      return new Set<string>();
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? new Set(parsed.filter((value) => typeof value === "string")) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function persistMilestones(milestones: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify([...milestones]));
  } catch {
    // Ignore storage failures. Tracking should stay best-effort.
  }
}

function sanitizeProps(props: AnalyticsEventProps | undefined) {
  if (!props) {
    return undefined;
  }

  const entries = Object.entries(props).filter(([, value]) => value !== undefined);
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export function initializeAnalyticsClient() {
  if (typeof window === "undefined" || !PLAUSIBLE_ENABLED || window.plausible) {
    return;
  }

  const queue: unknown[] = [];
  const plausible: PlausibleTracker = ((...args: unknown[]) => {
    queue.push(args);
  }) as PlausibleTracker;

  plausible.q = queue;
  window.plausible = plausible;
}

export function trackEvent(eventName: AnalyticsEventName, props?: AnalyticsEventProps) {
  if (typeof window === "undefined" || !PLAUSIBLE_ENABLED || typeof window.plausible !== "function") {
    return;
  }

  const sanitizedProps = sanitizeProps(props);
  window.plausible(eventName, sanitizedProps ? { props: sanitizedProps } : undefined);
}

export function trackEventOnce(
  milestoneKey: string,
  eventName: AnalyticsEventName,
  props?: AnalyticsEventProps,
) {
  const milestones = getStoredMilestones();
  if (milestones.has(milestoneKey)) {
    return;
  }

  trackEvent(eventName, props);
  milestones.add(milestoneKey);
  persistMilestones(milestones);
}

export function trackOnboardingCompletion(source: "fitness" | "focus" | "habits") {
  trackEventOnce("onboarding_completed", analyticsEvents.onboardingCompleted, { source });
}
