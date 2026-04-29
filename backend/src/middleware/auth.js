import jwt from "jsonwebtoken";

function parseTokenFromHeader(header = "") {
  if (typeof header !== "string") return "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return "";
  return token.trim();
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

  if (!token) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized." });
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
  } catch {
    return res.status(401).json({ error: "Unauthorized." });
  }
}
