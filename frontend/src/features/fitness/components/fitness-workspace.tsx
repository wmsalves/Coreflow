"use client";

import {
  Activity,
  Dumbbell,
  Loader2,
  Play,
  Plus,
  Save,
  Search,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import {
  addExerciseToWorkoutPlanAction,
  createWorkoutPlanAction,
  getExerciseDetailAction,
  listExerciseCatalogAction,
  logWorkoutAction,
  searchExerciseCatalogAction,
} from "@/features/fitness/actions";
import type {
  ExerciseConfig,
  ExerciseDetail,
  ExerciseSummary,
  WorkoutLog,
  WorkoutPlan,
} from "@/features/fitness/types";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { cn } from "@/lib/utils";

type LoadState = "idle" | "loading" | "error";
type FitnessCopy = (typeof dashboardCopy)["en"]["fitness"];
type CommonCopy = (typeof dashboardCopy)["en"]["common"];

const defaultConfig: ExerciseConfig = {
  notes: "",
  reps: 10,
  restSeconds: 90,
  sets: 3,
};

function getMetaValue(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

type FitnessWorkspaceProps = {
  initialExercises: ExerciseSummary[];
  initialLoadFailed: boolean;
  initialLogs: WorkoutLog[];
  initialPlans: WorkoutPlan[];
};

export function FitnessWorkspace({
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
  const [plans, setPlans] = useState<WorkoutPlan[]>(initialPlans);
  const [logs, setLogs] = useState<WorkoutLog[]>(initialLogs);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(
    initialPlans[0] ?? null,
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
  const [planState, setPlanState] = useState<LoadState>("idle");
  const [message, setMessage] = useState<string | null>(
    initialLoadFailed ? copy.initialLoadError : null,
  );

  const activePlanExercises = useMemo(
    () => activePlan?.exercises ?? [],
    [activePlan],
  );
  const selectedInternalId = selectedExercise?.internalId;

  async function runSearch(searchQuery: string) {
    setCatalogState("loading");
    setMessage(null);

    try {
      const loadedExercises = searchQuery.trim()
        ? await searchExerciseCatalogAction(searchQuery.trim())
        : await listExerciseCatalogAction();

      setResults(loadedExercises);
      setCatalogState("idle");
    } catch (error) {
      setCatalogState("error");
      setMessage(getErrorMessage(error, copy.fallbackError));
    }
  }

  const sortedPlanExercises = useMemo(
    () =>
      [...activePlanExercises].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      ),
    [activePlanExercises],
  );

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runSearch(query);
  }

  async function handleSelectExercise(exercise: ExerciseSummary) {
    setDetailState("loading");
    setMessage(null);

    try {
      const detail = await getExerciseDetailAction(exercise.id);
      setSelectedExercise(detail);
      setExerciseConfig(defaultConfig);
      setDetailState("idle");
    } catch (error) {
      setDetailState("error");
      setMessage(getErrorMessage(error, copy.fallbackError));
    }
  }

  async function handleCreatePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlanState("loading");
    setMessage(null);

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
      setPlanState("idle");
      setMessage(copy.planCreated);
    } catch (error) {
      setPlanState("error");
      setMessage(getErrorMessage(error, copy.fallbackError));
    }
  }

  async function handleAddExercise() {
    if (!activePlan || !selectedInternalId) {
      setMessage(copy.createPlanFirst);
      return;
    }

    setPlanState("loading");
    setMessage(null);

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
      setPlanState("idle");
      setMessage(copy.exerciseAdded);
    } catch (error) {
      setPlanState("error");
      setMessage(getErrorMessage(error, copy.fallbackError));
    }
  }

  async function handleLogWorkout() {
    if (!activePlan) {
      setMessage(copy.createPlanFirst);
      return;
    }

    if (activePlanExercises.length === 0) {
      setMessage(copy.addExerciseBeforeLogging);
      return;
    }

    setPlanState("loading");
    setMessage(null);

    try {
      const workoutLog = await logWorkoutAction(activePlan.id);

      setLogs((currentLogs) => [workoutLog, ...currentLogs]);
      setPlanState("idle");
      setMessage(copy.workoutLogged);
    } catch (error) {
      setPlanState("error");
      setMessage(getErrorMessage(error, copy.fallbackError));
    }
  }

  return (
    <>
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
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

        <div className="grid grid-cols-3 overflow-hidden rounded-[28px] border border-[var(--landing-border)] bg-[var(--landing-surface)] text-center shadow-[var(--landing-shadow-soft)] sm:min-w-[420px]">
          <Metric label={copy.metrics.results} value={results.length} />
          <Metric label={copy.metrics.plans} value={plans.length} />
          <Metric
            label={copy.metrics.inPlan}
            value={activePlanExercises.length}
          />
        </div>
      </section>

      {message ? (
        <div
          className={cn(
            "mt-6 rounded-[24px] border px-4 py-3 text-sm",
            planState === "error" ||
              catalogState === "error" ||
              detailState === "error"
              ? "border-[rgba(204,90,67,0.3)] bg-[rgba(204,90,67,0.08)] text-[var(--danger)]"
              : "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]",
          )}
        >
          {message}
        </div>
      ) : null}

      <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1.05fr)_420px]">
        <div className="space-y-6">
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
                  className="flex w-full gap-2 lg:max-w-md"
                  onSubmit={handleSearch}
                >
                  <Input
                    aria-label={copy.catalog.searchAria}
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
              ) : (
                <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                  {results.map((exercise) => (
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
            planReady={Boolean(activePlan)}
            saving={planState === "loading"}
          />
        </div>

        <WorkoutBuilder
          activePlan={activePlan}
          commonCopy={commonCopy}
          copy={copy}
          logs={logs}
          planDescription={planDescription}
          planName={planName}
          planState={planState}
          plans={plans}
          sortedPlanExercises={sortedPlanExercises}
          onCreatePlan={handleCreatePlan}
          onLogWorkout={handleLogWorkout}
          onPlanDescriptionChange={setPlanDescription}
          onPlanNameChange={setPlanName}
          onSelectPlan={setActivePlan}
        />
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-[var(--landing-border)] px-4 py-4 last:border-r-0">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--landing-text-muted)]">
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
        "group flex min-h-[320px] flex-col rounded-[24px] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] p-4 text-left text-[var(--landing-text)] shadow-[var(--landing-chip-inset-shadow)] backdrop-blur transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--landing-border-strong)] hover:shadow-[var(--landing-hover-shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent-strong)]",
        active &&
          "border-[var(--landing-border-strong)] ring-1 ring-inset ring-[var(--landing-border-strong)]",
      )}
      onClick={() => onSelect(exercise)}
      type="button"
    >
      <ExerciseMedia className="aspect-[4/3]" exercise={exercise} />
      <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight tracking-tight">
              {exercise.name}
            </h3>
            {!exercise.gifUrl && !exercise.imageUrl && exercise.videoUrl ? (
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

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.8fr)]">
        <div className="bg-[var(--landing-surface-alt)] p-4">
          <ExerciseMedia className="aspect-video" exercise={exercise} large />
        </div>
        <div className="space-y-6 p-6">
          <div className="space-y-3">
            <Badge>{copy.inspector.selected}</Badge>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                {exercise.name}
              </h2>
              <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                {[
                  getMetaValue(exercise.bodyPart, commonCopy.notSpecified),
                  getMetaValue(exercise.target, commonCopy.notSpecified),
                  getMetaValue(exercise.equipment, commonCopy.notSpecified),
                ].join(commonCopy.slashSeparator)}
              </p>
            </div>
          </div>

          {detailState === "loading" ? (
            <div className="flex items-center gap-2 text-sm text-[var(--landing-text-muted)]">
              <Loader2 className="size-4 animate-spin" />{" "}
              {copy.inspector.loadingDetails}
            </div>
          ) : null}

          {exercise.instructions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                {copy.inspector.formNotes}
              </p>
              <ol className="space-y-2 text-sm leading-6 text-[var(--landing-text-muted)]">
                {exercise.instructions.slice(0, 3).map((instruction, index) => (
                  <li
                    className="flex gap-3"
                    key={`${exercise.id}-instruction-${index}`}
                  >
                    <span className="font-semibold text-[var(--landing-accent)]">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
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
              className="min-h-24 w-full resize-none rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-3 text-sm outline-none placeholder:text-[var(--landing-text-faint)] focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)]"
              onChange={(event) =>
                onConfigChange({ ...config, notes: event.target.value })
              }
              placeholder={copy.inspector.notesPlaceholder}
              value={config.notes}
            />
          </label>

          <Button
            disabled={!planReady || !exercise.internalId || saving}
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
        </div>
      </div>
    </Card>
  );
}

function WorkoutBuilder({
  activePlan,
  commonCopy,
  copy,
  logs,
  onCreatePlan,
  onLogWorkout,
  onPlanDescriptionChange,
  onPlanNameChange,
  onSelectPlan,
  planDescription,
  planName,
  planState,
  plans,
  sortedPlanExercises,
}: {
  activePlan: WorkoutPlan | null;
  commonCopy: CommonCopy;
  copy: FitnessCopy;
  logs: WorkoutLog[];
  onCreatePlan: (event: FormEvent<HTMLFormElement>) => void;
  onLogWorkout: () => void;
  onPlanDescriptionChange: (value: string) => void;
  onPlanNameChange: (value: string) => void;
  onSelectPlan: (plan: WorkoutPlan) => void;
  planDescription: string;
  planName: string;
  planState: LoadState;
  plans: WorkoutPlan[];
  sortedPlanExercises: WorkoutPlan["exercises"];
}) {
  return (
    <aside className="space-y-6 2xl:sticky 2xl:top-28 2xl:self-start">
      <Card>
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
          <form className="space-y-4" onSubmit={onCreatePlan}>
            <label className="block space-y-2 text-sm font-medium">
              <span>{copy.builder.planName}</span>
              <Input
                onChange={(event) => onPlanNameChange(event.target.value)}
                required
                value={planName}
              />
            </label>
            <label className="block space-y-2 text-sm font-medium">
              <span>{copy.builder.planDescription}</span>
              <Input
                onChange={(event) =>
                  onPlanDescriptionChange(event.target.value)
                }
                value={planDescription}
              />
            </label>
            <Button
              className="w-full"
              disabled={planState === "loading"}
              type="submit"
            >
              {planState === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              {copy.builder.savePlan}
            </Button>
          </form>
        </CardContent>
      </Card>

      {plans.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {plans.map((plan) => (
            <button
              className={cn(
                "rounded-full border px-3 py-2 text-sm font-medium",
                activePlan?.id === plan.id
                  ? "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]"
                  : "border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text-muted)] hover:bg-[var(--landing-surface-strong)]",
              )}
              key={plan.id}
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
                {activePlan?.name ?? copy.builder.noWorkout}
              </CardTitle>
              <p className="mt-2 text-sm leading-6 text-[var(--landing-text-muted)]">
                {activePlan?.description || copy.builder.noWorkoutDescription}
              </p>
            </div>
            <Badge variant="muted">{sortedPlanExercises.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {sortedPlanExercises.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.builder.emptyPlan}
            </div>
          ) : (
            sortedPlanExercises.map((item, index) => (
              <div
                className="rounded-[24px] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4"
                key={item.id}
              >
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
                  <Dumbbell className="mt-1 size-4 shrink-0 text-[var(--landing-accent)]" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <MiniStat
                    label={copy.builder.sets}
                    value={item.sets ?? "-"}
                  />
                  <MiniStat
                    label={copy.builder.reps}
                    value={item.reps ?? "-"}
                  />
                  <MiniStat
                    label={copy.builder.rest}
                    value={item.restSeconds ? `${item.restSeconds}s` : "-"}
                  />
                </div>
                {item.notes ? (
                  <p className="mt-3 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {item.notes}
                  </p>
                ) : null}
              </div>
            ))
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
          <Button
            className="w-full"
            disabled={!activePlan || sortedPlanExercises.length === 0 || planState === "loading"}
            onClick={onLogWorkout}
            type="button"
            variant="secondary"
          >
            {copy.logs.logActivePlan}
          </Button>

          {logs.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.logs.empty}
            </div>
          ) : (
            logs.slice(0, 5).map((log) => (
              <div
                className="rounded-[20px] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 text-sm"
                key={log.id}
              >
                <p className="font-semibold text-[var(--landing-text)]">
                  {copy.logs.completedAt(new Date(log.completedAt).toLocaleString())}
                </p>
                <p className="mt-1 text-[var(--landing-text-muted)]">
                  {copy.logs.exerciseCount(log.exercises.length)}
                </p>
              </div>
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
}: {
  className?: string;
  exercise: Pick<ExerciseSummary, "gifUrl" | "imageUrl" | "name" | "videoUrl">;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-[var(--landing-border)] bg-[var(--landing-surface-alt)]",
        className,
      )}
    >
      {exercise.gifUrl || exercise.imageUrl ? (
        <Image
          alt={exercise.name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          src={exercise.gifUrl ?? exercise.imageUrl ?? ""}
          unoptimized
        />
      ) : exercise.videoUrl ? (
        <video
          className="h-full w-full object-cover"
          controls={large}
          muted
          playsInline
          src={exercise.videoUrl}
        />
      ) : (
        <div className="flex h-full min-h-44 items-center justify-center text-[var(--landing-text-muted)]">
          <Dumbbell className="size-8" />
        </div>
      )}
    </div>
  );
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
