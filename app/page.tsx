"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AdviceResult = {
  careerSuggestions: string[];
  learningRoadmap: string[];
  salaryReference: string[];
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const features = [
  {
    title: "Bài kiểm tra tính cách",
    description: "10 câu hỏi chấm điểm để xác định nhóm nghề phù hợp.",
    href: "/quiz",
    cta: "Làm bài test",
  },
  {
    title: "Chat AI hướng nghiệp",
    description:
      "Nhận tư vấn nghề, lộ trình học và mức lương tham khảo theo bối cảnh cá nhân.",
    href: "/quiz",
    cta: "Trải nghiệm AI",
  },
  {
    title: "Dashboard kết quả",
    description:
      "Theo dõi điểm mạnh, nghề đề xuất và các bước hành động tiếp theo.",
    href: "/dashboard",
    cta: "Xem dashboard",
  },
];

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdviceResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = message.trim();
    if (!input) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/career-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Không thể lấy tư vấn.");

      setResult(payload.data as AdviceResult);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Đã có lỗi xảy ra khi gọi AI.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 px-4 py-8 text-slate-900 md:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5 md:p-12">
          <p className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Career Guidance Platform
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            Website hướng nghiệp hiện đại cho học sinh và sinh viên
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600 md:text-lg">
            Bắt đầu từ bài test tính cách, nhận tư vấn AI theo điểm mạnh và theo
            dõi tiến trình trên dashboard cá nhân.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Xem dashboard mẫu
            </Link>
            <Link
              href="/auth"
              className="rounded-xl border border-blue-300 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Đăng nhập / Đăng ký
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5"
            >
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              <Link
                href={feature.href}
                className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline"
              >
                {feature.cta}
              </Link>
            </article>
          ))}
        </section>

        <section
          id="ai-chat"
          className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8"
        >
          <h2 className="text-2xl font-semibold">AI tư vấn nghề nghiệp</h2>
          <p className="mt-2 text-slate-600">
            Nhập mô tả về sở thích hoặc điểm mạnh để nhận gợi ý nghề phù hợp.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ví dụ: Tôi học kém toán nhưng thích máy tính"
              className="h-12 flex-1 rounded-xl border border-slate-200 px-4 outline-none ring-blue-200 transition focus:ring"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-slate-900 px-6 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? "Đang phân tích..." : "Gửi cho AI"}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {result && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-900">Gợi ý nghề</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  {result.careerSuggestions.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl bg-emerald-50 p-4">
                <h3 className="font-semibold text-emerald-900">Lộ trình học</h3>
                <ul className="mt-2 space-y-1 text-sm text-emerald-800">
                  {result.learningRoadmap.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl bg-amber-50 p-4">
                <h3 className="font-semibold text-amber-900">
                  Mức lương tham khảo
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-amber-800">
                  {result.salaryReference.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
