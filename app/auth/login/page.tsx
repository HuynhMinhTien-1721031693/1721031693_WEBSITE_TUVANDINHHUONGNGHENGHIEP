"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setToken, setUser } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      setError("Email không hợp lệ.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Đăng nhập thất bại.");
      }

      if (!payload?.token) {
        throw new Error("Thiếu token từ máy chủ.");
      }

      setToken(payload.token);
      if (payload?.user) {
        setUser(payload.user);
      }
      router.push("/dashboard");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-[#0F2044]/15 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#0F2044]">Đăng nhập</h1>
        <p className="mt-2 text-sm text-[#0F2044]/70">Đăng nhập để tiếp tục xem dashboard hướng nghiệp.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#0F2044]/20 px-3 outline-none focus:ring focus:ring-[#F5A623]/40"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#0F2044]/20 px-3 outline-none focus:ring focus:ring-[#F5A623]/40"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-[#0F2044] font-semibold text-white transition hover:bg-[#0b1733] disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {error && (
          <p className="mt-3 rounded-lg bg-[#F5A623]/10 px-3 py-2 text-sm text-[#0F2044]">
            {error}
          </p>
        )}

        <p className="mt-4 text-sm text-[#0F2044]/70">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="font-semibold text-[#F5A623] hover:underline">
            Đăng ký
          </Link>
        </p>
      </section>
    </main>
  );
}
