import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Assessment } from "../models/Assessment.js";

const router = Router();

router.post("/assessments", requireAuth, async (req, res) => {
  try {
    const payload = req.body || {};

    const created = await Assessment.create({
      userId: req.user._id,
      type: String(payload.type || "custom"),
      code: String(payload.code || ""),
      summary: String(payload.summary || ""),
      scores: payload.scores && typeof payload.scores === "object" ? payload.scores : {},
      careers: Array.isArray(payload.careers) ? payload.careers.map(String) : [],
      rawAnswers:
        payload.rawAnswers && typeof payload.rawAnswers === "object"
          ? payload.rawAnswers
          : {},
    });

    return res.status(201).json({ data: created });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Khong the luu ket qua assessment.";
    return res.status(500).json({ error: message });
  }
});

router.get("/assessments", requireAuth, async (req, res) => {
  try {
    const list = await Assessment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json({ data: list });
  } catch {
    return res.status(500).json({ error: "Khong the tai danh sach assessment." });
  }
});

export default router;
