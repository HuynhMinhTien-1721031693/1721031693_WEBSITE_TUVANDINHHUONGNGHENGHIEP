import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Thiếu JWT_SECRET trong biến môi trường backend.");
  }

  return jwt.sign(
    {
      userId: String(user._id),
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: "7d" },
  );
}

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body?.name || req.body?.fullName || "").trim();
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ tên, email và mật khẩu." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Mật khẩu tối thiểu 6 ký tự." });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return res.status(409).json({ error: "Email đã được sử dụng." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = signToken(user);

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể đăng ký lúc này.";
    return res.status(500).json({ error: message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email hoặc mật khẩu không đúng." });
    }

    // Compatible with legacy documents that still store passwordHash.
    const matched = user.password
      ? await user.comparePassword(password)
      : await bcrypt.compare(password, user.passwordHash || "");
    if (!matched) {
      return res.status(401).json({ error: "Email hoặc mật khẩu không đúng." });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name || user.fullName, email: user.email },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể đăng nhập lúc này.";
    return res.status(500).json({ error: message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId || req.user._id).select("_id name email").lean();
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng." });
    }
    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch {
    return res.status(500).json({ error: "Không thể tải hồ sơ người dùng." });
  }
});

export default router;
