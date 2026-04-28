"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortalThemeBridge } from "@/components/ui/portal-theme";
import { cn } from "@/lib/utils";

type ModalProps = {
  children: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  open: boolean;
  title: ReactNode;
  onOpenChange: (open: boolean) => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function Modal({
  children,
  description,
  footer,
  open,
  title,
  onOpenChange,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      const initialFocusElement =
        dialogRef.current?.querySelector<HTMLElement>("[data-modal-initial-focus]") ??
        getFocusableElements(dialogRef.current)[0];
      initialFocusElement?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  if (typeof document === "undefined" || !open) {
    return null;
  }

  const themeBridge = getPortalThemeBridge();

  function close() {
    onOpenChange(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(dialogRef.current);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-dvh items-end justify-center px-0 pb-0 pt-[calc(3rem+env(safe-area-inset-top))] sm:items-center sm:px-6 sm:py-6"
      data-theme={themeBridge.theme}
      onKeyDown={handleKeyDown}
      style={themeBridge.style}
    >
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--landing-bg)_74%,transparent)] backdrop-blur-sm"
        onClick={close}
        type="button"
      />
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "relative max-h-[calc(100dvh-4rem-env(safe-area-inset-top))] w-full max-w-lg overflow-hidden rounded-t-[1.65rem] sm:max-h-[min(42rem,calc(100dvh-3rem))] sm:rounded-[1.65rem]",
          "border border-[var(--landing-border-strong)] bg-[var(--landing-panel)] text-[var(--landing-text)] shadow-[var(--landing-shadow)]",
        )}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="pointer-events-none absolute inset-0 bg-[var(--landing-header-gloss)] opacity-70" />
        <div className="relative flex items-start justify-between gap-4 border-b border-[var(--landing-border)] px-6 py-5">
          <div className="min-w-0 space-y-2">
            <h2 className="text-lg font-semibold tracking-[-0.03em]" id={titleId}>
              {title}
            </h2>
            {description ? (
              <div className="text-sm leading-6 text-[var(--landing-text-muted)]" id={descriptionId}>
                {description}
              </div>
            ) : null}
          </div>
          <Button aria-label="Close modal" onClick={close} size="sm" variant="ghost">
            <X className="size-4" />
          </Button>
        </div>
        <div className="relative px-4 py-5 sm:px-6">{children}</div>
        {footer ? (
          <div className="relative flex flex-col-reverse gap-2 border-t border-[var(--landing-border)] px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-6 sm:pb-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}
