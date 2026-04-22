import "server-only";
import type { ExerciseDetail, ExerciseSummary } from "@/features/fitness/types";

type ApiResponse<T> = {
  message: string;
  data: T;
};

type ApiErrorResponse = {
  message?: string;
};

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL.");
  }

  return baseUrl.replace(/\/+$/, "");
}

function buildUrl(path: string, query?: Record<string, string | number | boolean | null | undefined>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${getApiBaseUrl()}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function readErrorMessage(response: Response) {
  const fallback = "API request failed.";
  const rawBody = await response.text();

  if (!rawBody) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawBody) as ApiErrorResponse;
    return parsed.message || fallback;
  } catch {
    return rawBody;
  }
}

async function catalogRequest<T>(
  path: string,
  accessToken: string,
  query?: Record<string, string | number | boolean | null | undefined>,
) {
  const response = await fetch(buildUrl(path, query), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export function listExerciseCatalog(accessToken: string) {
  return catalogRequest<ExerciseSummary[]>("/v1/fitness/exercises", accessToken);
}

export function searchExerciseCatalog(query: string, accessToken: string) {
  return catalogRequest<ExerciseSummary[]>("/v1/fitness/exercises/search", accessToken, {
    q: query.trim(),
  });
}

export function getExerciseCatalogDetail(id: string, accessToken: string) {
  return catalogRequest<ExerciseDetail>(
    `/v1/fitness/exercises/${encodeURIComponent(id)}`,
    accessToken,
  );
}
