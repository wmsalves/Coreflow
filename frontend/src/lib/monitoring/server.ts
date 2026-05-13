import * as Sentry from "@sentry/nextjs";

type ServerErrorContext = {
  action: string;
  module: string;
};

function normalizeError(error: unknown) {
  return error instanceof Error ? error : new Error("Unknown server error");
}

export function captureServerError(error: unknown, context: ServerErrorContext) {
  if (!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel("error");
    scope.setTag("coreflow.module", context.module);
    scope.setTag("coreflow.action", context.action);
    scope.setContext("coreflow", context);
    Sentry.captureException(normalizeError(error));
  });
}
