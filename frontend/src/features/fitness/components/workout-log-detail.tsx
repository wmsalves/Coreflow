"use client";

import { ChevronLeft, Dumbbell, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import type { WorkoutLog } from "@/features/fitness/types";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { cn } from "@/lib/utils";

type WorkoutLogDetailProps = {
  log: WorkoutLog | null;
};

function getMetaValue(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value : fallback;
}

function formatWeight(value: number | null | undefined, unit: string) {
  return value === null || value === undefined ? "-" : `${value}${unit}`;
}

function WorkoutLogMedia({
  exercise,
}: {
  exercise: Pick<
    WorkoutLog["exercises"][number],
    "gifUrl" | "imageUrl" | "name" | "videoUrl"
  >;
}) {
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-surface-alt)]">
      {exercise.imageUrl ? (
        <Image
          alt={exercise.name}
          className="object-cover"
          fill
          sizes="80px"
          src={exercise.imageUrl}
          unoptimized
        />
      ) : exercise.gifUrl || exercise.videoUrl ? (
        <div className="flex h-full items-center justify-center text-[var(--landing-accent)]">
          <Play className="size-5" />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-[var(--landing-text-muted)]">
          <Dumbbell className="size-6" />
        </div>
      )}
    </div>
  );
}

export function WorkoutLogDetail({ log }: WorkoutLogDetailProps) {
  const { locale } = useLandingPreferences();
  const copy = dashboardCopy[locale].fitness;
  const commonCopy = dashboardCopy[locale].common;

  if (!log) {
    return (
      <EmptyState
        description={copy.history.notFoundDescription}
        title={copy.history.notFoundTitle}
        action={{
          href: "/dashboard/fitness",
          label: copy.history.backToFitness,
        }}
      />
    );
  }

  const completedCount = log.exercises.filter((exercise) => exercise.completed).length;
  const skippedCount = Math.max(log.exercises.length - completedCount, 0);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link href="/dashboard/fitness">
          <ChevronLeft className="size-4" />
          {copy.history.backToFitness}
        </Link>
      </Button>

      <section className="space-y-4">
        <Badge>{copy.detail.completedBadge}</Badge>
        <div className="space-y-2">
          <h1 className="max-w-3xl text-[2rem] font-semibold leading-tight tracking-[-0.045em] text-[var(--landing-text)] sm:text-[2.35rem]">
            {log.workoutName ?? copy.builder.noWorkout}
          </h1>
          <p className="text-sm leading-6 text-[var(--landing-text-muted)] sm:text-base sm:leading-7">
            {copy.logs.completedAt(new Date(log.completedAt).toLocaleString())}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label={copy.detail.completionRatio(completedCount, log.exercises.length)}
          value={`${completedCount}/${log.exercises.length}`}
        />
        <SummaryCard label={copy.detail.completedLabel} value={completedCount} />
        <SummaryCard label={copy.detail.skippedLabel} value={skippedCount} />
        <SummaryCard
          label={copy.logs.completedAt(new Date(log.completedAt).toLocaleDateString())}
          value={
            log.durationMinutes !== null
              ? copy.detail.duration(log.durationMinutes)
              : "--"
          }
        />
      </section>

      {log.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>{copy.detail.notes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
              {log.notes}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-[var(--landing-border)] bg-[var(--landing-surface)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{copy.detail.exerciseSummary}</CardTitle>
              <p className="mt-2 text-sm leading-6 text-[var(--landing-text-muted)]">
                {copy.logs.progress(completedCount, log.exercises.length)}
              </p>
            </div>
            <Badge variant="muted">{log.exercises.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {log.exercises.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 text-sm leading-6 text-[var(--landing-text-muted)]">
              {copy.history.emptyExercises}
            </div>
          ) : (
            log.exercises.map((exercise, index) => (
              <div
                className={cn(
                  "rounded-[1.25rem] border bg-[var(--landing-surface)] p-4 sm:rounded-[24px]",
                  exercise.completed
                    ? "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)]/40"
                    : "border-[var(--landing-border)]",
                )}
                key={`${log.id}-${exercise.name}-${exercise.sortOrder ?? index}`}
              >
                <div className="flex items-start gap-3">
                  <WorkoutLogMedia exercise={exercise} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--landing-text-muted)]">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-1 font-semibold tracking-tight text-[var(--landing-text)]">
                          {exercise.name}
                        </h2>
                        <p className="mt-1 text-sm text-[var(--landing-text-muted)]">
                          {[
                            getMetaValue(exercise.bodyPart, commonCopy.notSpecified),
                            getMetaValue(exercise.target, commonCopy.notSpecified),
                            getMetaValue(exercise.equipment, commonCopy.notSpecified),
                          ].join(commonCopy.slashSeparator)}
                        </p>
                      </div>
                      <Badge variant={exercise.completed ? "success" : "muted"}>
                        {exercise.completed
                          ? copy.logs.completedStatus
                          : copy.logs.skippedStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <MiniStat
                    label={copy.builder.sets}
                    value={exercise.setsCompleted ?? "-"}
                  />
                  <MiniStat
                    label={copy.builder.reps}
                    value={exercise.repsCompleted ?? "-"}
                  />
                  <MiniStat
                    label={copy.builder.rest}
                    value={exercise.restSeconds ? `${exercise.restSeconds}s` : "-"}
                  />
                  <MiniStat
                    label={copy.builder.weight}
                    value={formatWeight(exercise.weight, copy.builder.weightUnit)}
                  />
                </div>

                {exercise.notes ? (
                  <>
                    <Disclosure className="mt-3 sm:hidden" summary={copy.detail.notes}>
                      <p className="text-sm leading-6 text-[var(--landing-text-muted)]">
                        {exercise.notes}
                      </p>
                    </Disclosure>
                    <p className="mt-3 hidden text-sm leading-6 text-[var(--landing-text-muted)] sm:block">
                      {exercise.notes}
                    </p>
                  </>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="px-4 py-4">
        <p className="text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--landing-text-muted)]">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-[var(--landing-bg-elevated)] px-3 py-2">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
        {label}
      </p>
      <p className="mt-1 font-semibold text-[var(--landing-text)]">{value}</p>
    </div>
  );
}
