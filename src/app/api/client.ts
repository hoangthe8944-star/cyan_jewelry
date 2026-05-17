const DEFAULT_API_BASE_URL = "https://cyan-admin.onrender.com";
const DEFAULT_FALLBACK_API_BASE_URL = "http://localhost:8081";

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  return normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL);
}

function resolveFallbackApiBaseUrl() {
  const envBaseUrl = import.meta.env.VITE_FALLBACK_API_BASE_URL;
  return envBaseUrl ? normalizeBaseUrl(envBaseUrl) : DEFAULT_FALLBACK_API_BASE_URL;
}

const API_BASE_URL = resolveApiBaseUrl();
const FALLBACK_API_BASE_URL = resolveFallbackApiBaseUrl();

function buildUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path}`;
}

function extractOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError;
}

type QueryValue = string | number | boolean | null | undefined;

function looksLikeUploadedMedia(value: Record<string, unknown>) {
  return typeof value.url === "string" && typeof value.contentType === "string";
}

function toMediaPayload(value: Record<string, unknown>) {
  const contentType = String(value.contentType ?? "");
  const mediaType = contentType.startsWith("video/") ? "MP4" : "IMAGE";

  return {
    mediaType,
    url: String(value.url),
  };
}

function normalizeDateTimeValue(value: string) {
  const isoDate = new Date(value);

  if (Number.isNaN(isoDate.getTime())) {
    return value;
  }

  const pad = (input: number) => String(input).padStart(2, "0");

  return `${isoDate.getFullYear()}-${pad(isoDate.getMonth() + 1)}-${pad(isoDate.getDate())}T${pad(
    isoDate.getHours()
  )}:${pad(isoDate.getMinutes())}:${pad(isoDate.getSeconds())}`;
}

function sanitizeJsonPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeJsonPayload);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (looksLikeUploadedMedia(value as Record<string, unknown>)) {
    return toMediaPayload(value as Record<string, unknown>);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (key === "ctaLabel" && typeof nestedValue === "string") {
        return [key, nestedValue.trim().slice(0, 80)];
      }

      if (
        typeof nestedValue === "string" &&
        /(publishedAt|createdAt|updatedAt|startAt|endAt)$/i.test(key) &&
        nestedValue.includes("T")
      ) {
        return [key, normalizeDateTimeValue(nestedValue)];
      }

      return [key, sanitizeJsonPayload(nestedValue)];
    })
  );
}

const API_ORIGIN = extractOrigin(API_BASE_URL);
const FALLBACK_API_ORIGIN = extractOrigin(FALLBACK_API_BASE_URL);

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedBody =
    typeof init?.body === "string" && (init.body.trim().startsWith("{") || init.body.trim().startsWith("["))
      ? JSON.stringify(sanitizeJsonPayload(JSON.parse(init.body)))
      : init?.body;

  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
    body: normalizedBody,
  };

  let response: Response;

  try {
    response = await fetch(buildUrl(API_BASE_URL, path), requestInit);
  } catch (error) {
    const shouldFallbackToRender =
      API_BASE_URL !== FALLBACK_API_BASE_URL && isNetworkError(error);

    if (!shouldFallbackToRender) {
      throw error;
    }

    response = await fetch(buildUrl(FALLBACK_API_BASE_URL, path), requestInit);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function buildQuery(params: Record<string, QueryValue>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export { API_BASE_URL, API_ORIGIN, FALLBACK_API_BASE_URL, FALLBACK_API_ORIGIN };
