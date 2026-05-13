"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { cn } from "@/lib/utils";

type DashboardOverviewProps = {
  snapshot: {
    metrics: Array<{
      key: "habitsToday" | "completionRate" | "longestStreak" | "modulesInProgress";
      value: string;
    }>;
    moduleCards: Array<{
      href: string;
      key: "fitness" | "focus" | "habits";
    }>;
    recentHabits: Array<{
      completedToday: boolean;
      completionsThisWeek: number;
      currentStreak: number;
      id: string;
      name: string;
    }>;
    todayView: {
      fitness: {
        activeWorkoutName: string | null;
        activeWorkoutProgress: {
          completedCount: number;
          remainingCount: number;
          totalCount: number;
        } | null;
        hasActiveWorkout: boolean;
        latestWorkoutProgress: {
          completedAt?: string;
          completedCount: number;
          logId?: string;
          remainingCount: number;
          skippedCount?: number;
          totalCount: number;
          workoutName?: string | null;
        } | null;
        planCount: number;
      };
      focus: {
        activeSessionTitle: string | null;
        completedSessions: number;
        hasActiveSession: boolean;
        nextSessionDueDate: string | null;
        nextSessionTitle: string | null;
        pendingSessions: number;
        todayFocusSeconds: number;
        weekFocusSeconds: number;
      };
      focusTimeTodaySeconds: number;
      habits: {
        completedCount: number;
        pendingCount: number;
        pendingNames: string[];
        totalCount: number;
      };
      isFirstRun: boolean;
      modulesInProgressCount: number;
      overallProgress: number;
      quickActions: Array<{
        href: string;
        key: "createHabit" | "openWorkoutBuilder" | "planFocusSession" | "startFocus";
      }>;
    };
  };
};

type RecommendedAction = {
  href: string;
  key: "createHabit" | "openWorkoutBuilder" | "planFocusSession" | "startFocus";
  reason: string;
};

type SystemSignalTone = "active" | "attention" | "clear" | "queued";

type SystemSignal = {
  href: string;
  key: "fitness" | "focus" | "habits";
  summary: string;
  title: string;
  tone: SystemSignalTone;
};

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value * 100)));
}

function progressPercentage(completed: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return clampProgress(completed / total);
}

function FirstRunStarter({
  copy,
}: {
  copy: (typeof dashboardCopy)["en"]["dashboard"];
}) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--landing-border-strong)] bg-[linear-gradient(180deg,var(--landing-surface),var(--landing-bg-elevated))] p-4 shadow-[var(--landing-chip-inset-shadow)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Badge variant="success">{copy.ftue.badge}</Badge>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
              {copy.ftue.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.ftue.description}
            </p>
          </div>
        </div>
        <Badge variant="muted">{copy.ftue.progress}</Badge>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {copy.ftue.starterRows.map((row) => (
          <Link
            className="group rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 py-4 transition hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-border-strong)]"
            href={row.href}
            key={row.title}
          >
            <p className="text-sm font-semibold text-[var(--landing-text)]">
              {row.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
              {row.description}
            </p>
            <span className="mt-3 inline-flex text-sm font-medium text-[var(--landing-accent)]">
              {row.action}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getRecommendedAction(
  snapshot: DashboardOverviewProps["snapshot"],
  copy: (typeof dashboardCopy)["en"]["dashboard"],
): RecommendedAction {
  if (snapshot.todayView.isFirstRun) {
    return {
      href: "/dashboard/habits",
      key: "createHabit",
      reason: copy.nextAction.reasons.firstRun,
    };
  }

  if (snapshot.todayView.focus.hasActiveSession) {
    return {
      href: "/dashboard/focus",
      key: "startFocus",
      reason: copy.nextAction.reasons.resumeFocus,
    };
  }

  if (snapshot.todayView.fitness.hasActiveWorkout) {
    return {
      href: "/dashboard/fitness",
      key: "openWorkoutBuilder",
      reason: copy.nextAction.reasons.resumeWorkout,
    };
  }

  if (snapshot.todayView.habits.pendingCount > 0) {
    return {
      href: "/dashboard/habits",
      key: "createHabit",
      reason: copy.nextAction.reasons.habitsPending(snapshot.todayView.habits.pendingCount),
    };
  }

  if (snapshot.todayView.focus.nextSessionTitle) {
    return {
      href: "/dashboard/focus",
      key: "planFocusSession",
      reason: copy.nextAction.reasons.nextFocus(snapshot.todayView.focus.nextSessionTitle),
    };
  }

  if (snapshot.todayView.fitness.planCount > 0) {
    return {
      href: "/dashboard/fitness",
      key: "openWorkoutBuilder",
      reason: copy.nextAction.reasons.readyWorkout,
    };
  }

  return {
    href: "/dashboard/habits",
    key: "createHabit",
    reason: copy.nextAction.reasons.firstStep,
  };
}

function getSystemSignals(
  snapshot: DashboardOverviewProps["snapshot"],
  copy: (typeof dashboardCopy)["en"]["dashboard"],
): SystemSignal[] {
  const habitsHref = snapshot.moduleCards.find((card) => card.key === "habits")?.href ?? "/dashboard/habits";
  const focusHref = snapshot.moduleCards.find((card) => card.key === "focus")?.href ?? "/dashboard/focus";
  const fitnessHref =
    snapshot.moduleCards.find((card) => card.key === "fitness")?.href ?? "/dashboard/fitness";

  return [
    {
      href: habitsHref,
      key: "habits",
      summary:
        snapshot.todayView.habits.totalCount === 0
          ? copy.moduleCards.habits.empty
          : snapshot.todayView.habits.pendingCount > 0
            ? copy.moduleCards.habits.pending(snapshot.todayView.habits.pendingCount)
            : copy.moduleCards.habits.ready,
      title: copy.moduleCards.habits.title,
      tone:
        snapshot.todayView.habits.totalCount === 0
          ? "queued"
          : snapshot.todayView.habits.pendingCount > 0
            ? "attention"
            : "clear",
    },
    {
      href: focusHref,
      key: "focus",
      summary:
        snapshot.todayView.focus.hasActiveSession && snapshot.todayView.focus.activeSessionTitle
          ? copy.moduleCards.focus.active(snapshot.todayView.focus.activeSessionTitle)
          : snapshot.todayView.focus.nextSessionTitle
            ? copy.moduleCards.focus.next(snapshot.todayView.focus.nextSessionTitle)
            : copy.moduleCards.focus.empty,
      title: copy.moduleCards.focus.title,
      tone: snapshot.todayView.focus.hasActiveSession
        ? "active"
        : snapshot.todayView.focus.nextSessionTitle
          ? "queued"
          : "clear",
    },
    {
      href: fitnessHref,
      key: "fitness",
      summary:
        snapshot.todayView.fitness.hasActiveWorkout
          ? snapshot.todayView.fitness.activeWorkoutName
            ? copy.moduleCards.fitness.active(snapshot.todayView.fitness.activeWorkoutName)
            : copy.moduleCards.fitness.activeFallback
          : snapshot.todayView.fitness.latestWorkoutProgress?.workoutName
            ? copy.moduleCards.fitness.latest(snapshot.todayView.fitness.latestWorkoutProgress.workoutName)
            : snapshot.todayView.fitness.planCount > 0
              ? copy.moduleCards.fitness.readyPlans(snapshot.todayView.fitness.planCount)
              : copy.moduleCards.fitness.empty,
      title: copy.moduleCards.fitness.title,
      tone: snapshot.todayView.fitness.hasActiveWorkout
        ? "active"
        : snapshot.todayView.fitness.planCount > 0 || snapshot.todayView.fitness.latestWorkoutProgress
          ? "queued"
          : "clear",
    },
  ];
}

function signalToneClasses(tone: SystemSignalTone) {
  switch (tone) {
    case "active":
      return "border-[var(--landing-accent-strong)] bg-[color-mix(in_srgb,var(--landing-accent-soft)_62%,white_20%)] text-[var(--landing-accent)]";
    case "attention":
      return "border-[rgba(204,90,67,0.22)] bg-[rgba(204,90,67,0.08)] text-[var(--danger)]";
    case "clear":
      return "border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text-muted)]";
    case "queued":
    default:
      return "border-[var(--landing-border-strong)] bg-[var(--landing-surface-strong)] text-[var(--landing-text-soft)]";
  }
}

function ModuleCard({
  accent,
  actionHref,
  actionLabel,
  children,
  description,
  progress,
  title,
}: {
  accent: ReactNode;
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
  description: string;
  progress: number | null;
  title: string;
}) {
  return (
    <Card className={cn("operational-panel", progress !== null && progress > 0 && progress < 100 && "operational-active")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            {accent}
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {progress !== null ? (
          <div className="operational-track h-2">
            <div className="operational-fill" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        <Button asChild className="w-full">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview({ snapshot }: DashboardOverviewProps) {
  const { locale } = useLandingPreferences();
  const copy = dashboardCopy[locale].dashboard;
  const habitsCardHref = snapshot.moduleCards.find((card) => card.key === "habits")?.href ?? "/dashboard/habits";
  const focusCardHref = snapshot.moduleCards.find((card) => card.key === "focus")?.href ?? "/dashboard/focus";
  const fitnessCardHref =
    snapshot.moduleCards.find((card) => card.key === "fitness")?.href ?? "/dashboard/fitness";
  const overallProgress = clampProgress(snapshot.todayView.overallProgress);
  const recommendedAction = getRecommendedAction(snapshot, copy);
  const systemSignals = getSystemSignals(snapshot, copy);
  const habitsProgress = progressPercentage(
    snapshot.todayView.habits.completedCount,
    snapshot.todayView.habits.totalCount,
  );
  const activeWorkoutProgress = snapshot.todayView.fitness.activeWorkoutProgress;
  const latestWorkoutProgress = snapshot.todayView.fitness.latestWorkoutProgress;
  const fitnessProgress = activeWorkoutProgress
    ? progressPercentage(activeWorkoutProgress.completedCount, activeWorkoutProgress.totalCount)
    : latestWorkoutProgress
      ? progressPercentage(latestWorkoutProgress.completedCount, latestWorkoutProgress.totalCount)
      : null;
  const focusProgress =
    snapshot.todayView.focus.todayFocusSeconds > 0 || snapshot.todayView.focus.weekFocusSeconds > 0
      ? progressPercentage(
          snapshot.todayView.focus.todayFocusSeconds,
          Math.max(snapshot.todayView.focus.weekFocusSeconds, snapshot.todayView.focus.todayFocusSeconds),
        )
      : null;

  return (
    <>
      <section className="space-y-4">
        <div className="space-y-3">
          <Badge>{copy.badge}</Badge>
          <div className="space-y-2">
            <h1 className="max-w-3xl text-[2rem] font-semibold leading-tight tracking-[-0.045em] text-[var(--landing-text)] sm:text-[2.35rem]">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--landing-text-muted)] sm:text-base sm:leading-7">
              {copy.description}
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="operational-panel operational-active rounded-[1.6rem] p-4 sm:p-5">
            {snapshot.todayView.isFirstRun ? (
              <FirstRunStarter copy={copy} />
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--landing-accent)]">
                      <span className="operational-dot" data-live={snapshot.todayView.modulesInProgressCount > 0} />
                      {copy.nextAction.title}
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-[1.55rem] font-semibold leading-tight tracking-[-0.055em] text-[var(--landing-text)] sm:text-[1.9rem]">
                        {copy.quickActions[recommendedAction.key]}
                      </h2>
                      <p className="max-w-xl text-sm leading-6 text-[var(--landing-text-soft)] sm:text-[15px]">
                        {recommendedAction.reason}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-surface-strong)] px-4 py-3 shadow-[var(--landing-chip-inset-shadow)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-faint)]">
                      {copy.summary.title}
                    </p>
                    <p className="operational-number mt-2 text-3xl font-semibold tracking-[-0.06em] text-[var(--landing-text)]">
                      {overallProgress}%
                    </p>
                    <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
                      {copy.summary.modulesInMotion(snapshot.todayView.modulesInProgressCount)}
                    </p>
                  </div>
                </div>

                <div className="operational-track h-2.5">
                  <div className="operational-fill" style={{ width: `${overallProgress}%` }} />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {systemSignals.map((signal) => (
                    <Link
                      className="rounded-[1.2rem] border border-[var(--landing-border)] bg-[var(--landing-surface-strong)] px-4 py-4 shadow-[var(--landing-chip-inset-shadow)] transition hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-surface)]"
                      href={signal.href}
                      key={signal.key}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--landing-text)]">
                          {signal.title}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${signalToneClasses(signal.tone)}`}
                        >
                          {signal.tone}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--landing-text-muted)]">
                        {signal.summary}
                      </p>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-12 flex-1 justify-start px-4 text-left">
                    <Link href={recommendedAction.href}>
                      {copy.quickActions[recommendedAction.key]}
                    </Link>
                  </Button>
                  <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                    {snapshot.todayView.quickActions.slice(0, 2).map((action) => (
                      <Button
                        key={action.key}
                        asChild
                        className="h-12 justify-start px-4 text-left"
                        variant="secondary"
                      >
                        <Link href={action.href}>{copy.quickActions[action.key]}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Card className="operational-panel">
            <CardHeader>
              <CardTitle>{copy.summary.title}</CardTitle>
              <CardDescription>{copy.summary.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.15rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4 shadow-[var(--landing-chip-inset-shadow)]">
                <p className="text-base font-medium text-[var(--landing-text)]">
                  {copy.summary.habitsProgress(
                    snapshot.todayView.habits.completedCount,
                    snapshot.todayView.habits.totalCount,
                  )}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
                  {copy.summary.focusProgress(
                    snapshot.todayView.focusTimeTodaySeconds,
                    snapshot.todayView.focus.weekFocusSeconds,
                  )}
                </p>
                <div className="operational-track mt-4 h-2">
                  <div className="operational-fill" style={{ width: `${overallProgress}%` }} />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
                    {copy.moduleCards.habits.eyebrow}
                  </p>
                  <p className="operational-number mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
                    {snapshot.todayView.habits.pendingCount}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {copy.moduleCards.habits.pending(snapshot.todayView.habits.pendingCount)}
                  </p>
                </div>

                <div className="rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
                    {copy.moduleCards.focus.eyebrow}
                  </p>
                  <p className="operational-number mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
                    {snapshot.todayView.focus.pendingSessions}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {snapshot.todayView.focus.hasActiveSession && snapshot.todayView.focus.activeSessionTitle
                      ? copy.moduleCards.focus.active(snapshot.todayView.focus.activeSessionTitle)
                      : copy.moduleCards.focus.summary(
                          snapshot.todayView.focus.completedSessions,
                          snapshot.todayView.focus.pendingSessions,
                        )}
                  </p>
                </div>

                <div className="rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
                    {copy.moduleCards.fitness.eyebrow}
                  </p>
                  <p className="operational-number mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
                    {activeWorkoutProgress
                      ? `${activeWorkoutProgress.completedCount}/${activeWorkoutProgress.totalCount}`
                      : latestWorkoutProgress
                        ? `${latestWorkoutProgress.completedCount}/${latestWorkoutProgress.totalCount}`
                        : snapshot.todayView.fitness.planCount}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {activeWorkoutProgress
                      ? copy.moduleCards.fitness.progress(
                          activeWorkoutProgress.completedCount,
                          activeWorkoutProgress.totalCount,
                          activeWorkoutProgress.remainingCount,
                        )
                      : latestWorkoutProgress
                        ? copy.moduleCards.fitness.progress(
                            latestWorkoutProgress.completedCount,
                            latestWorkoutProgress.totalCount,
                            latestWorkoutProgress.remainingCount,
                          )
                        : copy.moduleCards.fitness.readyPlans(snapshot.todayView.fitness.planCount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <ModuleCard
          accent={
            <Badge variant={snapshot.todayView.habits.pendingCount === 0 ? "success" : "muted"}>
              {copy.moduleCards.habits.eyebrow}
            </Badge>
          }
          actionHref={habitsCardHref}
          actionLabel={copy.moduleCards.habits.openAction}
          description={
            snapshot.todayView.habits.totalCount === 0
              ? copy.moduleCards.habits.empty
              : snapshot.todayView.habits.pendingCount === 0
                ? copy.moduleCards.habits.ready
                : copy.moduleCards.habits.completed(
                    snapshot.todayView.habits.completedCount,
                    snapshot.todayView.habits.totalCount,
                  )
          }
          progress={snapshot.todayView.habits.totalCount > 0 ? habitsProgress : null}
          title={copy.moduleCards.habits.title}
        >
          {snapshot.todayView.habits.pendingNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {snapshot.todayView.habits.pendingNames.map((name) => (
                <Badge key={name} variant="muted" className="max-w-full truncate normal-case tracking-normal">
                  {name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.moduleCards.habits.completed(
                snapshot.todayView.habits.completedCount,
                snapshot.todayView.habits.totalCount,
              )}
            </p>
          )}
        </ModuleCard>

        <ModuleCard
          accent={
            <Badge variant={snapshot.todayView.focus.hasActiveSession ? "success" : "muted"}>
              {copy.moduleCards.focus.eyebrow}
            </Badge>
          }
          actionHref={focusCardHref}
          actionLabel={
            snapshot.todayView.focus.hasActiveSession
              ? copy.moduleCards.focus.resumeAction
              : copy.moduleCards.focus.planAction
          }
          description={
            snapshot.todayView.focus.hasActiveSession && snapshot.todayView.focus.activeSessionTitle
              ? copy.moduleCards.focus.active(snapshot.todayView.focus.activeSessionTitle)
              : snapshot.todayView.focus.nextSessionTitle
                ? copy.moduleCards.focus.next(snapshot.todayView.focus.nextSessionTitle)
                : copy.moduleCards.focus.empty
          }
          progress={focusProgress}
          title={copy.moduleCards.focus.title}
        >
          <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
            {copy.moduleCards.focus.summary(
              snapshot.todayView.focus.completedSessions,
              snapshot.todayView.focus.pendingSessions,
            )}
          </p>
          {snapshot.todayView.focus.nextSessionDueDate ? (
            <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
              {formatDate(snapshot.todayView.focus.nextSessionDueDate, locale)}
            </p>
          ) : null}
          <p className="operational-number text-sm font-medium text-[var(--landing-text)]">
            {copy.summary.focusProgress(
              snapshot.todayView.focus.todayFocusSeconds,
              snapshot.todayView.focus.weekFocusSeconds,
            )}
          </p>
        </ModuleCard>

        <ModuleCard
          accent={
            <Badge variant={snapshot.todayView.fitness.hasActiveWorkout ? "success" : "muted"}>
              {copy.moduleCards.fitness.eyebrow}
            </Badge>
          }
          actionHref={fitnessCardHref}
          actionLabel={
            snapshot.todayView.fitness.hasActiveWorkout
              ? copy.moduleCards.fitness.resumeAction
              : copy.moduleCards.fitness.buildAction
          }
          description={
            snapshot.todayView.fitness.hasActiveWorkout
              ? snapshot.todayView.fitness.activeWorkoutName
                ? copy.moduleCards.fitness.active(snapshot.todayView.fitness.activeWorkoutName)
                : copy.moduleCards.fitness.activeFallback
              : snapshot.todayView.fitness.latestWorkoutProgress?.workoutName
                ? copy.moduleCards.fitness.latest(snapshot.todayView.fitness.latestWorkoutProgress.workoutName)
                : copy.moduleCards.fitness.empty
          }
          progress={fitnessProgress}
          title={copy.moduleCards.fitness.title}
        >
          {activeWorkoutProgress ? (
            <p className="operational-number text-sm font-medium text-[var(--landing-text)]">
              {copy.moduleCards.fitness.progress(
                activeWorkoutProgress.completedCount,
                activeWorkoutProgress.totalCount,
                activeWorkoutProgress.remainingCount,
              )}
            </p>
          ) : latestWorkoutProgress ? (
            <>
              <p className="operational-number text-sm font-medium text-[var(--landing-text)]">
                {copy.moduleCards.fitness.progress(
                  latestWorkoutProgress.completedCount,
                  latestWorkoutProgress.totalCount,
                  latestWorkoutProgress.remainingCount,
                )}
              </p>
              {latestWorkoutProgress.skippedCount ? (
                <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                  {copy.moduleCards.fitness.skipped(latestWorkoutProgress.skippedCount)}
                </p>
              ) : null}
              {latestWorkoutProgress.completedAt ? (
                <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                  {formatDate(latestWorkoutProgress.completedAt, locale)}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.moduleCards.fitness.readyPlans(snapshot.todayView.fitness.planCount)}
            </p>
          )}
        </ModuleCard>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="operational-panel">
          <CardHeader>
            <CardTitle>{copy.habitMomentum.title}</CardTitle>
            <CardDescription>{copy.habitMomentum.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.recentHabits.length === 0 ? (
              <EmptyState
                title={copy.habitMomentum.emptyTitle}
                description={copy.habitMomentum.emptyDescription}
                action={{
                  href: "/dashboard/habits",
                  label: copy.habitMomentum.emptyAction,
                }}
              />
            ) : (
              snapshot.recentHabits.map((habit) => (
                <div
                  key={habit.id}
                  className={cn(
                    "rounded-[1.2rem] border px-4 py-4 shadow-[var(--landing-chip-inset-shadow)] transition-[border-color,background-color,box-shadow]",
                    habit.completedToday
                      ? "border-[var(--landing-accent-strong)] bg-[color-mix(in_srgb,var(--landing-accent-soft)_42%,white_24%)]"
                      : "border-[var(--landing-border)] bg-[var(--landing-surface)]",
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <p className="font-medium text-[var(--landing-text)]">{habit.name}</p>
                      <p className="text-sm text-[var(--landing-text-muted)]">
                        {copy.habitMomentum.habitStats(habit.currentStreak, habit.completionsThisWeek)}
                      </p>
                    </div>
                    <Badge variant={habit.completedToday ? "success" : "muted"}>
                      {habit.completedToday ? copy.habitMomentum.doneToday : copy.habitMomentum.pending}
                    </Badge>
                  </div>
                  <div className="operational-track mt-4 h-2">
                    <div
                      className="operational-fill"
                      style={{
                        width: `${progressPercentage(habit.completionsThisWeek, Math.max(habit.currentStreak, 1) + habit.completionsThisWeek)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--landing-border)] bg-[color-mix(in_srgb,var(--landing-surface)_88%,white_8%)] shadow-[var(--landing-shadow-soft)]">
          <CardHeader>
            <CardTitle>{copy.secondaryMetrics.title}</CardTitle>
            <CardDescription>{copy.secondaryMetrics.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {snapshot.metrics.map((metric) => {
              const metricCopy = copy.metrics[metric.key];

              return (
                <div
                  key={metric.key}
                  className="rounded-[1.1rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4 shadow-[var(--landing-chip-inset-shadow)]"
                >
                  <p className="text-xs leading-5 text-[var(--landing-text-muted)]">{metricCopy.label}</p>
                  <p className="operational-number mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--landing-text)]">
                    {metric.value}
                  </p>
                  <p className="mt-2 hidden text-sm leading-6 text-[var(--landing-text-muted)] sm:block">
                    {metricCopy.detail}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
