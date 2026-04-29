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
