"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clientApiUrl, CLIENT_API_CONNECTION_HINT_VI, isLikelyNetworkFetchFailure } from "@/lib/api-base";
import { apiFailureMessage, localizeAuthApiMessage, parseJsonSafely } from "@/lib/auth-api";
import type { AuthUser } from "@/lib/auth-client";
import { setToken, setUser } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Tên phải có ít nhất 2 ký tự.");
      return;
    }
    if (!normalizedEmail.includes("@")) {
      setError("Email không hợp lệ.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await fetch(clientApiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: normalizedEmail, password }),
      });

      const registerPayload = await parseJsonSafely(registerResponse);
      if (!registerResponse.ok) {
        const msg = apiFailureMessage(registerPayload);
        throw new Error(localizeAuthApiMessage(msg || "Đăng ký thất bại."));
      }

      const loginResponse = await fetch(clientApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const loginPayload = await parseJsonSafely(loginResponse);
      if (!loginResponse.ok) {
        const msg = apiFailureMessage(loginPayload);
        throw new Error(localizeAuthApiMessage(msg || "Không thể tự động đăng nhập."));
      }

      if (!loginPayload || typeof loginPayload.token !== "string") {
        throw new Error("Thiếu token từ máy chủ.");
      }

      setToken(loginPayload.token);
      if (loginPayload.user && typeof loginPayload.user === "object") {
        setUser(loginPayload.user as AuthUser);
      }
      router.push("/dashboard");
    } catch (issue) {
      if (isLikelyNetworkFetchFailure(issue)) {
        setError(CLIENT_API_CONNECTION_HINT_VI);
      } else {
        setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-[#0F2044]/15 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#0F2044]">Đăng ký</h1>
        <p className="mt-2 text-sm text-[#0F2044]/70">Tạo tài khoản để lưu kết quả quiz và lịch sử tư vấn.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="text"
            placeholder="Họ và tên"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#0F2044]/20 px-3 outline-none focus:ring focus:ring-[#F5A623]/40"
            required
          />
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
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#0F2044]/20 px-3 outline-none focus:ring focus:ring-[#F5A623]/40"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-[#0F2044] font-semibold text-white transition hover:bg-[#0b1733] disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        {error && (
          <p className="mt-3 rounded-lg bg-[#F5A623]/10 px-3 py-2 text-sm text-[#0F2044]">
            {error}
          </p>
        )}

        <p className="mt-4 text-sm text-[#0F2044]/70">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-semibold text-[#F5A623] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </section>
    </main>
  );
}
