import jwt from "jsonwebtoken";

function parseTokenFromHeader(header = "") {
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Thiếu JWT_SECRET trong biến môi trường backend.");
  }

  const payload = jwt.verify(token, secret);
  return {
    ...payload,
    _id: payload.userId || payload._id,
  };
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = parseTokenFromHeader(header);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "Thiếu JWT_SECRET trong biến môi trường backend." });
  }

  if (!token) {
    return res.status(401).json({ error: "Bạn cần đăng nhập để thực hiện thao tác này." });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = parseTokenFromHeader(header);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("JWT_SECRET")) {
      return res.status(500).json({ error: message });
    }
    return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
  }
}
