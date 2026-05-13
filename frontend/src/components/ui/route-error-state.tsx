"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type RouteErrorStateProps = {
  description: string;
  title: string;
  onRetry: () => void;
};

export function RouteErrorState({
  description,
  title,
  onRetry,
}: RouteErrorStateProps) {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-[1.75rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 shadow-[var(--landing-shadow)] sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] text-[var(--danger)] shadow-[var(--landing-chip-inset-shadow)]">
          <AlertTriangle className="size-5" />
        </div>
        <div className="mt-5 space-y-2">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--landing-text)]">
            {title}
          </h1>
          <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
            {description}
          </p>
        </div>
        <Button className="mt-6" onClick={onRetry} size="lg">
          <RefreshCcw className="size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
