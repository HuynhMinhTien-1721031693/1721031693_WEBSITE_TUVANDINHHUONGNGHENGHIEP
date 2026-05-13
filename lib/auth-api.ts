const API_MESSAGE_VI: Record<string, string> = {
  "name, email and password are required": "Vui lòng nhập đủ họ tên, email và mật khẩu.",
  "email and password are required": "Vui lòng nhập email và mật khẩu.",
  "Email already exists": "Email này đã được đăng ký.",
  "Invalid email or password": "Email hoặc mật khẩu không đúng.",
};

export async function parseJsonSafely(
  response: Response,
): Promise<Record<string, unknown> | null> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function apiFailureMessage(payload: Record<string, unknown> | null): string | null {
  if (!payload) return null;
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  return null;
}

export function localizeAuthApiMessage(raw: string): string {
  return API_MESSAGE_VI[raw] ?? raw;
}
