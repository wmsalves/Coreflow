"use client";

import { useEffect } from "react";
import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent, trackEventOnce } from "@/lib/analytics/client";

type DashboardEntryTrackerProps = {
  signupCompleted?: boolean;
};

export function DashboardEntryTracker({
  signupCompleted = false,
}: DashboardEntryTrackerProps) {
  useEffect(() => {
    trackEvent(analyticsEvents.dashboardEntry, { area: "today_view" });

    if (signupCompleted) {
      trackEventOnce("signup_completed", analyticsEvents.signupCompleted, {
        destination: "dashboard",
      });
    }
  }, [signupCompleted]);

  return null;
}
