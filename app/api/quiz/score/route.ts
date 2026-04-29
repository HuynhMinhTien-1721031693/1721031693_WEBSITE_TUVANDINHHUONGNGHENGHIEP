import { NextResponse } from "next/server";

type Trait = "analysis" | "creative" | "social" | "practical";
type QuizInput = { questionId: number; trait: Trait; score: number };

const traitLabels: Record<Trait, string> = {
  analysis: "Phân tích",
  creative: "Sáng tạo",
  social: "Xã hội",
  practical: "Thực tiễn",
};

const careersByTrait: Record<Trait, string[]> = {
  analysis: ["Data Analyst", "Software Engineer", "AI Engineer", "QA Engineer"],
  creative: ["UI/UX Designer", "Graphic Designer", "Content Strategist", "Digital Marketer"],
  social: ["Career Counselor", "HR Specialist", "Trainer", "Customer Success"],
  practical: ["System Admin", "Project Coordinator", "Product Operations", "Technical Support"],
};

const strengthsByTrait: Record<Trait, string[]> = {
  analysis: ["Tư duy logic", "Phân tích dữ liệu", "Giải quyết vấn đề"],
  creative: ["Sáng tạo ý tưởng", "Thẩm mỹ tốt", "Kể chuyện bằng nội dung"],
  social: ["Giao tiếp hiệu quả", "Lắng nghe tốt", "Hợp tác nhóm"],
  practical: ["Tư duy thực thi", "Kỷ luật cao", "Chú trọng kết quả"],
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

    const scores: Record<Trait, number> = {
      analysis: 0,
      creative: 0,
      social: 0,
      practical: 0,
    };

    for (const answer of answers) {
      if (!answer || !scores.hasOwnProperty(answer.trait)) {
        return NextResponse.json(
          { error: "Dữ liệu trait không hợp lệ." },
          { status: 400 },
        );
      }
      scores[answer.trait] += Number(answer.score) || 0;
    }

    const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1]) as Array<
      [Trait, number]
    >;
    const [topTrait, topScore] = ranking[0];
    const confidence = Math.min(100, Math.round((topScore / 34) * 100));

    return NextResponse.json({
      data: {
        topTrait,
        topLabel: traitLabels[topTrait],
        confidence,
        scores,
        careers: careersByTrait[topTrait],
        strengths: strengthsByTrait[topTrait],
      },
    });
  } catch {
    return NextResponse.json({ error: "Không thể chấm điểm bài test." }, { status: 500 });
  }
}
