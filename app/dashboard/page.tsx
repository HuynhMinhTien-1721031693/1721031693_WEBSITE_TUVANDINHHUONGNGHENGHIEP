"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import withAuthGuard from "@/components/AuthGuard";
import { getToken } from "@/lib/auth";

type TraitKey = "R" | "I" | "A" | "S" | "E" | "C";

type AssessmentItem = {
  _id?: string;
  id?: string;
  createdAt?: string;
  result?: {
    type?: string;
    scores?: Record<string, number>;
    suggestedCareers?: string[];
  };
  scores?: Record<string, number>;
  careers?: string[];
};

type HistoryItem = {
  _id?: string;
  id?: string;
  message?: string;
  question?: string;
  content?: string;
  createdAt?: string;
};

type DashboardUser = {
  name: string;
  email: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const TRAIT_META: Array<{ key: TraitKey; label: string; colorClass: string }> = [
  { key: "R", label: "Realistic", colorClass: "bg-sky-500" },
  { key: "I", label: "Investigative", colorClass: "bg-indigo-500" },
  { key: "A", label: "Artistic", colorClass: "bg-fuchsia-500" },
  { key: "S", label: "Social", colorClass: "bg-emerald-500" },
  { key: "E", label: "Enterprising", colorClass: "bg-amber-500" },
  { key: "C", label: "Conventional", colorClass: "bg-cyan-600" },
];

function createEmptyScores(): Record<TraitKey, number> {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    const json = atob(payload);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizeRiasecScores(
  rawScores: Record<string, number> | undefined,
): Record<TraitKey, number> {
  const scores = createEmptyScores();
  if (!rawScores) return scores;

  for (const [key, value] of Object.entries(rawScores)) {
    const normalized = key.trim().toUpperCase();
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) continue;

    if (normalized in scores) {
      scores[normalized as TraitKey] = numericValue;
      continue;
    }

    if (normalized === "REALISTIC") scores.R = numericValue;
    if (normalized === "INVESTIGATIVE") scores.I = numericValue;
    if (normalized === "ARTISTIC") scores.A = numericValue;
    if (normalized === "SOCIAL") scores.S = numericValue;
    if (normalized === "ENTERPRISING") scores.E = numericValue;
    if (normalized === "CONVENTIONAL") scores.C = numericValue;
  }

  return scores;
}

function toCareerMatchList(careers: string[]): Array<{ name: string; matchPercent: number }> {
  return careers.slice(0, 6).map((name, index) => ({
    name,
    matchPercent: Math.max(70, 95 - index * 6),
  }));
}

function DashboardPage() {
  const [user, setUser] = useState<DashboardUser>({
    name: "Người dùng",
    email: "user@example.com",
  });
  const [riasecScores, setRiasecScores] = useState<Record<TraitKey, number>>(
    createEmptyScores(),
  );
  const [suggestedCareers, setSuggestedCareers] = useState<
    Array<{ name: string; matchPercent: number }>
  >([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingAssessment, setLoadingAssessment] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawUser = localStorage.getItem("career_guidance_user");
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as {
          fullName?: string;
          name?: string;
          email?: string;
        };
        setUser({
          name: parsed.fullName || parsed.name || "Người dùng",
          email: parsed.email || "user@example.com",
        });
        return;
      } catch {
        // ignore invalid user cache
      }
    }

    const token = getToken() || "";
    if (!token) return;

    const payload = decodeTokenPayload(token);
    if (!payload) return;

    setUser({
      name: String(payload.fullName || payload.name || "Người dùng"),
      email: String(payload.email || "user@example.com"),
    });
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      const token = getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      setError(null);
      setLoadingAssessment(true);
      setLoadingHistory(true);

      try {
        const [assessmentResponse, historyResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/assessment/history`, { headers }),
          fetch(`${API_BASE_URL}/api/history`, { headers }),
        ]);

        if (assessmentResponse.ok) {
          const payload = (await assessmentResponse.json()) as { data?: AssessmentItem[] };
          const list = Array.isArray(payload?.data) ? payload.data : [];
          const latest = list[0];

          if (latest) {
            const rawScores = latest.result?.scores || latest.scores;
            const normalizedScores = normalizeRiasecScores(rawScores);
            setRiasecScores(normalizedScores);

            const careers =
              latest.result?.suggestedCareers ||
              latest.careers ||
              [];
            setSuggestedCareers(toCareerMatchList(careers));
          }
        } else {
          const assessmentError = (await assessmentResponse.json().catch(() => null)) as
            | { error?: string; message?: string }
            | null;
          setError(assessmentError?.error || assessmentError?.message || "Không tải được kết quả RIASEC.");
        }

        if (historyResponse.ok) {
          const payload = (await historyResponse.json()) as { data?: HistoryItem[] };
          const list = Array.isArray(payload?.data) ? payload.data : [];
          setHistory(list.slice(0, 5));
        } else {
          const historyError = (await historyResponse.json().catch(() => null)) as
            | { error?: string; message?: string }
            | null;
          setError(historyError?.error || historyError?.message || "Không tải được lịch sử tư vấn AI.");
        }
      } catch (issue) {
        setError(
          issue instanceof Error ? issue.message : "Có lỗi xảy ra khi tải dữ liệu dashboard.",
        );
      } finally {
        setLoadingAssessment(false);
        setLoadingHistory(false);
      }
    }

    void loadDashboardData();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("latest_quiz_result");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as {
        scores?: Record<string, number>;
        careers?: string[];
        suggestedCareers?: string[];
      };
      if (parsed.scores && Object.keys(parsed.scores).length > 0) {
        setRiasecScores(normalizeRiasecScores(parsed.scores));
      }
      const fallbackCareers = parsed.careers || parsed.suggestedCareers || [];
      if (fallbackCareers.length > 0) {
        setSuggestedCareers(toCareerMatchList(fallbackCareers));
      }
    } catch {
      // ignore invalid cache
    }
  }, []);

  const maxScore = Math.max(...Object.values(riasecScores), 1);
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-8">
      <section className="app-card p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F2044] text-lg font-bold text-white">
              {initials || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F2044] md:text-3xl">Dashboard cá nhân</h1>
              <p className="mt-1 text-sm text-slate-600">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/assessment" className="btn-primary px-4 py-2 text-sm font-semibold">
              Làm lại bài test
            </Link>
            <Link href="/" className="btn-accent px-4 py-2 text-sm font-semibold">
              Tư vấn thêm
            </Link>
          </div>
        </div>
      </section>

      <section className="app-card p-6 md:p-7">
        <h2 className="text-xl font-semibold text-[#0F2044]">Kết quả RIASEC mới nhất</h2>
        {loadingAssessment ? (
          <p className="mt-3 text-sm text-slate-500">Đang tải kết quả RIASEC...</p>
        ) : (
          <div className="mt-4 space-y-4">
            {TRAIT_META.map((trait) => {
              const value = riasecScores[trait.key];
              const percent = Math.round((value / maxScore) * 100);
              return (
                <div key={trait.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {trait.label}
                    </span>
                    <span className="font-semibold text-slate-600">{value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100">
                    <div
                      className={`h-3 rounded-full ${trait.colorClass} transition-all`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="app-card p-6 md:p-7">
        <h2 className="text-xl font-semibold text-[#0F2044]">Danh sách nghề gợi ý</h2>
        {suggestedCareers.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {suggestedCareers.map((career) => (
              <article
                key={career.name}
                className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"
              >
                <p className="font-semibold text-emerald-900">{career.name}</p>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  Độ phù hợp: {career.matchPercent}%
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Chưa có nghề gợi ý. Hãy làm bài test để nhận đề xuất nghề nghiệp.
          </p>
        )}
      </section>

      <section className="app-card p-6 md:p-7">
        <h2 className="text-xl font-semibold text-[#0F2044]">Lịch sử tư vấn AI</h2>
        {loadingHistory ? (
          <p className="mt-3 text-sm text-slate-500">Đang tải lịch sử...</p>
        ) : history.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Chưa có lịch sử tư vấn.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {history.slice(0, 5).map((item, index) => (
              <article
                key={item._id || item.id || `${item.createdAt || "history"}-${index}`}
                className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-slate-700"
              >
                <p className="line-clamp-2">
                  {item.message || item.question || item.content || "(Không có nội dung)"}
                </p>
                {item.createdAt && (
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {error && (
        <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </main>
  );
}

export default withAuthGuard(DashboardPage);
