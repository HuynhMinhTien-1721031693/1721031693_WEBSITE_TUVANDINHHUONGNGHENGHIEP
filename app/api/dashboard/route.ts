import { NextResponse } from "next/server";

type TraitScores = {
  analysis: number;
  creative: number;
  social: number;
  practical: number;
};

type QuizResult = {
  topLabel: string;
  scores: TraitScores;
  careers: string[];
};

const strongestDimensionByTrait: Record<keyof TraitScores, string> = {
  analysis: "Năng lực phân tích và tư duy hệ thống",
  creative: "Năng lực sáng tạo và thiết kế giải pháp",
  social: "Năng lực tương tác và phát triển con người",
  practical: "Năng lực thực thi và tối ưu vận hành",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quizResult = body?.quizResult as QuizResult | undefined;
    const latestQuestions = (body?.latestQuestions || []) as string[];

    if (!quizResult?.scores || !quizResult?.topLabel) {
      return NextResponse.json({ error: "Thiếu dữ liệu quizResult." }, { status: 400 });
    }

    const scoreEntries = Object.entries(quizResult.scores).sort((a, b) => b[1] - a[1]) as Array<
      [keyof TraitScores, number]
    >;
    const strongest = scoreEntries[0][0];

    const nextActions = [
      "Chọn 1 nghề mục tiêu trong 4 tuần tới và đọc JD từ 5-10 công ty.",
      "Xây dựng portfolio mini thể hiện kỹ năng cốt lõi.",
      "Tham gia 1 cộng đồng nghề nghiệp và xin feedback định kỳ.",
    ];

    if (latestQuestions.length > 0) {
      nextActions.push("Dùng lịch sử câu hỏi đã chat để cá nhân hóa kế hoạch học hàng tuần.");
    }

    return NextResponse.json({
      data: {
        summary: `Bạn đang nghiêng về nhóm ${quizResult.topLabel}. Dashboard tổng hợp cho thấy hướng phát triển phù hợp là ưu tiên kỹ năng nền tảng và thực hành dự án thực tế.`,
        strongestDimension: strongestDimensionByTrait[strongest],
        recommendedTracks: quizResult.careers.slice(0, 3),
        nextActions: nextActions.slice(0, 4),
      },
    });
  } catch {
    return NextResponse.json({ error: "Không thể tạo dashboard." }, { status: 500 });
  }
}
