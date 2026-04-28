"use client";

import { useEffect, type RefObject } from "react";

export function useLandingPreviewMotion(
  previewRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const preview = previewRef.current;

    if (!preview) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const desktopViewport = window.matchMedia("(min-width: 1024px)").matches;

    if (reduceMotion || !finePointer || !desktopViewport) {
      preview.style.setProperty("--preview-rotate-x", "0deg");
      preview.style.setProperty("--preview-rotate-y", "0deg");
      preview.style.setProperty("--preview-shift-y", "0px");
      return;
    }

    const state = {
      currentRotateX: 0,
      currentRotateY: 0,
      currentShiftY: 0,
      frame: 0,
      targetRotateX: 0,
      targetRotateY: 0,
      targetShiftY: 0,
    };

    const apply = () => {
      preview.style.setProperty(
        "--preview-rotate-x",
        `${state.currentRotateX}deg`,
      );
      preview.style.setProperty(
        "--preview-rotate-y",
        `${state.currentRotateY}deg`,
      );
      preview.style.setProperty(
        "--preview-shift-y",
        `${state.currentShiftY}px`,
      );
    };

    const tick = () => {
      state.currentRotateX +=
        (state.targetRotateX - state.currentRotateX) * 0.14;
      state.currentRotateY +=
        (state.targetRotateY - state.currentRotateY) * 0.14;
      state.currentShiftY += (state.targetShiftY - state.currentShiftY) * 0.14;
      apply();

      if (
        Math.abs(state.targetRotateX - state.currentRotateX) < 0.08 &&
        Math.abs(state.targetRotateY - state.currentRotateY) < 0.08 &&
        Math.abs(state.targetShiftY - state.currentShiftY) < 0.08
      ) {
        state.frame = 0;
        return;
      }

      state.frame = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!state.frame) {
        state.frame = window.requestAnimationFrame(tick);
      }
    };

    const handleMove = (event: PointerEvent) => {
      const rect = preview.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      state.targetRotateX = y * -4.6;
      state.targetRotateY = x * 6.4;
      state.targetShiftY = y * -7;
      schedule();
    };

    const reset = () => {
      state.targetRotateX = 0;
      state.targetRotateY = 0;
      state.targetShiftY = 0;
      schedule();
    };

    apply();
    preview.addEventListener("pointermove", handleMove);
    preview.addEventListener("pointerleave", reset);

    return () => {
      preview.removeEventListener("pointermove", handleMove);
      preview.removeEventListener("pointerleave", reset);

      if (state.frame) {
        window.cancelAnimationFrame(state.frame);
      }
    };
  }, [previewRef]);
}
