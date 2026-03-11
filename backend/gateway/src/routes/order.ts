import { Router, Response, Request, NextFunction } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import logger from "../utils/logger";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middleware/auth";

const router = Router();
const orderLogger = logger;

const createOrderSchema = z.object({
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  deliveryAddress: z.string(),
  deliveryDate: z.string().optional(),
  paymentMethod: z.enum(["BANK_TRANSFER", "CARD", "USSD"]),
  notes: z.string().optional(),
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", status, startDate, endDate } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          customer: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch orders" });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        shipments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch order" });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const body = createOrderSchema.parse(req.body);
    const userId = req.user?.id || "unknown";

    const products = await prisma.product.findMany({
      where: {
        id: { in: body.items.map(item => item.productId) },
      },
    });

    if (products.length !== body.items.length) {
      return res.status(400).json({ code: "INVALID_PRODUCT", message: "One or more products not found" });
    }

    const orderItems = body.items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      const unitPrice = Number(product.basePrice);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);
    const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: body.customerId,
        userId,
        totalAmount,
        deliveryAddress: body.deliveryAddress,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: body.notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    logger.info({ orderId: order.id, userId, action: "create_order" });

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid input", errors: error.errors });
    }
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create order" });
  }
});

router.patch("/:id/cancel", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({ where: { id } });
    
    if (!order) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Order not found" });
    }

    if (order.status === "DELIVERED" || order.status === "IN_TRANSIT") {
      return res.status(400).json({
        code: "INVALID_STATE",
        message: "Cannot cancel order that is already delivered or in transit",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to cancel order" });
  }
});

export { router as orderRouter };
