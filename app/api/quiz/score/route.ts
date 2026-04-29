import { NextResponse } from "next/server";

type Riasec = "R" | "I" | "A" | "S" | "E" | "C";
type MbtiPole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
type QuizInput = {
  questionId: number;
  riasec: Riasec;
  mbti: MbtiPole;
  score: number;
};

type CareerProfile = {
  name: string;
  riasec: Riasec[];
  mbti: string[];
};

const riasecLabels: Record<Riasec, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const careerProfiles: CareerProfile[] = [
  { name: "Software Engineer", riasec: ["I", "R", "C"], mbti: ["INTJ", "INTP", "ISTJ"] },
  { name: "Data Analyst", riasec: ["I", "C", "R"], mbti: ["INTJ", "ISTJ", "ENTJ"] },
  { name: "UX/UI Designer", riasec: ["A", "I", "S"], mbti: ["INFP", "ENFP", "ISFP"] },
  { name: "Digital Marketer", riasec: ["E", "A", "S"], mbti: ["ENFP", "ENTP", "ESFP"] },
  { name: "HR Specialist", riasec: ["S", "E", "C"], mbti: ["ENFJ", "ESFJ", "INFJ"] },
  { name: "Project Coordinator", riasec: ["E", "C", "S"], mbti: ["ENTJ", "ESTJ", "ENFJ"] },
];

const strengthsByRiasec: Record<Riasec, string[]> = {
  R: ["Thực hành tốt", "Thích làm ra sản phẩm cụ thể"],
  I: ["Tư duy phân tích", "Thích nghiên cứu và giải quyết vấn đề"],
  A: ["Sáng tạo", "Nhạy thẩm mỹ và ý tưởng"],
  S: ["Đồng cảm", "Giỏi hỗ trợ và giao tiếp"],
  E: ["Chủ động", "Có năng lực dẫn dắt và thuyết phục"],
  C: ["Cẩn thận", "Làm việc có quy trình và tính hệ thống"],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const answers = (body?.answers || []) as QuizInput[];

    if (!Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: "Bài test yêu cầu đúng 10 câu trả lời hợp lệ." },
        { status: 400 },
      );
    }

    const riasecScores: Record<Riasec, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };
    const mbtiScores: Record<MbtiPole, number> = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    for (const answer of answers) {
      if (
        !answer ||
        !Object.hasOwn(riasecScores, answer.riasec) ||
        !Object.hasOwn(mbtiScores, answer.mbti)
      ) {
        return NextResponse.json(
          { error: "Dữ liệu RIASEC/MBTI không hợp lệ." },
          { status: 400 },
        );
      }
      riasecScores[answer.riasec] += Number(answer.score) || 0;
      mbtiScores[answer.mbti] += 1;
    }

    const topRiasec = (Object.entries(riasecScores) as Array<[Riasec, number]>)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code]) => code);
    const hollandCode = topRiasec.join("");

    const mbtiCode =
      (mbtiScores.E >= mbtiScores.I ? "E" : "I") +
      (mbtiScores.S >= mbtiScores.N ? "S" : "N") +
      (mbtiScores.T >= mbtiScores.F ? "T" : "F") +
      (mbtiScores.J >= mbtiScores.P ? "J" : "P");

    const scoredCareers = careerProfiles
      .map((career) => {
        const riasecMatch = career.riasec.filter((item) => topRiasec.includes(item)).length;
        const mbtiMatch = career.mbti.includes(mbtiCode) ? 2 : 0;
        return { name: career.name, score: riasecMatch * 2 + mbtiMatch };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.name);

    const confidence = Math.min(
      100,
      Math.round(((riasecScores[topRiasec[0]] || 0) / 15) * 100),
    );
    const strengths = Array.from(
      new Set(topRiasec.flatMap((code) => strengthsByRiasec[code])),
    ).slice(0, 4);

    return NextResponse.json({
      data: {
        topTrait: topRiasec[0],
        topLabel: riasecLabels[topRiasec[0]],
        hollandCode,
        mbtiCode,
        confidence,
        scores: riasecScores,
        careers: scoredCareers,
        strengths,
      },
    });
  } catch {
    return NextResponse.json({ error: "Không thể chấm điểm bài test." }, { status: 500 });
  }
}
