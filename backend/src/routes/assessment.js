import { Router } from "express";
import { Assessment } from "../models/Assessment.js";
import { requireAuth } from "../middleware/auth.js";
import { generateRiasecCareers } from "../services/openai.js";

const router = Router();
const GROUPS = ["R", "I", "A", "S", "E", "C"];

function normalizeAnswerValue(answer) {
  const raw = Number(answer?.value ?? answer?.score);
  if (!Number.isFinite(raw)) return 0;
  return Math.max(1, Math.min(5, raw));
}

function normalizeGroup(answer) {
  const rawGroup = String(answer?.tag || answer?.group || answer?.riasecTag || "")
    .trim()
    .toUpperCase();
  if (GROUPS.includes(rawGroup)) return rawGroup;

  const questionId = String(answer?.questionId || "")
    .trim()
    .toUpperCase();
  if (GROUPS.includes(questionId.charAt(0))) return questionId.charAt(0);
  return "";
}

function computeRiasecScores(answers) {
  const base = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const answer of answers) {
    const group = normalizeGroup(answer);
    if (!group) continue;
    base[group] += normalizeAnswerValue(answer);
  }
  return base;
}

function getDominantType(riasecScores) {
  return GROUPS.reduce((winner, current) =>
    riasecScores[current] > riasecScores[winner] ? current : winner,
  "R");
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    if (answers.length === 0) {
      return res.status(400).json({ error: "answers[] is required." });
    }

    const normalizedAnswers = answers.map((answer, index) => ({
      questionId: String(answer?.questionId || `Q${index + 1}`),
      value: normalizeAnswerValue(answer),
    }));

    const riasecScores = computeRiasecScores(answers);
    const dominantType = getDominantType(riasecScores);
    const suggestedCareers = await generateRiasecCareers(dominantType, riasecScores);

    const created = await Assessment.create({
      userId: req.user._id,
      answers: normalizedAnswers,
      riasecScores,
      dominantType,
      suggestedCareers,
    });

    return res.status(201).json({
      data: created,
      riasecScores,
      dominantType,
      suggestedCareers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Khong the xu ly assessment.";
    return res.status(500).json({ error: message });
  }
});

router.get("/my", requireAuth, async (req, res) => {
  try {
    const list = await Assessment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ data: list });
  } catch {
    return res.status(500).json({ error: "Khong the tai lich su assessment." });
  }
});

export default router;
