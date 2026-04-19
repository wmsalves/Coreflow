"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { BookOpenCheck, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { focusCopy, type FocusCopy } from "@/features/focus/content/focus-copy";
import { FocusOverview } from "@/features/focus/components/focus-overview";
import { PomodoroPanel } from "@/features/focus/components/pomodoro-panel";
import { StudySessionList } from "@/features/focus/components/study-session-list";
import type { FocusFilters, FocusLevel, StudySession, StudySessionInput } from "@/features/focus/types/focus-types";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";

function createInitialSessions(copy: FocusCopy): StudySession[] {
  const samples = copy.samples.sessions;

  return [
    {
      ...samples["session-1"],
      completedFocusMinutes: 20,
      difficulty: "medium",
      dueDate: "2026-04-22",
      estimatedMinutes: 45,
      id: "session-1",
      importance: "high",
      startDate: "2026-04-19",
      status: "in_progress",
    },
    {
      ...samples["session-2"],
      completedFocusMinutes: 0,
      difficulty: "high",
      dueDate: "2026-04-24",
      estimatedMinutes: 60,
      id: "session-2",
      importance: "high",
      startDate: "2026-04-20",
      status: "pending",
    },
    {
      ...samples["session-3"],
      completedFocusMinutes: 30,
      difficulty: "low",
      dueDate: "2026-04-18",
      estimatedMinutes: 30,
      id: "session-3",
      importance: "medium",
      startDate: "2026-04-18",
      status: "completed",
    },
  ];
}

const defaultFilters: FocusFilters = {
  difficulty: "all",
  importance: "all",
  status: "all",
};

const defaultInput: StudySessionInput = {
  description: "",
  difficulty: "medium",
  dueDate: "2026-04-25",
  estimatedMinutes: 45,
  importance: "medium",
  startDate: "2026-04-19",
  subject: "",
  title: "",
};

const levelOptions: FocusLevel[] = ["low", "medium", "high"];

export function FocusWorkspace() {
  const { locale } = useLandingPreferences();
  const copy = focusCopy[locale];
  const [sessions, setSessions] = useState<StudySession[]>(() => createInitialSessions(focusCopy.en));
  const [selectedSessionId, setSelectedSessionId] = useState("session-1");
  const [filters, setFilters] = useState<FocusFilters>(defaultFilters);
  const [input, setInput] = useState<StudySessionInput>(defaultInput);

  const localizedSessions = useMemo(
    () =>
      sessions.map((session) => {
        const localizedSession = copy.samples.sessions[session.id as keyof typeof copy.samples.sessions];
        return localizedSession ? { ...session, ...localizedSession } : session;
      }),
    [copy, sessions],
  );

  const selectedSession = localizedSessions.find((session) => session.id === selectedSessionId) ?? null;

  const filteredSessions = useMemo(() => {
    return localizedSessions
      .filter((session) => filters.status === "all" || session.status === filters.status)
      .filter((session) => filters.difficulty === "all" || session.difficulty === filters.difficulty)
      .filter((session) => filters.importance === "all" || session.importance === filters.importance)
      .sort((first, second) => first.dueDate.localeCompare(second.dueDate));
  }, [filters, localizedSessions]);

  const completedCount = localizedSessions.filter((session) => session.status === "completed").length;
  const activeCount = localizedSessions.filter((session) => session.status === "in_progress").length;
  const pendingCount = localizedSessions.filter((session) => session.status === "pending").length;
  const totalFocusMinutes = localizedSessions.reduce((total, session) => total + session.completedFocusMinutes, 0);
  const completionRate = localizedSessions.length === 0 ? 0 : Math.round((completedCount / localizedSessions.length) * 100);

  function createSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const session: StudySession = {
      ...input,
      completedFocusMinutes: 0,
      description: input.description.trim(),
      id: globalThis.crypto?.randomUUID?.() ?? `session-${Date.now()}`,
      status: input.status ?? "pending",
      subject: input.subject.trim() || copy.badge,
      title: input.title.trim(),
    };

    if (!session.title) {
      return;
    }

    setSessions((current) => [session, ...current]);
    setSelectedSessionId(session.id);
    setInput(defaultInput);
  }

  function selectSession(id: string) {
    setSelectedSessionId(id);
  }

  function startSession(id: string) {
    setSelectedSessionId(id);
    setSessions((current) =>
      current.map((session) => (session.id === id && session.status === "pending" ? { ...session, status: "in_progress" } : session)),
    );
  }

  function completeSession(id: string, focusMinutes?: number) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? {
              ...session,
              completedFocusMinutes: Math.max(session.completedFocusMinutes, focusMinutes ?? session.estimatedMinutes),
              status: "completed",
            }
          : session,
      ),
    );
  }

  return (
    <>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <Badge>{copy.badge}</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[var(--landing-text)] sm:text-[2.35rem]">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--landing-text-muted)] sm:text-base">
              {copy.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <FocusOverview
          activeCount={activeCount}
          completedCount={completedCount}
          completionRate={completionRate}
          copy={copy}
          pendingCount={pendingCount}
          totalFocusMinutes={totalFocusMinutes}
        />
      </section>

      <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
              <div>
                <CardTitle>{copy.planner.title}</CardTitle>
                <CardDescription>{copy.planner.description}</CardDescription>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-accent)] shadow-[var(--landing-chip-inset-shadow)]">
                <BookOpenCheck className="size-5" />
              </span>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 lg:grid-cols-2" onSubmit={createSession}>
                <Field label={copy.planner.titleLabel}>
                  <Input
                    onChange={(event) => setInput((current) => ({ ...current, title: event.target.value }))}
                    placeholder={copy.planner.titlePlaceholder}
                    required
                    value={input.title}
                  />
                </Field>
                <Field label={copy.planner.subjectLabel}>
                  <Input
                    onChange={(event) => setInput((current) => ({ ...current, subject: event.target.value }))}
                    placeholder={copy.planner.subjectPlaceholder}
                    value={input.subject}
                  />
                </Field>
                <Field className="lg:col-span-2" label={copy.planner.descriptionLabel}>
                  <textarea
                    className="min-h-24 w-full resize-none rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-3 text-sm text-[var(--landing-text)] outline-none placeholder:text-[var(--landing-text-faint)] focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)]"
                    onChange={(event) => setInput((current) => ({ ...current, description: event.target.value }))}
                    placeholder={copy.planner.descriptionPlaceholder}
                    value={input.description}
                  />
                </Field>
                <Field label={copy.planner.estimatedLabel}>
                  <Input
                    min={5}
                    onChange={(event) => setInput((current) => ({ ...current, estimatedMinutes: Number(event.target.value) || 5 }))}
                    type="number"
                    value={input.estimatedMinutes}
                  />
                </Field>
                <Field label={copy.planner.startLabel}>
                  <Input
                    onChange={(event) => setInput((current) => ({ ...current, startDate: event.target.value }))}
                    type="date"
                    value={input.startDate}
                  />
                </Field>
                <Field label={copy.planner.dueLabel}>
                  <Input
                    onChange={(event) => setInput((current) => ({ ...current, dueDate: event.target.value }))}
                    type="date"
                    value={input.dueDate}
                  />
                </Field>
                <Field label={copy.planner.difficultyLabel}>
                  <LevelSelect
                    copy={copy}
                    onChange={(difficulty) => setInput((current) => ({ ...current, difficulty }))}
                    value={input.difficulty}
                  />
                </Field>
                <Field label={copy.planner.importanceLabel}>
                  <LevelSelect
                    copy={copy}
                    onChange={(importance) => setInput((current) => ({ ...current, importance }))}
                    value={input.importance}
                  />
                </Field>
                <div className="lg:col-span-2">
                  <Button type="submit">
                    <Plus className="size-4" />
                    {copy.actions.save}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <StudySessionList
            activeSessionId={selectedSessionId}
            copy={copy}
            filters={filters}
            onComplete={completeSession}
            onFilterChange={setFilters}
            onSelect={selectSession}
            sessions={filteredSessions}
          />
        </div>

        <PomodoroPanel
          copy={copy}
          onCompleteSession={completeSession}
          onStartSession={startSession}
          selectedSession={selectedSession}
        />
      </section>
    </>
  );
}

function Field({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`block space-y-2 text-sm font-medium ${className ?? ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function LevelSelect({
  copy,
  onChange,
  value,
}: {
  copy: typeof focusCopy.en;
  onChange: (value: FocusLevel) => void;
  value: FocusLevel;
}) {
  return (
    <select
      className="h-11 w-full rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 text-sm text-[var(--landing-text)] outline-none shadow-[var(--landing-chip-inset-shadow)] focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)]"
      onChange={(event) => onChange(event.target.value as FocusLevel)}
      value={value}
    >
      {levelOptions.map((level) => (
        <option key={level} value={level}>
          {copy.levels[level]}
        </option>
      ))}
    </select>
  );
}