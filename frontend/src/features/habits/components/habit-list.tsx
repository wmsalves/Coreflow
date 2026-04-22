"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  deleteHabitAction,
  toggleHabitCompletionAction,
  type HabitActionState,
} from "@/features/habits/actions";

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

const initialState: HabitActionState = {
  error: null,
  success: false,
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
              <HabitToggleForm copy={copy} habit={habit} />
              <HabitDeleteForm copy={copy} habit={habit} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function HabitToggleForm({
  copy,
  habit,
}: {
  copy: HabitListCopy;
  habit: HabitOverviewItem;
}) {
  const [state, formAction] = useActionState(toggleHabitCompletionAction, initialState);
  const label = habit.completedToday ? copy.undoToday : copy.markComplete;

  return (
    <form action={formAction} className="space-y-2">
      <input name="habitId" type="hidden" value={habit.id} />
      <SubmitButton
        pendingLabel={label}
        variant={habit.completedToday ? "secondary" : "primary"}
      >
        {label}
      </SubmitButton>
      {state.error ? (
        <p aria-live="polite" className="max-w-48 text-xs text-[var(--danger)]">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

function HabitDeleteForm({
  copy,
  habit,
}: {
  copy: HabitListCopy;
  habit: HabitOverviewItem;
}) {
  const [state, formAction] = useActionState(deleteHabitAction, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input name="habitId" type="hidden" value={habit.id} />
      <SubmitButton
        aria-label={copy.deleteLabel(habit.name)}
        pendingLabel="..."
        variant="ghost"
      >
        <Trash2 className="size-4" />
      </SubmitButton>
      {state.error ? (
        <p aria-live="polite" className="max-w-48 text-xs text-[var(--danger)]">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
