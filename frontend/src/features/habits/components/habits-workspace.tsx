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

  return (
    <>
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
        <CreateHabitForm copy={copy.form} />

        <div className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm leading-5 sm:text-lg">{copy.summary.active}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                {overview.summary.activeCount}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm leading-5 sm:text-lg">{copy.summary.doneToday}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                {overview.summary.completedTodayCount}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm leading-5 sm:text-lg">{copy.summary.bestStreak}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                {overview.summary.bestStreak}
              </CardContent>
            </Card>
          </div>

          <HabitList copy={copy.list} habits={overview.habits} />
        </div>
      </section>
    </>
  );
}
