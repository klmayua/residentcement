import { Router, Response, AuthRequest } from "express";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

const mockInventory = [
  { id: "inv_001", productId: "prod_001", productName: "Dangote Cement 42.5R", location: "Lagos Depot", quantity: 5000, unit: "bags", lastUpdated: "2025-03-05T10:00:00Z" },
  { id: "inv_002", productId: "prod_002", productName: "Dangote Cement 32.5R", location: "Lagos Depot", quantity: 8000, unit: "bags", lastUpdated: "2025-03-05T10:00:00Z" },
  { id: "inv_003", productId: "prod_001", productName: "Dangote Cement 42.5R", location: "Abuja Depot", quantity: 3000, unit: "bags", lastUpdated: "2025-03-05T10:00:00Z" },
  { id: "inv_004", productId: "prod_003", productName: "Dangote Cement 52.5R", location: "Port Harcourt Depot", quantity: 1500, unit: "bags", lastUpdated: "2025-03-05T10:00:00Z" },
  { id: "inv_005", productId: "prod_004", productName: "Dangote Pozzolana Cement 32.5N", location: "Kano Depot", quantity: 3500, unit: "bags", lastUpdated: "2025-03-05T10:00:00Z" },
];

router.get("/", (req: AuthRequest, res: Response) => {
  const { productId, location } = req.query;
  
  let inventory = [...mockInventory];
  
  if (productId) {
    inventory = inventory.filter(i => i.productId === productId);
  }
  
  if (location) {
    inventory = inventory.filter(i => i.location.toLowerCase().includes((location as string).toLowerCase()));
  }

  res.json({ data: inventory });
});

router.get("/:id", (req: AuthRequest, res: Response) => {
  const item = mockInventory.find(i => i.id === req.params.id);
  
  if (!item) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Inventory item not found" });
  }

  res.json(item);
});

router.post("/adjust", (req: AuthRequest, res: Response) => {
  const { productId, location, adjustment, reason } = req.body;
  
  const newAdjustment = {
    id: "adj_" + Date.now(),
    productId,
    location,
    adjustment,
    reason,
    performedBy: req.user?.sub,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(newAdjustment);
});

export { router as inventoryRouter };
