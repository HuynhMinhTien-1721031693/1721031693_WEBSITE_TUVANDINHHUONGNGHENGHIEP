import { Router } from "express";
import { ChatHistory } from "../models/ChatHistory.js";
import { TestResult } from "../models/TestResult.js";
import { requireAuth } from "../middleware/auth.js";
import { generateCareerAdvice } from "../services/openai.js";

const router = Router();

router.post("/career-advice", requireAuth, async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung tư vấn." });
    }

    const advice = await generateCareerAdvice(message);

    await ChatHistory.create({
      userId: req.user.userId,
      message,
      ...advice,
    });

    return res.json({ data: advice });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Lỗi hệ thống khi tư vấn AI.";
    return res.status(500).json({ error: message });
  }
});

router.get("/history", requireAuth, async (req, res) => {
  try {
    const history = await ChatHistory.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ data: history });
  } catch {
    res.status(500).json({ error: "Không thể tải lịch sử tư vấn." });
  }
});

router.post("/test-results", requireAuth, async (req, res) => {
  try {
    const payload = req.body || {};
    const requiredFields = ["topTrait", "topLabel", "confidence", "scores"];
    const missingField = requiredFields.find(
      (field) => payload[field] === undefined,
    );

    if (missingField) {
      return res
        .status(400)
        .json({ error: `Thiếu trường bắt buộc: ${missingField}` });
    }

    const created = await TestResult.create({
      userId: req.user.userId,
      topTrait: String(payload.topTrait),
      topLabel: String(payload.topLabel),
      confidence: Number(payload.confidence),
      scores: payload.scores,
      careers: Array.isArray(payload.careers) ? payload.careers : [],
      strengths: Array.isArray(payload.strengths) ? payload.strengths : [],
    });

    return res.status(201).json({ data: created });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể lưu kết quả test.";
    return res.status(500).json({ error: message });
  }
});

router.get("/test-results", requireAuth, async (req, res) => {
  try {
    const history = await TestResult.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ data: history });
  } catch {
    return res.status(500).json({ error: "Không thể tải lịch sử kết quả test." });
  }
});

export default router;
