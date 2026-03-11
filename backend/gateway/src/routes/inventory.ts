import { Router, Response, Request, NextFunction } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import fetch from "node-fetch";
import { createLogger } from "../utils/logger";

const router = Router();
router.use(authenticate);

const logger = createLogger({ service: "inventory-router" });
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:3003";

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { productId, depotId, location, lowStock, limit, offset } = req.query;
    
    const params = new URLSearchParams();
    if (productId) params.append("productId", productId as string);
    if (depotId) params.append("depotId", depotId as string);
    if (location) params.append("location", location as string);
    if (lowStock) params.append("lowStock", lowStock as string);
    if (limit) params.append("limit", limit as string);
    if (offset) params.append("offset", offset as string);

    const response = await fetch(`${INVENTORY_SERVICE_URL}/inventory?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Inventory service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error fetching inventory", { error: error.message });
    res.status(500).json({ error: "Failed to fetch inventory", details: error.message });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const response = await fetch(`${INVENTORY_SERVICE_URL}/inventory/${req.params.id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ code: "NOT_FOUND", message: "Inventory item not found" });
      }
      throw new Error(`Inventory service error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    logger.error("Error fetching inventory item", { error: error.message, id: req.params.id });
    res.status(500).json({ error: "Failed to fetch inventory item", details: error.message });
  }
});

router.post("/adjust", async (req: AuthRequest, res: Response) => {
  try {
    const { inventoryId, adjustment, reason, reference } = req.body;

    const response = await fetch(`${INVENTORY_SERVICE_URL}/inventory/adjust`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventoryId, adjustment, reason, reference })
    });

    if (!response.ok) {
      throw new Error(`Inventory service error: ${response.status}`);
    }

    const data = await response.json();
    res.status(201).json(data);
  } catch (error: any) {
    logger.error("Error adjusting inventory", { error: error.message });
    res.status(500).json({ error: "Failed to adjust inventory", details: error.message });
  }
});

export { router as inventoryRouter };
