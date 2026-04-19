export type FocusLevel = "low" | "medium" | "high";

export type FocusStatus = "pending" | "in_progress" | "completed";

export type PomodoroPhase = "focus" | "short_break" | "long_break" | "complete";

export type PomodoroSettings = {
  cycles: number;
  focusMinutes: number;
  longBreakMinutes: number;
  shortBreakMinutes: number;
};

export type StudySession = {
  id: string;
  title: string;
  description: string;
  difficulty: FocusLevel;
  importance: FocusLevel;
  estimatedMinutes: number;
  startDate: string;
  dueDate: string;
  status: FocusStatus;
  subject: string;
  completedFocusMinutes: number;
};

export type StudySessionInput = Omit<StudySession, "id" | "completedFocusMinutes" | "status"> & {
  status?: FocusStatus;
};

export type FocusFilters = {
  difficulty: FocusLevel | "all";
  importance: FocusLevel | "all";
  status: FocusStatus | "all";
};