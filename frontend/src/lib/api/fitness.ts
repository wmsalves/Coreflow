import { apiClient } from "@/lib/api/client";

export function getWorkoutPlans() {
  return apiClient("/fitness/workout-plans");
}

export function getWorkoutLogs() {
  return apiClient("/fitness/workout-logs");
}
