import { Router } from "express";
import { ChatHistory } from "../models/ChatHistory.js";
import { generateCareerAdvice } from "../services/openai.js";

const router = Router();

router.post("/career-advice", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung tư vấn." });
    }

    const advice = await generateCareerAdvice(message);

    await ChatHistory.create({
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

router.get("/history", async (_req, res) => {
  try {
    const history = await ChatHistory.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ data: history });
  } catch {
    res.status(500).json({ error: "Không thể tải lịch sử tư vấn." });
  }
});

export default router;
