"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { RouteErrorState } from "@/components/ui/route-error-state";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag("coreflow.route", "global");
      scope.setTag("coreflow.module", "app");
      if (error.digest) {
        scope.setFingerprint([error.digest]);
      }
      Sentry.captureException(error);
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <RouteErrorState
          description="The app hit an unexpected failure. Retry the screen, and if it keeps happening the issue is now traceable."
          onRetry={reset}
          title="Coreflow couldn’t finish this screen."
        />
      </body>
    </html>
  );
}
