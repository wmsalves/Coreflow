import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteHabitAction, toggleHabitCompletionAction } from "@/features/habits/actions";

type HabitOverviewItem = {
  completedToday: boolean;
  completionsThisWeek: number;
  currentStreak: number;
  description: string | null;
  frequencyPerWeek: number;
  id: string;
  name: string;
};

type HabitListCopy = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  doneToday: string;
  needsCheckIn: string;
  undoToday: string;
  markComplete: string;
  deleteLabel: (name: string) => string;
  habitStats: (currentStreak: number, completionsThisWeek: number, frequencyPerWeek: number) => string[];
};

type HabitListProps = {
  copy: HabitListCopy;
  habits: HabitOverviewItem[];
};

export function HabitList({ copy, habits }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        title={copy.emptyTitle}
        description={copy.emptyDescription}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex flex-col gap-4 rounded-[26px] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 shadow-[var(--landing-chip-inset-shadow)] lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold">{habit.name}</p>
                <Badge variant={habit.completedToday ? "success" : "muted"}>
                  {habit.completedToday ? copy.doneToday : copy.needsCheckIn}
                </Badge>
              </div>

              {habit.description ? (
                <p className="max-w-2xl text-sm leading-6 text-[var(--landing-text-muted)]">{habit.description}</p>
              ) : null}

              <div className="flex flex-wrap gap-3 text-sm text-[var(--landing-text-muted)]">
                {copy.habitStats(habit.currentStreak, habit.completionsThisWeek, habit.frequencyPerWeek).map((stat) => (
                  <span key={stat}>{stat}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <form action={toggleHabitCompletionAction}>
                <input name="habitId" type="hidden" value={habit.id} />
                <Button type="submit" variant={habit.completedToday ? "secondary" : "primary"}>
                  {habit.completedToday ? copy.undoToday : copy.markComplete}
                </Button>
              </form>

              <form action={deleteHabitAction}>
                <input name="habitId" type="hidden" value={habit.id} />
                <Button aria-label={copy.deleteLabel(habit.name)} type="submit" variant="ghost">
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
