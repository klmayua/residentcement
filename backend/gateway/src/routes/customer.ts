import { Router, Response, AuthRequest } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import logger from "../utils/logger";

const customerLogger = logger;

const createCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  phone: z.string().min(10),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

const updateCustomerSchema = z.object({
  companyName: z.string().min(1).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM"]).optional(),
  creditLimit: z.number().optional(),
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", search, tier, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { companyName: { contains: search as string, mode: "insensitive" } },
        { user: { email: { contains: search as string, mode: "insensitive" } } },
      ];
    }
    
    if (tier) {
      where.tier = tier;
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      data: customers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch customers" });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            isActive: true,
          },
        },
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch customer" });
  }
});

router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateCustomerSchema.parse(req.body);

    const customer = await prisma.customer.update({
      where: { id },
      data: body,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    res.json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid input", errors: error.errors });
    }
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to update customer" });
  }
});

export { router as customerRouter };
