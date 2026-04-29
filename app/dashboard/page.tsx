"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TraitScores = {
  analysis: number;
  creative: number;
  social: number;
  practical: number;
};

type QuizResult = {
  topTrait: "analysis" | "creative" | "social" | "practical";
  topLabel: string;
  confidence: number;
  scores: TraitScores;
  careers: string[];
  strengths: string[];
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type DashboardData = {
  summary: string;
  nextActions: string[];
  strongestDimension: string;
  recommendedTracks: string[];
};

export default function DashboardPage() {
  const [quizResult] = useState<QuizResult | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("career_quiz_latest_result");
      return raw ? (JSON.parse(raw) as QuizResult) : null;
    } catch {
      return null;
    }
  });
  const [chatHistory] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("career_chat_history");
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function buildDashboard() {
      if (!quizResult) return;
      const latestQuestions = chatHistory
        .filter((item) => item.role === "user")
        .slice(-3)
        .map((item) => item.content);

      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizResult, latestQuestions }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Không tạo được dashboard.");
      }
      setDashboardData(payload.data as DashboardData);
    }

    buildDashboard().catch((issue) => {
      setError(issue instanceof Error ? issue.message : "Lỗi dashboard.");
    });
  }, [quizResult, chatHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-6 md:px-8">
      <main className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Bảng điều khiển kết quả</h1>
              <p className="mt-2 text-slate-600">
                Tổng hợp từ bài test tính cách và lịch sử chat AI gần nhất.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">
                Trang chủ
              </Link>
              <Link href="/quiz" className="text-sm font-semibold text-blue-700 hover:underline">
                Làm lại quiz
              </Link>
            </div>
          </div>
        </section>

        {!quizResult && (
          <section className="rounded-2xl bg-amber-50 p-5 text-amber-800 ring-1 ring-amber-100">
            Chưa có kết quả quiz. Hãy hoàn thành bài test trước khi xem dashboard.
          </section>
        )}

        {quizResult && (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Nhóm nổi trội</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{quizResult.topLabel}</p>
              </article>
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Mức phù hợp</p>
                <p className="mt-2 text-xl font-bold text-blue-700">{quizResult.confidence}%</p>
              </article>
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Tin nhắn đã lưu</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{chatHistory.length}</p>
              </article>
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Nghề gợi ý</p>
                <p className="mt-2 text-xl font-bold text-emerald-700">
                  {quizResult.careers[0] || "Đang cập nhật"}
                </p>
              </article>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <h2 className="text-lg font-semibold text-slate-900">Điểm theo nhóm tính cách</h2>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  <li>- Phân tích: {quizResult.scores.analysis}</li>
                  <li>- Sáng tạo: {quizResult.scores.creative}</li>
                  <li>- Xã hội: {quizResult.scores.social}</li>
                  <li>- Thực tiễn: {quizResult.scores.practical}</li>
                </ul>
              </article>
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <h2 className="text-lg font-semibold text-slate-900">Điểm mạnh nổi bật</h2>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {quizResult.strengths.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            </section>

            {dashboardData && (
              <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900">Phân tích dashboard</h2>
                <p className="mt-3 text-slate-700">{dashboardData.summary}</p>
                <p className="mt-4 text-sm text-slate-500">
                  Trục mạnh nhất: <span className="font-semibold">{dashboardData.strongestDimension}</span>
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <article className="rounded-2xl bg-blue-50 p-4">
                    <h3 className="font-semibold text-blue-900">Hành động tiếp theo</h3>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800">
                      {dashboardData.nextActions.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </article>
                  <article className="rounded-2xl bg-emerald-50 p-4">
                    <h3 className="font-semibold text-emerald-900">Lộ trình nghề phù hợp</h3>
                    <ul className="mt-2 space-y-1 text-sm text-emerald-800">
                      {dashboardData.recommendedTracks.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>
            )}
          </>
        )}

        {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      </main>
    </div>
  );
}
