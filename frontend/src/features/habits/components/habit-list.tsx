import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteHabitAction, toggleHabitCompletionAction } from "@/features/habits/actions";
import type { HabitOverviewItem } from "@/features/habits/queries";

type HabitListProps = {
  habits: HabitOverviewItem[];
};

export function HabitList({ habits }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        title="Your habits will show up here"
        description="Once you create a habit, you can mark it complete for today, watch the streak grow, and see the metrics land on the dashboard."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit list</CardTitle>
        <CardDescription>Daily completions are stored separately, so your streak math stays resilient.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex flex-col gap-4 rounded-[26px] border border-[var(--border)] bg-white/72 p-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold">{habit.name}</p>
                <Badge variant={habit.completedToday ? "success" : "muted"}>
                  {habit.completedToday ? "Done today" : "Needs check-in"}
                </Badge>
              </div>

              {habit.description ? (
                <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">{habit.description}</p>
              ) : null}

              <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                <span>{habit.currentStreak} day streak</span>
                <span>{habit.completionsThisWeek} completions this week</span>
                <span>{habit.frequencyPerWeek} target days / week</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <form action={toggleHabitCompletionAction}>
                <input name="habitId" type="hidden" value={habit.id} />
                <Button variant={habit.completedToday ? "secondary" : "primary"}>
                  {habit.completedToday ? "Undo today" : "Mark complete"}
                </Button>
              </form>

              <form action={deleteHabitAction}>
                <input name="habitId" type="hidden" value={habit.id} />
                <Button aria-label={`Delete ${habit.name}`} variant="ghost">
                  <Trash2 className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
