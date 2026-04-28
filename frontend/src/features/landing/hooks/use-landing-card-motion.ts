"use client";

import { useEffect } from "react";

export function useLandingCardMotion() {
  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 1024px)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!desktopViewport || reduceMotion || !finePointer) {
      return;
    }

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-card-motion]"),
    ).filter((card) => !card.closest(".landing-preview"));

    if (!cards.length) {
      return;
    }

    const resetCard = (card: HTMLElement) => {
      card.style.removeProperty("transform");
    };

    const cleanups = cards.map((card) => {
      const motion = card.dataset.cardMotion === "panel" ? "panel" : "follow";
      const strength =
        motion === "panel"
          ? { rotateX: 0.82, rotateY: 1.08, shiftY: -4.2 }
          : { rotateX: 0.24, rotateY: 0.34, shiftY: -1.65 };

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
        card.style.transform = `perspective(1400px) translate3d(0, ${state.currentShiftY}px, 0) rotateX(${state.currentRotateX}deg) rotateY(${state.currentRotateY}deg)`;
      };

      const tick = () => {
        state.currentRotateX +=
          (state.targetRotateX - state.currentRotateX) * 0.14;
        state.currentRotateY +=
          (state.targetRotateY - state.currentRotateY) * 0.14;
        state.currentShiftY +=
          (state.targetShiftY - state.currentShiftY) * 0.14;

        apply();

        if (
          Math.abs(state.targetRotateX - state.currentRotateX) < 0.03 &&
          Math.abs(state.targetRotateY - state.currentRotateY) < 0.03 &&
          Math.abs(state.targetShiftY - state.currentShiftY) < 0.03
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
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const easedX = Math.sign(x) * Math.pow(Math.abs(x), 1.35);
        const easedY = Math.sign(y) * Math.pow(Math.abs(y), 1.15);

        state.targetRotateX = easedY * -strength.rotateX;
        state.targetRotateY = easedX * strength.rotateY;
        state.targetShiftY = easedY * strength.shiftY;
        schedule();
      };

      const reset = () => {
        state.targetRotateX = 0;
        state.targetRotateY = 0;
        state.targetShiftY = 0;
        schedule();
      };

      resetCard(card);
      card.addEventListener("pointermove", handleMove);
      card.addEventListener("pointerleave", reset);

      return () => {
        card.removeEventListener("pointermove", handleMove);
        card.removeEventListener("pointerleave", reset);
        resetCard(card);

        if (state.frame) {
          window.cancelAnimationFrame(state.frame);
        }
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);
}
