import { Router, Response } from "express";

const router = Router();

router.get("/", (req: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "api-gateway",
    version: "1.0.0",
    uptime: process.uptime(),
  });
});

router.get("/ready", (req: Response) => {
  res.json({
    ready: true,
    services: {
      database: "connected",
      cache: "connected",
      messageQueue: "connected",
    },
  });
});

export { router as healthRouter };
