import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateHabitForm } from "@/features/habits/components/create-habit-form";
import { HabitList } from "@/features/habits/components/habit-list";
import { getHabitsOverview } from "@/features/habits/queries";
import { requireUser } from "@/lib/auth";

export default async function HabitsPage() {
  const user = await requireUser();
  const overview = await getHabitsOverview(user.id);

  return (
    <div className="space-y-8 p-5 sm:p-7 lg:p-10">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Habits
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Build consistency with simple daily loops.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            This module handles the full MVP flow: create habits, mark today as complete, track
            streaks, and keep the dashboard updated automatically.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <CreateHabitForm />

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active habits</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-3xl font-semibold">
                {overview.summary.activeCount}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Done today</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-3xl font-semibold">
                {overview.summary.completedTodayCount}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Best streak</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-3xl font-semibold">
                {overview.summary.bestStreak}
              </CardContent>
            </Card>
          </div>

          <HabitList habits={overview.habits} />
        </div>
      </section>
    </div>
  );
}
