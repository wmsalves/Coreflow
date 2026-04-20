"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { BookOpenCheck, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { focusCopy } from "@/features/focus/content/focus-copy";
import {
  createStudySessionAction,
  updateStudySessionStatusAction,
} from "@/features/focus/actions";
import { FocusOverview } from "@/features/focus/components/focus-overview";
import { PomodoroPanel } from "@/features/focus/components/pomodoro-panel";
import { StudySessionList } from "@/features/focus/components/study-session-list";
import type {
  FocusFilters,
  FocusLevel,
  StudySession,
  StudySessionInput,
} from "@/features/focus/types/focus-types";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";

const defaultFilters: FocusFilters = {
  difficulty: "all",
  importance: "all",
  status: "all",
};

const levelOptions: FocusLevel[] = ["low", "medium", "high"];

type FocusWorkspaceProps = {
  initialSessions: StudySession[];
};

function addDays(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function createDefaultInput(): StudySessionInput {
  const today = new Date().toISOString().slice(0, 10);

  return {
    description: "",
    difficulty: "medium",
    dueDate: addDays(today, 7),
    estimatedMinutes: 45,
    importance: "medium",
    startDate: today,
    subject: "",
    title: "",
  };
}

export function FocusWorkspace({ initialSessions }: FocusWorkspaceProps) {
  const { locale } = useLandingPreferences();
  const copy = focusCopy[locale];
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSessions[0]?.id ?? null,
  );
  const [filters, setFilters] = useState<FocusFilters>(defaultFilters);
  const [input, setInput] = useState<StudySessionInput>(() => createDefaultInput());
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const localizedSessions = useMemo(
    () =>
      sessions.map((session) => {
        const localizedSession =
          copy.samples.sessions[
            session.id as keyof typeof copy.samples.sessions
          ];
        return localizedSession ? { ...session, ...localizedSession } : session;
      }),
    [copy, sessions],
  );

  const selectedSession =
    localizedSessions.find((session) => session.id === selectedSessionId) ??
    null;

  const filteredSessions = useMemo(() => {
    return localizedSessions
      .filter(
        (session) =>
          filters.status === "all" || session.status === filters.status,
      )
      .filter(
        (session) =>
          filters.difficulty === "all" ||
          session.difficulty === filters.difficulty,
      )
      .filter(
        (session) =>
          filters.importance === "all" ||
          session.importance === filters.importance,
      )
      .sort((first, second) => first.dueDate.localeCompare(second.dueDate));
  }, [filters, localizedSessions]);

  const completedCount = localizedSessions.filter(
    (session) => session.status === "completed",
  ).length;
  const activeCount = localizedSessions.filter(
    (session) => session.status === "in_progress",
  ).length;
  const pendingCount = localizedSessions.filter(
    (session) => session.status === "pending",
  ).length;
  const totalFocusMinutes = localizedSessions.reduce(
    (total, session) => total + session.completedFocusMinutes,
    0,
  );
  const completionRate =
    localizedSessions.length === 0
      ? 0
      : Math.round((completedCount / localizedSessions.length) * 100);

  async function createSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.title.trim()) {
      return;
    }

    setIsSavingSession(true);
    setMessage(null);

    try {
      const session = await createStudySessionAction(input);
      setSessions((current) => [session, ...current]);
      setSelectedSessionId(session.id);
      setInput(createDefaultInput());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.fallbackError);
    } finally {
      setIsSavingSession(false);
    }
  }

  function selectSession(id: string) {
    setSelectedSessionId(id);
  }

  function startSession(id: string) {
    setSelectedSessionId(id);
    setSessions((current) =>
      current.map((session) =>
        session.id === id && session.status === "pending"
          ? { ...session, status: "in_progress" }
          : session,
      ),
    );
    const session = sessions.find((item) => item.id === id);
    if (session && session.status === "pending") {
      void updateStudySessionStatusAction({ ...session, status: "in_progress" }, "in_progress").catch(
        (error: unknown) => setMessage(error instanceof Error ? error.message : copy.fallbackError),
      );
    }
  }

  function completeSession(id: string, focusMinutes?: number) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? {
              ...session,
              completedFocusMinutes: Math.max(
                session.completedFocusMinutes,
                focusMinutes ?? session.estimatedMinutes,
              ),
              status: "completed",
            }
          : session,
      ),
    );
    const session = sessions.find((item) => item.id === id);
    if (session) {
      void updateStudySessionStatusAction(session, "completed", focusMinutes ?? session.estimatedMinutes)
        .then((updatedSession) => {
          setSessions((current) =>
            current.map((item) => (item.id === updatedSession.id ? updatedSession : item)),
          );
        })
        .catch((error: unknown) =>
          setMessage(error instanceof Error ? error.message : copy.fallbackError),
        );
    }
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

      {message ? (
        <div className="mt-6 rounded-[1.5rem] border border-[rgba(204,90,67,0.3)] bg-[rgba(204,90,67,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {message}
        </div>
      ) : null}

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_390px] 2xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <div className="h-full space-y-6">
          <Card className="flex h-full flex-col">
            <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
              <div>
                <CardTitle>{copy.planner.title}</CardTitle>
                <CardDescription>{copy.planner.description}</CardDescription>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-accent)] shadow-[var(--landing-chip-inset-shadow)]">
                <BookOpenCheck className="size-5" />
              </span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <form
                className="grid gap-4 lg:grid-cols-2"
                onSubmit={createSession}
              >
                <Field label={copy.planner.titleLabel}>
                  <Input
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder={copy.planner.titlePlaceholder}
                    required
                    value={input.title}
                  />
                </Field>
                <Field label={copy.planner.subjectLabel}>
                  <Input
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        subject: event.target.value,
                      }))
                    }
                    placeholder={copy.planner.subjectPlaceholder}
                    value={input.subject}
                  />
                </Field>
                <Field
                  className="lg:col-span-2"
                  label={copy.planner.descriptionLabel}
                >
                  <textarea
                    className="min-h-24 w-full resize-none rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-3 text-sm text-[var(--landing-text)] outline-none placeholder:text-[var(--landing-text-faint)] focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)]"
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder={copy.planner.descriptionPlaceholder}
                    value={input.description}
                  />
                </Field>
                <Field label={copy.planner.estimatedLabel}>
                  <Input
                    min={5}
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        estimatedMinutes: Number(event.target.value) || 5,
                      }))
                    }
                    type="number"
                    value={input.estimatedMinutes}
                  />
                </Field>
                <Field label={copy.planner.startLabel}>
                  <Input
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        startDate: event.target.value,
                      }))
                    }
                    type="date"
                    value={input.startDate}
                  />
                </Field>
                <Field label={copy.planner.dueLabel}>
                  <Input
                    onChange={(event) =>
                      setInput((current) => ({
                        ...current,
                        dueDate: event.target.value,
                      }))
                    }
                    type="date"
                    value={input.dueDate}
                  />
                </Field>
                <Field label={copy.planner.difficultyLabel}>
                  <LevelSelect
                    copy={copy}
                    onChange={(difficulty) =>
                      setInput((current) => ({ ...current, difficulty }))
                    }
                    value={input.difficulty}
                  />
                </Field>
                <Field label={copy.planner.importanceLabel}>
                  <LevelSelect
                    copy={copy}
                    onChange={(importance) =>
                      setInput((current) => ({ ...current, importance }))
                    }
                    value={input.importance}
                  />
                </Field>
                <div className="lg:col-span-2">
                  <Button disabled={isSavingSession} type="submit">
                    <Plus className="size-4" />
                    {isSavingSession ? copy.actions.saving : copy.actions.save}
                  </Button>
                </div>
              </form>

              <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 shadow-[var(--landing-chip-inset-shadow)] sm:grid-cols-2 xl:grid-cols-4">
                <PlanSummaryItem
                  label={copy.planner.titleLabel}
                  value={input.title || copy.planner.titlePlaceholder}
                />
                <PlanSummaryItem
                  label={copy.planner.subjectLabel}
                  value={input.subject || copy.planner.subjectPlaceholder}
                />
                <PlanSummaryItem
                  label={copy.planner.estimatedLabel}
                  value={copy.overview.minutes(input.estimatedMinutes)}
                />
                <PlanSummaryItem
                  label={copy.planner.dueLabel}
                  value={input.dueDate}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="xl:self-start">
          <PomodoroPanel
            copy={copy}
            onCompleteSession={completeSession}
            onStartSession={startSession}
            selectedSession={selectedSession}
          />
        </aside>
      </section>

      <section className="mt-6">
        <StudySessionList
          activeSessionId={selectedSessionId}
          copy={copy}
          filters={filters}
          onComplete={completeSession}
          onFilterChange={setFilters}
          onSelect={selectSession}
          sessions={filteredSessions}
        />
      </section>
    </>
  );
}

function PlanSummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--landing-text-faint)]">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-[var(--landing-text)]">{value}</p>
    </div>
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
