import type { ReactNode } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FocusCopy } from "@/features/focus/content/focus-copy";
import { StudySessionCard } from "@/features/focus/components/study-session-card";
import type { FocusFilters, FocusLevel, FocusStatus, StudySession } from "@/features/focus/types/focus-types";

type StudySessionListProps = {
  activeSessionId: string | null;
  copy: FocusCopy;
  filters: FocusFilters;
  onArchive: (id: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onFilterChange: (filters: FocusFilters) => void;
  onSelect: (id: string) => void;
  onStart: (id: string) => void;
  pendingAction?: { id: string; type: string } | null;
  sessions: StudySession[];
};

const statuses: Array<FocusStatus | "all"> = [
  "all",
  "pending",
  "in_progress",
  "completed",
  "canceled",
  "archived",
];
const levels: Array<FocusLevel | "all"> = ["all", "low", "medium", "high"];

export function StudySessionList({
  activeSessionId,
  copy,
  filters,
  onArchive,
  onCancel,
  onComplete,
  onDelete,
  onEdit,
  onFilterChange,
  onSelect,
  onStart,
  pendingAction,
  sessions,
}: StudySessionListProps) {
  const upcomingSessions = sessions.filter(
    (session) => session.status === "pending" || session.status === "in_progress",
  );
  const inactiveSessions = sessions.filter(
    (session) => session.status === "canceled" || session.status === "archived",
  );

  return (
    <Card>
      <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
        <div>
          <CardTitle>{copy.list.title}</CardTitle>
          <CardDescription>{copy.list.description}</CardDescription>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <SlidersHorizontal className="hidden size-4 text-[var(--landing-text-muted)] sm:block" />
          <FilterSelect
            label={copy.list.filters.status}
            value={filters.status}
            onChange={(status) => onFilterChange({ ...filters, status: status as FocusStatus | "all" })}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? copy.list.filters.all : copy.status[status]}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            label={copy.list.filters.difficulty}
            value={filters.difficulty}
            onChange={(difficulty) => onFilterChange({ ...filters, difficulty: difficulty as FocusLevel | "all" })}
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === "all" ? copy.list.filters.all : copy.levels[level]}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            label={copy.list.filters.importance}
            value={filters.importance}
            onChange={(importance) => onFilterChange({ ...filters, importance: importance as FocusLevel | "all" })}
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level === "all" ? copy.list.filters.all : copy.levels[level]}
              </option>
            ))}
          </FilterSelect>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {sessions.length === 0 ? (
          <div className="rounded-[1.35rem] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 text-sm leading-6 text-[var(--landing-text-muted)]">
            <p className="font-medium text-[var(--landing-text)]">{copy.list.emptyTitle}</p>
            <p className="mt-1">{copy.list.emptyDescription}</p>
            <p className="mt-2 text-[var(--landing-text-soft)]">{copy.list.emptyHint}</p>
            <Button asChild className="mt-4" variant="secondary">
              <Link href="#plan-focus">{copy.list.emptyAction}</Link>
            </Button>
          </div>
        ) : (
          <>
            <SessionSection
              activeSessionId={activeSessionId}
              copy={copy}
              onArchive={onArchive}
              onCancel={onCancel}
              onComplete={onComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              onSelect={onSelect}
              onStart={onStart}
              pendingAction={pendingAction}
              sessions={upcomingSessions}
              title={copy.list.upcomingTitle}
            />
            <SessionSection
              activeSessionId={activeSessionId}
              copy={copy}
              onArchive={onArchive}
              onCancel={onCancel}
              onComplete={onComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              onSelect={onSelect}
              onStart={onStart}
              pendingAction={pendingAction}
              sessions={inactiveSessions}
              title={copy.list.archivedTitle}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SessionSection({
  activeSessionId,
  copy,
  onArchive,
  onCancel,
  onComplete,
  onDelete,
  onEdit,
  onSelect,
  onStart,
  pendingAction,
  sessions,
  title,
}: {
  activeSessionId: string | null;
  copy: FocusCopy;
  onArchive: (id: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSelect: (id: string) => void;
  onStart: (id: string) => void;
  pendingAction?: { id: string; type: string } | null;
  sessions: StudySession[];
  title: string;
}) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-faint)]">
          {title}
        </h3>
        <span className="text-xs font-medium text-[var(--landing-text-muted)]">
          {sessions.length}
        </span>
      </div>
      {sessions.map((session) => (
        <StudySessionCard
          active={session.id === activeSessionId}
          copy={copy}
          key={session.id}
          onArchive={onArchive}
          onCancel={onCancel}
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          onSelect={onSelect}
          onStart={onStart}
          pendingAction={pendingAction}
          session={session}
        />
      ))}
    </section>
  );
}

function FilterSelect({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="sr-only">
      {label}
      <select
        className="not-sr-only h-11 w-full rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 text-sm font-medium text-[var(--landing-text-muted)] outline-none transition focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)] sm:h-9 sm:w-auto sm:text-xs"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}
