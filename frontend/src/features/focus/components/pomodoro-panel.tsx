import { useState } from "react";
import { Pause, Play, RotateCcw, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { FocusCopy } from "@/features/focus/content/focus-copy";
import { formatTimer, usePomodoro } from "@/features/focus/hooks/use-pomodoro";
import type {
  PomodoroSettings,
  StudySession,
} from "@/features/focus/types/focus-types";

const settingKeys: Array<keyof PomodoroSettings> = [
  "focusMinutes",
  "shortBreakMinutes",
  "longBreakMinutes",
  "cycles",
];

type PomodoroPanelProps = {
  copy: FocusCopy;
  onClearSession: () => void;
  onCompleteSession: (id: string) => Promise<void> | void;
  onLogFocusRun: (studySessionId: string | null, focusSeconds: number) => Promise<void> | void;
  onStartSession: (id: string) => Promise<StudySession | null> | StudySession | null;
  selectedSession: StudySession | null;
  standaloneFocusSeconds: number;
};

export function PomodoroPanel({
  copy,
  onClearSession,
  onCompleteSession,
  onLogFocusRun,
  onStartSession,
  selectedSession,
  standaloneFocusSeconds,
}: PomodoroPanelProps) {
  const timer = usePomodoro();
  const [isSavingFocusRun, setIsSavingFocusRun] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const selectedSessionCanRun = Boolean(
    selectedSession &&
      selectedSession.status !== "completed" &&
      selectedSession.status !== "canceled" &&
      selectedSession.status !== "archived",
  );
  const canRun = !selectedSession || selectedSessionCanRun;
  const hasFocusTimeToSave = timer.focusSecondsLogged > 0;
  const primaryLabel = timer.isRunning
    ? copy.actions.pause
    : timer.remainingSeconds < timer.settings.focusMinutes * 60
      ? copy.actions.resume
      : copy.actions.start;

  async function handlePrimaryAction() {
    if (!canRun) {
      return;
    }

    if (timer.isRunning) {
      timer.pause();
      return;
    }

    if (selectedSession) {
      setIsStartingSession(true);
      try {
        const startedSession = await onStartSession(selectedSession.id);
        if (!startedSession) {
          return;
        }
      } finally {
        setIsStartingSession(false);
      }
    }
    timer.start();
  }

  async function saveFocusTime() {
    if (!hasFocusTimeToSave) {
      return;
    }

    setIsSavingFocusRun(true);
    try {
      await onLogFocusRun(selectedSession?.id ?? null, timer.focusSecondsLogged);
      timer.reset();
    } finally {
      setIsSavingFocusRun(false);
    }
  }

  async function handleComplete() {
    if (!selectedSession || !selectedSessionCanRun) {
      return;
    }

    setIsSavingFocusRun(true);
    try {
      if (hasFocusTimeToSave) {
        await onLogFocusRun(selectedSession.id, timer.focusSecondsLogged);
      }
      await onCompleteSession(selectedSession.id);
      timer.reset();
    } finally {
      setIsSavingFocusRun(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{copy.pomodoro.title}</CardTitle>
            <CardDescription>{copy.pomodoro.description}</CardDescription>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-accent)] shadow-[var(--landing-chip-inset-shadow)]">
            <TimerReset className="size-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-[1.5rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--landing-text-faint)]">
            {selectedSession ? copy.pomodoro.selected : copy.pomodoro.noSession}
          </p>
          {selectedSession ? (
            <div className="mt-2">
              <h3 className="font-semibold tracking-[-0.025em] text-[var(--landing-text)]">
                {selectedSession.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
                {selectedSession.subject}
              </p>
              <Button className="mt-3" onClick={onClearSession} size="sm" variant="secondary">
                {copy.actions.useStandalone}
              </Button>
            </div>
          ) : (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-[var(--landing-text-muted)]">
                {copy.pomodoro.noSessionDescription}
              </p>
              <p className="text-sm font-medium text-[var(--landing-text)]">
                {copy.pomodoro.standaloneTotal(standaloneFocusSeconds)}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-12 text-center shadow-[var(--landing-chip-inset-shadow)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent)]">
            {copy.pomodoro.phase[timer.phase]}
          </p>
          <p className="mt-3 text-6xl font-semibold tracking-[-0.08em] text-[var(--landing-text)] sm:text-7xl">
            {formatTimer(timer.remainingSeconds)}
          </p>
          <p className="mt-3 text-sm text-[var(--landing-text-muted)]">
            {copy.pomodoro.cycle(timer.cycle, timer.settings.cycles)}
          </p>
          <p className="mt-2 text-xs font-medium text-[var(--landing-text-faint)]">
            {copy.pomodoro.currentRun(timer.focusSecondsLogged)}
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--landing-surface-alt)]">
            <div
              className="h-full rounded-full bg-[var(--landing-accent)] transition-all duration-500"
              style={{ width: `${timer.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {settingKeys.map((key) => (
            <label className="block space-y-2 text-sm font-medium" key={key}>
              <span>{copy.pomodoro.settings[key]}</span>
              <Input
                disabled={timer.isRunning}
                min={key === "cycles" ? 1 : 1}
                onChange={(event) =>
                  timer.updateSettings({ [key]: Number(event.target.value) })
                }
                type="number"
                value={timer.settings[key]}
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled={!canRun || isStartingSession} onClick={handlePrimaryAction}>
            {timer.isRunning ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
            {isStartingSession ? copy.actions.saving : primaryLabel}
          </Button>
          <Button onClick={timer.reset} variant="secondary">
            <RotateCcw className="size-4" />
            {copy.actions.reset}
          </Button>
          <Button
            disabled={!hasFocusTimeToSave || isSavingFocusRun}
            onClick={saveFocusTime}
            variant="secondary"
          >
            {isSavingFocusRun ? copy.actions.savingFocus : copy.actions.saveFocus}
          </Button>
          <Button
            disabled={
              !selectedSession ||
              !selectedSessionCanRun ||
              selectedSession.status === "completed" ||
              selectedSession.status === "canceled" ||
              selectedSession.status === "archived" ||
              isSavingFocusRun
            }
            onClick={handleComplete}
            variant="ghost"
          >
            {copy.actions.complete}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
