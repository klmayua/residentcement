import { Router, Response, AuthRequest } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

const quoteSchema = z.object({
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  deliveryLocation: z.string().optional(),
  validityDays: z.number().int().min(1).max(30).optional(),
});

const mockQuotes = [
  {
    id: "quote_001",
    customerId: "cust_001",
    items: [
      { productId: "prod_001", productName: "Dangote Cement 42.5R", quantity: 200, unitPrice: 4500, total: 900000 },
    ],
    subtotal: 900000,
    discount: 45000,
    total: 855000,
    status: "valid",
    validUntil: "2025-03-15T10:00:00Z",
    createdAt: "2025-03-05T10:00:00Z",
  },
];

router.post("/calculate", async (req: AuthRequest, res: Response) => {
  try {
    const body = quoteSchema.parse(req.body);
    
    const items = body.items.map(item => {
      const unitPrice = 4500;
      const subtotal = item.quantity * unitPrice;
      const discount = item.quantity >= 100 ? subtotal * 0.05 : 0;
      return {
        productId: item.productId,
        productName: "Dangote Cement 42.5R",
        quantity: item.quantity,
        unitPrice,
        subtotal,
        discount,
        total: subtotal - discount,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const total = subtotal - totalDiscount;

    res.json({
      items,
      subtotal,
      discount: totalDiscount,
      total,
      currency: "NGN",
      validUntil: new Date(Date.now() + (body.validityDays || 7) * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Calculation failed" });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const body = quoteSchema.parse(req.body);
    
    const quote = {
      id: "quote_" + Date.now(),
      ...body,
      status: "valid",
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create quote" });
  }
});

router.get("/", (req: AuthRequest, res: Response) => {
  res.json({ data: mockQuotes });
});

router.get("/:id", (req: AuthRequest, res: Response) => {
  const quote = mockQuotes.find(q => q.id === req.params.id);
  if (!quote) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Quote not found" });
  }
  res.json(quote);
});

router.post("/:id/convert", (req: AuthRequest, res: Response) => {
  const quote = mockQuotes.find(q => q.id === req.params.id);
  if (!quote) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Quote not found" });
  }

  res.json({
    orderId: "ord_" + Date.now(),
    message: "Quote converted to order successfully",
  });
});

export { router as pricingRouter };
