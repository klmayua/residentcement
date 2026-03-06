/**
 * ResidentCement Product Service
 * 
 * Domain microservice for product catalog management
 * Handles product CRUD, categories, and availability checking
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient, ProductCategory } from '@prisma/client';
import { createLogger } from './utils/logger';

config();

const logger = createLogger('product-service');
const app: Express = express();
const PORT = process.env.PORT || 3006;

const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'product-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /products - List all products with filtering
app.get('/products', async (req: Request, res: Response) => {
  try {
    const { category, search, inStock, limit = 50, offset = 0 } = req.query;
    
    const where: any = {};
    
    if (category) {
      where.category = category as ProductCategory;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const products = await prisma.product.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            inventoryItems: true
          }
        }
      }
    });
    
    // Get availability for each product
    const productsWithAvailability = await Promise.all(
      products.map(async (product) => {
        const inventory = await prisma.inventoryItem.findMany({
          where: { productId: product.id },
          select: {
            quantity: true,
            depot: {
              select: {
                name: true,
                location: true
              }
            }
          }
        });
        
        const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          ...product,
          totalStock: totalQuantity,
          inStock: totalQuantity > 0,
          depotStock: inventory
        };
      })
    );
    
    const total = await prisma.product.count({ where });
    
    res.json({
      data: productsWithAvailability,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total
      }
    });
  } catch (error: any) {
    logger.error('Error listing products', { error: error.message });
    res.status(500).json({ error: 'Failed to list products' });
  }
});

// GET /products/:id - Get product by ID
app.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        inventoryItems: {
          include: {
            depot: {
              select: {
                id: true,
                name: true,
                location: true
              }
            }
          }
        },
        orderItems: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            order: {
              select: {
                id: true,
                status: true,
                createdAt: true
              }
            }
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const totalStock = product.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      ...product,
      totalStock,
      inStock: totalStock > 0
    });
  } catch (error: any) {
    logger.error('Error getting product', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// GET /products/:id/availability - Check product availability
app.get('/products/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        unit: true,
        inventoryItems: {
          include: {
            depot: {
              select: {
                id: true,
                name: true,
                location: true
              }
            }
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const totalQuantity = product.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    const reservedQuantity = product.inventoryItems.reduce((sum, item) => sum + (item.reservedQuantity || 0), 0);
    
    res.json({
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      totalQuantity,
      reservedQuantity,
      availableQuantity: totalQuantity - reservedQuantity,
      inStock: totalQuantity > 0,
      depots: product.inventoryItems.map(item => ({
        depotId: item.depotId,
        depotName: item.depot?.name || 'Unknown',
        location: item.depot?.location || 'Unknown',
        quantity: item.quantity,
        reservedQuantity: item.reservedQuantity || 0,
        availableQuantity: item.quantity - (item.reservedQuantity || 0),
        lastUpdated: item.lastUpdated
      }))
    });
  } catch (error: any) {
    logger.error('Error checking product availability', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// POST /products - Create new product
app.post('/products', async (req: Request, res: Response) => {
  try {
    const { name, description, category, basePrice, unit, sku, specifications, minOrderQuantity } = req.body;
    
    // Validate required fields
    if (!name || !basePrice || !category) {
      return res.status(400).json({ error: 'name, basePrice, and category are required' });
    }
    
    // Check for duplicate SKU
    if (sku) {
      const existing = await prisma.product.findUnique({
        where: { sku }
      });
      
      if (existing) {
        return res.status(409).json({ error: 'Product with this SKU already exists' });
      }
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        basePrice,
        unit: unit || 'bags',
        sku,
        specifications: specifications || {},
        minOrderQuantity: minOrderQuantity || 1,
        isActive: true
      }
    });
    
    logger.info('Product created', { 
      productId: product.id, 
      name: product.name,
      sku: product.sku 
    });
    
    res.status(201).json(product);
  } catch (error: any) {
    logger.error('Error creating product', { error: error.message });
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PATCH /products/:id - Update product
app.patch('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check for duplicate SKU if SKU is being updated
    if (updates.sku && updates.sku !== existing.sku) {
      const duplicate = await prisma.product.findUnique({
        where: { sku: updates.sku }
      });
      
      if (duplicate) {
        return res.status(409).json({ error: 'Product with this SKU already exists' });
      }
    }
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });
    
    logger.info('Product updated', { productId: id });
    res.json(product);
  } catch (error: any) {
    logger.error('Error updating product', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /products/:id - Deactivate product (soft delete)
app.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check for active orders with this product
    const activeOrders = await prisma.orderItem.count({
      where: {
        productId: id,
        order: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'PROCESSING']
          }
        }
      }
    });
    
    if (activeOrders > 0) {
      return res.status(400).json({ 
        error: 'Cannot deactivate product with active orders',
        activeOrders 
      });
    }
    
    // Soft delete - mark as inactive
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
    
    logger.info('Product deactivated', { productId: id });
    res.json({ message: 'Product deactivated successfully' });
  } catch (error: any) {
    logger.error('Error deactivating product', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to deactivate product' });
  }
});

// GET /products/categories - List product categories
app.get('/products/categories', (req: Request, res: Response) => {
  const categories = Object.values(ProductCategory).map(category => ({
    id: category,
    name: formatCategoryName(category),
    description: getCategoryDescription(category)
  }));
  
  res.json({ categories });
});

function formatCategoryName(category: string): string {
  return category
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    ORDINARY_PORTLAND_CEMENT_42_5: 'High-strength cement for general construction (42.5 MPa)',
    ORDINARY_PORTLAND_CEMENT_32_5: 'Standard cement for residential construction (32.5 MPa)',
    POZZOLANIC_CEMENT: 'Eco-friendly cement with enhanced durability',
    WHITE_CEMENT: 'Premium white cement for decorative applications',
    MASONRY_CEMENT: 'Specialized cement for bricklaying and plastering',
    OIL_WELL_CEMENT: 'Specialized cement for oil and gas industry'
  };
  return descriptions[category] || 'Cement product';
}

// GET /products/stats - Get product statistics
app.get('/products/stats', async (req: Request, res: Response) => {
  try {
    const [total, byCategory, active, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.product.groupBy({
        by: ['category'],
        _count: true
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          inventoryItems: true
        }
      }).then(products => {
        return products.filter(p => 
          p.inventoryItems.reduce((sum, i) => sum + i.quantity, 0) < 100
        ).length;
      })
    ]);
    
    res.json({
      total,
      active,
      inactive: total - active,
      lowStock,
      byCategory: byCategory.map(c => ({
        category: c.category,
        count: c._count
      }))
    });
  } catch (error: any) {
    logger.error('Error getting product stats', { error: error.message });
    res.status(500).json({ error: 'Failed to get product statistics' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Product Service running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
