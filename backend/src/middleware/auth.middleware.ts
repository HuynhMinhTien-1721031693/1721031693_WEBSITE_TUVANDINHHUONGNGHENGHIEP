import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: token missing" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: String(decoded.userId || decoded.id || ""),
      email: typeof decoded.email === "string" ? decoded.email : undefined,
      name: typeof decoded.name === "string" ? decoded.name : undefined,
    };

    if (!req.user.id) {
      return res.status(401).json({ message: "Unauthorized: invalid token payload" });
    }

    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
};
