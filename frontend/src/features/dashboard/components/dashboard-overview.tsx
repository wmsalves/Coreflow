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
    nextSteps: Array<{
      href: string;
      key: "studySessions" | "workoutTracking" | "stripePlans";
    }>;
    recentHabits: Array<{
      completedToday: boolean;
      completionsThisWeek: number;
      currentStreak: number;
      id: string;
      name: string;
    }>;
  };
};

export function DashboardOverview({ snapshot }: DashboardOverviewProps) {
  const { locale } = useLandingPreferences();
  const copy = dashboardCopy[locale].dashboard;

  return (
    <>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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

        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/habits">{copy.manageHabits}</Link>
        </Button>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => {
          const metricCopy = copy.metrics[metric.key];

          return (
            <Card key={metric.key}>
              <CardHeader className="pb-3 max-sm:space-y-1">
                <CardDescription className="max-sm:text-xs max-sm:leading-5">{metricCopy.label}</CardDescription>
                <CardTitle className="text-2xl tracking-[-0.05em] sm:text-3xl">{metric.value}</CardTitle>
              </CardHeader>
              <CardContent className="hidden pt-0 text-sm leading-6 text-[var(--landing-text-muted)] sm:block">
                {metricCopy.detail}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
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
            <CardTitle>{copy.nextModules.title}</CardTitle>
            <CardDescription>{copy.nextModules.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.nextSteps.map((step) => {
              const stepCopy = copy.nextModules[step.key];

              return (
                <Link
                  key={step.key}
                  className="block rounded-[1.35rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-4 shadow-[var(--landing-chip-inset-shadow)] transition hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-bg-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-border-strong)]"
                  href={step.href}
                >
                  <p className="font-medium text-[var(--landing-text)]">{stepCopy.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--landing-text-muted)]">
                    {stepCopy.description}
                  </p>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
