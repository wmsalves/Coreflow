export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = RequestInit & {
  accessToken?: string | null;
  query?: Record<string, string | number | boolean | null | undefined>;
};

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL.");
  }

  return baseUrl.replace(/\/+$/, "");
}

function buildUrl(path: string, query?: ApiRequestOptions["query"]) {
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

async function getBrowserAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
  const {
    data: { session },
  } = await createBrowserSupabaseClient().auth.getSession();

  return session?.access_token ?? null;
}

export async function apiClient<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { accessToken, headers, query, ...init } = options;
  const token = accessToken ?? (await getBrowserAccessToken());
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Content-Type", "application/json");

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || "API request failed.", response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
