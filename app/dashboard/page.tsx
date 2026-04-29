"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import withAuthGuard from "@/components/AuthGuard";
import { getToken } from "@/lib/auth";

type QuizResult = {
  type?: string;
  careers?: string[];
  suggestedCareers?: string[];
  code?: string;
  topLabel?: string;
};

type HistoryItem = {
  _id?: string;
  id?: string;
  message?: string;
  question?: string;
  content?: string;
  createdAt?: string;
};

function DashboardPage() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("latest_quiz_result");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as QuizResult;
      setQuizResult(parsed);
    } catch {
      // ignore invalid cache
    }
  }, []);

  useEffect(() => {
    async function loadHistory() {
      setLoadingHistory(true);
      setError(null);
      try {
        const token = getToken();
        const response = await fetch("/api/history", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Không tải được lịch sử tư vấn.");
        }
        const list = Array.isArray(payload?.data)
          ? (payload.data as HistoryItem[])
          : Array.isArray(payload)
            ? (payload as HistoryItem[])
            : [];
        setHistory(list);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
      } finally {
        setLoadingHistory(false);
      }
    }

    void loadHistory();
  }, []);

  const typeLabel = quizResult?.type || "RIASEC";
  const suggestedCareers = quizResult?.careers || quizResult?.suggestedCareers || [];
  const codeOrTop = quizResult?.code || quizResult?.topLabel || "Chưa có";

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-6 px-4 py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Theo dõi kết quả quiz gần nhất và lịch sử tư vấn AI của bạn.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/quiz" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Làm lại quiz
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
          >
            Tư vấn thêm
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Kết quả quiz gần nhất</h2>
        <p className="mt-2 text-sm text-slate-600">Loại bài test: {typeLabel}</p>
        <p className="mt-1 text-sm text-slate-600">Nhóm nổi bật: {codeOrTop}</p>
        {suggestedCareers.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            {suggestedCareers.slice(0, 5).map((career) => (
              <li key={career}>- {career}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Chưa có nghề gợi ý. Hãy làm quiz để cập nhật kết quả.</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Lịch sử tư vấn AI</h2>
        {loadingHistory ? (
          <p className="mt-2 text-sm text-slate-500">Đang tải lịch sử...</p>
        ) : history.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Chưa có lịch sử tư vấn.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {history.slice(0, 10).map((item, index) => (
              <article
                key={item._id || item.id || `${item.createdAt || "history"}-${index}`}
                className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <p>{item.message || item.question || item.content || "(Không có nội dung)"}</p>
                {item.createdAt && (
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>
    </main>
  );
}

export default withAuthGuard(DashboardPage);
