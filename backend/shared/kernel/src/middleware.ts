/**
 * Express Middleware for ResidentCement
 */

import { Request, Response, NextFunction } from 'express';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
} from './errors';
import { validationSchemas } from './validation';
import { ZodSchema, ZodError } from 'zod';

// -----------------------------------------------------------------------------
// Request Validation Middleware
// -----------------------------------------------------------------------------

export function validateRequest<T extends ZodSchema>(
  schema: T,
  source: 'body' | 'query' | 'params' | 'headers' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req[source]);
      
      // Replace the original data with validated (and transformed) data
      req[source] = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!details[path]) {
            details[path] = [];
          }
          details[path].push(err.message);
        });
        
        throw new ValidationError('Validation failed', details, req.id);
      }
      next(error);
    }
  };
}

export function validateBody<T extends ZodSchema>(schema: T) {
  return validateRequest(schema, 'body');
}

export function validateQuery<T extends ZodSchema>(schema: T) {
  return validateRequest(schema, 'query');
}

export function validateParams<T extends ZodSchema>(schema: T) {
  return validateRequest(schema, 'params');
}

// -----------------------------------------------------------------------------
// Authentication Middleware
// -----------------------------------------------------------------------------

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: AuthenticatedUser;
      traceId?: string;
      logger?: any;
    }
  }
}

/**
 * JWT Verification Helper
 * Verifies JWT tokens using RS256 algorithm (Keycloak default)
 */
async function verifyJWT(token: string): Promise<AuthenticatedUser> {
  const { jwtVerify, importJWK } = await import('jose');

  // Get JWT verification configuration from environment
  const jwksUri = process.env.KEYCLOAK_JWKS_URL || `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM || 'resident-cement'}/protocol/openid-connect/certs`;
  const issuer = process.env.JWT_ISSUER || `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM || 'resident-cement'}`;
  const audience = process.env.JWT_AUDIENCE || 'resident-cement-api';

  try {
    // Create JWKS client for key rotation support
    const createRemoteJWKSet = (await import('jose')).createRemoteJWKSet;
    const jwks = createRemoteJWKSet(new URL(jwksUri));

    // Verify the JWT token
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience,
      algorithms: ['RS256'],
    });

    // Extract user information from token
    return {
      id: String(payload.sub || ''),
      email: String(payload.email || ''),
      name: String(payload.name || payload.preferred_username || ''),
      role: extractRoleFromToken(payload),
    };
  } catch (error) {
    // Fallback to static key if JWKS fails (for development)
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new UnauthorizedError('JWT verification not configured');
    }

    const { importSPKI } = await import('jose');
    
    // For development with symmetric key
    try {
      const key = await importSPKI(
        `-----BEGIN PUBLIC KEY-----\n${Buffer.from(jwtSecret).toString('base64')}\n-----END PUBLIC KEY-----`,
        'HS256'
      );
      
      const { payload } = await jwtVerify(token, key, {
        issuer,
        algorithms: ['HS256'],
      });

      return {
        id: String(payload.sub || ''),
        email: String(payload.email || ''),
        name: String(payload.name || payload.preferred_username || ''),
        role: extractRoleFromToken(payload),
      };
    } catch {
      throw new UnauthorizedError('Invalid token');
    }
  }
}

/**
 * Extract role from JWT token payload
 * Handles Keycloak realm_access and resource_access patterns
 */
function extractRoleFromToken(payload: any): string {
  // Check for Keycloak realm_access roles
  if (payload.realm_access?.roles) {
    const roles = payload.realm_access.roles;
    if (roles.includes('admin')) return 'ADMIN';
    if (roles.includes('staff')) return 'STAFF';
    if (roles.includes('distributor')) return 'DISTRIBUTOR';
    if (roles.includes('sales_rep')) return 'SALES_REP';
  }

  // Check for resource_access roles
  if (payload.resource_access?.['resident-cement-api']?.roles) {
    const roles = payload.resource_access['resident-cement-api'].roles;
    if (roles.includes('admin')) return 'ADMIN';
    if (roles.includes('staff')) return 'STAFF';
    if (roles.includes('distributor')) return 'DISTRIBUTOR';
    if (roles.includes('sales_rep')) return 'SALES_REP';
  }

  // Check for direct role claim
  if (payload.role) return payload.role;
  if (payload.roles?.[0]) return payload.roles[0];

  // Default to VIEWER role
  return 'VIEWER';
}

/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */
export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No authorization header provided');
      }

      const token = authHeader.substring(7);

      // Verify JWT token and extract user information
      const user = await verifyJWT(token);

      // Attach user to request
      req.user = user;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        next(error);
      } else {
        next(new UnauthorizedError('Invalid or expired token'));
      }
    }
  };
}

/**
 * Optional Authentication Middleware
 * Attempts to verify JWT but continues without user if it fails
 */
export function optionalAuthenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No auth header, continue without user
        return next();
      }

      const token = authHeader.substring(7);

      // Attempt to verify JWT token
      const user = await verifyJWT(token);
      req.user = user;

      next();
    } catch (error) {
      // Authentication failed, but it's optional, so continue without user
      next();
    }
  };
}

// -----------------------------------------------------------------------------
// Authorization Middleware
// -----------------------------------------------------------------------------

export type Role = 'ADMIN' | 'STAFF' | 'DISTRIBUTOR' | 'SALES_REP' | 'VIEWER';

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    
    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(
        new ForbiddenError(
          `Insufficient permissions. Required: ${allowedRoles.join(' or ')}`
        )
      );
    }
    
    next();
  };
}

export function requireAdmin() {
  return authorize('ADMIN');
}

export function requireStaff() {
  return authorize('ADMIN', 'STAFF');
}

// -----------------------------------------------------------------------------
// Error Handling Middleware
// -----------------------------------------------------------------------------

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error (if logger is available)
  if (req.logger) {
    req.logger.error({
      error: err.message,
      stack: err.stack,
      requestId: req.id,
    });
  }
  
  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        traceId: err.traceId || req.id,
        timestamp: err.timestamp,
      },
    });
  }
  
  // Handle Zod errors
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!details[path]) details[path] = [];
      details[path].push(e.message);
    });
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
        traceId: req.id,
      },
    });
  }
  
  // Handle unknown errors
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isDev ? err.message : 'An unexpected error occurred',
      ...(isDev && { stack: err.stack }),
      traceId: req.id,
    },
  });
}

// -----------------------------------------------------------------------------
// Request ID Middleware
// -----------------------------------------------------------------------------

export function requestIdMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get or generate request ID
    const requestId =
      req.headers['x-request-id'] as string ||
      req.headers['x-correlation-id'] as string ||
      `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    req.id = requestId;
    res.setHeader('x-request-id', requestId);
    res.setHeader('x-correlation-id', requestId);
    
    next();
  };
}

// -----------------------------------------------------------------------------
// CORS Configuration
// -----------------------------------------------------------------------------

export interface CorsOptions {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const DEFAULT_CORS_OPTIONS: CorsOptions = {
  allowedOrigins: ['http://localhost:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'x-trace-id'],
  exposedHeaders: ['x-request-id', 'x-trace-id'],
  credentials: true,
  maxAge: 86400,
};

export function corsMiddleware(options: CorsOptions = {}) {
  const config = { ...DEFAULT_CORS_OPTIONS, ...options };
  
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    
    if (origin && config.allowedOrigins?.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin || config.allowedOrigins?.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader(
      'Access-Control-Allow-Methods',
      config.allowedMethods?.join(', ') || 'GET, POST, PUT, DELETE, OPTIONS'
    );
    
    res.setHeader(
      'Access-Control-Allow-Headers',
      config.allowedHeaders?.join(', ') || 'Content-Type, Authorization'
    );
    
    res.setHeader(
      'Access-Control-Expose-Headers',
      config.exposedHeaders?.join(', ') || ''
    );
    
    if (config.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    res.setHeader(
      'Access-Control-Max-Age',
      (config.maxAge || 86400).toString()
    );
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    
    next();
  };
}

// -----------------------------------------------------------------------------
// Rate Limiting Helper
// -----------------------------------------------------------------------------

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: Record<string, unknown>;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

export function rateLimitMiddleware(config: RateLimitConfig) {
  const { windowMs, maxRequests, message, skipSuccessfulRequests, skipFailedRequests } = config;
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip if configured
    if (skipSuccessfulRequests && res.statusCode < 400) {
      return next();
    }
    if (skipFailedRequests && res.statusCode >= 400) {
      return next();
    }
    
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `rate_limit:${ip}`;
    const now = Date.now();
    
    let record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs,
      };
    }
    
    record.count++;
    rateLimitStore.set(key, record);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader(
      'X-RateLimit-Remaining',
      Math.max(0, maxRequests - record.count).toString()
    );
    res.setHeader(
      'X-RateLimit-Reset',
      Math.ceil(record.resetTime / 1000).toString()
    );
    
    if (record.count > maxRequests) {
      return res.status(429).json(
        message || {
          success: false,
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests, please try again later',
          },
        }
      );
    }
    
    next();
  };
}

// -----------------------------------------------------------------------------
// Request Logging Middleware
// -----------------------------------------------------------------------------

export function expressRequestLoggingMiddleware(options: {
  skipPaths?: string[];
  includeBody?: boolean;
  includeHeaders?: boolean;
} = {}) {
  const { skipPaths = ['/health', '/health/ready'], includeBody = false, includeHeaders = false } = options;
  
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    // Skip health check endpoints
    if (skipPaths.includes(req.path)) {
      return next();
    }
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      
      const logData: Record<string, unknown> = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        requestId: req.id,
      };
      
      if (includeBody && req.body && Object.keys(req.body).length > 0) {
        logData.body = req.body;
      }
      
      if (includeHeaders) {
        logData.headers = req.headers;
      }
      
      if (req.logger) {
        req.logger.log(level, `${req.method} ${req.path}`, logData);
      } else {
        console.log(`[${level.toUpperCase()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
      }
    });
    
    next();
  };
}

// -----------------------------------------------------------------------------
// Compression Middleware (simple implementation)
// -----------------------------------------------------------------------------

export function compressionMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    if (acceptEncoding.includes('gzip')) {
      // In production, use the 'compression' package
      res.setHeader('Content-Encoding', 'identity');
    }
    
    next();
  };
}

// -----------------------------------------------------------------------------
// Security Headers Middleware
// -----------------------------------------------------------------------------

export function securityHeadersMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options
    res.setHeader('X-Frame-Options', 'DENY');
    
    // X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Strict-Transport-Security (HSTS)
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    
    // Content-Security-Policy
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );
    
    // Referrer-Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions-Policy
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()'
    );
    
    next();
  };
}
