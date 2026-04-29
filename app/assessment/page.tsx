"use client";

import Link from "next/link";
import { useState } from "react";
import { assessmentById, assessmentDefinitions, AssessmentType } from "@/lib/assessment/data";
import { AnswerMap, AssessmentResult, evaluateAssessment } from "@/lib/assessment/engine";
import { authFetch } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function AssessmentPage() {
  const [activeTestId, setActiveTestId] = useState<AssessmentType>("mbti");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const definition = assessmentById[activeTestId];
  const question = definition.questions[questionIndex];

  function resetFlow(testId: AssessmentType) {
    setActiveTestId(testId);
    setQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setMessage(null);
  }

  async function submitAssessment() {
    const evaluated = evaluateAssessment(definition, answers);
    setResult(evaluated);
    setMessage(null);
    setError(null);

    try {
      const response = await authFetch(`${API_BASE_URL}/api/assessments`, {
        method: "POST",
        body: JSON.stringify({
          type: definition.id,
          code: evaluated.code,
          summary: evaluated.summary,
          scores: evaluated.highlightTraits.reduce<Record<string, number>>((acc, item) => {
            acc[item] = 1;
            return acc;
          }, {}),
          careers: evaluated.careers.map((item) => item.name),
          rawAnswers: answers,
        }),
      });

      if (response.status === 401) {
        setError("Bạn cần đăng nhập để lưu lịch sử assessment.");
        return;
      }
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Không thể lưu assessment.");
      }
      setMessage("Đã lưu kết quả assessment vào lịch sử của bạn.");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Lỗi khi lưu assessment.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-8 md:px-8">
      <main className="mx-auto w-full max-w-5xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Assessment nghề nghiệp</h1>
              <p className="mt-2 text-slate-600">Làm MBTI mini, Holland mini hoặc DISC mini và nhận kết quả chi tiết.</p>
            </div>
            <div className="flex gap-3 text-sm font-semibold">
              <Link href="/" className="text-blue-700 hover:underline">Trang chủ</Link>
              <Link href="/history" className="text-blue-700 hover:underline">Lịch sử</Link>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {assessmentDefinitions.map((item) => (
            <button
              key={item.id}
              onClick={() => resetFlow(item.id)}
              className={`rounded-2xl border p-4 text-left ${
                activeTestId === item.id ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-xs text-slate-500">{item.estimatedMinutes} phút</p>
              <h2 className="mt-1 font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            </button>
          ))}
        </section>

        {!result && (
          <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
            <p className="text-sm text-slate-500">
              {definition.title} - Câu {questionIndex + 1}/{definition.questions.length}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{question.prompt}</h2>
            <div className="mt-4 space-y-2">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                    className={`w-full rounded-xl border px-4 py-3 text-left ${
                      selected ? "border-blue-500 bg-blue-50 text-blue-900" : "border-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={questionIndex === 0}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Câu trước
              </button>
              <button
                onClick={() => {
                  if (questionIndex < definition.questions.length - 1) {
                    setQuestionIndex((prev) => prev + 1);
                  } else {
                    void submitAssessment();
                  }
                }}
                disabled={!answers[question.id]}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {questionIndex < definition.questions.length - 1 ? "Câu tiếp" : "Xem kết quả"}
              </button>
            </div>
          </section>
        )}

        {result && (
          <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Kết quả: {result.code}</h2>
            <p className="mt-2 text-slate-700">{result.summary}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-900">Điểm mạnh</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  {result.highlightTraits.map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </article>
              <article className="rounded-2xl bg-emerald-50 p-4">
                <h3 className="font-semibold text-emerald-900">Nhóm nghề phù hợp</h3>
                <ul className="mt-2 space-y-1 text-sm text-emerald-800">
                  {result.careers.map((item) => <li key={item.name}>- {item.name}</li>)}
                </ul>
              </article>
            </div>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
          </section>
        )}
      </main>
    </div>
  );
}
