import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth';
import type { JWTPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      status: 'error',
      message: 'Access token required',
      code: 'AUTH_REQUIRED',
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      res.status(401).json({
        status: 'error',
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }

    res.status(403).json({
      status: 'error',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
    return;
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions',
        code: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
}

// Predefined role middleware
export const requireAdmin = requireRole('SYSTEM_ADMINISTRATOR', 'C_LEVEL_EXECUTIVE');
export const requireManager = requireRole(
  'SYSTEM_ADMINISTRATOR',
  'C_LEVEL_EXECUTIVE',
  'DEPARTMENT_MANAGER',
  'SALES_MANAGER',
  'OPERATIONS_MANAGER',
  'FINANCE_OFFICER',
  'LOGISTICS_COORDINATOR'
);
