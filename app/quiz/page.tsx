"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Trait = "analysis" | "creative" | "social" | "practical";
type QuestionOption = { id: string; text: string; trait: Trait; score: number };
type Question = { id: number; text: string; options: QuestionOption[] };

type QuizApiResponse = {
  topTrait: Trait;
  topLabel: string;
  confidence: number;
  scores: Record<Trait, number>;
  careers: string[];
  strengths: string[];
};

const QUIZ_STORAGE_KEY = "career_quiz_latest_result";

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Khi làm việc nhóm, bạn thường đảm nhận vai trò nào?",
    options: [
      { id: "1a", text: "Phân tích vấn đề và đưa ra kế hoạch.", trait: "analysis", score: 4 },
      { id: "1b", text: "Đề xuất ý tưởng mới và thiết kế giải pháp.", trait: "creative", score: 4 },
      { id: "1c", text: "Kết nối mọi người và giữ tinh thần nhóm.", trait: "social", score: 4 },
      { id: "1d", text: "Thực thi công việc và đảm bảo tiến độ.", trait: "practical", score: 4 },
    ],
  },
  {
    id: 2,
    text: "Bạn hứng thú nhất với hoạt động nào?",
    options: [
      { id: "2a", text: "Giải quyết bài toán logic.", trait: "analysis", score: 3 },
      { id: "2b", text: "Sáng tạo nội dung/hình ảnh.", trait: "creative", score: 3 },
      { id: "2c", text: "Tư vấn và hỗ trợ người khác.", trait: "social", score: 3 },
      { id: "2d", text: "Làm sản phẩm hoặc thao tác thực hành.", trait: "practical", score: 3 },
    ],
  },
  {
    id: 3,
    text: "Môi trường làm việc bạn thích nhất là:",
    options: [
      { id: "3a", text: "Có dữ liệu và tiêu chí rõ ràng.", trait: "analysis", score: 3 },
      { id: "3b", text: "Linh hoạt, nhiều không gian sáng tạo.", trait: "creative", score: 3 },
      { id: "3c", text: "Tương tác con người thường xuyên.", trait: "social", score: 3 },
      { id: "3d", text: "Tập trung vào hiệu quả thực tế.", trait: "practical", score: 3 },
    ],
  },
  {
    id: 4,
    text: "Khi gặp vấn đề khó, bạn thường:",
    options: [
      { id: "4a", text: "Chia nhỏ vấn đề và phân tích từng bước.", trait: "analysis", score: 4 },
      { id: "4b", text: "Đổi góc nhìn để tìm cách mới.", trait: "creative", score: 4 },
      { id: "4c", text: "Hỏi ý kiến và thảo luận với người khác.", trait: "social", score: 4 },
      { id: "4d", text: "Thử nghiệm nhanh rồi tối ưu dần.", trait: "practical", score: 4 },
    ],
  },
  {
    id: 5,
    text: "Bạn cảm thấy tự tin nhất với điểm mạnh nào?",
    options: [
      { id: "5a", text: "Tư duy hệ thống.", trait: "analysis", score: 3 },
      { id: "5b", text: "Thẩm mỹ và ý tưởng.", trait: "creative", score: 3 },
      { id: "5c", text: "Giao tiếp và đồng cảm.", trait: "social", score: 3 },
      { id: "5d", text: "Kỷ luật và bền bỉ.", trait: "practical", score: 3 },
    ],
  },
  {
    id: 6,
    text: "Bạn muốn tạo ra giá trị gì trong công việc?",
    options: [
      { id: "6a", text: "Tối ưu bằng dữ liệu và quy trình.", trait: "analysis", score: 4 },
      { id: "6b", text: "Trải nghiệm sáng tạo cho người dùng.", trait: "creative", score: 4 },
      { id: "6c", text: "Giúp người khác phát triển.", trait: "social", score: 4 },
      { id: "6d", text: "Kết quả hữu hình và ứng dụng cao.", trait: "practical", score: 4 },
    ],
  },
  {
    id: 7,
    text: "Nếu có 6 tháng học kỹ năng mới, bạn chọn:",
    options: [
      { id: "7a", text: "Phân tích dữ liệu/Lập trình.", trait: "analysis", score: 3 },
      { id: "7b", text: "Thiết kế/UI/UX/Content.", trait: "creative", score: 3 },
      { id: "7c", text: "Coaching/HR/Đào tạo.", trait: "social", score: 3 },
      { id: "7d", text: "Vận hành hệ thống/Quản lý dự án.", trait: "practical", score: 3 },
    ],
  },
  {
    id: 8,
    text: "Bạn thường ra quyết định dựa trên:",
    options: [
      { id: "8a", text: "Số liệu và bằng chứng.", trait: "analysis", score: 2 },
      { id: "8b", text: "Trực giác và ý tưởng.", trait: "creative", score: 2 },
      { id: "8c", text: "Tác động đến con người.", trait: "social", score: 2 },
      { id: "8d", text: "Tính khả thi và nguồn lực.", trait: "practical", score: 2 },
    ],
  },
  {
    id: 9,
    text: "Bạn mong muốn công việc tương lai như thế nào?",
    options: [
      { id: "9a", text: "Rõ ràng lộ trình chuyên môn.", trait: "analysis", score: 4 },
      { id: "9b", text: "Tự do sáng tạo và đổi mới.", trait: "creative", score: 4 },
      { id: "9c", text: "Nhiều cơ hội làm việc với người.", trait: "social", score: 4 },
      { id: "9d", text: "Ổn định, tạo giá trị thực tế.", trait: "practical", score: 4 },
    ],
  },
  {
    id: 10,
    text: "Bạn thường được nhận xét là người:",
    options: [
      { id: "10a", text: "Lý trí và cẩn thận.", trait: "analysis", score: 3 },
      { id: "10b", text: "Sáng tạo và linh hoạt.", trait: "creative", score: 3 },
      { id: "10c", text: "Dễ gần và truyền cảm hứng.", trait: "social", score: 3 },
      { id: "10d", text: "Thực tế và đáng tin.", trait: "practical", score: 3 },
    ],
  },
];

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<number, QuestionOption>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizApiResponse | null>(null);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  function selectAnswer(questionId: number, option: QuestionOption) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  async function calculateResult() {
    if (answeredCount < QUESTIONS.length) {
      setError("Vui lòng trả lời đủ 10 câu trước khi tính kết quả.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = QUESTIONS.map((question) => ({
        questionId: question.id,
        trait: answers[question.id].trait,
        score: answers[question.id].score,
      }));

      const response = await fetch("/api/quiz/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không tính được kết quả.");

      setResult(data.data as QuizApiResponse);
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data.data));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 px-4 py-6 md:px-8">
      <main className="mx-auto w-full max-w-5xl">
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Bài kiểm tra tính cách 10 câu</h1>
              <p className="mt-2 text-slate-600">
                Chọn đáp án phù hợp nhất để hệ thống chấm điểm và gợi ý nghề.
              </p>
            </div>
            <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">
              Quay lại trang chủ
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Đã trả lời: {answeredCount}/10</p>
        </section>

        <div className="mt-6 space-y-4">
          {QUESTIONS.map((question) => (
            <section key={question.id} className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
              <h2 className="text-lg font-semibold text-slate-900">
                Câu {question.id}. {question.text}
              </h2>
              <div className="mt-3 grid gap-2">
                {question.options.map((option) => {
                  const selected = answers[question.id]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectAnswer(question.id, option)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-slate-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void calculateResult()}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Đang tính..." : "Tính kết quả"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Mở dashboard
          </Link>
        </div>

        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {result && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
            <h3 className="text-2xl font-bold text-slate-900">Kết quả: {result.topLabel}</h3>
            <p className="mt-2 text-slate-600">
              Mức độ phù hợp ước lượng: <span className="font-semibold">{result.confidence}%</span>
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-slate-50 p-4">
                <h4 className="font-semibold">Điểm theo nhóm</h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>- Phân tích: {result.scores.analysis}</li>
                  <li>- Sáng tạo: {result.scores.creative}</li>
                  <li>- Xã hội: {result.scores.social}</li>
                  <li>- Thực tiễn: {result.scores.practical}</li>
                </ul>
              </article>
              <article className="rounded-2xl bg-emerald-50 p-4">
                <h4 className="font-semibold text-emerald-900">Gợi ý nghề nghiệp</h4>
                <ul className="mt-2 space-y-1 text-sm text-emerald-800">
                  {result.careers.map((career) => (
                    <li key={career}>- {career}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
