"use client";

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
      modulesInProgressCount: number;
      overallProgress: number;
      quickActions: Array<{
        href: string;
        key: "createHabit" | "openWorkoutBuilder" | "planFocusSession" | "startFocus";
      }>;
    };
  };
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

export function DashboardOverview({ snapshot }: DashboardOverviewProps) {
  const { locale } = useLandingPreferences();
  const copy = dashboardCopy[locale].dashboard;
  const habitsCardHref = snapshot.moduleCards.find((card) => card.key === "habits")?.href ?? "/dashboard/habits";
  const focusCardHref = snapshot.moduleCards.find((card) => card.key === "focus")?.href ?? "/dashboard/focus";
  const fitnessCardHref =
    snapshot.moduleCards.find((card) => card.key === "fitness")?.href ?? "/dashboard/fitness";
  const overallProgress = clampProgress(snapshot.todayView.overallProgress);

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

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>{copy.summary.title}</CardTitle>
              <CardDescription>{copy.summary.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.2rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4 shadow-[var(--landing-chip-inset-shadow)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-base font-medium text-[var(--landing-text)]">
                      {copy.summary.habitsProgress(
                        snapshot.todayView.habits.completedCount,
                        snapshot.todayView.habits.totalCount,
                      )}
                    </p>
                    <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                      {copy.summary.focusProgress(
                        snapshot.todayView.focusTimeTodaySeconds,
                        snapshot.todayView.focus.weekFocusSeconds,
                      )}
                    </p>
                  </div>

                  <Badge variant={snapshot.todayView.modulesInProgressCount > 0 ? "success" : "muted"}>
                    {copy.summary.modulesInMotion(snapshot.todayView.modulesInProgressCount)}
                  </Badge>
                </div>

                <div className="mt-4 h-2.5 rounded-full bg-[var(--landing-border)]">
                  <div
                    className="h-full rounded-full bg-[var(--landing-accent)] transition-[width]"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.15rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
                    {copy.moduleCards.habits.eyebrow}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
                    {snapshot.todayView.habits.pendingCount}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {copy.moduleCards.habits.pending(snapshot.todayView.habits.pendingCount)}
                  </p>
                </div>

                <div className="rounded-[1.15rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
                    {copy.moduleCards.focus.eyebrow}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
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

                <div className="rounded-[1.15rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
                    {copy.moduleCards.fitness.eyebrow}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
                    {snapshot.todayView.fitness.activeWorkoutProgress
                      ? `${snapshot.todayView.fitness.activeWorkoutProgress.completedCount}/${snapshot.todayView.fitness.activeWorkoutProgress.totalCount}`
                      : snapshot.todayView.fitness.latestWorkoutProgress
                        ? `${snapshot.todayView.fitness.latestWorkoutProgress.completedCount}/${snapshot.todayView.fitness.latestWorkoutProgress.totalCount}`
                        : snapshot.todayView.fitness.planCount}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {snapshot.todayView.fitness.activeWorkoutProgress
                      ? copy.moduleCards.fitness.progress(
                          snapshot.todayView.fitness.activeWorkoutProgress.completedCount,
                          snapshot.todayView.fitness.activeWorkoutProgress.totalCount,
                          snapshot.todayView.fitness.activeWorkoutProgress.remainingCount,
                        )
                      : snapshot.todayView.fitness.latestWorkoutProgress
                        ? copy.moduleCards.fitness.progress(
                            snapshot.todayView.fitness.latestWorkoutProgress.completedCount,
                            snapshot.todayView.fitness.latestWorkoutProgress.totalCount,
                            snapshot.todayView.fitness.latestWorkoutProgress.remainingCount,
                          )
                        : copy.moduleCards.fitness.readyPlans(snapshot.todayView.fitness.planCount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{copy.quickActions.title}</CardTitle>
              <CardDescription>{copy.quickActions.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {snapshot.todayView.quickActions.map((action) => (
                <Button key={action.key} asChild variant="secondary" className="w-full justify-start px-4 text-left">
                  <Link href={action.href}>{copy.quickActions[action.key]}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Badge variant={snapshot.todayView.habits.pendingCount === 0 ? "success" : "muted"}>
                  {copy.moduleCards.habits.eyebrow}
                </Badge>
                <CardTitle>{copy.moduleCards.habits.title}</CardTitle>
                <CardDescription>
                  {snapshot.todayView.habits.totalCount === 0
                    ? copy.moduleCards.habits.empty
                    : snapshot.todayView.habits.pendingCount === 0
                      ? copy.moduleCards.habits.ready
                      : copy.moduleCards.habits.completed(
                          snapshot.todayView.habits.completedCount,
                          snapshot.todayView.habits.totalCount,
                        )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {snapshot.todayView.habits.pendingNames.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {snapshot.todayView.habits.pendingNames.map((name) => (
                  <Badge key={name} variant="muted" className="max-w-full truncate normal-case tracking-normal">
                    {name}
                  </Badge>
                ))}
              </div>
            ) : null}

            <Button asChild className="w-full">
              <Link href={habitsCardHref}>{copy.moduleCards.habits.openAction}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Badge variant={snapshot.todayView.focus.hasActiveSession ? "success" : "muted"}>
                  {copy.moduleCards.focus.eyebrow}
                </Badge>
                <CardTitle>{copy.moduleCards.focus.title}</CardTitle>
                <CardDescription>
                  {snapshot.todayView.focus.hasActiveSession && snapshot.todayView.focus.activeSessionTitle
                    ? copy.moduleCards.focus.active(snapshot.todayView.focus.activeSessionTitle)
                    : snapshot.todayView.focus.nextSessionTitle
                      ? copy.moduleCards.focus.next(snapshot.todayView.focus.nextSessionTitle)
                      : copy.moduleCards.focus.empty}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <p className="text-sm font-medium text-[var(--landing-text)]">
              {copy.summary.focusProgress(
                snapshot.todayView.focus.todayFocusSeconds,
                snapshot.todayView.focus.weekFocusSeconds,
              )}
            </p>

            <Button asChild className="w-full">
              <Link href={focusCardHref}>
                {snapshot.todayView.focus.hasActiveSession
                  ? copy.moduleCards.focus.resumeAction
                  : copy.moduleCards.focus.planAction}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Badge variant={snapshot.todayView.fitness.hasActiveWorkout ? "success" : "muted"}>
                  {copy.moduleCards.fitness.eyebrow}
                </Badge>
                <CardTitle>{copy.moduleCards.fitness.title}</CardTitle>
                <CardDescription>
                  {snapshot.todayView.fitness.hasActiveWorkout
                    ? snapshot.todayView.fitness.activeWorkoutName
                      ? copy.moduleCards.fitness.active(snapshot.todayView.fitness.activeWorkoutName)
                      : copy.moduleCards.fitness.activeFallback
                    : snapshot.todayView.fitness.latestWorkoutProgress?.workoutName
                      ? copy.moduleCards.fitness.latest(
                          snapshot.todayView.fitness.latestWorkoutProgress.workoutName,
                        )
                      : copy.moduleCards.fitness.empty}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.todayView.fitness.activeWorkoutProgress ? (
              <p className="text-sm font-medium text-[var(--landing-text)]">
                {copy.moduleCards.fitness.progress(
                  snapshot.todayView.fitness.activeWorkoutProgress.completedCount,
                  snapshot.todayView.fitness.activeWorkoutProgress.totalCount,
                  snapshot.todayView.fitness.activeWorkoutProgress.remainingCount,
                )}
              </p>
            ) : snapshot.todayView.fitness.latestWorkoutProgress ? (
              <>
                <p className="text-sm font-medium text-[var(--landing-text)]">
                  {copy.moduleCards.fitness.progress(
                    snapshot.todayView.fitness.latestWorkoutProgress.completedCount,
                    snapshot.todayView.fitness.latestWorkoutProgress.totalCount,
                    snapshot.todayView.fitness.latestWorkoutProgress.remainingCount,
                  )}
                </p>
                {snapshot.todayView.fitness.latestWorkoutProgress.skippedCount ? (
                  <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                    {copy.moduleCards.fitness.skipped(
                      snapshot.todayView.fitness.latestWorkoutProgress.skippedCount,
                    )}
                  </p>
                ) : null}
                {snapshot.todayView.fitness.latestWorkoutProgress.completedAt ? (
                  <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                    {formatDate(snapshot.todayView.fitness.latestWorkoutProgress.completedAt, locale)}
                  </p>
                ) : null}
              </>
            ) : null}

            <Button asChild className="w-full">
              <Link href={fitnessCardHref}>
                {snapshot.todayView.fitness.hasActiveWorkout
                  ? copy.moduleCards.fitness.resumeAction
                  : copy.moduleCards.fitness.buildAction}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
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
                  className="flex flex-col gap-3 rounded-[1.35rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4 shadow-[var(--landing-chip-inset-shadow)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-[var(--landing-text)]">{habit.name}</p>
                    <p className="text-sm text-[var(--landing-text-muted)]">
                      {copy.habitMomentum.habitStats(habit.currentStreak, habit.completionsThisWeek)}
                    </p>
                  </div>
                  <Badge variant={habit.completedToday ? "success" : "muted"}>
                    {habit.completedToday ? copy.habitMomentum.doneToday : copy.habitMomentum.pending}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
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
                  className="rounded-[1.2rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4 shadow-[var(--landing-chip-inset-shadow)]"
                >
                  <p className="text-xs leading-5 text-[var(--landing-text-muted)]">{metricCopy.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[var(--landing-text)]">
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
