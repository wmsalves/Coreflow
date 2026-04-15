import { apiClient } from "@/lib/api/client";

export type HabitPayload = {
  description?: string | null;
  frequencyPerWeek: number;
  name: string;
};

export function getHabits() {
  return apiClient("/habits");
}

export function createHabit(payload: HabitPayload) {
  return apiClient("/habits", {
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function toggleHabit(habitId: string) {
  return apiClient(`/habits/${habitId}/toggle`, {
    method: "POST",
  });
}
