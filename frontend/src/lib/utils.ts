export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function getQueryParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return rawValue;
  }

  return rawValue.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 300);
}

type StringOptions = {
  maxLength?: number;
};

export function getRequiredString(
  formData: FormData,
  key: string,
  options: StringOptions = {},
) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Expected "${key}" to be a non-empty string.`);
  }

  const trimmed = value.trim();

  if (options.maxLength && trimmed.length > options.maxLength) {
    throw new Error(`Expected "${key}" to be ${options.maxLength} characters or fewer.`);
  }

  return trimmed;
}

export function getOptionalString(
  formData: FormData,
  key: string,
  options: StringOptions = {},
) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (options.maxLength && trimmed.length > options.maxLength) {
    throw new Error(`Expected "${key}" to be ${options.maxLength} characters or fewer.`);
  }

  return trimmed.length > 0 ? trimmed : null;
}

export function buildRedirectUrl(
  path: string,
  params: Record<string, string | null | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function formatPercentage(value: number) {
  return `${Math.round(value * 100)}%`;
}
