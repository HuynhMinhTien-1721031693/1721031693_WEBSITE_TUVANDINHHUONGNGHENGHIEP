"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApiUrl, CLIENT_API_CONNECTION_HINT_VI, isLikelyNetworkFetchFailure } from "@/lib/api-base";
import { apiFailureMessage, localizeAuthApiMessage, parseJsonSafely } from "@/lib/auth-api";
import type { AuthUser } from "@/lib/auth-client";
import { saveAuthSession } from "@/lib/auth-client";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail.includes("@")) {
        setError("Email không hợp lệ.");
        return;
      }
      if (password.length < 6) {
        setError("Mật khẩu tối thiểu 6 ký tự.");
        return;
      }

      if (mode === "register") {
        const trimmedName = fullName.trim();
        if (trimmedName.length < 2) {
          setError("Họ và tên cần ít nhất 2 ký tự.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Mật khẩu xác nhận không khớp.");
          return;
        }
      }

      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: normalizedEmail, password }
          : { name: fullName.trim(), email: normalizedEmail, password };

      const response = await fetch(clientApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await parseJsonSafely(response);
      if (!response.ok) {
        const apiError = apiFailureMessage(payload);
        throw new Error(localizeAuthApiMessage(apiError || "Xác thực thất bại."));
      }

      if (typeof payload?.token !== "string" || !payload?.user) {
        throw new Error("Máy chủ trả về dữ liệu không hợp lệ.");
      }

      saveAuthSession(payload.token, payload.user as AuthUser);
      setMessage(mode === "login" ? "Đăng nhập thành công." : "Đăng ký thành công.");
      router.push("/assessment");
      router.refresh();
    } catch (issue) {
      if (isLikelyNetworkFetchFailure(issue)) {
        setError(CLIENT_API_CONNECTION_HINT_VI);
        return;
      }
      setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  function fieldClass(disabled: boolean) {
    return `h-11 w-full rounded-xl border border-slate-200 px-4 outline-none ring-blue-200 focus:ring disabled:opacity-60 ${disabled ? "bg-slate-50" : "bg-white"}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-10">
      <main className="mx-auto w-full max-w-xl rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5">
        <h1 className="text-3xl font-bold text-slate-900">
          {mode === "login" ? "Đăng nhập" : "Đăng ký"}
        </h1>
        <p className="mt-2 text-slate-600">Xác thực tài khoản để lưu kết quả và lịch sử cá nhân.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {mode === "register" && (
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Họ và tên"
              className={fieldClass(loading)}
              autoComplete="name"
              disabled={loading}
              required
            />
          )}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            className={fieldClass(loading)}
            autoComplete={mode === "login" ? "email" : "username"}
            disabled={loading}
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            type="password"
            className={fieldClass(loading)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            disabled={loading}
            required
          />
          {mode === "register" && (
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Xác nhận mật khẩu"
              type="password"
              className={fieldClass(loading)}
              autoComplete="new-password"
              disabled={loading}
              required
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}

        <div className="mt-6 flex gap-4 text-sm font-semibold">
          <Link href="/" className="text-blue-700 hover:underline">
            Trang chủ
          </Link>
          {mode === "login" ? (
            <Link href="/register" className="text-blue-700 hover:underline">
              Chưa có tài khoản? Đăng ký
            </Link>
          ) : (
            <Link href="/login" className="text-blue-700 hover:underline">
              Đã có tài khoản? Đăng nhập
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
