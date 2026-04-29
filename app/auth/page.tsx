"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login" ? { email, password } : { fullName, email, password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Xác thực thất bại.");
      }

      localStorage.setItem("career_guidance_token", payload.token);
      localStorage.setItem("career_guidance_user", JSON.stringify(payload.user));
      setMessage(
        mode === "login"
          ? "Đăng nhập thành công. Bạn có thể quay về trang chủ để dùng AI."
          : "Đăng ký thành công. Bạn đã được đăng nhập tự động.",
      );
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-10">
      <main className="mx-auto w-full max-w-xl rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5">
        <h1 className="text-3xl font-bold text-slate-900">Đăng nhập / Đăng ký</h1>
        <p className="mt-2 text-slate-600">
          Xác thực bằng JWT để dùng các API thật của hệ thống.
        </p>

        <div className="mt-6 flex gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
              mode === "login" ? "bg-white text-slate-900" : "text-slate-600"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
              mode === "register" ? "bg-white text-slate-900" : "text-slate-600"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {mode === "register" && (
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Họ và tên"
              className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none ring-blue-200 focus:ring"
            />
          )}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none ring-blue-200 focus:ring"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mật khẩu (>= 6 ký tự)"
            type="password"
            className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none ring-blue-200 focus:ring"
          />
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

        <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:underline">
          ← Về trang chủ
        </Link>
      </main>
    </div>
  );
}
