"use client";

import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
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
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { focusCopy } from "@/features/focus/content/focus-copy";
import {
  createStudySessionAction,
  deleteStudySessionAction,
  logFocusRunAction,
  updateStudySessionStatusAction,
} from "@/features/focus/actions";
import { FocusOverview } from "@/features/focus/components/focus-overview";
import { PomodoroPanel } from "@/features/focus/components/pomodoro-panel";
import { StudySessionList } from "@/features/focus/components/study-session-list";
import type {
  FocusFilters,
  FocusLevel,
  FocusStatus,
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
  initialStandaloneFocusSeconds: number;
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

export function FocusWorkspace({
  initialSessions,
  initialStandaloneFocusSeconds,
}: FocusWorkspaceProps) {
  const { locale } = useLandingPreferences();
  const copy = focusCopy[locale];
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    initialSessions.find((session) => session.status === "in_progress" || session.status === "pending")?.id ??
      null,
  );
  const [standaloneFocusSeconds, setStandaloneFocusSeconds] = useState(initialStandaloneFocusSeconds);
  const [filters, setFilters] = useState<FocusFilters>(defaultFilters);
  const [input, setInput] = useState<StudySessionInput>(() => createDefaultInput());
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [isDeletingSession, setIsDeletingSession] = useState(false);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sessionPendingDeleteId, setSessionPendingDeleteId] = useState<string | null>(null);

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ??
    null;
  const sessionPendingDelete =
    sessions.find((session) => session.id === sessionPendingDeleteId) ?? null;

  const filteredSessions = useMemo(() => {
    return sessions
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
  }, [filters, sessions]);

  const completedCount = sessions.filter(
    (session) => session.status === "completed",
  ).length;
  const activeCount = sessions.filter(
    (session) => session.status === "in_progress",
  ).length;
  const pendingCount = sessions.filter(
    (session) => session.status === "pending",
  ).length;
  const totalSessionFocusSeconds = sessions.reduce(
    (total, session) => total + session.completedFocusSeconds,
    0,
  );
  const totalFocusSeconds = totalSessionFocusSeconds + standaloneFocusSeconds;
  const visibleSessionCount = sessions.filter((session) => session.status !== "archived").length;
  const completionRate =
    visibleSessionCount === 0
      ? 0
      : Math.round((completedCount / visibleSessionCount) * 100);

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
      setCreateSheetOpen(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.fallbackError);
    } finally {
      setIsSavingSession(false);
    }
  }

  function selectSession(id: string) {
    setSelectedSessionId(id);
  }

  async function persistStatus(id: string, status: FocusStatus) {
    setMessage(null);

    try {
      const updatedSession = await updateStudySessionStatusAction(id, status);
      setSessions((current) =>
        current.map((session) => (session.id === updatedSession.id ? updatedSession : session)),
      );
      return updatedSession;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.fallbackError);
      return null;
    }
  }

  async function startSession(id: string) {
    setSelectedSessionId(id);
    const session = sessions.find((item) => item.id === id);
    if (session && session.status === "pending") {
      return persistStatus(id, "in_progress");
    }

    return session ?? null;
  }

  async function logFocusRun(studySessionId: string | null, focusSeconds: number) {
    setMessage(null);

    try {
      const result = await logFocusRunAction({ durationSeconds: focusSeconds, studySessionId });
      if (result.studySession) {
        const updatedSession = result.studySession;
        setSessions((current) =>
          current.map((session) =>
            session.id === updatedSession.id ? updatedSession : session,
          ),
        );
      }
      if (result.standaloneFocusSeconds !== undefined) {
        setStandaloneFocusSeconds(result.standaloneFocusSeconds);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.fallbackError);
      throw error;
    }
  }

  async function completeSession(id: string) {
    await persistStatus(id, "completed");
  }

  async function cancelSession(id: string) {
    await persistStatus(id, "canceled");
  }

  async function archiveSession(id: string) {
    const updatedSession = await persistStatus(id, "archived");
    if (updatedSession && selectedSessionId === id) {
      setSelectedSessionId(null);
    }
  }

  function requestDeleteSession(id: string) {
    setMessage(null);
    setSessionPendingDeleteId(id);
  }

  async function confirmDeleteSession() {
    if (!sessionPendingDeleteId) {
      return;
    }

    setIsDeletingSession(true);
    setMessage(null);

    try {
      const deletedSessionId = await deleteStudySessionAction(sessionPendingDeleteId);
      setSessions((current) => current.filter((session) => session.id !== deletedSessionId));
      if (selectedSessionId === deletedSessionId) {
        setSelectedSessionId(null);
      }
      setSessionPendingDeleteId(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.fallbackError);
    } finally {
      setIsDeletingSession(false);
    }
  }

  function cancelDeleteSession() {
    if (!isDeletingSession) {
      setSessionPendingDeleteId(null);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <Badge>{copy.badge}</Badge>
          <div className="space-y-2">
            <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.045em] text-[var(--landing-text)] sm:text-[2.35rem]">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--landing-text-muted)] sm:text-base sm:leading-7">
              {copy.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 sm:mt-6">
        <FocusOverview
          activeCount={activeCount}
          completedCount={completedCount}
          completionRate={completionRate}
          copy={copy}
          pendingCount={pendingCount}
          totalFocusSeconds={totalFocusSeconds}
        />
      </section>

      {message ? (
        <div className="mt-6 rounded-[1.5rem] border border-[rgba(204,90,67,0.3)] bg-[rgba(204,90,67,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
          {message}
        </div>
      ) : null}

      <section className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-[minmax(0,1.05fr)_390px] 2xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <div className="h-full space-y-5 sm:space-y-6">
          <div className="sm:hidden">
            <MobileSheet
              description={copy.planner.description}
              open={createSheetOpen}
              title={copy.planner.title}
              trigger={
                <Button className="w-full" size="lg">
                  <Plus className="size-4" />
                  {copy.actions.create}
                </Button>
              }
              onOpenChange={setCreateSheetOpen}
            >
              <StudySessionPlannerForm
                copy={copy}
                input={input}
                isSavingSession={isSavingSession}
                onCreateSession={createSession}
                onInputChange={setInput}
              />
            </MobileSheet>
          </div>

          <Card className="hidden h-full flex-col sm:flex">
            <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>{copy.planner.title}</CardTitle>
                <CardDescription>{copy.planner.description}</CardDescription>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-accent)] shadow-[var(--landing-chip-inset-shadow)]">
                <BookOpenCheck className="size-5" />
              </span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <StudySessionPlannerForm
                copy={copy}
                input={input}
                isSavingSession={isSavingSession}
                onCreateSession={createSession}
                onInputChange={setInput}
                showSummary
              />
            </CardContent>
          </Card>
        </div>

        <aside className="xl:self-start">
          <PomodoroPanel
            copy={copy}
            onClearSession={() => setSelectedSessionId(null)}
            onCompleteSession={completeSession}
            onLogFocusRun={logFocusRun}
            onStartSession={startSession}
            selectedSession={selectedSession}
            standaloneFocusSeconds={standaloneFocusSeconds}
          />
        </aside>
      </section>

      <section className="mt-6">
        <StudySessionList
          activeSessionId={selectedSessionId}
          copy={copy}
          filters={filters}
          onArchive={archiveSession}
          onCancel={cancelSession}
          onComplete={completeSession}
          onDelete={requestDeleteSession}
          onFilterChange={setFilters}
          onSelect={selectSession}
          onStart={startSession}
          sessions={filteredSessions}
        />
      </section>

      <ConfirmationModal
        cancelLabel={copy.deleteDialog.cancelLabel}
        confirmLabel={copy.deleteDialog.confirmLabel}
        description={copy.deleteDialog.description}
        loading={isDeletingSession}
        open={Boolean(sessionPendingDelete)}
        title={copy.deleteDialog.title}
        variant="danger"
        onCancel={cancelDeleteSession}
        onConfirm={confirmDeleteSession}
      >
        {sessionPendingDelete ? (
          <div className="rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-3">
            <p className="text-sm font-medium text-[var(--landing-text)]">
              {sessionPendingDelete.title}
            </p>
            <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
              {sessionPendingDelete.subject}
            </p>
          </div>
        ) : null}
      </ConfirmationModal>
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

function StudySessionPlannerForm({
  copy,
  input,
  isSavingSession,
  onCreateSession,
  onInputChange,
  showSummary = false,
}: {
  copy: typeof focusCopy.en;
  input: StudySessionInput;
  isSavingSession: boolean;
  onCreateSession: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: Dispatch<SetStateAction<StudySessionInput>>;
  showSummary?: boolean;
}) {
  return (
    <>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={onCreateSession}
      >
        <Field label={copy.planner.titleLabel}>
          <Input
            onChange={(event) =>
              onInputChange((current) => ({
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
              onInputChange((current) => ({
                ...current,
                subject: event.target.value,
              }))
            }
            placeholder={copy.planner.subjectPlaceholder}
            value={input.subject}
          />
        </Field>
        <Field
          className="sm:col-span-2"
          label={copy.planner.descriptionLabel}
        >
          <textarea
            className="min-h-24 w-full resize-none rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-3 text-sm text-[var(--landing-text)] outline-none placeholder:text-[var(--landing-text-faint)] focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)]"
            onChange={(event) =>
              onInputChange((current) => ({
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
              onInputChange((current) => ({
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
              onInputChange((current) => ({
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
              onInputChange((current) => ({
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
              onInputChange((current) => ({ ...current, difficulty }))
            }
            value={input.difficulty}
          />
        </Field>
        <Field label={copy.planner.importanceLabel}>
          <LevelSelect
            copy={copy}
            onChange={(importance) =>
              onInputChange((current) => ({ ...current, importance }))
            }
            value={input.importance}
          />
        </Field>
        <div className="sm:col-span-2">
          <Button className="w-full sm:w-auto" disabled={isSavingSession} type="submit">
            <Plus className="size-4" />
            {isSavingSession ? copy.actions.saving : copy.actions.save}
          </Button>
        </div>
      </form>

      {showSummary ? (
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3 shadow-[var(--landing-chip-inset-shadow)] sm:mt-6 sm:rounded-[1.5rem] sm:p-4 xl:grid-cols-4">
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
      ) : null}
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
