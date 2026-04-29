export const AUTH_TOKEN_KEY = "career_guidance_token";
export const AUTH_USER_KEY = "career_guidance_user";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
};

export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function getAuthUser(): AuthUser | null {
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

export function saveAuthSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function authFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getAuthToken();
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
