import { Clock3, ListChecks, Target, TrendingUp } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FocusCopy } from "@/features/focus/content/focus-copy";

type FocusOverviewProps = {
  activeCount: number;
  completionRate: number;
  completedCount: number;
  copy: FocusCopy;
  pendingCount: number;
  totalFocusSeconds: number;
};

const metricIcons = [Clock3, ListChecks, Target, TrendingUp];

export function FocusOverview({
  activeCount,
  completionRate,
  completedCount,
  copy,
  pendingCount,
  totalFocusSeconds,
}: FocusOverviewProps) {
  const metrics = [
    {
      label: copy.overview.totalFocus,
      value: copy.overview.duration(totalFocusSeconds),
    },
    {
      label: copy.overview.completed,
      value: String(completedCount),
    },
    {
      label: copy.overview.activePending,
      value: copy.overview.ratio(activeCount, pendingCount),
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

        return (
          <Card key={metric.label} className="overflow-hidden">
            <CardHeader className="pb-3 max-sm:space-y-1">
              <div className="flex items-start justify-between gap-4">
                <CardDescription className="max-sm:text-xs max-sm:leading-5">{metric.label}</CardDescription>
                <span className="hidden size-9 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-accent)] shadow-[var(--landing-chip-inset-shadow)] sm:flex">
                  <Icon className="size-4" />
                </span>
              </div>
              <CardTitle className="text-2xl tracking-[-0.05em] sm:text-3xl">{metric.value}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </section>
  );
}
