import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "Thiếu JWT_SECRET trong biến môi trường backend." });
  }

  if (!token) {
    return res.status(401).json({ error: "Bạn cần đăng nhập để thực hiện thao tác này." });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
  }
}
