import type { ComponentType } from "react";
import { CalendarDays, CheckCircle2, CircleDot, Timer, Trash2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FocusCopy } from "@/features/focus/content/focus-copy";
import type { StudySession } from "@/features/focus/types/focus-types";
import { cn } from "@/lib/utils";

type StudySessionCardProps = {
  active: boolean;
  copy: FocusCopy;
  onArchive: (id: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onStart: (id: string) => void;
  session: StudySession;
};

const statusTone: Record<StudySession["status"], string> = {
  completed: "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]",
  archived: "border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text-faint)]",
  canceled: "border-[rgba(204,90,67,0.3)] bg-[rgba(204,90,67,0.08)] text-[var(--danger)]",
  in_progress: "border-[var(--landing-border-strong)] bg-[var(--landing-surface-strong)] text-[var(--landing-text)]",
  pending: "border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text-muted)]",
};

export function StudySessionCard({
  active,
  copy,
  onArchive,
  onCancel,
  onComplete,
  onDelete,
  onSelect,
  onStart,
  session,
}: StudySessionCardProps) {
  const isCompleted = session.status === "completed";
  const isInactive = session.status === "canceled" || session.status === "archived";
  const canStart = session.status === "pending" || session.status === "in_progress";
  const primaryAction = canStart ? onStart : onSelect;
  const primaryLabel =
    session.status === "pending"
      ? copy.actions.start
      : session.status === "in_progress"
        ? copy.actions.resume
        : copy.actions.select;

  return (
    <article
      className={cn(
        "group rounded-[1.45rem] border bg-[var(--landing-surface)] p-4 shadow-[var(--landing-chip-inset-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-surface-strong)]",
        active
          ? "border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)]"
          : "border-[var(--landing-border)]",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", statusTone[session.status])}>
              {session.status === "completed" ? <CheckCircle2 className="size-3.5" /> : <CircleDot className="size-3.5" />}
              {copy.status[session.status]}
            </span>
            <Badge variant="muted">{session.subject}</Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--landing-text)]">{session.title}</h3>
            {session.description ? (
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--landing-text-muted)]">{session.description}</p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            onClick={() => primaryAction(session.id)}
            size="sm"
            variant={active && canStart ? "primary" : "secondary"}
          >
            {primaryLabel}
          </Button>
          <Button
            disabled={isCompleted || isInactive}
            onClick={() => onComplete(session.id)}
            size="sm"
            variant="ghost"
          >
            {copy.actions.complete}
          </Button>
          {canStart ? (
            <Button onClick={() => onCancel(session.id)} size="sm" variant="ghost">
              {copy.actions.cancel}
            </Button>
          ) : null}
          {session.status !== "archived" ? (
            <Button onClick={() => onArchive(session.id)} size="sm" variant="ghost">
              {copy.actions.archive}
            </Button>
          ) : null}
          <Button onClick={() => onDelete(session.id)} size="sm" variant="danger">
            <Trash2 className="size-4" />
            {copy.actions.delete}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[var(--landing-text-muted)] sm:grid-cols-2 xl:grid-cols-4">
        <Meta icon={Zap} label={copy.levels[session.difficulty]} value={copy.planner.difficultyLabel} />
        <Meta icon={TargetDot} label={copy.levels[session.importance]} value={copy.planner.importanceLabel} />
        <Meta icon={Timer} label={copy.list.estimated(session.estimatedMinutes)} value={copy.list.focusLogged(session.completedFocusSeconds)} />
        <Meta icon={CalendarDays} label={copy.list.dateRange(session.startDate, session.dueDate)} value="" />
      </div>
    </article>
  );
}

function TargetDot({ className }: { className?: string }) {
  return <CircleDot className={className} />;
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-3 py-2">
      <Icon className="size-4 shrink-0 text-[var(--landing-accent)]" />
      <div className="min-w-0">
        {value ? <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--landing-text-faint)]">{value}</p> : null}
        <p className="truncate text-sm text-[var(--landing-text-muted)]">{label}</p>
      </div>
    </div>
  );
}
