"use client";

import {
  Activity,
  CheckCircle2,
  Circle,
  Clock3,
  Dumbbell,
  Loader2,
  Play,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclosure } from "@/components/ui/disclosure";
import { Input } from "@/components/ui/input";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { StatusNotice } from "@/components/ui/status-notice";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import {
  addExerciseToWorkoutPlanAction,
  cancelWorkoutSessionAction,
  createWorkoutPlanAction,
  finishWorkoutSessionAction,
  getExerciseDetailAction,
  listExerciseCatalogAction,
  removeExerciseFromWorkoutPlanAction,
  searchExerciseCatalogAction,
  startWorkoutSessionAction,
  updateWorkoutSessionExerciseCompletionAction,
  updateWorkoutSessionExerciseDetailsAction,
} from "@/features/fitness/actions";
import type {
  ExerciseConfig,
  ExerciseDetail,
  ExerciseResolvedMedia,
  ExerciseSummary,
  WorkoutLog,
  WorkoutPlan,
  WorkoutSession,
} from "@/features/fitness/types";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { cn } from "@/lib/utils";

type LoadState = "idle" | "loading" | "error";
type Notice = {
  kind: "error" | "info" | "success";
  text: string;
};
type PendingMutation =
  | { type: "add-exercise" }
  | { type: "cancel-workout" }
  | { type: "create-plan" }
  | { type: "finish-workout" }
  | { exerciseId: string; type: "remove-exercise" }
  | { type: "start-workout" };
type FitnessCopy = (typeof dashboardCopy)["en"]["fitness"];
type CommonCopy = (typeof dashboardCopy)["en"]["common"];
type SessionExerciseDraft = {
  reps: number;
  restSeconds: number;
  sets: number;
  weight: string;
};

const defaultConfig: ExerciseConfig = {
  notes: "",
  reps: 10,
  restSeconds: 90,
  sets: 3,
};
const CATALOG_VISIBLE_BATCH_SIZE = 6;

function getMetaValue(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function formatWeightDraft(value: number | null) {
  return value === null || value === undefined ? "" : String(value);
}

function toSessionExerciseDraft(
  exercise: WorkoutSession["exercises"][number],
): SessionExerciseDraft {
  return {
    reps: exercise.reps ?? 1,
    restSeconds: exercise.restSeconds ?? 0,
    sets: exercise.sets ?? 1,
    weight: formatWeightDraft(exercise.weight),
  };
}

function parseWeightDraft(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

type FitnessWorkspaceProps = {
  initialActiveSession: WorkoutSession | null;
  initialExercises: ExerciseSummary[];
  initialLoadFailed: boolean;
  initialLogs: WorkoutLog[];
  initialPlans: WorkoutPlan[];
};

export function FitnessWorkspace({
  initialActiveSession,
  initialExercises,
  initialLoadFailed,
  initialLogs,
  initialPlans,
}: FitnessWorkspaceProps) {
  const { locale } = useLandingPreferences();
  const copy = dashboardCopy[locale].fitness;
  const commonCopy = dashboardCopy[locale].common;
  const [query, setQuery] = useState(copy.defaults.searchQuery);
  const [results, setResults] = useState<ExerciseSummary[]>(initialExercises);
  const [visibleResultsCount, setVisibleResultsCount] = useState(
    CATALOG_VISIBLE_BATCH_SIZE,
  );
  const [plans, setPlans] = useState<WorkoutPlan[]>(initialPlans);
  const [logs, setLogs] = useState<WorkoutLog[]>(initialLogs);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(
    initialActiveSession,
  );
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(
    initialPlans.find((plan) => plan.id === initialActiveSession?.workoutPlanId) ??
      initialPlans[0] ??
      null,
  );
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseDetail | null>(null);
  const [exerciseConfig, setExerciseConfig] = useState(defaultConfig);
  const [planName, setPlanName] = useState(copy.defaults.planName);
  const [planDescription, setPlanDescription] = useState(
    copy.defaults.planDescription,
  );
  const [catalogState, setCatalogState] = useState<LoadState>("idle");
  const [detailState, setDetailState] = useState<LoadState>("idle");
  const [pendingMutation, setPendingMutation] =
    useState<PendingMutation | null>(null);
  const [savingSessionExerciseIds, setSavingSessionExerciseIds] = useState<string[]>([]);
  const [sessionExerciseDrafts, setSessionExerciseDrafts] = useState<
    Record<string, SessionExerciseDraft>
  >({});
  const [createPlanSheetOpen, setCreatePlanSheetOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(
    initialLoadFailed ? { kind: "error", text: copy.initialLoadError } : null,
  );
  const editTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const rollbackSnapshotRef = useRef<
    Record<string, WorkoutSession["exercises"][number]>
  >({});

  const activePlanExercises = useMemo(
    () => activePlan?.exercises ?? [],
    [activePlan],
  );
  const isMutating = pendingMutation !== null;
  const selectedInternalId = selectedExercise?.internalId;
  const visibleResults = results.slice(0, visibleResultsCount);
  const hasMoreResults = visibleResultsCount < results.length;

  async function runSearch(searchQuery: string) {
    setCatalogState("loading");
    setNotice(null);
    setVisibleResultsCount(CATALOG_VISIBLE_BATCH_SIZE);

    try {
      const loadedExercises = searchQuery.trim()
        ? await searchExerciseCatalogAction(searchQuery.trim())
        : await listExerciseCatalogAction();

      setResults(loadedExercises);
      setVisibleResultsCount(CATALOG_VISIBLE_BATCH_SIZE);
      setCatalogState("idle");
    } catch (error) {
      setCatalogState("error");
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    }
  }

  const sortedPlanExercises = useMemo(
    () =>
      [...activePlanExercises].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      ),
    [activePlanExercises],
  );
  const activeSessionExercises = useMemo(
    () =>
      [...(activeSession?.exercises ?? [])].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      ),
    [activeSession],
  );
  const completedExerciseCount = activeSessionExercises.filter(
    (exercise) => exercise.completed,
  ).length;
  const remainingExerciseCount = Math.max(
    (activeSession
      ? activeSessionExercises.length
      : sortedPlanExercises.length) - completedExerciseCount,
    0,
  );
  useEffect(() => {
    if (!activeSession) {
      setSessionExerciseDrafts({});
      return;
    }

    setSessionExerciseDrafts(
      Object.fromEntries(
        activeSession.exercises.map((exercise) => [
          exercise.id,
          toSessionExerciseDraft(exercise),
        ]),
      ),
    );
  }, [activeSession]);

  useEffect(() => {
    return () => {
      Object.values(editTimersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  function clearSessionEditTimers() {
    Object.values(editTimersRef.current).forEach((timer) => clearTimeout(timer));
    editTimersRef.current = {};
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runSearch(query);
  }

  async function handleSelectExercise(exercise: ExerciseSummary) {
    setDetailState("loading");
    setNotice(null);

    try {
      const detail = await getExerciseDetailAction(exercise.id);
      setSelectedExercise(detail);
      setExerciseConfig(defaultConfig);
      setDetailState("idle");
    } catch (error) {
      setDetailState("error");
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    }
  }

  async function handleCreatePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isMutating) {
      return;
    }

    setPendingMutation({ type: "create-plan" });
    setNotice(null);

    try {
      const plan = await createWorkoutPlanAction({
        description: planDescription,
        name: planName,
      });
      setPlans((currentPlans) => [
        plan,
        ...currentPlans.filter((item) => item.id !== plan.id),
      ]);
      setActivePlan(plan);
      setCreatePlanSheetOpen(false);
      setNotice({ kind: "success", text: copy.planCreated });
    } catch (error) {
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setPendingMutation(null);
    }
  }

  async function handleAddExercise() {
    if (isMutating) {
      return;
    }

    if (!activePlan || !selectedInternalId) {
      setNotice({ kind: "info", text: copy.createPlanFirst });
      return;
    }

    if (activeSession?.workoutPlanId === activePlan.id) {
      setNotice({ kind: "info", text: copy.builder.finishSessionBeforeEditing });
      return;
    }

    setPendingMutation({ type: "add-exercise" });
    setNotice(null);

    try {
      const updatedPlan = await addExerciseToWorkoutPlanAction(
        activePlan.id,
        selectedExercise,
        exerciseConfig,
        activePlanExercises.length + 1,
      );

      setActivePlan(updatedPlan);
      setPlans((currentPlans) =>
        currentPlans.map((plan) =>
          plan.id === updatedPlan.id ? updatedPlan : plan,
        ),
      );
      setNotice({ kind: "success", text: copy.exerciseAdded });
    } catch (error) {
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setPendingMutation(null);
    }
  }

  async function handleRemoveExercise(exerciseId: string) {
    if (isMutating) {
      return;
    }

    if (!activePlan) {
      setNotice({ kind: "info", text: copy.createPlanFirst });
      return;
    }

    if (activeSession?.workoutPlanId === activePlan.id) {
      setNotice({ kind: "info", text: copy.builder.finishSessionBeforeEditing });
      return;
    }

    const previousActivePlan = activePlan;
    const previousPlans = plans;
    const removeFromPlan = (plan: WorkoutPlan) => ({
      ...plan,
      exercises: plan.exercises.filter(
        (exercise) => exercise.id !== exerciseId,
      ),
    });

    setPendingMutation({ exerciseId, type: "remove-exercise" });
    setNotice({ kind: "info", text: copy.exerciseRemoving });
    setActivePlan(removeFromPlan(activePlan));
    setPlans((currentPlans) =>
      currentPlans.map((plan) =>
        plan.id === activePlan.id ? removeFromPlan(plan) : plan,
      ),
    );

    try {
      const updatedPlan = await removeExerciseFromWorkoutPlanAction(
        activePlan.id,
        exerciseId,
      );

      setActivePlan(updatedPlan);
      setPlans((currentPlans) =>
        currentPlans.map((plan) =>
          plan.id === updatedPlan.id ? updatedPlan : plan,
        ),
      );
      setNotice({ kind: "success", text: copy.exerciseRemoved });
    } catch (error) {
      setActivePlan(previousActivePlan);
      setPlans(previousPlans);
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setPendingMutation(null);
    }
  }

  async function handleStartWorkout() {
    if (isMutating) {
      return;
    }

    if (activeSession) {
      setNotice({ kind: "info", text: copy.session.resumeReady });
      return;
    }

    if (!activePlan) {
      setNotice({ kind: "info", text: copy.createPlanFirst });
      return;
    }

    if (sortedPlanExercises.length === 0) {
      setNotice({ kind: "info", text: copy.addExerciseBeforeStarting });
      return;
    }

    setPendingMutation({ type: "start-workout" });
    setNotice(null);

    try {
      const session = await startWorkoutSessionAction(activePlan.id);
      setActiveSession(session);
      setActivePlan((currentPlan) =>
        currentPlan?.id === session.workoutPlanId
          ? currentPlan
          : plans.find((plan) => plan.id === session.workoutPlanId) ?? currentPlan,
      );
      setNotice({ kind: "success", text: copy.session.started });
    } catch (error) {
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setPendingMutation(null);
    }
  }

  async function handleExerciseCompletionToggle(sessionExerciseId: string) {
    if (isMutating || savingSessionExerciseIds.includes(sessionExerciseId)) {
      return;
    }

    if (!activeSession) {
      setNotice({ kind: "info", text: copy.session.startFirst });
      return;
    }

    const currentExercise = activeSession.exercises.find(
      (exercise) => exercise.id === sessionExerciseId,
    );

    if (!currentExercise) {
      return;
    }

    const nextCompleted = !currentExercise.completed;
    const previousSession = activeSession;
    const now = new Date().toISOString();

    setSavingSessionExerciseIds((current) =>
      current.includes(sessionExerciseId)
        ? current
        : [...current, sessionExerciseId],
    );
    setActiveSession({
      ...activeSession,
      exercises: activeSession.exercises.map((exercise) =>
        exercise.id === sessionExerciseId
          ? {
              ...exercise,
              completed: nextCompleted,
              completedAt: nextCompleted ? now : null,
            }
          : exercise,
      ),
      updatedAt: now,
    });

    try {
      const session = await updateWorkoutSessionExerciseCompletionAction({
        completed: nextCompleted,
        sessionExerciseId,
        sessionId: activeSession.id,
      });
      setActiveSession(session);
      setNotice({
        kind: "success",
        text: nextCompleted
          ? copy.session.exerciseCompleted
          : copy.session.exerciseReset,
      });
    } catch (error) {
      setActiveSession(previousSession);
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setSavingSessionExerciseIds((current) =>
        current.filter((id) => id !== sessionExerciseId),
      );
    }
  }

  async function persistSessionExerciseDraft(
    sessionId: string,
    sessionExerciseId: string,
    draft: SessionExerciseDraft,
  ) {
    setSavingSessionExerciseIds((current) =>
      current.includes(sessionExerciseId)
        ? current
        : [...current, sessionExerciseId],
    );

    try {
      const session = await updateWorkoutSessionExerciseDetailsAction({
        reps: draft.reps,
        restSeconds: draft.restSeconds,
        sessionExerciseId,
        sessionId,
        sets: draft.sets,
        weight: parseWeightDraft(draft.weight),
      });
      delete rollbackSnapshotRef.current[sessionExerciseId];
      setActiveSession(session);
      setNotice({ kind: "success", text: copy.session.exerciseUpdated });
    } catch (error) {
      const rollbackExercise = rollbackSnapshotRef.current[sessionExerciseId];

      if (rollbackExercise) {
        setActiveSession((current) =>
          current
            ? {
                ...current,
                exercises: current.exercises.map((exercise) =>
                  exercise.id === sessionExerciseId ? rollbackExercise : exercise,
                ),
              }
            : current,
        );
        setSessionExerciseDrafts((current) => ({
          ...current,
          [sessionExerciseId]: toSessionExerciseDraft(rollbackExercise),
        }));
      }

      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setSavingSessionExerciseIds((current) =>
        current.filter((id) => id !== sessionExerciseId),
      );
    }
  }

  function handleSessionExerciseFieldChange(
    sessionExerciseId: string,
    field: keyof SessionExerciseDraft,
    value: number | string,
  ) {
    if (!activeSession || isMutating) {
      return;
    }

    const currentExercise = activeSession.exercises.find(
      (exercise) => exercise.id === sessionExerciseId,
    );

    if (!currentExercise) {
      return;
    }

    rollbackSnapshotRef.current[sessionExerciseId] =
      rollbackSnapshotRef.current[sessionExerciseId] ?? { ...currentExercise };

    const nextDraft = {
      ...(sessionExerciseDrafts[sessionExerciseId] ?? toSessionExerciseDraft(currentExercise)),
      [field]: value,
    } as SessionExerciseDraft;

    setSessionExerciseDrafts((current) => ({
      ...current,
      [sessionExerciseId]: nextDraft,
    }));

    setActiveSession((current) =>
      current
        ? {
            ...current,
            exercises: current.exercises.map((exercise) =>
              exercise.id === sessionExerciseId
                ? {
                    ...exercise,
                    reps: field === "reps" ? Number(value) : nextDraft.reps,
                    restSeconds:
                      field === "restSeconds" ? Number(value) : nextDraft.restSeconds,
                    sets: field === "sets" ? Number(value) : nextDraft.sets,
                    weight:
                      field === "weight"
                        ? parseWeightDraft(String(value))
                        : parseWeightDraft(nextDraft.weight),
                  }
                : exercise,
            ),
          }
        : current,
    );

    if (editTimersRef.current[sessionExerciseId]) {
      clearTimeout(editTimersRef.current[sessionExerciseId]);
    }

    editTimersRef.current[sessionExerciseId] = setTimeout(() => {
      void persistSessionExerciseDraft(activeSession.id, sessionExerciseId, nextDraft);
    }, 450);
  }

  async function handleFinishWorkout() {
    if (isMutating) {
      return;
    }

    if (!activeSession) {
      setNotice({ kind: "info", text: copy.session.startFirst });
      return;
    }

    if (activeSessionExercises.length === 0) {
      setNotice({ kind: "info", text: copy.addExerciseBeforeLogging });
      return;
    }

    if (completedExerciseCount === 0) {
      setNotice({ kind: "info", text: copy.noExercisesCompleted });
      return;
    }

    setPendingMutation({ type: "finish-workout" });
    setNotice(null);
    clearSessionEditTimers();

    try {
      const workoutLog = await finishWorkoutSessionAction(activeSession.id);
      setLogs((currentLogs) => [workoutLog, ...currentLogs]);
      setActiveSession(null);
      setNotice({ kind: "success", text: copy.session.finished });
    } catch (error) {
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setPendingMutation(null);
    }
  }

  async function handleCancelWorkout() {
    if (isMutating) {
      return;
    }

    if (!activeSession) {
      setNotice({ kind: "info", text: copy.session.startFirst });
      return;
    }

    setPendingMutation({ type: "cancel-workout" });
    setNotice(null);
    clearSessionEditTimers();

    try {
      await cancelWorkoutSessionAction(activeSession.id);
      setActiveSession(null);
      setNotice({ kind: "success", text: copy.session.cancelled });
    } catch (error) {
      setNotice({
        kind: "error",
        text: getErrorMessage(error, copy.fallbackError),
      });
    } finally {
      setPendingMutation(null);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
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

        <div className="grid grid-cols-3 overflow-hidden rounded-[1.35rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] text-center shadow-[var(--landing-shadow-soft)] sm:min-w-[420px] sm:rounded-[28px]">
          <Metric label={copy.metrics.results} value={results.length} />
          <Metric label={copy.metrics.plans} value={plans.length} />
          <Metric
            label={copy.metrics.inPlan}
            value={activePlanExercises.length}
          />
        </div>
      </section>

      {notice ? (
        <StatusNotice aria-live="polite" className="mt-6" variant={notice.kind}>
          {notice.text}
        </StatusNotice>
      ) : null}

      <section className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 2xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <div className="space-y-5 sm:space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-[var(--landing-border)] bg-[var(--landing-surface)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>{copy.catalog.title}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {copy.catalog.description}
                  </p>
                </div>
                <form
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 lg:max-w-md"
                  onSubmit={handleSearch}
                >
                  <Input
                    aria-label={copy.catalog.searchAria}
                    disabled={catalogState === "loading"}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={copy.catalog.searchPlaceholder}
                    value={query}
                  />
                  <Button disabled={catalogState === "loading"} type="submit">
                    {catalogState === "loading" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Search className="size-4" />
                    )}
                    {copy.catalog.searchButton}
                  </Button>
                </form>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {results.length === 0 && catalogState !== "loading" ? (
                <div className="p-6 text-sm text-[var(--landing-text-muted)]">
                  {copy.catalog.noResults}
                </div>
              ) : results.length === 0 && catalogState === "loading" ? (
                <div className="flex items-center gap-2 p-6 text-sm text-[var(--landing-text-muted)]">
                  <Loader2 className="size-4 animate-spin" />
                  {copy.catalog.loading}
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-[var(--landing-text-muted)]">
                      {copy.catalog.showing(visibleResults.length, results.length)}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleResults.map((exercise) => (
                      <ExerciseResultCard
                        active={selectedExercise?.id === exercise.id}
                        commonCopy={commonCopy}
                        copy={copy}
                        exercise={exercise}
                        key={exercise.id}
                        onSelect={handleSelectExercise}
                      />
                    ))}
                  </div>

                  {hasMoreResults ? (
                    <div className="border-t border-[var(--landing-border)] pt-4">
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() =>
                          setVisibleResultsCount((current) =>
                            Math.min(current + CATALOG_VISIBLE_BATCH_SIZE, results.length),
                          )
                        }
                        type="button"
                        variant="secondary"
                      >
                        {copy.catalog.showMore}
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>

          <ExerciseInspector
            commonCopy={commonCopy}
            config={exerciseConfig}
            copy={copy}
            detailState={detailState}
            exercise={selectedExercise}
            onAddExercise={handleAddExercise}
            onConfigChange={setExerciseConfig}
            mutationPending={isMutating}
            planReady={Boolean(activePlan)}
            saving={pendingMutation?.type === "add-exercise"}
          />
        </div>

        <WorkoutBuilder
          activePlan={activePlan}
          activeSession={activeSession}
          activeSessionExercises={activeSessionExercises}
          completedExerciseCount={completedExerciseCount}
          commonCopy={commonCopy}
          copy={copy}
          logs={logs}
          planDescription={planDescription}
          planName={planName}
          cancellingWorkout={pendingMutation?.type === "cancel-workout"}
          creatingPlan={pendingMutation?.type === "create-plan"}
          createPlanSheetOpen={createPlanSheetOpen}
          finishingWorkout={pendingMutation?.type === "finish-workout"}
          mutationPending={isMutating}
          pendingRemovalId={
            pendingMutation?.type === "remove-exercise"
              ? pendingMutation.exerciseId
              : null
          }
          plans={plans}
          sessionExerciseDrafts={sessionExerciseDrafts}
          savingSessionExerciseIds={savingSessionExerciseIds}
          sortedPlanExercises={sortedPlanExercises}
          startingWorkout={pendingMutation?.type === "start-workout"}
          workoutSessionPlanId={activeSession?.workoutPlanId ?? null}
          onCreatePlan={handleCreatePlan}
          onCreatePlanSheetOpenChange={setCreatePlanSheetOpen}
          onCancelWorkout={handleCancelWorkout}
          onFinishWorkout={handleFinishWorkout}
          onPlanDescriptionChange={setPlanDescription}
          onPlanNameChange={setPlanName}
          onSessionExerciseFieldChange={handleSessionExerciseFieldChange}
          onToggleExerciseCompletion={handleExerciseCompletionToggle}
          onRemoveExercise={handleRemoveExercise}
          onSelectPlan={setActivePlan}
          onStartWorkout={handleStartWorkout}
          remainingExerciseCount={remainingExerciseCount}
        />
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-[var(--landing-border)] px-4 py-4 last:border-r-0">
      <p className="text-xl font-semibold tracking-tight sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--landing-text-muted)] sm:text-[11px] sm:tracking-[0.18em]">
        {label}
      </p>
    </div>
  );
}

function ExerciseResultCard({
  active,
  commonCopy,
  copy,
  exercise,
  onSelect,
}: {
  active: boolean;
  commonCopy: CommonCopy;
  copy: FitnessCopy;
  exercise: ExerciseSummary;
  onSelect: (exercise: ExerciseSummary) => void;
}) {
  return (
    <button
      className={cn(
        "group flex min-h-0 flex-row gap-3 rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] p-3 text-left text-[var(--landing-text)] shadow-[var(--landing-chip-inset-shadow)] backdrop-blur transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--landing-border-strong)] hover:shadow-[var(--landing-hover-shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent-strong)] sm:min-h-[320px] sm:flex-col sm:gap-0 sm:rounded-[24px] sm:p-4",
        active &&
          "border-[var(--landing-border-strong)] ring-1 ring-inset ring-[var(--landing-border-strong)]",
      )}
      onClick={() => onSelect(exercise)}
      type="button"
    >
      <ExerciseMedia
        className="h-24 w-24 shrink-0 sm:h-auto sm:w-auto sm:shrink sm:aspect-[4/3]"
        exercise={exercise}
        mode="thumbnail"
      />
      <div className="flex flex-1 flex-col justify-between gap-3 sm:mt-4 sm:gap-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-tight tracking-tight sm:text-lg">
              {exercise.name}
            </h3>
            {!exercise.imageUrl && (exercise.gifUrl || exercise.videoUrl) ? (
              <Play className="mt-1 size-4 shrink-0 text-[var(--landing-accent)]" />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">
              {getMetaValue(exercise.bodyPart, commonCopy.notSpecified)}
            </Badge>
            <Badge variant="muted">
              {getMetaValue(exercise.target, commonCopy.notSpecified)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-[var(--landing-text-muted)]">
          {copy.catalog.equipment(
            getMetaValue(exercise.equipment, commonCopy.notSpecified),
          )}
        </p>
      </div>
    </button>
  );
}

function ExerciseInspector({
  commonCopy,
  config,
  copy,
  detailState,
  exercise,
  mutationPending,
  onAddExercise,
  onConfigChange,
  planReady,
  saving,
}: {
  commonCopy: CommonCopy;
  config: ExerciseConfig;
  copy: FitnessCopy;
  detailState: LoadState;
  exercise: ExerciseDetail | null;
  mutationPending: boolean;
  onAddExercise: () => void;
  onConfigChange: (config: ExerciseConfig) => void;
  planReady: boolean;
  saving: boolean;
}) {
  if (!exercise) {
    return (
      <Card className="border-dashed bg-[var(--landing-surface)] shadow-none">
        <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-3 p-8 text-center">
          <Activity className="size-8 text-[var(--landing-accent)]" />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              {copy.inspector.emptyTitle}
            </h2>
            <p className="max-w-md text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.inspector.emptyDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const bodyPart = getMetaValue(exercise.bodyPart, commonCopy.notSpecified);
  const target = getMetaValue(exercise.target, commonCopy.notSpecified);
  const equipment = getMetaValue(exercise.equipment, commonCopy.notSpecified);
  const muscleGroups = Array.from(
    new Set(
      [exercise.bodyPart, exercise.target, ...exercise.secondaryMuscles]
        .map((item) => item?.trim())
        .filter((item): item is string => Boolean(item)),
    ),
  );
  const metadata = [
    {
      label: copy.inspector.difficulty,
      value: getMetaValue(exercise.difficulty, copy.inspector.difficultyFallback),
    },
    {
      label: copy.inspector.category,
      value: getMetaValue(exercise.category, copy.inspector.categoryFallback),
    },
    {
      label: copy.inspector.equipment,
      value: equipment,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4 border-b border-[var(--landing-border)] bg-[var(--landing-surface-alt)] p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <ExerciseMedia
            className="aspect-[4/3]"
            exercise={exercise}
            large
            mode="detail"
          />

          <div className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] p-4 shadow-[var(--landing-chip-inset-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-faint)]">
              {copy.inspector.contextTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.inspector.contextDescription(bodyPart, target, equipment)}
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] p-4 shadow-[var(--landing-chip-inset-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-faint)]">
              {copy.inspector.muscleGroupsTitle}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(muscleGroups.length > 0 ? muscleGroups : [commonCopy.notSpecified]).map((muscle) => (
                <Badge key={muscle} variant="muted" className="normal-case tracking-normal">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] p-4 shadow-[var(--landing-chip-inset-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-faint)]">
              {copy.inspector.metadataTitle}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {metadata.map((item) => (
                <DetailMetaBlock
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
          <div className="space-y-3">
            <Badge>{copy.inspector.selected}</Badge>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {exercise.name}
              </h2>
              <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                {[bodyPart, target, equipment].join(commonCopy.slashSeparator)}
              </p>
            </div>
          </div>

          <section className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 shadow-[var(--landing-chip-inset-shadow)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--landing-text)]">
                {copy.inspector.executionTitle}
              </p>
              {detailState === "loading" ? (
                <span className="flex items-center gap-2 text-xs font-medium text-[var(--landing-text-muted)]">
                  <Loader2 className="size-3.5 animate-spin" />
                  {copy.inspector.loadingDetails}
                </span>
              ) : null}
            </div>

            {exercise.instructions.length > 0 ? (
              <div className="mt-3">
                <Disclosure
                  className="sm:hidden"
                  summary={copy.inspector.formNotes}
                >
                  <InstructionList exercise={exercise} />
                </Disclosure>
                <div className="hidden sm:block">
                  <InstructionList exercise={exercise} />
                </div>
              </div>
            ) : null}
          </section>

          <section className="space-y-4 rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 shadow-[var(--landing-chip-inset-shadow)]">
            <p className="text-sm font-semibold text-[var(--landing-text)]">
              {copy.inspector.setupTitle}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <NumberField
                label={copy.inspector.sets}
                min={1}
                onChange={(sets) => onConfigChange({ ...config, sets })}
                value={config.sets}
              />
              <NumberField
                label={copy.inspector.reps}
                min={1}
                onChange={(reps) => onConfigChange({ ...config, reps })}
                value={config.reps}
              />
              <NumberField
                label={copy.inspector.restSeconds}
                min={0}
                onChange={(restSeconds) =>
                  onConfigChange({ ...config, restSeconds })
                }
                value={config.restSeconds}
              />
            </div>

            <label className="block space-y-2 text-sm font-medium">
              <span>{copy.inspector.notes}</span>
              <textarea
                className="min-h-20 w-full resize-none rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-3 text-sm outline-none placeholder:text-[var(--landing-text-faint)] focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)] sm:min-h-24"
                onChange={(event) =>
                  onConfigChange({ ...config, notes: event.target.value })
                }
                placeholder={copy.inspector.notesPlaceholder}
                value={config.notes}
              />
            </label>

            <Button
              className="w-full sm:w-auto"
              disabled={!planReady || !exercise.internalId || mutationPending}
              onClick={onAddExercise}
              size="lg"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              {copy.inspector.addToWorkout}
            </Button>
          </section>
        </div>
      </div>
    </Card>
  );
}

function DetailMetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--landing-text-faint)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--landing-text)]">
        {value}
      </p>
    </div>
  );
}

function WorkoutBuilder({
  activePlan,
  activeSession,
  activeSessionExercises,
  completedExerciseCount,
  cancellingWorkout,
  commonCopy,
  copy,
  createPlanSheetOpen,
  creatingPlan,
  finishingWorkout,
  logs,
  mutationPending,
  onCreatePlan,
  onCreatePlanSheetOpenChange,
  onCancelWorkout,
  onFinishWorkout,
  onPlanDescriptionChange,
  onPlanNameChange,
  onSessionExerciseFieldChange,
  onToggleExerciseCompletion,
  onRemoveExercise,
  onSelectPlan,
  onStartWorkout,
  pendingRemovalId,
  planDescription,
  planName,
  plans,
  remainingExerciseCount,
  sessionExerciseDrafts,
  savingSessionExerciseIds,
  sortedPlanExercises,
  startingWorkout,
  workoutSessionPlanId,
}: {
  activePlan: WorkoutPlan | null;
  activeSession: WorkoutSession | null;
  activeSessionExercises: WorkoutSession["exercises"];
  completedExerciseCount: number;
  cancellingWorkout: boolean;
  commonCopy: CommonCopy;
  copy: FitnessCopy;
  createPlanSheetOpen: boolean;
  creatingPlan: boolean;
  finishingWorkout: boolean;
  logs: WorkoutLog[];
  mutationPending: boolean;
  onCreatePlan: (event: FormEvent<HTMLFormElement>) => void;
  onCreatePlanSheetOpenChange: (open: boolean) => void;
  onCancelWorkout: () => void;
  onFinishWorkout: () => void;
  onPlanDescriptionChange: (value: string) => void;
  onPlanNameChange: (value: string) => void;
  onSessionExerciseFieldChange: (
    exerciseId: string,
    field: keyof SessionExerciseDraft,
    value: number | string,
  ) => void;
  onToggleExerciseCompletion: (exerciseId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onSelectPlan: (plan: WorkoutPlan) => void;
  onStartWorkout: () => void;
  pendingRemovalId: string | null;
  planDescription: string;
  planName: string;
  plans: WorkoutPlan[];
  remainingExerciseCount: number;
  sessionExerciseDrafts: Record<string, SessionExerciseDraft>;
  savingSessionExerciseIds: string[];
  sortedPlanExercises: WorkoutPlan["exercises"];
  startingWorkout: boolean;
  workoutSessionPlanId: string | null;
}) {
  return (
    <aside className="space-y-5 sm:space-y-6 2xl:sticky 2xl:top-28 2xl:self-start">
      <div className="sm:hidden">
        <MobileSheet
          description={copy.builder.description}
          open={createPlanSheetOpen}
          title={copy.builder.title}
          trigger={
            <Button className="w-full" size="lg">
              <Plus className="size-4" />
              {copy.builder.savePlan}
            </Button>
          }
          onOpenChange={onCreatePlanSheetOpenChange}
        >
          <WorkoutPlanForm
            copy={copy}
            creatingPlan={creatingPlan}
            guided
            mutationPending={mutationPending}
            planDescription={planDescription}
            planName={planName}
            onCreatePlan={onCreatePlan}
            onPlanDescriptionChange={onPlanDescriptionChange}
            onPlanNameChange={onPlanNameChange}
          />
        </MobileSheet>
      </div>

      <Card className="hidden sm:block">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]">
              <Save className="size-5" />
            </div>
            <div>
              <CardTitle>{copy.builder.title}</CardTitle>
              <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
                {copy.builder.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WorkoutPlanForm
            copy={copy}
            creatingPlan={creatingPlan}
            mutationPending={mutationPending}
            planDescription={planDescription}
            planName={planName}
            onCreatePlan={onCreatePlan}
            onPlanDescriptionChange={onPlanDescriptionChange}
            onPlanNameChange={onPlanNameChange}
          />
        </CardContent>
      </Card>

      {plans.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {plans.map((plan) => (
            <button
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0",
                activePlan?.id === plan.id
                  ? "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]"
                  : "border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text-muted)] hover:bg-[var(--landing-surface-strong)]",
              )}
              key={plan.id}
              disabled={
                mutationPending ||
                (workoutSessionPlanId !== null && workoutSessionPlanId !== plan.id)
              }
              onClick={() => onSelectPlan(plan)}
              type="button"
            >
              {plan.name}
            </button>
          ))}
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--landing-border)] bg-[var(--landing-surface)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>
                {activeSession
                  ? copy.session.activeTitle(activePlan?.name ?? copy.builder.noWorkout)
                  : activePlan?.name ?? copy.builder.noWorkout}
              </CardTitle>
              <p className="mt-2 text-sm leading-6 text-[var(--landing-text-muted)]">
                {activeSession
                  ? copy.session.startedAt(
                      new Date(activeSession.startedAt).toLocaleString(),
                    )
                  : activePlan?.description || copy.builder.noWorkoutDescription}
              </p>
            </div>
            <Badge variant={activeSession ? "success" : "muted"}>
              {activeSession ? copy.session.inProgress : sortedPlanExercises.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {sortedPlanExercises.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 text-sm leading-6 text-[var(--landing-text-muted)]">
              {activePlan
                ? copy.builder.emptyPlan
                : copy.builder.noWorkoutDescription}
            </div>
          ) : (
            <>
              <div className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-3 sm:rounded-[1.5rem]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--landing-text)]">
                    {copy.builder.progressCompleted(
                      completedExerciseCount,
                      activeSessionExercises.length || sortedPlanExercises.length,
                    )}
                  </p>
                  {activeSession ? (
                    <span className="text-xs font-medium text-[var(--landing-text-muted)]">
                      {copy.session.liveLabel}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--landing-surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--landing-accent)] transition-[width] duration-300"
                    style={{
                      width: `${Math.max(
                        (((activeSessionExercises.length || sortedPlanExercises.length) === 0
                          ? 0
                          : completedExerciseCount /
                            (activeSessionExercises.length || sortedPlanExercises.length)) *
                          100),
                        0,
                      )}%`,
                    }}
                  />
                </div>
                <p className="mt-3 text-sm text-[var(--landing-text-muted)]">
                  {copy.builder.progressRemaining(remainingExerciseCount)}
                </p>
              </div>
              {!activeSession ? (
                <div className="space-y-3">
                  <div className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4 text-sm text-[var(--landing-text-muted)]">
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-[var(--landing-accent)]" />
                      <p>{copy.session.resumeHint}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    disabled={mutationPending || !activePlan || sortedPlanExercises.length === 0}
                    onClick={onStartWorkout}
                    size="lg"
                    type="button"
                  >
                    {startingWorkout ? <Loader2 className="size-4 animate-spin" /> : <Activity className="size-4" />}
                    {copy.session.startAction}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    className="flex-1"
                    disabled={
                      mutationPending ||
                      activeSessionExercises.length === 0 ||
                      savingSessionExerciseIds.length > 0
                    }
                    onClick={onFinishWorkout}
                    type="button"
                  >
                    {finishingWorkout ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                    {copy.session.finishAction}
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={mutationPending || savingSessionExerciseIds.length > 0}
                    onClick={onCancelWorkout}
                    type="button"
                    variant="ghost"
                  >
                    {cancellingWorkout ? <Loader2 className="size-4 animate-spin" /> : <Circle className="size-4" />}
                    {copy.session.cancelAction}
                  </Button>
                </div>
              )}
              {activeSession
                ? activeSessionExercises.map((item, index) => {
                    const completed = item.completed;

                    return (
                      <div
                        className={cn(
                          "rounded-[1.25rem] border bg-[var(--landing-surface)] p-4 transition-[border-color,background-color,box-shadow] duration-200 sm:rounded-[24px]",
                          completed
                            ? "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)]/40 shadow-[var(--landing-chip-inset-shadow)]"
                            : "border-[var(--landing-border)]",
                        )}
                        key={item.id}
                      >
                        <div className="flex items-start gap-3">
                          <ExerciseMedia
                            className="h-20 w-20 shrink-0 rounded-[1rem]"
                            exercise={item}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--landing-text-muted)]">
                                  {String(index + 1).padStart(2, "0")}
                                </p>
                                <h3 className="mt-1 font-semibold tracking-tight">
                                  {item.name}
                                </h3>
                                <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
                                  {[
                                    getMetaValue(
                                      item.bodyPart,
                                      commonCopy.notSpecified,
                                    ),
                                    getMetaValue(
                                      item.target,
                                      commonCopy.notSpecified,
                                    ),
                                  ].join(commonCopy.slashSeparator)}
                                </p>
                              </div>
                              <button
                                aria-pressed={completed}
                                className={cn(
                                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-medium transition",
                                  completed
                                    ? "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]"
                                    : "border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] text-[var(--landing-text-muted)]",
                                )}
                                disabled={
                                  mutationPending ||
                                  savingSessionExerciseIds.includes(item.id)
                                }
                                onClick={() => onToggleExerciseCompletion(item.id)}
                                type="button"
                              >
                                {savingSessionExerciseIds.includes(item.id) ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : completed ? (
                                  <CheckCircle2 className="size-4" />
                                ) : (
                                  <Circle className="size-4" />
                                )}
                                {completed
                                  ? copy.builder.markComplete
                                  : copy.builder.markPending}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <NumberField
                            label={copy.builder.sets}
                            min={1}
                            onChange={(value) =>
                              onSessionExerciseFieldChange(item.id, "sets", value)
                            }
                            value={sessionExerciseDrafts[item.id]?.sets ?? item.sets ?? 1}
                          />
                          <NumberField
                            label={copy.builder.reps}
                            min={1}
                            onChange={(value) =>
                              onSessionExerciseFieldChange(item.id, "reps", value)
                            }
                            value={sessionExerciseDrafts[item.id]?.reps ?? item.reps ?? 1}
                          />
                          <NumberField
                            label={copy.builder.rest}
                            min={0}
                            onChange={(value) =>
                              onSessionExerciseFieldChange(item.id, "restSeconds", value)
                            }
                            value={
                              sessionExerciseDrafts[item.id]?.restSeconds ??
                              item.restSeconds ??
                              0
                            }
                          />
                          <WeightField
                            label={copy.builder.weight}
                            onChange={(value) =>
                              onSessionExerciseFieldChange(item.id, "weight", value)
                            }
                            value={
                              sessionExerciseDrafts[item.id]?.weight ??
                              formatWeightDraft(item.weight)
                            }
                          />
                        </div>
                        {savingSessionExerciseIds.includes(item.id) ? (
                          <p className="mt-3 text-xs font-medium text-[var(--landing-text-muted)]">
                            {copy.session.savingExercise}
                          </p>
                        ) : null}
                        {item.notes ? (
                          <>
                            <Disclosure className="mt-3 sm:hidden" summary={copy.builder.notes}>
                              <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                                {item.notes}
                              </p>
                            </Disclosure>
                            <p className="mt-3 hidden text-sm leading-6 text-[var(--landing-text-muted)] sm:block">
                              {item.notes}
                            </p>
                          </>
                        ) : null}
                      </div>
                    );
                  })
                : sortedPlanExercises.map((item, index) => (
                    <div
                      className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 sm:rounded-[24px]"
                      key={item.id}
                    >
                      <div className="flex items-start gap-3">
                        <ExerciseMedia
                          className="h-20 w-20 shrink-0 rounded-[1rem]"
                          exercise={item.exercise}
                          mode="thumbnail"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--landing-text-muted)]">
                                {String(index + 1).padStart(2, "0")}
                              </p>
                              <h3 className="mt-1 font-semibold tracking-tight">
                                {item.exercise.name}
                              </h3>
                              <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
                                {[
                                  getMetaValue(
                                    item.exercise.bodyPart,
                                    commonCopy.notSpecified,
                                  ),
                                  getMetaValue(
                                    item.exercise.target,
                                    commonCopy.notSpecified,
                                  ),
                                ].join(commonCopy.slashSeparator)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                        <MiniStat label={copy.builder.sets} value={item.sets ?? "-"} />
                        <MiniStat label={copy.builder.reps} value={item.reps ?? "-"} />
                        <MiniStat
                          label={copy.builder.rest}
                          value={item.restSeconds ? `${item.restSeconds}s` : "-"}
                        />
                      </div>
                      {item.notes ? (
                        <>
                          <Disclosure className="mt-3 sm:hidden" summary={copy.builder.notes}>
                            <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                              {item.notes}
                            </p>
                          </Disclosure>
                          <p className="mt-3 hidden text-sm leading-6 text-[var(--landing-text-muted)] sm:block">
                            {item.notes}
                          </p>
                        </>
                      ) : null}
                      <Button
                        aria-label={`Remove ${item.exercise.name}`}
                        className="mt-3 w-full sm:w-auto"
                        disabled={mutationPending}
                        onClick={() => onRemoveExercise(item.id)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        {pendingRemovalId === item.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  ))}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--landing-border)] bg-[var(--landing-surface)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{copy.logs.title}</CardTitle>
              <p className="mt-2 text-sm leading-6 text-[var(--landing-text-muted)]">
                {copy.logs.description}
              </p>
            </div>
            <Badge variant="muted">{logs.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {logs.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 text-sm leading-6 text-[var(--landing-text-muted)]">
              <p className="font-medium text-[var(--landing-text)]">
                {copy.logs.empty}
              </p>
              <p className="mt-1 text-[var(--landing-text-soft)]">
                {copy.logs.emptyHint}
              </p>
            </div>
          ) : (
            logs.slice(0, 5).map((log) => (
              <Link
                className="block rounded-[20px] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 text-sm transition hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-bg-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-border-strong)]"
                href={`/dashboard/fitness/history/${log.id}`}
                key={log.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--landing-text)]">
                      {log.workoutName ?? copy.builder.noWorkout}
                    </p>
                    <p className="mt-1 text-[var(--landing-text-muted)]">
                      {copy.logs.completedAt(
                        new Date(log.completedAt).toLocaleString(),
                      )}
                    </p>
                  </div>
                  <Badge variant="muted">{copy.logs.detailCta}</Badge>
                </div>
                <p className="mt-3 text-[var(--landing-text)]">
                  {copy.logs.progress(
                    log.exercises.filter((exercise) => exercise.completed).length,
                    log.exercises.length,
                  )}
                </p>
                <p className="mt-1 text-[var(--landing-text-muted)]">
                  {copy.logs.skippedCount(
                    log.exercises.filter((exercise) => !exercise.completed).length,
                  )}
                </p>
                <p className="mt-1 text-[var(--landing-text-muted)]">
                  {copy.logs.exerciseCount(log.exercises.length)}
                </p>
                {log.durationMinutes !== null ? (
                  <p className="mt-1 text-[var(--landing-text-muted)]">
                    {copy.detail.duration(log.durationMinutes)}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {log.exercises.slice(0, 3).map((exercise, index) => (
                    <Badge key={`${log.id}-${exercise.name}-${index}`} variant="muted">
                      {exercise.name}
                    </Badge>
                  ))}
                </div>
                {log.exercises.length > 0 ? (
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--landing-text-faint)]">
                    {copy.logs.summaryLabel}
                  </p>
                ) : null}
                <div className="mt-2 space-y-2">
                  {log.exercises.slice(0, 2).map((exercise) => (
                    <div
                      className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-3 py-3"
                      key={`${log.id}-${exercise.name}-${exercise.sortOrder ?? 0}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[var(--landing-text)]">
                            {exercise.name}
                          </p>
                          <p className="mt-1 text-xs text-[var(--landing-text-muted)]">
                            {[
                              `${copy.builder.sets}: ${exercise.setsCompleted ?? "-"}`,
                              `${copy.builder.reps}: ${exercise.repsCompleted ?? "-"}`,
                              `${copy.builder.rest}: ${
                                exercise.restSeconds ? `${exercise.restSeconds}s` : "-"
                              }`,
                            ].join(" • ")}
                          </p>
                        </div>
                        <Badge variant={exercise.completed ? "success" : "muted"}>
                          {exercise.completed
                            ? copy.logs.completedStatus
                            : copy.logs.skippedStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

function ExerciseMedia({
  className,
  exercise,
  large = false,
  mode = "thumbnail",
}: {
  className?: string;
  exercise: {
    gifUrl?: string | null;
    imageUrl?: string | null;
    name: string;
    resolvedMedia?: ExerciseResolvedMedia | null;
    videoUrl?: string | null;
  };
  large?: boolean;
  mode?: "detail" | "thumbnail";
}) {
  const media =
    mode === "detail"
      ? resolveExerciseDetailMedia(exercise)
      : resolveExerciseThumbnailMedia(exercise);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-[var(--landing-border)] bg-[var(--landing-surface-alt)]",
        className,
      )}
    >
      {media?.type === "image" || media?.type === "gif" ? (
        <Image
          alt={exercise.name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          src={media.url}
          unoptimized
        />
      ) : media?.type === "video" ? (
        <video
          autoPlay={mode === "detail"}
          className="h-full w-full object-cover"
          controls={large}
          loop
          muted
          playsInline
          poster={exercise.imageUrl ?? undefined}
          preload={mode === "detail" ? "metadata" : "none"}
          src={media.url}
        />
      ) : exercise.gifUrl || exercise.videoUrl ? (
        <div className="flex h-full min-h-44 items-center justify-center text-[var(--landing-accent)]">
          <Play className="size-6" />
        </div>
      ) : (
        <div className="flex h-full min-h-44 items-center justify-center text-[var(--landing-text-muted)]">
          <Dumbbell className="size-8" />
        </div>
      )}
    </div>
  );
}

function resolveExerciseThumbnailMedia(exercise: {
  imageUrl?: string | null;
}): ExerciseResolvedMedia | null {
  return exercise.imageUrl ? { type: "image", url: exercise.imageUrl } : null;
}

function resolveExerciseDetailMedia(exercise: {
  gifUrl?: string | null;
  imageUrl?: string | null;
  resolvedMedia?: ExerciseResolvedMedia | null;
  videoUrl?: string | null;
}): ExerciseResolvedMedia | null {
  if (exercise.resolvedMedia?.url) {
    return exercise.resolvedMedia;
  }

  if (exercise.videoUrl && exercise.gifUrl) {
    return { type: "video", url: exercise.videoUrl };
  }
  if (exercise.gifUrl) {
    return { type: "gif", url: exercise.gifUrl };
  }
  if (exercise.videoUrl) {
    return { type: "video", url: exercise.videoUrl };
  }
  if (exercise.imageUrl) {
    return { type: "image", url: exercise.imageUrl };
  }

  return null;
}

function NumberField({
  label,
  min,
  onChange,
  value,
}: {
  label: string;
  min: number;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      <Input
        min={min}
        onChange={(event) =>
          onChange(Math.max(min, Number(event.target.value) || min))
        }
        type="number"
        value={value}
      />
    </label>
  );
}

function WeightField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      <Input
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        placeholder="0"
        type="text"
        value={value}
      />
    </label>
  );
}

function InstructionList({ exercise }: { exercise: ExerciseDetail }) {
  return (
    <ol className="space-y-2 text-sm leading-6 text-[var(--landing-text-muted)]">
      {exercise.instructions.slice(0, 3).map((instruction, index) => (
        <li className="flex gap-3" key={`${exercise.id}-instruction-${index}`}>
          <span className="font-semibold text-[var(--landing-accent)]">
            {index + 1}
          </span>
          <span>{instruction}</span>
        </li>
      ))}
    </ol>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-[var(--landing-surface)] px-3 py-2">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function WorkoutPlanForm({
  copy,
  creatingPlan,
  guided = false,
  mutationPending,
  onCreatePlan,
  onPlanDescriptionChange,
  onPlanNameChange,
  planDescription,
  planName,
}: {
  copy: FitnessCopy;
  creatingPlan: boolean;
  guided?: boolean;
  mutationPending: boolean;
  onCreatePlan: (event: FormEvent<HTMLFormElement>) => void;
  onPlanDescriptionChange: (value: string) => void;
  onPlanNameChange: (value: string) => void;
  planDescription: string;
  planName: string;
}) {
  return (
    <form className="space-y-4" onSubmit={onCreatePlan}>
      <div
        className={
          guided
            ? "space-y-4 rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3"
            : "space-y-4"
        }
      >
        {guided ? <StepLabel index={1} title={copy.builder.planName} /> : null}
        <label className="block space-y-2 text-sm font-medium">
          <span>{copy.builder.planName}</span>
          <Input
            disabled={creatingPlan}
            onChange={(event) => onPlanNameChange(event.target.value)}
            required
            value={planName}
          />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{copy.builder.planDescription}</span>
          <Input
            disabled={creatingPlan}
            onChange={(event) => onPlanDescriptionChange(event.target.value)}
            value={planDescription}
          />
        </label>
      </div>
      <Button className="w-full" disabled={mutationPending} type="submit">
        {creatingPlan ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        {copy.builder.savePlan}
      </Button>
    </form>
  );
}

function StepLabel({ index, title }: { index: number; title: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-faint)]">
      {index.toString().padStart(2, "0")} / {title}
    </p>
  );
}
