export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
}

const AUTH_STORAGE_KEY = "oriven-auth-user";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeIdSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createAuthUserId(email: string) {
  const [localPart] = email.split("@");
  const normalizedLocalPart = normalizeIdSegment(localPart || "user");
  return `user-${normalizedLocalPart || "guest"}`;
}

export function saveAuthUser(user: AuthUser) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<AuthUser>;
    if (
      typeof parsedValue?.id !== "string" ||
      typeof parsedValue?.fullName !== "string" ||
      typeof parsedValue?.email !== "string"
    ) {
      return null;
    }

    return {
      id: parsedValue.id,
      fullName: parsedValue.fullName,
      email: parsedValue.email,
    };
  } catch {
    return null;
  }
}

export function clearAuthUser() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
