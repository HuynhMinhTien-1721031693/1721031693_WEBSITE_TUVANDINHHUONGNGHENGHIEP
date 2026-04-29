import OpenAI from "openai";
import { Request, Response, Router } from "express";
import Assessment, { IAssessmentAnswer } from "../models/Assessment.model";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const RIASEC_TRAITS = ["R", "I", "A", "S", "E", "C"] as const;
type RiasecTrait = (typeof RIASEC_TRAITS)[number];
type RiasecScores = Record<RiasecTrait, number>;

function createEmptyScores(): RiasecScores {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

function getTraitFromQuestionId(questionId: string): RiasecTrait {
  const normalized = String(questionId || "").trim().toUpperCase();

  if (normalized.startsWith("HOL-")) {
    const number = Number(normalized.replace("HOL-", ""));
    if (Number.isFinite(number) && number > 0) {
      return RIASEC_TRAITS[(number - 1) % RIASEC_TRAITS.length];
    }
  }

  const firstChar = normalized[0] as RiasecTrait | undefined;
  if (firstChar && RIASEC_TRAITS.includes(firstChar)) {
    return firstChar;
  }

  return "C";
}

function calculateRiasecScores(answers: IAssessmentAnswer[]): RiasecScores {
  return answers.reduce<RiasecScores>((scores, answer) => {
    const trait = getTraitFromQuestionId(answer.questionId);
    const value = Number(answer.value);
    if (Number.isFinite(value)) {
      scores[trait] += value;
    }
    return scores;
  }, createEmptyScores());
}

function buildFallbackCareers(scores: RiasecScores): string[] {
  const topTraits = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([trait]) => trait as RiasecTrait);

  const map: Record<RiasecTrait, string[]> = {
    R: ["Kỹ thuật viên cơ điện", "Kỹ sư bảo trì hệ thống"],
    I: ["Data Analyst", "Nghiên cứu thị trường"],
    A: ["Thiết kế đồ họa", "Content Creator"],
    S: ["Chuyên viên tư vấn hướng nghiệp", "Nhân sự đào tạo"],
    E: ["Sales Executive", "Chuyên viên phát triển kinh doanh"],
    C: ["Kế toán", "Business Analyst"],
  };

  return [...new Set(topTraits.flatMap((trait) => map[trait]))].slice(0, 5);
}

async function suggestCareersWithOpenAI(scores: RiasecScores): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildFallbackCareers(scores);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const client = new OpenAI({ apiKey });

  const prompt = `RIASEC scores: ${JSON.stringify(scores)}.
Hãy gợi ý tối đa 5 nghề nghiệp phù hợp cho học sinh/sinh viên Việt Nam.
Trả về DUY NHẤT JSON theo dạng: {"suggestedCareers":["..."]}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "Bạn là chuyên gia tư vấn hướng nghiệp. Luôn trả về JSON hợp lệ theo đúng format người dùng yêu cầu.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.choices?.[0]?.message?.content || "";
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return buildFallbackCareers(scores);
    }

    const parsed = JSON.parse(content.slice(start, end + 1)) as {
      suggestedCareers?: unknown;
    };

    if (!Array.isArray(parsed.suggestedCareers)) {
      return buildFallbackCareers(scores);
    }

    const careers = parsed.suggestedCareers.map((item) => String(item).trim()).filter(Boolean);
    return careers.length > 0 ? careers.slice(0, 5) : buildFallbackCareers(scores);
  } catch {
    return buildFallbackCareers(scores);
  }
}

router.post("/api/assessment", authMiddleware, async (req: Request, res: Response) => {
  try {
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    if (answers.length === 0) {
      return res.status(400).json({ message: "answers is required and must be a non-empty array" });
    }

    const normalizedAnswers: IAssessmentAnswer[] = answers.map((item) => ({
      questionId: String(item?.questionId || "").trim(),
      value: Number(item?.value || 0),
    }));

    if (normalizedAnswers.some((item) => !item.questionId || !Number.isFinite(item.value))) {
      return res.status(400).json({ message: "Each answer must include questionId and numeric value" });
    }

    const scores = calculateRiasecScores(normalizedAnswers);
    const suggestedCareers = await suggestCareersWithOpenAI(scores);

    const assessment = await Assessment.create({
      userId: req.user?.id,
      answers: normalizedAnswers,
      result: {
        type: "RIASEC",
        scores,
        suggestedCareers,
      },
    });

    return res.status(201).json({ data: assessment });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create assessment";
    return res.status(500).json({ message });
  }
});

router.get("/api/assessment/history", authMiddleware, async (req: Request, res: Response) => {
  try {
    const history = await Assessment.find({ userId: req.user?.id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ data: history });
  } catch {
    return res.status(500).json({ message: "Could not fetch assessment history" });
  }
});

export default router;
