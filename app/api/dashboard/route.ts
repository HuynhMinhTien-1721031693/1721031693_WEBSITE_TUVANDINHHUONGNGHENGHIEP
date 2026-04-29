import { NextResponse } from "next/server";

type QuizResult = {
  topLabel: string;
  topTrait?: string;
  hollandCode?: string;
  mbtiCode?: string;
  scores: Record<string, number>;
  careers: string[];
};

const strongestDimensionByTrait: Record<string, string> = {
  R: "Năng lực thực hành và tạo sản phẩm cụ thể",
  I: "Năng lực phân tích và nghiên cứu vấn đề",
  A: "Năng lực sáng tạo và phát triển ý tưởng",
  S: "Năng lực hỗ trợ, giao tiếp và phát triển con người",
  E: "Năng lực dẫn dắt, thuyết phục và định hướng kết quả",
  C: "Năng lực tổ chức, quy trình và độ chính xác",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quizResult = body?.quizResult as QuizResult | undefined;
    const latestQuestions = (body?.latestQuestions || []) as string[];

    if (!quizResult?.scores || !quizResult?.topLabel) {
      return NextResponse.json({ error: "Thiếu dữ liệu quizResult." }, { status: 400 });
    }

    const scoreEntries = Object.entries(quizResult.scores).sort((a, b) => b[1] - a[1]);
    const strongest = String(quizResult.topTrait || scoreEntries[0]?.[0] || "I");

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
        summary: `Bạn đang nghiêng về nhóm ${quizResult.topLabel}. Ma Holland/MBTI (${quizResult.hollandCode || "N/A"} / ${quizResult.mbtiCode || "N/A"}) cho thấy huong phat trien nen uu tien du an thuc te va ky nang cot loi.`,
        strongestDimension:
          strongestDimensionByTrait[strongest] || "Năng lực định hướng nghề nghiệp tổng hợp",
        recommendedTracks: quizResult.careers.slice(0, 3),
        nextActions: nextActions.slice(0, 4),
      },
    });
  } catch {
    return NextResponse.json({ error: "Không thể tạo dashboard." }, { status: 500 });
  }
}
