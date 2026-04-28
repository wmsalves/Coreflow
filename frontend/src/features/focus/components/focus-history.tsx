import Link from "next/link";
import { CheckCircle2, Clock3, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclosure } from "@/components/ui/disclosure";
import type { FocusCopy } from "@/features/focus/content/focus-copy";
import type { FocusRunHistory, StudySession } from "@/features/focus/types/focus-types";

type FocusHistoryProps = {
  completedSessions: StudySession[];
  copy: FocusCopy;
  history: FocusRunHistory[];
};

export function FocusHistory({ completedSessions, copy, history }: FocusHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.list.historyTitle}</CardTitle>
        <CardDescription>{copy.list.historyDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {completedSessions.length === 0 ? (
          <div className="rounded-[1.35rem] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 text-sm leading-6 text-[var(--landing-text-muted)]">
            <p className="font-medium text-[var(--landing-text)]">{copy.list.historyEmptyTitle}</p>
            <p className="mt-1">{copy.list.historyEmptyDescription}</p>
            <p className="mt-2 text-[var(--landing-text-soft)]">{copy.list.historyEmptyHint}</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link href="#plan-focus">{copy.list.historyEmptyAction}</Link>
            </Button>
          </div>
        ) : (
          completedSessions.map((session) => {
            const latestRun = history.find((entry) => entry.sessionId === session.id) ?? null;

            return (
              <article
                className="rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4 shadow-[var(--landing-chip-inset-shadow)] sm:rounded-[1.45rem]"
                key={session.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--landing-accent)]">
                      <CheckCircle2 className="size-3.5" />
                      {copy.status.completed}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">
                        {session.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
                        {session.subject}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-3 py-2 text-sm text-[var(--landing-text-muted)]">
                    {copy.list.completedAt(
                      new Date(session.completedAt ?? session.dueDate).toLocaleString(),
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-[var(--landing-text-muted)] sm:grid-cols-2 xl:grid-cols-4">
                  <HistoryMetric icon={Clock3} label={copy.list.focusLogged(session.completedFocusSeconds)} />
                  <HistoryMetric icon={TimerReset} label={copy.list.cyclesLogged(session.totalCyclesCompleted)} />
                  <HistoryMetric icon={Clock3} label={copy.list.estimated(session.estimatedMinutes)} />
                  <HistoryMetric icon={TimerReset} label={copy.list.runCount(session.totalFocusRuns)} />
                </div>

                {session.description ? (
                  <>
                    <Disclosure className="mt-4 sm:hidden" summary={copy.list.details}>
                      <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                        {session.description}
                      </p>
                    </Disclosure>
                    <p className="mt-4 hidden text-sm leading-6 text-[var(--landing-text-muted)] sm:block">
                      {session.description}
                    </p>
                  </>
                ) : null}

                {latestRun ? (
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--landing-text-faint)]">
                    {copy.pomodoro.currentRun(latestRun.durationSeconds)}
                  </p>
                ) : null}
              </article>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function HistoryMetric({
  icon: Icon,
  label,
}: {
  icon: typeof Clock3;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-3 py-2">
      <Icon className="size-4 shrink-0 text-[var(--landing-accent)]" />
      <p className="truncate">{label}</p>
    </div>
  );
}
