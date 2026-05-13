/**
 * Base URL của API Express (không có dấu / cuối).
 * Để trống = gọi cùng origin với Next (rewrite trong next.config → backend), tránh lỗi CORS khi dev.
 * Production khác domain: đặt NEXT_PUBLIC_API_BASE_URL=https://api.example.com
 */
export function getClientApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (raw === undefined || raw === null || String(raw).trim() === "") return "";
  return String(raw).replace(/\/$/, "");
}

/** path bắt đầu bằng /, ví dụ /api/auth/login */
export function clientApiUrl(path: string): string {
  const base = getClientApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

export function isLikelyNetworkFetchFailure(issue: unknown): boolean {
  if (issue instanceof TypeError) return true;
  if (issue instanceof Error) {
    const m = issue.message.toLowerCase();
    return (
      m.includes("failed to fetch") ||
      m.includes("load failed") ||
      m.includes("networkerror") ||
      m.includes("network request failed")
    );
  }
  return false;
}

export const CLIENT_API_CONNECTION_HINT_VI =
  "Không kết nối được máy chủ API. Hãy chạy backend (ví dụ npm run dev:all), rồi tải lại trang. Nếu bạn đặt NEXT_PUBLIC_API_BASE_URL thì kiểm tra URL và CORS trên máy chủ.";
