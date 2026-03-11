/**
 * ResidentCement API Gateway
 * 
 * Central entry point for all API requests
 * Handles routing, authentication, rate limiting, and request tracing
 */

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { 
  createLogger, 
  requestLoggingMiddleware,
  errorHandler,
  requestIdMiddleware,
  corsMiddleware,
  securityHeadersMiddleware,
} from "@resident-cement/kernel";
import { swaggerDefinition, apiPaths } from "./lib/swagger";
import { authRouter } from "./routes/auth";
import { customerRouter } from "./routes/customer";
import { orderRouter } from "./routes/order";
import { productRouter } from "./routes/product";
import { inventoryRouter } from "./routes/inventory";
import { pricingRouter } from "./routes/pricing";
import { paymentRouter } from "./routes/payment";
import { healthRouter } from "./routes/health";

config();

const logger = createLogger({
  service: 'api-gateway',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  level: (process.env.LOG_LEVEL as any) || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'both',
});

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Combine swagger definition with API paths
const swaggerSpec = {
  ...swaggerDefinition,
  paths: apiPaths,
};

// -----------------------------------------------------------------------------
// Security Middleware
// -----------------------------------------------------------------------------

// Helmet for security headers
app.use(helmet());

// Additional security headers
app.use(securityHeadersMiddleware());

// CORS configuration
app.use(corsMiddleware({
  allowedOrigins: [
    process.env.CORS_ORIGIN || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:8180", // Keycloak
  ],
  allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-request-id",
    "x-trace-id",
    "x-correlation-id",
  ],
  exposedHeaders: ["x-request-id", "x-trace-id", "x-correlation-id"],
  credentials: true,
}));

// -----------------------------------------------------------------------------
// Request Processing Middleware
// -----------------------------------------------------------------------------

// Request ID middleware - must be first
app.use(requestIdMiddleware());

// Request logging
app.use(requestLoggingMiddleware({
  skipPaths: ["/health", "/health/ready", "/health/live", "/api-docs"],
  includeBody: process.env.NODE_ENV === "development",
}));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Add request ID to response headers
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = (req.headers["x-request-id"] as string) || req.id || uuidv4();
  res.setHeader("x-request-id", req.id);
  res.setHeader("x-trace-id", req.id);
  next();
});

// Add logger to request
app.use((req: Request, res: Response, next: NextFunction) => {
  req.logger = logger.child({ requestId: req.id });
  next();
});

// -----------------------------------------------------------------------------
// Rate Limiting
// -----------------------------------------------------------------------------

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path.startsWith("/health");
  },
});

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login attempts per windowMs
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many login attempts, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------

// Health check routes (no auth required)
app.use("/health", healthRouter);

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "ResidentCement API",
}));

// Authentication routes (with stricter rate limiting)
app.use("/api/v1/auth", authLimiter, authRouter);

// Protected API routes
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/pricing", pricingRouter);
app.use("/api/v1/quotes", pricingRouter);
app.use("/api/v1/payments", paymentRouter);

// -----------------------------------------------------------------------------
// Error Handling
// -----------------------------------------------------------------------------

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
      traceId: req.id,
    },
  });
});

// Global error handler
app.use(errorHandler);

// -----------------------------------------------------------------------------
// Graceful Shutdown
// -----------------------------------------------------------------------------

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down gracefully");
    server.close(() => {
      logger.info("Process terminated");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT received, shutting down gracefully");
    server.close(() => {
      logger.info("Process terminated");
      process.exit(0);
    });
  });
};

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------

const server = app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
});

// Handle server errors
server.on("error", (error: Error) => {
  logger.error({
    message: "Server error",
    error: error.message,
    stack: error.stack,
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error({
    message: "Uncaught exception",
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
  logger.error({
    message: "Unhandled rejection",
    reason,
    promise,
  });
});

gracefulShutdown("SIGTERM");
gracefulShutdown("SIGINT");

export default app;
