"use client";

import * as Sentry from "@sentry/nextjs";

type ClientErrorContext = {
  action?: string;
  module: string;
  route?: string;
};

function normalizeError(error: unknown) {
  return error instanceof Error ? error : new Error("Unknown client error");
}

export function captureClientError(error: unknown, context: ClientErrorContext) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel("error");
    scope.setTag("coreflow.module", context.module);

    if (context.action) {
      scope.setTag("coreflow.action", context.action);
    }

    if (context.route) {
      scope.setTag("coreflow.route", context.route);
    }

    scope.setContext("coreflow", context);
    Sentry.captureException(normalizeError(error));
  });
}
