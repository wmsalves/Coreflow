import type { Database } from "@/types/database";
import type {
  FocusLevel,
  FocusStatus,
  StudySession,
  StudySessionInput,
} from "@/features/focus/types/focus-types";

type StudySessionRow = Database["public"]["Tables"]["study_sessions"]["Row"];

type StoredSessionMetadata = {
  description?: string;
  difficulty?: FocusLevel;
  dueDate?: string;
  estimatedMinutes?: number;
  importance?: FocusLevel;
  status?: FocusStatus;
  title?: string;
};

const defaultDifficulty: FocusLevel = "medium";
const defaultImportance: FocusLevel = "medium";
const defaultEstimatedMinutes = 45;

export function serializeStudySessionMetadata(input: StudySessionInput | StudySession) {
  return JSON.stringify({
    description: input.description,
    difficulty: input.difficulty,
    dueDate: input.dueDate,
    estimatedMinutes: input.estimatedMinutes,
    importance: input.importance,
    status: input.status ?? "pending",
    title: input.title,
  } satisfies StoredSessionMetadata);
}

export function toStudySession(row: StudySessionRow): StudySession {
  const metadata = parseMetadata(row.notes);
  const startDate = row.started_at.slice(0, 10);
  const dueDate = metadata.dueDate ?? startDate;
  const completedFocusMinutes = row.duration_minutes ?? 0;

  return {
    completedFocusMinutes,
    description: metadata.description ?? "",
    difficulty: metadata.difficulty ?? defaultDifficulty,
    dueDate,
    estimatedMinutes: metadata.estimatedMinutes ?? (completedFocusMinutes || defaultEstimatedMinutes),
    id: row.id,
    importance: metadata.importance ?? defaultImportance,
    startDate,
    status: row.ended_at ? "completed" : metadata.status ?? "pending",
    subject: row.subject ?? "Focus",
    title: metadata.title ?? row.subject ?? "Study session",
  };
}

export function withStatus(session: StudySession, status: FocusStatus, focusMinutes?: number): StudySession {
  const completedFocusMinutes =
    focusMinutes === undefined
      ? session.completedFocusMinutes
      : Math.max(session.completedFocusMinutes, focusMinutes);

  return {
    ...session,
    completedFocusMinutes,
    status,
  };
}

function parseMetadata(notes: string | null): StoredSessionMetadata {
  if (!notes) {
    return {};
  }

  try {
    const parsed = JSON.parse(notes) as StoredSessionMetadata;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {
      description: notes,
    };
  }
}
