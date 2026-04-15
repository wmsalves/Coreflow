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
import { getDashboardSnapshot } from "@/features/dashboard/queries";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const snapshot = await getDashboardSnapshot(user.id);

  return (
    <div className="space-y-8 p-5 sm:p-7 lg:p-10">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge>Overview</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Keep your systems moving.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Your first Coreflow slice starts with habits, while study sessions and workouts are
              already represented in the dashboard structure for the next implementation steps.
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href="/dashboard/habits">Manage habits</Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-3">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-[var(--muted)]">{metric.detail}</CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Habit momentum</CardTitle>
            <CardDescription>The habits module is fully wired into the dashboard metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.recentHabits.length === 0 ? (
              <EmptyState
                title="No habits yet"
                description="Create your first habit to start generating daily progress and streak data."
                action={{
                  href: "/dashboard/habits",
                  label: "Create a habit",
                }}
              />
            ) : (
              snapshot.recentHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{habit.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {habit.currentStreak} day streak · {habit.completionsThisWeek} completions this week
                    </p>
                  </div>
                  <Badge variant={habit.completedToday ? "success" : "muted"}>
                    {habit.completedToday ? "Done today" : "Pending"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next modules</CardTitle>
            <CardDescription>Scaffolded space for the rest of the MVP roadmap.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.nextSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-4"
              >
                <p className="font-medium">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
