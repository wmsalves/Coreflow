import { apiClient } from "@/lib/api/client";

export function getStudySessions() {
  return apiClient("/study/sessions");
}

export function startStudySession(subject?: string) {
  return apiClient("/study/sessions", {
    body: JSON.stringify({ subject }),
    method: "POST",
  });
}
