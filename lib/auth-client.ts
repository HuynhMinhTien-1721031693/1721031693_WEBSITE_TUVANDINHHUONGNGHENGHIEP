export const AUTH_TOKEN_KEY = "token";
export const AUTH_USER_KEY = "user";

export type AuthUser = {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
};

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  removeToken();
  localStorage.removeItem(AUTH_USER_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

// Backward-compatible aliases for existing imports in the project.
export const getAuthToken = getToken;
export const getAuthUser = getUser;
export const clearAuthSession = clearAuth;
export function saveAuthSession(token: string, user: AuthUser): void {
  setToken(token);
  setUser(user);
}

export async function authFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  const nextHeaders = new Headers(init.headers || {});

  if (!nextHeaders.has("Content-Type") && init.body) {
    nextHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers: nextHeaders,
  });
}
