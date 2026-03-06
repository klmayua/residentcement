import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { createLogger } from "./utils/logger";
import { authRouter } from "./routes/auth";
import { customerRouter } from "./routes/customer";
import { orderRouter } from "./routes/order";
import { productRouter } from "./routes/product";
import { inventoryRouter } from "./routes/inventory";
import { pricingRouter } from "./routes/pricing";
import { paymentRouter } from "./routes/payment";
import { healthRouter } from "./routes/health";

config();
const logger = createLogger("gateway");
const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = req.headers["x-request-id"] as string || uuidv4();
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.id,
    });
  });
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/pricing", pricingRouter);
app.use("/api/v1/quotes", pricingRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/health", healthRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    requestId: req.id,
  });
  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
    requestId: req.id,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
