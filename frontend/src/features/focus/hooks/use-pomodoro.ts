"use client";

import { useEffect, useMemo, useState } from "react";
import type { PomodoroPhase, PomodoroSettings } from "@/features/focus/types/focus-types";

const defaultSettings: PomodoroSettings = {
  cycles: 4,
  focusMinutes: 25,
  longBreakMinutes: 15,
  shortBreakMinutes: 5,
};

type PomodoroState = {
  cycle: number;
  focusSeconds: number;
  isRunning: boolean;
  phase: PomodoroPhase;
  remainingSeconds: number;
};

function createInitialState(settings: PomodoroSettings, isRunning = false): PomodoroState {
  return {
    cycle: 1,
    focusSeconds: 0,
    isRunning,
    phase: "focus",
    remainingSeconds: settings.focusMinutes * 60,
  };
}

function clampSetting(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.round(value)));
}

function secondsForPhase(phase: PomodoroPhase, settings: PomodoroSettings) {
  if (phase === "short_break") {
    return settings.shortBreakMinutes * 60;
  }

  if (phase === "long_break") {
    return settings.longBreakMinutes * 60;
  }

  return settings.focusMinutes * 60;
}

function tick(current: PomodoroState, settings: PomodoroSettings): PomodoroState {
  if (!current.isRunning || current.phase === "complete") {
    return current;
  }

  const focusSeconds = current.phase === "focus" ? current.focusSeconds + 1 : current.focusSeconds;

  if (current.remainingSeconds > 1) {
    return {
      ...current,
      focusSeconds,
      remainingSeconds: current.remainingSeconds - 1,
    };
  }

  if (current.phase === "focus") {
    const nextPhase: PomodoroPhase = current.cycle >= settings.cycles ? "long_break" : "short_break";
    return {
      ...current,
      focusSeconds,
      phase: nextPhase,
      remainingSeconds: secondsForPhase(nextPhase, settings),
    };
  }

  if (current.cycle >= settings.cycles) {
    return {
      ...current,
      focusSeconds,
      isRunning: false,
      phase: "complete",
      remainingSeconds: 0,
    };
  }

  return {
    ...current,
    cycle: current.cycle + 1,
    focusSeconds,
    phase: "focus",
    remainingSeconds: settings.focusMinutes * 60,
  };
}

export function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function usePomodoro(initialSettings: PomodoroSettings = defaultSettings) {
  const [settings, setSettings] = useState<PomodoroSettings>(initialSettings);
  const [timerState, setTimerState] = useState<PomodoroState>(() => createInitialState(initialSettings));

  useEffect(() => {
    if (!timerState.isRunning || timerState.phase === "complete") {
      return;
    }

    const timer = window.setInterval(() => {
      setTimerState((current) => tick(current, settings));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [settings, timerState.isRunning, timerState.phase]);

  const progress = useMemo(() => {
    if (timerState.phase === "complete") {
      return 100;
    }

    const total = secondsForPhase(timerState.phase, settings);
    return Math.round(((total - timerState.remainingSeconds) / total) * 100);
  }, [settings, timerState.phase, timerState.remainingSeconds]);

  function start() {
    setTimerState((current) => {
      if (current.phase === "complete") {
        return createInitialState(settings, true);
      }

      return { ...current, isRunning: true };
    });
  }

  function pause() {
    setTimerState((current) => ({ ...current, isRunning: false }));
  }

  function reset() {
    setTimerState(createInitialState(settings));
  }

  function updateSettings(nextSettings: Partial<PomodoroSettings>) {
    setSettings((current) => {
      const updated = {
        cycles: clampSetting(nextSettings.cycles ?? current.cycles, 1, 8),
        focusMinutes: clampSetting(nextSettings.focusMinutes ?? current.focusMinutes, 5, 120),
        longBreakMinutes: clampSetting(nextSettings.longBreakMinutes ?? current.longBreakMinutes, 5, 45),
        shortBreakMinutes: clampSetting(nextSettings.shortBreakMinutes ?? current.shortBreakMinutes, 1, 30),
      };

      setTimerState((timer) => {
        if (timer.isRunning) {
          return timer;
        }

        const phase = timer.phase === "complete" ? "focus" : timer.phase;
        return {
          ...timer,
          phase,
          remainingSeconds: secondsForPhase(phase, updated),
        };
      });

      return updated;
    });
  }

  return {
    cycle: timerState.cycle,
    focusSecondsLogged: timerState.focusSeconds,
    isRunning: timerState.isRunning,
    phase: timerState.phase,
    progress,
    remainingSeconds: timerState.remainingSeconds,
    reset,
    settings,
    start,
    pause,
    updateSettings,
  };
}
