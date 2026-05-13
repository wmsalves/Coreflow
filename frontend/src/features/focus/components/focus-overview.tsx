import { Clock3, ListChecks, Target, TrendingUp } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FocusCopy } from "@/features/focus/content/focus-copy";

type FocusOverviewProps = {
  completionRate: number;
  completedCount: number;
  copy: FocusCopy;
  todayFocusSeconds: number;
  weekFocusSeconds: number;
};

const metricIcons = [Clock3, TrendingUp, ListChecks, Target];

export function FocusOverview({
  completionRate,
  completedCount,
  copy,
  todayFocusSeconds,
  weekFocusSeconds,
}: FocusOverviewProps) {
  const metrics = [
    {
      label: copy.overview.todayFocus,
      value: copy.overview.duration(todayFocusSeconds),
    },
    {
      label: copy.overview.weekFocus,
      value: copy.overview.duration(weekFocusSeconds),
    },
    {
      label: copy.overview.completed,
      value: String(completedCount),
    },
    {
      label: copy.overview.completionRate,
      value: `${completionRate}%`,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metricIcons[index];
        const progress =
          index === 0
            ? weekFocusSeconds > 0
              ? Math.max(0, Math.min(100, Math.round((todayFocusSeconds / weekFocusSeconds) * 100)))
              : todayFocusSeconds > 0
                ? 100
                : 0
            : index === 2
              ? Math.max(0, Math.min(100, completionRate))
              : index === 3
                ? Math.max(0, Math.min(100, completionRate))
                : null;

        return (
          <Card
            key={metric.label}
            className={
              progress && progress > 0 && progress < 100
                ? "operational-panel operational-active overflow-hidden"
                : progress === 100
                  ? "operational-panel operational-surface-quiet overflow-hidden"
                  : "operational-panel overflow-hidden"
            }
          >
            <CardHeader className="pb-3 max-sm:space-y-1">
              <div className="flex items-start justify-between gap-4">
                <CardDescription className="max-sm:text-xs max-sm:leading-5">{metric.label}</CardDescription>
                <span className="hidden size-9 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-accent)] shadow-[var(--landing-chip-inset-shadow)] sm:flex">
                  <Icon className="size-4" />
                </span>
              </div>
              <CardTitle className="operational-number text-2xl tracking-[-0.05em] sm:text-3xl">{metric.value}</CardTitle>
              {progress !== null ? (
                <div className="operational-track mt-3 h-2">
                  <div
                    className="operational-fill"
                    data-state={progress === 100 ? "resolved" : undefined}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : null}
            </CardHeader>
          </Card>
        );
      })}
    </section>
  );
}
