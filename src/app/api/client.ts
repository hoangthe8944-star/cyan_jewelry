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

const API_ORIGIN = extractOrigin(API_BASE_URL);
const FALLBACK_API_ORIGIN = extractOrigin(FALLBACK_API_BASE_URL);

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const requestInit: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
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
