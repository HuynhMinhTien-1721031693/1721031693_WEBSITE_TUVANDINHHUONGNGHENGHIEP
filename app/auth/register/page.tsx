"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const registerPayload = await registerResponse.json();
      if (!registerResponse.ok) {
        throw new Error(registerPayload?.error || "Đăng ký thất bại.");
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginPayload = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginPayload?.error || "Không thể tự động đăng nhập.");
      }

      if (!loginPayload?.token) {
        throw new Error("Thiếu token từ máy chủ.");
      }

      setToken(loginPayload.token);
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
        <h1 className="text-2xl font-bold text-slate-900">Đăng ký</h1>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="text"
            placeholder="Họ và tên"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:ring"
            required
          />
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
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-semibold text-blue-700 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </section>
    </main>
  );
}
