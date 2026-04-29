"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import withAuthGuard from "@/components/AuthGuard";
import { clearAuth, getToken, getUser } from "@/lib/auth-client";

type TraitKey = "R" | "I" | "A" | "S" | "E" | "C";

type AssessmentItem = {
  _id?: string;
  createdAt?: string;
  riasecScores?: Partial<Record<TraitKey, number>>;
  dominantType?: TraitKey;
  suggestedCareers?: string[];
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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

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

function normalizeRiasecScores(rawScores?: Partial<Record<TraitKey, number>>) {
  const scores = createEmptyScores();
  if (!rawScores) return scores;
  for (const key of ["R", "I", "A", "S", "E", "C"] as TraitKey[]) {
    const value = Number(rawScores[key] || 0);
    scores[key] = Number.isFinite(value) ? value : 0;
  }
  return scores;
}

function getPersonalityTypeName(scores: Record<TraitKey, number>): string {
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => TRAIT_META.find((item) => item.key === key)?.label || key);
  return sorted.join(" - ");
}

function DashboardPage() {
  const [user, setUser] = useState<DashboardUser>({
    name: "Người dùng",
    email: "user@example.com",
  });
  const [personalityName, setPersonalityName] = useState("Đang cập nhật");
  const [riasecScores, setRiasecScores] = useState<Record<TraitKey, number>>(
    createEmptyScores(),
  );
  const [suggestedCareers, setSuggestedCareers] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingAssessment, setLoadingAssessment] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsed = getUser();
    if (!parsed) return;
    setUser({
      name: parsed.name || parsed.fullName || "Người dùng",
      email: parsed.email || "user@example.com",
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
          fetch(`${BASE_URL}/api/assessment/my`, { headers }),
          fetch(`${BASE_URL}/api/history`, { headers }),
        ]);

        if (assessmentResponse.ok) {
          const payload = (await assessmentResponse.json()) as { data?: AssessmentItem[] };
          const list = Array.isArray(payload?.data) ? payload.data : [];
          const latest = list[0];

          if (latest) {
            const normalizedScores = normalizeRiasecScores(latest.riasecScores);
            setRiasecScores(normalizedScores);
            setPersonalityName(getPersonalityTypeName(normalizedScores));
            setSuggestedCareers(
              Array.isArray(latest.suggestedCareers) ? latest.suggestedCareers.slice(0, 5) : [],
            );
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

  const maxScore = Math.max(...Object.values(riasecScores), 1);
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  const traitPercent = (value: number) => Math.round((value / maxScore) * 100);

  function handleLogout() {
    clearAuth();
    window.location.href = "/auth/login";
  }

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
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-[#0F2044]/20 px-4 py-2 text-sm font-semibold text-[#0F2044] hover:bg-slate-50"
            >
              Đăng xuất
            </button>
            <Link href="/quiz" className="btn-primary px-4 py-2 text-sm font-semibold">
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
        <p className="mt-2 inline-flex rounded-full bg-[#F5A623]/20 px-3 py-1 text-sm font-semibold text-[#0F2044]">
          {personalityName}
        </p>
        {loadingAssessment ? (
          <p className="mt-3 text-sm text-slate-500">Đang tải kết quả RIASEC...</p>
        ) : (
          <div className="mt-4 space-y-4">
            {TRAIT_META.map((trait) => {
              const value = riasecScores[trait.key];
              const percent = traitPercent(value);
              return (
                <div key={trait.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {trait.label}
                    </span>
                    <span className="rounded-full bg-[#0F2044]/10 px-2 py-0.5 font-semibold text-[#0F2044]">
                      {percent}%
                    </span>
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
            {suggestedCareers.map((career, index) => (
              <article
                key={`${career}-${index}`}
                className="rounded-xl border border-[#0F2044]/10 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-[#0F2044]">{career}</p>
                  <span className="rounded-full bg-[#F5A623]/20 px-2 py-0.5 text-xs font-semibold text-[#0F2044]">
                    Phù hợp
                  </span>
                </div>
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
