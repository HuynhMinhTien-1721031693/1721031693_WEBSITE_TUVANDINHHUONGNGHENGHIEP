"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-client";
import withAuthGuard from "@/components/AuthGuard";

type RiasecGroup = "R" | "I" | "A" | "S" | "E" | "C";

type Question = {
  id: string;
  group: RiasecGroup;
  text: string;
};

const QUESTION_SETS: Record<RiasecGroup, string[]> = {
  R: [
    "Tôi thích sửa chữa hoặc lắp ráp thiết bị.",
    "Tôi hứng thú với công việc kỹ thuật, thực hành tay chân.",
    "Tôi muốn làm việc với máy móc, công cụ hoặc vật liệu thật.",
    "Tôi thấy hào hứng khi xây dựng hoặc chế tạo một thứ gì đó.",
    "Tôi thích môi trường công việc có hoạt động thực địa.",
  ],
  I: [
    "Tôi thích phân tích số liệu để tìm ra quy luật.",
    "Tôi hứng thú với việc nghiên cứu và đặt giả thuyết.",
    "Tôi muốn giải quyết vấn đề bằng tư duy logic.",
    "Tôi thích đọc tài liệu chuyên sâu để hiểu bản chất.",
    "Tôi thấy vui khi tự khám phá câu trả lời cho câu hỏi khó.",
  ],
  A: [
    "Tôi thích viết, vẽ hoặc tạo nội dung sáng tạo.",
    "Tôi hứng thú với việc biểu đạt ý tưởng theo cách mới.",
    "Tôi muốn làm việc trong môi trường linh hoạt, giàu cảm hứng.",
    "Tôi thường có nhiều ý tưởng độc đáo khi làm việc.",
    "Tôi yêu thích các hoạt động nghệ thuật và thiết kế.",
  ],
  S: [
    "Tôi thích hỗ trợ người khác học tập hoặc giải quyết khó khăn.",
    "Tôi hứng thú với việc lắng nghe và tư vấn cho mọi người.",
    "Tôi muốn công việc của mình tạo tác động tích cực cho cộng đồng.",
    "Tôi thấy vui khi làm việc nhóm và giúp đồng đội tiến bộ.",
    "Tôi ưu tiên các hoạt động mang tính giáo dục hoặc chăm sóc.",
  ],
  E: [
    "Tôi thích thuyết trình và truyền cảm hứng cho người khác.",
    "Tôi hứng thú với việc dẫn dắt một nhóm để đạt mục tiêu.",
    "Tôi muốn tham gia hoạt động kinh doanh hoặc khởi nghiệp.",
    "Tôi thấy thoải mái khi đàm phán và thuyết phục.",
    "Tôi thích môi trường cạnh tranh và định hướng thành tựu.",
  ],
  C: [
    "Tôi thích sắp xếp hồ sơ, dữ liệu theo quy trình rõ ràng.",
    "Tôi hứng thú với công việc cần độ chính xác cao.",
    "Tôi muốn làm việc với kế hoạch cụ thể và tiêu chuẩn rõ ràng.",
    "Tôi thấy yên tâm khi mọi thứ được tổ chức ngăn nắp.",
    "Tôi thích rà soát chi tiết để đảm bảo ít sai sót.",
  ],
};

const QUESTIONS: Question[] = (Object.keys(QUESTION_SETS) as RiasecGroup[]).flatMap(
  (group) =>
    QUESTION_SETS[group].map((text, index) => ({
      id: `${group}-${index + 1}`,
      group,
      text,
    })),
);

const SCALE_OPTIONS = [
  { value: 1, label: "Hoàn toàn không thích" },
  { value: 2, label: "Không thích" },
  { value: 3, label: "Bình thường" },
  { value: 4, label: "Thích" },
  { value: 5, label: "Rất thích" },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const totalQuestions = QUESTIONS.length;

  const allAnswered = useMemo(
    () => QUESTIONS.every((question) => Boolean(answers[question.id])),
    [answers],
  );

  useEffect(() => {
    setShowQuestion(false);
    const timer = window.setTimeout(() => setShowQuestion(true), 30);
    return () => window.clearTimeout(timer);
  }, [currentIndex]);

  async function handleSubmit() {
    setError(null);

    const token = getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!allAnswered) {
      setError("Vui lòng chọn điểm cho đầy đủ 30 câu hỏi.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          {
            answers: QUESTIONS.map((question) => ({
              questionId: question.id,
              tag: question.group,
              value: answers[question.id],
            })),
          },
        ),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload?.error || payload?.message || "Không thể chấm điểm bài quiz.",
        );
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("latest_quiz_result", JSON.stringify(payload?.data || payload));
      }
      router.push("/dashboard");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 md:py-10">
      <section className="app-card p-5 md:p-7">
        <h1 className="text-2xl font-bold text-[#0F2044] md:text-3xl">
          Quiz RIASEC
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Chọn 1 mức độ phù hợp cho từng câu hỏi.
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
            <span>Tiến độ</span>
            <span>
              Câu {currentIndex + 1}/{totalQuestions}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full rounded-full bg-[#F5A623] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div
          key={currentQuestion.id}
          className={`mt-6 transition-opacity duration-300 ${
            showQuestion ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nhóm {currentQuestion.group}
          </p>
          <p className="mt-2 text-lg font-semibold text-[#0F2044]">
            {currentQuestion.text}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SCALE_OPTIONS.map((option) => (
              <label
                key={`${currentQuestion.id}-${option.value}`}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  currentAnswer === option.value
                    ? "border-[#0F2044] bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={currentAnswer === option.value}
                  onChange={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: option.value,
                    }))
                  }
                  className="sr-only"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    {option.label}
                  </span>
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      currentAnswer === option.value
                        ? "border-[#0F2044] bg-[#0F2044]"
                        : "border-slate-300"
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
              }}
              disabled={!currentAnswer}
              className="btn-primary px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              Tiếp
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={loading || !allAnswered}
              className="btn-accent px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Hoàn thành"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export default withAuthGuard(QuizPage);
