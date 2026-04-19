import { Pause, Play, RotateCcw, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { FocusCopy } from "@/features/focus/content/focus-copy";
import { formatTimer, usePomodoro } from "@/features/focus/hooks/use-pomodoro";
import type { PomodoroSettings, StudySession } from "@/features/focus/types/focus-types";

const settingKeys: Array<keyof PomodoroSettings> = [
  "focusMinutes",
  "shortBreakMinutes",
  "longBreakMinutes",
  "cycles",
];

type PomodoroPanelProps = {
  copy: FocusCopy;
  onCompleteSession: (id: string, focusMinutes: number) => void;
  onStartSession: (id: string) => void;
  selectedSession: StudySession | null;
};

export function PomodoroPanel({ copy, onCompleteSession, onStartSession, selectedSession }: PomodoroPanelProps) {
  const timer = usePomodoro();
  const canRun = Boolean(selectedSession);
  const primaryLabel = timer.isRunning ? copy.actions.pause : timer.remainingSeconds < timer.settings.focusMinutes * 60 ? copy.actions.resume : copy.actions.start;

  function handlePrimaryAction() {
    if (!selectedSession) {
      return;
    }

    if (timer.isRunning) {
      timer.pause();
      return;
    }

    onStartSession(selectedSession.id);
    timer.start();
  }

  function handleComplete() {
    if (!selectedSession) {
      return;
    }

    onCompleteSession(selectedSession.id, Math.max(timer.focusMinutesLogged, selectedSession.estimatedMinutes));
    timer.reset();
  }

  return (
    <Card className="xl:sticky xl:top-28">
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
              <h3 className="font-semibold tracking-[-0.025em] text-[var(--landing-text)]">{selectedSession.title}</h3>
              <p className="mt-1 text-sm text-[var(--landing-text-muted)]">{selectedSession.subject}</p>
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 text-center shadow-[var(--landing-chip-inset-shadow)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-accent)]">
            {copy.pomodoro.phase[timer.phase]}
          </p>
          <p className="mt-3 text-6xl font-semibold tracking-[-0.08em] text-[var(--landing-text)] sm:text-7xl">
            {formatTimer(timer.remainingSeconds)}
          </p>
          <p className="mt-3 text-sm text-[var(--landing-text-muted)]">
            {copy.pomodoro.cycle(timer.cycle, timer.settings.cycles)}
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
                onChange={(event) => timer.updateSettings({ [key]: Number(event.target.value) })}
                type="number"
                value={timer.settings[key]}
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled={!canRun} onClick={handlePrimaryAction}>
            {timer.isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
            {primaryLabel}
          </Button>
          <Button onClick={timer.reset} variant="secondary">
            <RotateCcw className="size-4" />
            {copy.actions.reset}
          </Button>
          <Button disabled={!selectedSession || selectedSession.status === "completed"} onClick={handleComplete} variant="ghost">
            {copy.actions.complete}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
