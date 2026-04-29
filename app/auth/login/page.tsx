"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Đăng nhập thất bại.");
      }

      if (!payload?.token) {
        throw new Error("Thiếu token từ máy chủ.");
      }

      setToken(payload.token);
      router.push("/dashboard");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-slate-900 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 text-sm text-slate-600">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="font-semibold text-blue-700 hover:underline">
            Đăng ký
          </Link>
        </p>
      </section>
    </main>
  );
}
