"use client";

import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  children: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  open: boolean;
  title: ReactNode;
  onOpenChange: (open: boolean) => void;
};

type ThemeBridgeStyle = CSSProperties & Record<`--${string}`, string>;

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

  const themeBridge = getModalThemeBridge();

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
      className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center px-4 py-6 sm:px-6"
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
          "relative max-h-[min(42rem,calc(100dvh-3rem))] w-full max-w-lg overflow-hidden rounded-[1.65rem]",
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
        <div className="relative px-6 py-5">{children}</div>
        {footer ? (
          <div className="relative flex flex-col-reverse gap-2 border-t border-[var(--landing-border)] px-6 py-5 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function getModalThemeBridge() {
  const themeRoot = document.querySelector<HTMLElement>("[data-theme]");

  if (!themeRoot) {
    return {};
  }

  const computedStyle = window.getComputedStyle(themeRoot);
  const style: ThemeBridgeStyle = {};

  for (const propertyName of Array.from(computedStyle)) {
    if (propertyName.startsWith("--")) {
      style[propertyName as `--${string}`] = computedStyle.getPropertyValue(propertyName).trim();
    }
  }

  return {
    style,
    theme: themeRoot.dataset.theme,
  };
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}
