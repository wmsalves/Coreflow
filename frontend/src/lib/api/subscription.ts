import { apiClient } from "@/lib/api/client";

export function getSubscription() {
  return apiClient("/subscription");
}
