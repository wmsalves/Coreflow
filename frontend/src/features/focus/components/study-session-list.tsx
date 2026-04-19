import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FocusCopy } from "@/features/focus/content/focus-copy";
import { StudySessionCard } from "@/features/focus/components/study-session-card";
import type { FocusFilters, FocusLevel, FocusStatus, StudySession } from "@/features/focus/types/focus-types";

type StudySessionListProps = {
  activeSessionId: string | null;
  copy: FocusCopy;
  filters: FocusFilters;
  onComplete: (id: string) => void;
  onFilterChange: (filters: FocusFilters) => void;
  onSelect: (id: string) => void;
  sessions: StudySession[];
};

const statuses: Array<FocusStatus | "all"> = ["all", "pending", "in_progress", "completed"];
const levels: Array<FocusLevel | "all"> = ["all", "low", "medium", "high"];

export function StudySessionList({
  activeSessionId,
  copy,
  filters,
  onComplete,
  onFilterChange,
  onSelect,
  sessions,
}: StudySessionListProps) {
  return (
    <Card>
      <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
        <div>
          <CardTitle>{copy.list.title}</CardTitle>
          <CardDescription>{copy.list.description}</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-4 text-[var(--landing-text-muted)]" />
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
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <div className="rounded-[1.35rem] border border-dashed border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 text-sm leading-6 text-[var(--landing-text-muted)]">
            <p className="font-medium text-[var(--landing-text)]">{copy.list.emptyTitle}</p>
            <p className="mt-1">{copy.list.emptyDescription}</p>
          </div>
        ) : (
          sessions.map((session) => (
            <StudySessionCard
              active={session.id === activeSessionId}
              copy={copy}
              key={session.id}
              onComplete={onComplete}
              onSelect={onSelect}
              session={session}
            />
          ))
        )}
      </CardContent>
    </Card>
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
        className="not-sr-only h-9 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 text-xs font-medium text-[var(--landing-text-muted)] outline-none transition focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}