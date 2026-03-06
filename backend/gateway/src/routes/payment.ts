import { Router, Response, AuthRequest } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

const initiatePaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.enum(["bank_transfer", "card", "ussd"]),
  callbackUrl: z.string().url().optional(),
});

const mockPayments = [
  {
    id: "pay_001",
    orderId: "ord_001",
    amount: 660000,
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "TXN-20250301-ABC123",
    createdAt: "2025-03-01T10:00:00Z",
    completedAt: "2025-03-01T10:05:00Z",
  },
  {
    id: "pay_002",
    orderId: "ord_002",
    amount: 900000,
    paymentMethod: "card",
    status: "completed",
    reference: "TXN-20250303-DEF456",
    createdAt: "2025-03-03T14:30:00Z",
    completedAt: "2025-03-03T14:32:00Z",
  },
];

router.post("/initiate", async (req: AuthRequest, res: Response) => {
  try {
    const body = initiatePaymentSchema.parse(req.body);
    
    const payment = {
      id: "pay_" + Date.now(),
      orderId: body.orderId,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      status: "pending",
      reference: "TXN-" + Date.now(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    if (body.paymentMethod === "bank_transfer") {
      (payment as any).bankDetails = {
        bankName: "First Bank of Nigeria",
        accountNumber: "1234567890",
        accountName: "Resident Cement Ltd",
      };
    } else if (body.paymentMethod === "ussd") {
      (payment as any).ussdCode = "*123*456#";
    } else {
      (payment as any).paymentUrl = "https://checkout.paystack.com/xxx";
    }

    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        errors: error.errors,
      });
    }
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to initiate payment" });
  }
});

router.get("/", (req: AuthRequest, res: Response) => {
  const { orderId, status } = req.query;
  
  let payments = [...mockPayments];
  
  if (orderId) {
    payments = payments.filter(p => p.orderId === orderId);
  }
  
  if (status) {
    payments = payments.filter(p => p.status === status);
  }

  res.json({ data: payments });
});

router.get("/:id", (req: AuthRequest, res: Response) => {
  const payment = mockPayments.find(p => p.id === req.params.id);
  if (!payment) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Payment not found" });
  }
  res.json(payment);
});

router.get("/:id/status", (req: AuthRequest, res: Response) => {
  const payment = mockPayments.find(p => p.id === req.params.id);
  if (!payment) {
    return res.status(404).json({ code: "NOT_FOUND", message: "Payment not found" });
  }
  res.json({
    id: payment.id,
    status: payment.status,
    reference: payment.reference,
  });
});

router.post("/webhook", async (req: AuthRequest, res: Response) => {
  const { event, data } = req.body;
  
  console.log("Payment webhook received:", event, data);
  
  res.json({ received: true });
});

export { router as paymentRouter };
