import { apiClient } from "@/lib/api/client";

export function getDashboardOverview() {
  return apiClient("/dashboard/overview");
}
