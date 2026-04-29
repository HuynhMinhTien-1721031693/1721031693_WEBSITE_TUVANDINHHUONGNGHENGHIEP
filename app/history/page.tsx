"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authFetch, getAuthToken } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type AdviceHistory = {
  _id: string;
  message: string;
  careerSuggestions: string[];
  createdAt: string;
};

type AssessmentHistory = {
  _id: string;
  type: string;
  code: string;
  summary: string;
  careers: string[];
  createdAt: string;
};

export default function HistoryPage() {
  const [adviceHistory, setAdviceHistory] = useState<AdviceHistory[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!getAuthToken()) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem lịch sử.");
        setLoading(false);
        return;
      }

      try {
        const [chatRes, assessmentRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/api/history`),
          authFetch(`${API_BASE_URL}/api/assessments`),
        ]);

        const chatPayload = await chatRes.json();
        const assessmentPayload = await assessmentRes.json();

        if (!chatRes.ok || !assessmentRes.ok) {
          throw new Error(chatPayload.error || assessmentPayload.error || "Không thể tải lịch sử.");
        }

        setAdviceHistory(Array.isArray(chatPayload.data) ? chatPayload.data : []);
        setAssessmentHistory(Array.isArray(assessmentPayload.data) ? assessmentPayload.data : []);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Lỗi khi tải lịch sử.");
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-8 md:px-8">
      <main className="mx-auto w-full max-w-5xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Lịch sử của bạn</h1>
            <div className="flex gap-3 text-sm font-semibold">
              <Link href="/assessment" className="text-blue-700 hover:underline">Assessment</Link>
              <Link href="/" className="text-blue-700 hover:underline">Trang chủ</Link>
            </div>
          </div>
        </section>

        {loading && <p className="text-sm text-slate-600">Đang tải lịch sử...</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {!loading && !error && (
          <>
            <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử tư vấn AI</h2>
              {adviceHistory.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">Chưa có dữ liệu.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {adviceHistory.map((item) => (
                    <div key={item._id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="font-medium">{item.message}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử assessment</h2>
              {assessmentHistory.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">Chưa có dữ liệu.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {assessmentHistory.map((item) => (
                    <div key={item._id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="font-medium">
                        {item.type.toUpperCase()} - {item.code || "N/A"}
                      </p>
                      <p className="mt-1">{item.summary}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
