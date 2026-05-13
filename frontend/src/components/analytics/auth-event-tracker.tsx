"use client";

import { useEffect } from "react";
import { analyticsEvents } from "@/lib/analytics/events";
import { trackEventOnce } from "@/lib/analytics/client";

type AuthEventTrackerProps = {
  event?: "signup_completed" | null;
};

export function AuthEventTracker({ event }: AuthEventTrackerProps) {
  useEffect(() => {
    if (event === "signup_completed") {
      trackEventOnce("signup_completed", analyticsEvents.signupCompleted, {
        destination: "login",
      });
    }
  }, [event]);

  return null;
}
