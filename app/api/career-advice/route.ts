import { NextResponse } from "next/server";

type AdviceResult = {
  careerSuggestions: string[];
  learningRoadmap: string[];
  salaryReference: string[];
  deepAnalysis: string[];
  roadmapByCareer: string[];
  recommendedCareer: string;
};

type UserResultInput = {
  personality?: string;
  skills?: string;
};

function extractJsonFromText(content: string): AdviceResult | null {
  const startIndex = content.indexOf("{");
  const endIndex = content.lastIndexOf("}");
  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) return null;

  try {
    const parsed = JSON.parse(content.slice(startIndex, endIndex + 1));
    if (
      Array.isArray(parsed.careerSuggestions) &&
      Array.isArray(parsed.learningRoadmap) &&
      Array.isArray(parsed.salaryReference) &&
      Array.isArray(parsed.deepAnalysis) &&
      Array.isArray(parsed.roadmapByCareer)
    ) {
      return {
        careerSuggestions: parsed.careerSuggestions.map(String),
        learningRoadmap: parsed.learningRoadmap.map(String),
        salaryReference: parsed.salaryReference.map(String),
        deepAnalysis: parsed.deepAnalysis.map(String),
        roadmapByCareer: parsed.roadmapByCareer.map(String),
        recommendedCareer: String(parsed.recommendedCareer || ""),
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function callOpenAI(
  message: string,
  testResultSummary: string,
  targetCareer: string,
  userResult: UserResultInput,
): Promise<AdviceResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Bạn là AI tư vấn hướng nghiệp tại Việt Nam. Trả về DUY NHAT JSON voi keys: careerSuggestions, learningRoadmap, salaryReference, deepAnalysis, roadmapByCareer, recommendedCareer. careerSuggestions PHAI co dung 3 nghe nghiep. learningRoadmap va salaryReference moi key 3-6 muc. salaryReference phai ghi ro khoang luong theo dinh dang ngan gon.",
        },
        {
          role: "user",
          content:
            "User result:\n" +
            `- Personality: ${userResult.personality || "Unknown"}\n` +
            `- Skills: ${userResult.skills || "Unknown"}\n\n` +
            `User message: "${message}".\n` +
            `Test summary: ${testResultSummary || "N/A"}.\n` +
            `Target career: ${targetCareer}.\n\n` +
            "Logic bat buoc:\n" +
            "1) Uu tien nghe can tu duy sang tao neu Personality la Creative.\n" +
            "2) Han che nghe yeu cau toan nang neu Skills cho thay Weak math.\n" +
            "3) Moi nghe can co ly do phu hop ngan gon trong deepAnalysis.\n" +
            "4) Dua learning roadmap theo tung buoc hoc tu co ban den portfolio.\n" +
            "5) Dua salary range theo thi truong Viet Nam o muc tham khao.",
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API lỗi: ${errorText}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content || "";
  const parsed = extractJsonFromText(content);
  if (!parsed) {
    throw new Error("Không parse được dữ liệu JSON từ OpenAI.");
  }

  return parsed;
}

async function callGemini(
  message: string,
  testResultSummary: string,
  targetCareer: string,
  userResult: UserResultInput,
): Promise<AdviceResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY hoặc GOOGLE_API_KEY.");

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text:
                "Ban la AI tu van huong nghiep tai Viet Nam. Tra ve DUY NHAT JSON voi keys: careerSuggestions, learningRoadmap, salaryReference, deepAnalysis, roadmapByCareer, recommendedCareer. careerSuggestions PHAI co dung 3 nghe nghiep. salaryReference phai co khoang luong ro rang. Khong them markdown.\n" +
                "User result:\n" +
                `- Personality: ${userResult.personality || "Unknown"}\n` +
                `- Skills: ${userResult.skills || "Unknown"}\n\n` +
                `User message: "${message}".\n` +
                `Test summary: ${testResultSummary || "N/A"}.\n` +
                `Target career: ${targetCareer}.\n\n` +
                "Logic bat buoc:\n" +
                "1) Neu Personality la Creative -> uu tien nghe sang tao.\n" +
                "2) Neu Skills la Weak math -> tranh nghe can toan nang.\n" +
                "3) Dua 3 nghe, learning roadmap, salary range.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API lỗi: ${errorText}`);
  }

  const data = await response.json();
  const content: string =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const parsed = extractJsonFromText(content);
  if (!parsed) {
    throw new Error("Không parse được dữ liệu JSON từ Gemini.");
  }
  return parsed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body?.message || "").trim();
    const testResultSummary = String(body?.testResultSummary || "").trim();
    const targetCareer = String(body?.targetCareer || "Frontend Developer").trim();
    const userResult = (body?.userResult || {}) as UserResultInput;

    if (!message) {
      return NextResponse.json(
        { error: "Vui lòng nhập nội dung tư vấn." },
        { status: 400 },
      );
    }

    let data: AdviceResult;

    if (process.env.OPENAI_API_KEY) {
      data = await callOpenAI(message, testResultSummary, targetCareer, userResult);
    } else if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      data = await callGemini(message, testResultSummary, targetCareer, userResult);
    } else {
      return NextResponse.json(
        {
          error:
            "Chưa cấu hình API key. Hãy thêm OPENAI_API_KEY hoặc GEMINI_API_KEY trong file .env.local.",
        },
        { status: 500 },
      );
    }

    if (data.careerSuggestions.length > 3) {
      data.careerSuggestions = data.careerSuggestions.slice(0, 3);
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Lỗi hệ thống khi tư vấn AI.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
