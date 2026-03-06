import { Router, Response, AuthRequest } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import logger from "../utils/logger";

const productLogger = logger;

const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["CEMENT", "AGGREGATE", "POZZOLANA"]).default("CEMENT"),
  grade: z.string().min(1),
  unit: z.string().default("bag"),
  unitSize: z.number().int().positive().default(50),
  basePrice: z.number().positive(),
  currency: z.string().default("NGN"),
  imageUrl: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial();

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "20", search, category, grade, inStock } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { sku: { contains: search as string, mode: "insensitive" } },
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (grade) {
      where.grade = grade;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch products" });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        inventoryItems: {
          include: {
            depot: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch product" });
  }
});

router.get("/:id/availability", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        inventoryItems: true,
      },
    });

    if (!product) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Product not found" });
    }

    const totalStock = product.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    const reorderPoint = product.inventoryItems.reduce((sum, item) => sum + item.reorderPoint, 0);

    res.json({
      productId: product.id,
      productName: product.name,
      availableStock: totalStock,
      reorderPoint,
      status: totalStock > reorderPoint ? "in_stock" : "low_stock",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to fetch availability" });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const body = createProductSchema.parse(req.body);
    
    const product = await prisma.product.create({
      data: body,
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid input", errors: error.errors });
    }
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create product" });
  }
});

router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateProductSchema.parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data: body,
    });

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid input", errors: error.errors });
    }
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to update product" });
  }
});

export { router as productRouter };
