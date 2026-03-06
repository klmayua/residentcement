import { Router, Response, AuthRequest } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import fetch from "node-fetch";
import { createLogger } from "../utils/logger";

const router = Router();
router.use(authenticate);

const logger = createLogger("payment-router");
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

const initiatePaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.enum(["CARD", "BANK_TRANSFER", "USSD"]).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

router.post("/initiate", async (req: AuthRequest, res: Response) => {
  try {
    const body = initiatePaymentSchema.parse(req.body);

    const response = await fetch(`${PAYMENT_SERVICE_URL}/payments/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Payment service error: ${response.status}`);
    }

    const data = await response.json();
    res.status(201).json(data);
  } catch (error: any) {
    logger.error("Error initiating payment", { error: error.message });
    res.status(500).json({ error: "Failed to initiate payment", details: error.message });
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, customerId, status, limit, offset } = req.query;
    
    const params = new URLSearchParams();
    if (orderId) params.append("orderId", orderId as string);
    if (customerId) params.append("customerId", customerId as string);
    if (status) params.append("status", status as string);
    if (limit) params.append("limit", limit as string);
    if (offset) params.append("offset", offset as string);

    const response = await fetch(`${PAYMENT_SERVICE_URL}/payments?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Payment service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error listing payments", { error: error.message });
    res.status(500).json({ error: "Failed to list payments", details: error.message });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const response = await fetch(`${PAYMENT_SERVICE_URL}/payments/${req.params.id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Payment not found" });
      }
      throw new Error(`Payment service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error getting payment", { error: error.message, id: req.params.id });
    res.status(500).json({ error: "Failed to get payment", details: error.message });
  }
});

router.get("/:id/status", async (req: AuthRequest, res: Response) => {
  try {
    const response = await fetch(`${PAYMENT_SERVICE_URL}/payments/${req.params.id}/status`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Payment not found" });
      }
      throw new Error(`Payment service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error getting payment status", { error: error.message, id: req.params.id });
    res.status(500).json({ error: "Failed to get payment status", details: error.message });
  }
});

router.post("/webhook", async (req: AuthRequest, res: Response) => {
  try {
    // Forward webhook to payment service
    const response = await fetch(`${PAYMENT_SERVICE_URL}/payments/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    logger.error("Error processing webhook", { error: error.message });
    res.status(500).json({ error: "Failed to process webhook", details: error.message });
  }
});

export { router as paymentRouter };
