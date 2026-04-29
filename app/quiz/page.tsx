"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

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

const SCALE = [1, 2, 3, 4, 5];

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allAnswered = useMemo(
    () => QUESTIONS.every((question) => Boolean(answers[question.id])),
    [answers],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "RIASEC",
          answers: QUESTIONS.map((question) => ({
            questionId: question.id,
            group: question.group,
            score: answers[question.id],
          })),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Không thể chấm điểm bài quiz.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("latest_quiz_result", JSON.stringify(payload));
      }
      router.push("/dashboard");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Quiz RIASEC (30 câu)</h1>
      <p className="mt-2 text-slate-600">Mỗi câu chọn điểm từ 1 (rất không phù hợp) đến 5 (rất phù hợp).</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {QUESTIONS.map((question, index) => (
          <section key={question.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">
              Câu {index + 1}. [{question.group}] {question.text}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SCALE.map((value) => (
                <label
                  key={`${question.id}-${value}`}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${
                    answers[question.id] === value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={value}
                    checked={answers[question.id] === value}
                    onChange={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: value,
                      }))
                    }
                    className="sr-only"
                  />
                  {value}
                </label>
              ))}
            </div>
          </section>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !allAnswered}
          className="h-11 rounded-xl bg-slate-900 px-6 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang gửi..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
