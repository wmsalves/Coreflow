"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MobileSheetProps = {
  children: ReactNode;
  description?: ReactNode;
  open?: boolean;
  title: ReactNode;
  trigger: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export function MobileSheet({
  children,
  description,
  open: controlledOpen,
  title,
  trigger,
  onOpenChange,
}: MobileSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(nextOpen: boolean) {
    onOpenChange?.(nextOpen);

    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => {
      const initialFocusElement =
        dialogRef.current?.querySelector<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
        ) ?? dialogRef.current;
      initialFocusElement?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
        ) ?? [],
      );

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
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      {typeof document !== "undefined" && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex min-h-dvh items-end sm:hidden"
              onKeyDown={handleKeyDown}
            >
              <button
                aria-label="Close sheet"
                className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--landing-bg)_62%,transparent)] backdrop-blur-sm"
                onClick={() => setOpen(false)}
                type="button"
              />
              <section
                aria-describedby={description ? descriptionId : undefined}
                aria-labelledby={titleId}
                aria-modal="true"
                className="relative max-h-[calc(100dvh-4.5rem-env(safe-area-inset-top))] w-full overflow-hidden rounded-t-[1.65rem] border border-b-0 border-[var(--landing-border-strong)] bg-[var(--landing-panel)] pb-[env(safe-area-inset-bottom)] text-[var(--landing-text)] shadow-[var(--landing-shadow)]"
                ref={dialogRef}
                role="dialog"
                tabIndex={-1}
              >
                <div className="pointer-events-none absolute inset-0 bg-[var(--landing-header-gloss)] opacity-70" />
                <div className="relative mx-auto mt-2 h-1 w-10 rounded-full bg-[var(--landing-border-strong)]" />
                <header className="relative flex items-start justify-between gap-4 border-b border-[var(--landing-border)] px-4 py-4">
                  <div className="min-w-0 space-y-1">
                    <h2 className="text-lg font-semibold tracking-[-0.03em]" id={titleId}>
                      {title}
                    </h2>
                    {description ? (
                      <div className="text-sm leading-6 text-[var(--landing-text-muted)]" id={descriptionId}>
                        {description}
                      </div>
                    ) : null}
                  </div>
                  <Button aria-label="Close sheet" onClick={() => setOpen(false)} size="sm" variant="ghost">
                    <X className="size-4" />
                  </Button>
                </header>
                <div className="relative max-h-[calc(100dvh-12rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] overflow-y-auto px-4 py-4">
                  {children}
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
