"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type QuizResult = {
  topTrait: string;
  topLabel: string;
  confidence: number;
  scores: Record<string, number>;
  careers: string[];
  strengths: string[];
};
type QuizHistoryEntry = QuizResult & {
  createdAt?: string;
  hollandCode?: string;
  mbtiCode?: string;
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
type TestResultApi = {
  _id: string;
  topLabel: string;
  confidence: number;
  careers: string[];
  createdAt: string;
  hollandCode?: string;
  mbtiCode?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const scoreColors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-cyan-500", "bg-fuchsia-500"];

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
  const [dbChatHistory, setDbChatHistory] = useState<ChatMessage[]>([]);
  const [dbLatestQuiz, setDbLatestQuiz] = useState<QuizResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResultApi[]>([]);

  const recentQuestions = useMemo(
    () =>
      chatHistory
        .filter((item) => item.role === "user")
        .slice(-5)
        .reverse(),
    [chatHistory],
  );

  const mergedQuestions = dbChatHistory.length > 0 ? dbChatHistory : recentQuestions;
  const activeQuizResult = quizResult || dbLatestQuiz;
  const scoreEntries = Object.entries(activeQuizResult?.scores || {});
  const maxScore = Math.max(...scoreEntries.map(([, value]) => value), 1);
  const localTestHistory = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("career_quiz_history");
      return raw ? (JSON.parse(raw) as QuizHistoryEntry[]) : [];
    } catch {
      return [];
    }
  }, []);
  const mergedTestHistory = testHistory.length
    ? testHistory
    : localTestHistory.map((item, index) => ({
        _id: `local-${index}`,
        topLabel: item.topLabel,
        confidence: item.confidence,
        careers: item.careers,
        createdAt: item.createdAt || new Date().toISOString(),
        hollandCode: item.hollandCode,
        mbtiCode: item.mbtiCode,
      }));

  useEffect(() => {
    async function loadPersistedData() {
      const token = localStorage.getItem("career_guidance_token");
      if (!token) return;
      try {
        const [historyRes, testRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/history`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/test-results`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const historyPayload = await historyRes.json();
        const testPayload = await testRes.json();

        if (historyRes.ok && Array.isArray(historyPayload.data)) {
          const mapped = historyPayload.data.map((item: Record<string, unknown>) => ({
            id: String(item._id || crypto.randomUUID()),
            role: "user" as const,
            content: String(item.message || ""),
            timestamp: String(item.createdAt || new Date().toISOString()),
          }));
          setDbChatHistory(mapped.slice(0, 5));
        }

        if (testRes.ok && Array.isArray(testPayload.data) && testPayload.data.length > 0) {
          const latest = testPayload.data[0] as QuizResult;
          setDbLatestQuiz(latest);
          setTestHistory(testPayload.data as TestResultApi[]);
        }
      } catch {
        // use localStorage fallback
      }
    }

    void loadPersistedData();
  }, []);

  useEffect(() => {
    async function buildDashboard() {
      if (!activeQuizResult) return;
      setLoading(true);
      setError(null);
      try {
        const latestQuestions = mergedQuestions.slice(0, 3).map((item) => item.content);
        const response = await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizResult: activeQuizResult, latestQuestions }),
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
  }, [activeQuizResult, mergedQuestions]);

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

        {!activeQuizResult && (
          <section className="rounded-2xl bg-amber-50 p-5 text-amber-800 ring-1 ring-amber-100">
            Chưa có dữ liệu quiz. Hãy hoàn thành bài test để mở dashboard đầy đủ.
          </section>
        )}

        {activeQuizResult && (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Nhóm nổi trội</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{activeQuizResult.topLabel}</p>
              </article>
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Mức phù hợp</p>
                <p className="mt-2 text-xl font-bold text-blue-700">{activeQuizResult.confidence}%</p>
              </article>
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Tin nhắn đã lưu</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{mergedQuestions.length}</p>
              </article>
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <p className="text-sm text-slate-500">Nghề đề xuất ưu tiên</p>
                <p className="mt-2 text-xl font-bold text-emerald-700">
                  {activeQuizResult.careers[0] || "Đang cập nhật"}
                </p>
              </article>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <h2 className="text-lg font-semibold text-slate-900">Biểu đồ kỹ năng</h2>
                <div className="mt-4 space-y-3">
                  {scoreEntries.map(([key, value], index) => {
                    const width = Math.min(100, Math.round((value / maxScore) * 100));
                    return (
                      <div key={key}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{key}</span>
                          <span className="font-semibold">{value} điểm</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full ${scoreColors[index % scoreColors.length]}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
                <h2 className="text-lg font-semibold text-slate-900">Nghề phù hợp</h2>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {activeQuizResult.careers.slice(0, 5).map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                <h3 className="mt-4 font-semibold text-slate-900">Điểm mạnh nổi bật</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {activeQuizResult.strengths.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử test</h2>
              {mergedTestHistory.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">Chưa có lịch sử test.</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {mergedTestHistory.slice(0, 10).map((item) => (
                    <div key={item._id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <span className="font-semibold">{item.topLabel}</span> - {item.confidence}% -
                      {` ${new Date(item.createdAt).toLocaleString("vi-VN")}`}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử câu hỏi gần đây</h2>
              {mergedQuestions.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">
                  Chưa có lịch sử chat AI. Hãy đặt một câu hỏi ở trang chủ để cá nhân hóa dashboard.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {mergedQuestions.map((item) => (
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
