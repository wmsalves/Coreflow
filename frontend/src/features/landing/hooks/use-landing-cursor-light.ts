"use client";

import { useEffect, type RefObject } from "react";

export function useLandingCursorLight(mainRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const main = mainRef.current;

    if (!main) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const setCursor = (x: number, y: number) => {
      main.style.setProperty("--cursor-x", `${x}px`);
      main.style.setProperty("--cursor-y", `${y}px`);
    };

    const restingX = window.innerWidth * 0.5;
    const restingY = window.innerHeight * 0.18;

    if (reduceMotion || !finePointer) {
      setCursor(restingX, restingY);
      return;
    }

    const state = {
      currentX: restingX,
      currentY: restingY,
      frame: 0,
      targetX: restingX,
      targetY: restingY,
    };

    const tick = () => {
      state.currentX += (state.targetX - state.currentX) * 0.12;
      state.currentY += (state.targetY - state.currentY) * 0.12;
      setCursor(state.currentX, state.currentY);

      if (
        Math.abs(state.targetX - state.currentX) < 0.6 &&
        Math.abs(state.targetY - state.currentY) < 0.6
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
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      schedule();
    };

    const handleLeave = () => {
      state.targetX = restingX;
      state.targetY = restingY;
      schedule();
    };

    setCursor(restingX, restingY);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);

      if (state.frame) {
        window.cancelAnimationFrame(state.frame);
      }
    };
  }, [mainRef]);
}
