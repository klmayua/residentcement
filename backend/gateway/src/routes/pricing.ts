import { Router, Response, AuthRequest } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import fetch from "node-fetch";
import { createLogger } from "../utils/logger";

const router = Router();
router.use(authenticate);

const logger = createLogger("pricing-router");
const PRICING_SERVICE_URL = process.env.PRICING_SERVICE_URL || "http://localhost:3004";

const quoteSchema = z.object({
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  deliveryLocation: z.string().optional(),
  validityDays: z.number().int().min(1).max(30).optional(),
});

router.post("/calculate", async (req: AuthRequest, res: Response) => {
  try {
    const body = quoteSchema.parse(req.body);

    const response = await fetch(`${PRICING_SERVICE_URL}/quotes/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Pricing service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error calculating quote", { error: error.message });
    res.status(500).json({ error: "Failed to calculate quote", details: error.message });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const body = quoteSchema.parse(req.body);

    const response = await fetch(`${PRICING_SERVICE_URL}/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Pricing service error: ${response.status}`);
    }

    const data = await response.json();
    res.status(201).json(data);
  } catch (error: any) {
    logger.error("Error creating quote", { error: error.message });
    res.status(500).json({ error: "Failed to create quote", details: error.message });
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { customerId, status, limit, offset } = req.query;
    
    const params = new URLSearchParams();
    if (customerId) params.append("customerId", customerId as string);
    if (status) params.append("status", status as string);
    if (limit) params.append("limit", limit as string);
    if (offset) params.append("offset", offset as string);

    const response = await fetch(`${PRICING_SERVICE_URL}/quotes?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Pricing service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error listing quotes", { error: error.message });
    res.status(500).json({ error: "Failed to list quotes", details: error.message });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const response = await fetch(`${PRICING_SERVICE_URL}/quotes/${req.params.id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Quote not found" });
      }
      throw new Error(`Pricing service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error getting quote", { error: error.message, id: req.params.id });
    res.status(500).json({ error: "Failed to get quote", details: error.message });
  }
});

router.post("/:id/convert", async (req: AuthRequest, res: Response) => {
  try {
    const response = await fetch(`${PRICING_SERVICE_URL}/quotes/${req.params.id}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Pricing service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error converting quote to order", { error: error.message, id: req.params.id });
    res.status(500).json({ error: "Failed to convert quote to order", details: error.message });
  }
});

export { router as pricingRouter };
