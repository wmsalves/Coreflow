"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { RouteErrorState } from "@/components/ui/route-error-state";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag("coreflow.route", "/dashboard");
      scope.setTag("coreflow.module", "dashboard");
      if (error.digest) {
        scope.setFingerprint([error.digest]);
      }
      Sentry.captureException(error);
    });
  }, [error]);

  return (
    <RouteErrorState
      description="Today View could not load correctly. Try again without leaving the dashboard."
      onRetry={reset}
      title="The dashboard ran into an error."
    />
  );
}
