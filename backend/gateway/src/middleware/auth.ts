import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const authLogger = logger;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    sub?: string;
    email: string;
    name: string;
    role: string;
    tenantId?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      role: string;
      tenantId?: string;
    };
    req.user = {
      id: decoded.sub,
      sub: decoded.sub,
      email: decoded.email,
      name: decoded.email.split('@')[0],
      role: decoded.role,
      tenantId: decoded.tenantId,
    };
    next();
  } catch (error) {
    logger.warn({ message: "Invalid token", token: token.substring(0, 20) + "..." });
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

export const generateToken = (payload: {
  sub: string;
  email: string;
  role: string;
  tenantId?: string;
}): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const verifyToken = (token: string): {
  sub: string;
  email: string;
  role: string;
  tenantId?: string;
} | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      role: string;
      tenantId?: string;
    };
  } catch {
    return null;
  }
};
