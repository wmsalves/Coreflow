"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import { CreateHabitForm } from "@/features/habits/components/create-habit-form";
import { HabitList } from "@/features/habits/components/habit-list";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";

type HabitsOverview = {
  habits: Array<{
    completedToday: boolean;
    completionsThisWeek: number;
    currentStreak: number;
    description: string | null;
    frequencyPerWeek: number;
    id: string;
    name: string;
  }>;
  summary: {
    activeCount: number;
    bestStreak: number;
    completedTodayCount: number;
  };
};

type HabitsWorkspaceProps = {
  overview: HabitsOverview;
};

export function HabitsWorkspace({ overview }: HabitsWorkspaceProps) {
  const { locale } = useLandingPreferences();
  const copy = dashboardCopy[locale].habits;
  const hasHabits = overview.summary.activeCount > 0;
  const allHabitsComplete =
    hasHabits && overview.summary.completedTodayCount >= overview.summary.activeCount;
  const momentumState = allHabitsComplete
    ? "resolved"
    : overview.summary.completedTodayCount > 0
      ? "building"
      : hasHabits
        ? "waiting"
        : "waiting";

  return (
    <div className="momentum-scope" data-momentum-state={momentumState}>
      <section className="space-y-3">
        <Badge>{copy.badge}</Badge>
        <div className="space-y-2">
          <h1 className="max-w-3xl text-[2rem] font-semibold leading-tight tracking-[-0.045em] text-[var(--landing-text)] sm:text-[2.35rem]">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--landing-text-muted)] sm:text-base sm:leading-7">
            {copy.description}
          </p>
        </div>
      </section>

      <section className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <CreateHabitForm copy={copy.form} initialHabitCount={overview.habits.length} />

        <div
          className="operational-region space-y-5 rounded-[1.9rem] p-3 sm:space-y-6 sm:p-4"
          data-state={overview.summary.completedTodayCount > 0 ? "resolved" : overview.summary.activeCount > 0 ? "active" : undefined}
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card className={overview.summary.activeCount > 0 ? "operational-panel" : "operational-surface-quiet"}>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm leading-5 sm:text-lg">{copy.summary.active}</CardTitle>
              </CardHeader>
              <CardContent className="operational-number pt-0 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                {overview.summary.activeCount}
              </CardContent>
            </Card>
            <Card className={overview.summary.completedTodayCount > 0 ? "operational-panel operational-surface-quiet" : "operational-panel"}>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm leading-5 sm:text-lg">{copy.summary.doneToday}</CardTitle>
              </CardHeader>
              <CardContent className="operational-number pt-0 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                {overview.summary.completedTodayCount}
              </CardContent>
            </Card>
            <Card className={overview.summary.bestStreak > 0 ? "operational-panel momentum-continuity" : "operational-surface-quiet momentum-continuity"}>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm leading-5 sm:text-lg">{copy.summary.bestStreak}</CardTitle>
              </CardHeader>
              <CardContent className="operational-number pt-0 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                {overview.summary.bestStreak}
              </CardContent>
            </Card>
          </div>

          <HabitList copy={copy.list} habits={overview.habits} />
        </div>
      </section>
    </div>
  );
}
