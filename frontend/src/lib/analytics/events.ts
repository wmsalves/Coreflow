export const analyticsEvents = {
  dashboardEntry: "dashboard_entry",
  firstFocusSessionStarted: "first_focus_session_started",
  firstHabitCreated: "first_habit_created",
  firstWorkoutStarted: "first_workout_started",
  focusSessionCompleted: "focus_session_completed",
  onboardingCompleted: "onboarding_completed",
  signupCompleted: "signup_completed",
  workoutCompleted: "workout_completed",
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

export type AnalyticsEventProps = Record<
  string,
  boolean | number | string | null | undefined
>;
