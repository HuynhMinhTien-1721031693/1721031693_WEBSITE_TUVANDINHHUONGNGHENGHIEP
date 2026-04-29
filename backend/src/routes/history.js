import { Router } from "express";
import { ChatHistory } from "../models/ChatHistory.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.json({ data: [] });
    }

    const history = await ChatHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ data: history });
  } catch {
    return res.status(500).json({ error: "Không thể tải lịch sử tư vấn." });
  }
});

export default router;
