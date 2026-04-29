"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

const scoreLabels: Array<{ key: keyof TraitScores; label: string; tone: string }> = [
  { key: "analysis", label: "Phân tích", tone: "bg-blue-500" },
  { key: "creative", label: "Sáng tạo", tone: "bg-emerald-500" },
  { key: "social", label: "Xã hội", tone: "bg-violet-500" },
  { key: "practical", label: "Thực tiễn", tone: "bg-amber-500" },
];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recentQuestions = useMemo(
    () =>
      chatHistory
        .filter((item) => item.role === "user")
        .slice(-5)
        .reverse(),
    [chatHistory],
  );

  useEffect(() => {
    async function buildDashboard() {
      if (!quizResult) return;
      setLoading(true);
      setError(null);
      try {
        const latestQuestions = recentQuestions.slice(0, 3).map((item) => item.content);
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
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Lỗi dashboard.");
      } finally {
        setLoading(false);
      }
    }

    void buildDashboard();
  }, [quizResult, recentQuestions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-6 md:px-8">
      <main className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard hướng nghiệp</h1>
              <p className="mt-2 text-slate-600">
                Tổng hợp từ kết quả quiz và lịch sử tư vấn AI để bạn hành động rõ ràng hơn.
              </p>
            </div>
            <div className="flex gap-3">
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
            Chưa có dữ liệu quiz. Hãy hoàn thành bài test để mở dashboard đầy đủ.
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
                <p className="text-sm text-slate-500">Nghề đề xuất ưu tiên</p>
                <p className="mt-2 text-xl font-bold text-emerald-700">
                  {quizResult.careers[0] || "Đang cập nhật"}
                </p>
              </article>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <h2 className="text-lg font-semibold text-slate-900">Điểm theo nhóm tính cách</h2>
                <div className="mt-4 space-y-3">
                  {scoreLabels.map((item) => {
                    const value = quizResult.scores[item.key];
                    const width = Math.min(100, Math.round((value / 34) * 100));
                    return (
                      <div key={item.key}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{item.label}</span>
                          <span className="font-semibold">{value} điểm</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <h2 className="text-lg font-semibold text-slate-900">Điểm mạnh nổi bật</h2>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {quizResult.strengths.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                <h3 className="mt-4 font-semibold text-slate-900">Top nghề gợi ý</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {quizResult.careers.slice(0, 3).map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử câu hỏi gần đây</h2>
              {recentQuestions.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">
                  Chưa có lịch sử chat AI. Hãy đặt một câu hỏi ở trang chủ để cá nhân hóa dashboard.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {recentQuestions.map((item) => (
                    <p key={item.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      - {item.content}
                    </p>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Phân tích hành động</h2>

              {loading && <p className="mt-3 text-sm text-slate-500">Đang tổng hợp dữ liệu dashboard...</p>}

              {dashboardData && (
                <>
                  <p className="mt-3 text-slate-700">{dashboardData.summary}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Trục mạnh nhất: <span className="font-semibold">{dashboardData.strongestDimension}</span>
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <article className="rounded-2xl bg-blue-50 p-4">
                      <h3 className="font-semibold text-blue-900">Hành động 30 ngày</h3>
                      <ul className="mt-2 space-y-1 text-sm text-blue-800">
                        {dashboardData.nextActions.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </article>
                    <article className="rounded-2xl bg-emerald-50 p-4">
                      <h3 className="font-semibold text-emerald-900">Lộ trình nghề ưu tiên</h3>
                      <ul className="mt-2 space-y-1 text-sm text-emerald-800">
                        {dashboardData.recommendedTracks.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </>
              )}
            </section>
          </>
        )}

        {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      </main>
    </div>
  );
}
