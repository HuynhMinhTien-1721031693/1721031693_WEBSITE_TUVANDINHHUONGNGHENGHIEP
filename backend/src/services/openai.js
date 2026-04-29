import OpenAI from "openai";

function parseAdviceJson(content) {
  const startIndex = content.indexOf("{");
  const endIndex = content.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null;
  }

  try {
    const parsed = JSON.parse(content.slice(startIndex, endIndex + 1));
    if (
      Array.isArray(parsed.careerSuggestions) &&
      Array.isArray(parsed.learningRoadmap) &&
      Array.isArray(parsed.salaryReference)
    ) {
      return {
        careerSuggestions: parsed.careerSuggestions.map(String),
        learningRoadmap: parsed.learningRoadmap.map(String),
        salaryReference: parsed.salaryReference.map(String),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateCareerAdvice(message) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in backend environment.");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "Bạn là AI tư vấn hướng nghiệp tại Việt Nam. Trả về duy nhất JSON có 3 khóa: careerSuggestions, learningRoadmap, salaryReference. Mỗi khóa là mảng string từ 3-5 phần tử, ngắn gọn và thực tế.",
      },
      {
        role: "user",
        content: `Người dùng: "${message}". Hãy tư vấn theo điểm mạnh, sở thích và mục tiêu.`,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content || "";
  const parsed = parseAdviceJson(content);

  if (!parsed) {
    throw new Error("Could not parse advice JSON from OpenAI response.");
  }

  return parsed;
}

const fallbackCareerByType = {
  R: [
    "Ky thuat vien co dien",
    "Ky su co khi",
    "Ky su xay dung",
    "Ky thuat vien bao tri",
    "Ky thuat vien san xuat",
  ],
  I: [
    "Nha phan tich du lieu",
    "Nghien cuu vien",
    "Lap trinh vien",
    "Ky su AI",
    "Chuyen vien kiem dinh chat luong",
  ],
  A: [
    "Designer do hoa",
    "Content Creator",
    "Copywriter",
    "Bien tap vien",
    "Nha thiet ke san pham",
  ],
  S: [
    "Tu van vien huong nghiep",
    "Giao vien",
    "Chuyen vien nhan su",
    "Cong tac xa hoi",
    "Chuyen vien dao tao",
  ],
  E: [
    "Chuyen vien kinh doanh",
    "Quan ly du an",
    "Marketer",
    "Quan ly van hanh",
    "Khoi nghiep vien",
  ],
  C: [
    "Ke toan vien",
    "Chuyen vien hanh chinh",
    "Phan tich tai chinh",
    "Kiem toan vien",
    "Chuyen vien van hanh du lieu",
  ],
};

function parseCareerList(content) {
  return content
    .split(/\r?\n|,/g)
    .map((line) => line.replace(/^\s*[-\d.)]+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function generateRiasecCareers(dominantType, riasecScores) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackCareerByType[dominantType] || [];
  }

  try {
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Ban la chuyen gia huong nghiep. Chi tra ve dung 5 nghe, moi dong 1 nghe, khong giai thich.",
        },
        {
          role: "user",
          content: `Loai RIASEC noi troi: ${dominantType}. Diem: ${JSON.stringify(
            riasecScores,
          )}. Goi y 5 nghe phu hop cho thi truong Viet Nam.`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content || "";
    const careers = parseCareerList(content);
    if (careers.length === 5) return careers;
    return fallbackCareerByType[dominantType] || careers;
  } catch {
    return fallbackCareerByType[dominantType] || [];
  }
}
