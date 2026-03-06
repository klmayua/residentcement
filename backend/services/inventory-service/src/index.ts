/**
 * ResidentCement Inventory Service
 * 
 * Domain microservice for inventory management
 * Handles stock levels, reservations, adjustments, and depot management
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createLogger } from './utils/logger';

config();

const logger = createLogger('inventory-service');
const app: Express = express();
const PORT = process.env.PORT || 3003;

const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'inventory-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /inventory - List all inventory items with filtering
app.get('/inventory', async (req: Request, res: Response) => {
  try {
    const { productId, depotId, location, lowStock, limit = 50, offset = 0 } = req.query;
    
    const where: any = {};
    
    if (productId) {
      where.productId = productId as string;
    }
    
    if (depotId) {
      where.depotId = depotId as string;
    }
    
    if (location) {
      where.location = { contains: location as string, mode: 'insensitive' };
    }
    
    if (lowStock === 'true') {
      where.quantity = { lte: 100 }; // Below threshold
    }
    
    const inventory = await prisma.inventoryItem.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { lastUpdated: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            unit: true
          }
        },
        depot: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    });
    
    const total = await prisma.inventoryItem.count({ where });
    
    res.json({
      data: inventory,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total
      }
    });
  } catch (error: any) {
    logger.error('Error listing inventory', { error: error.message });
    res.status(500).json({ error: 'Failed to list inventory' });
  }
});

// GET /inventory/:id - Get inventory item by ID
app.get('/inventory/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        product: true,
        depot: true,
        adjustments: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.json(inventory);
  } catch (error: any) {
    logger.error('Error getting inventory item', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get inventory item' });
  }
});

// GET /inventory/product/:productId/availability - Check product availability across depots
app.get('/inventory/product/:productId/availability', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    const inventory = await prisma.inventoryItem.findMany({
      where: { productId },
      include: {
        depot: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            unit: true
          }
        }
      }
    });
    
    const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      productId,
      productName: inventory[0]?.product?.name || 'Unknown',
      unit: inventory[0]?.product?.unit || 'bags',
      totalQuantity,
      available: totalQuantity > 0,
      depots: inventory.map(item => ({
        depotId: item.depotId,
        depotName: item.depot?.name || 'Unknown',
        location: item.depot?.location || 'Unknown',
        quantity: item.quantity,
        lastUpdated: item.lastUpdated
      }))
    });
  } catch (error: any) {
    logger.error('Error checking product availability', { error: error.message, productId: req.params.productId });
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// POST /inventory - Create inventory item
app.post('/inventory', async (req: Request, res: Response) => {
  try {
    const { productId, depotId, location, quantity, minStock, maxStock } = req.body;
    
    // Validate required fields
    if (!productId || !depotId || quantity === undefined) {
      return res.status(400).json({ error: 'productId, depotId, and quantity are required' });
    }
    
    // Check for existing inventory at this depot
    const existing = await prisma.inventoryItem.findFirst({
      where: {
        productId,
        depotId
      }
    });
    
    if (existing) {
      return res.status(409).json({ 
        error: 'Inventory item already exists at this depot',
        inventoryId: existing.id
      });
    }
    
    const inventory = await prisma.inventoryItem.create({
      data: {
        productId,
        depotId,
        location,
        quantity,
        minStock: minStock || 100,
        maxStock: maxStock || 10000,
        lastUpdated: new Date()
      },
      include: {
        product: true,
        depot: true
      }
    });
    
    logger.info('Inventory item created', { 
      inventoryId: inventory.id, 
      productId, 
      depotId,
      quantity 
    });
    res.status(201).json(inventory);
  } catch (error: any) {
    logger.error('Error creating inventory item', { error: error.message });
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// POST /inventory/adjust - Adjust inventory quantity
app.post('/inventory/adjust', async (req: Request, res: Response) => {
  try {
    const { inventoryId, adjustment, reason, reference } = req.body;
    
    // Validate required fields
    if (!inventoryId || !adjustment || !reason) {
      return res.status(400).json({ error: 'inventoryId, adjustment, and reason are required' });
    }
    
    // Get current inventory
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id: inventoryId },
      include: { product: true }
    });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    const newQuantity = inventory.quantity + adjustment;
    
    if (newQuantity < 0) {
      return res.status(400).json({ 
        error: 'Adjustment would result in negative quantity',
        currentQuantity: inventory.quantity,
        requestedAdjustment: adjustment
      });
    }
    
    // Create adjustment record and update inventory in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create adjustment record
      const adjustmentRecord = await tx.inventoryAdjustment.create({
        data: {
          inventoryId,
          adjustment,
          reason,
          reference,
          previousQuantity: inventory.quantity,
          newQuantity
        }
      });
      
      // Update inventory
      const updatedInventory = await tx.inventoryItem.update({
        where: { id: inventoryId },
        data: {
          quantity: newQuantity,
          lastUpdated: new Date()
        },
        include: {
          product: true,
          depot: true
        }
      });
      
      return { adjustmentRecord, updatedInventory };
    });
    
    logger.info('Inventory adjusted', { 
      inventoryId, 
      adjustment, 
      reason,
      newQuantity 
    });
    
    res.json({
      message: 'Inventory adjusted successfully',
      adjustment: result.adjustmentRecord,
      inventory: result.updatedInventory
    });
  } catch (error: any) {
    logger.error('Error adjusting inventory', { error: error.message });
    res.status(500).json({ error: 'Failed to adjust inventory' });
  }
});

// POST /inventory/reserve - Reserve inventory for an order
app.post('/inventory/reserve', async (req: Request, res: Response) => {
  try {
    const { productId, depotId, quantity, orderId } = req.body;
    
    // Validate required fields
    if (!productId || !quantity || !orderId) {
      return res.status(400).json({ error: 'productId, quantity, and orderId are required' });
    }
    
    // Find inventory at specified depot or any depot if depotId not specified
    const where: any = { productId, quantity: { gte: quantity } };
    if (depotId) {
      where.depotId = depotId;
    }
    
    const inventory = await prisma.inventoryItem.findFirst({
      where,
      orderBy: { quantity: 'desc' }
    });
    
    if (!inventory) {
      return res.status(409).json({ 
        error: 'Insufficient inventory',
        requested: quantity,
        productId,
        depotId
      });
    }
    
    // Reserve inventory
    const result = await prisma.$transaction(async (tx) => {
      // Update inventory
      await tx.inventoryItem.update({
        where: { id: inventory.id },
        data: {
          quantity: inventory.quantity - quantity,
          reservedQuantity: (inventory.reservedQuantity || 0) + quantity,
          lastUpdated: new Date()
        }
      });
      
      // Create reservation record (you may need to add this model to schema)
      // For now, we'll just return the updated inventory
      return tx.inventoryItem.findUnique({
        where: { id: inventory.id },
        include: {
          product: true,
          depot: true
        }
      });
    });
    
    logger.info('Inventory reserved', { 
      inventoryId: inventory.id, 
      quantity, 
      orderId 
    });
    
    res.json({
      message: 'Inventory reserved successfully',
      inventory: result,
      reservedQuantity: quantity,
      orderId
    });
  } catch (error: any) {
    logger.error('Error reserving inventory', { error: error.message });
    res.status(500).json({ error: 'Failed to reserve inventory' });
  }
});

// POST /inventory/release - Release reserved inventory
app.post('/inventory/release', async (req: Request, res: Response) => {
  try {
    const { inventoryId, quantity, orderId } = req.body;
    
    // Validate required fields
    if (!inventoryId || !quantity || !orderId) {
      return res.status(400).json({ error: 'inventoryId, quantity, and orderId are required' });
    }
    
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id: inventoryId }
    });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    const currentReserved = inventory.reservedQuantity || 0;
    
    if (currentReserved < quantity) {
      return res.status(400).json({ 
        error: 'Cannot release more than reserved',
        reserved: currentReserved,
        requested: quantity
      });
    }
    
    // Release reservation
    const updatedInventory = await prisma.inventoryItem.update({
      where: { id: inventoryId },
      data: {
        quantity: inventory.quantity + quantity,
        reservedQuantity: currentReserved - quantity,
        lastUpdated: new Date()
      },
      include: {
        product: true,
        depot: true
      }
    });
    
    logger.info('Inventory released', { 
      inventoryId, 
      quantity, 
      orderId 
    });
    
    res.json({
      message: 'Inventory released successfully',
      inventory: updatedInventory
    });
  } catch (error: any) {
    logger.error('Error releasing inventory', { error: error.message });
    res.status(500).json({ error: 'Failed to release inventory' });
  }
});

// GET /inventory/low-stock - Get all low stock items
app.get('/inventory/low-stock', async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      where: {
        quantity: { lte: prisma.inventoryItem.fields.minStock }
      },
      include: {
        product: true,
        depot: true
      },
      orderBy: { quantity: 'asc' }
    });
    
    res.json({
      data: inventory,
      count: inventory.length
    });
  } catch (error: any) {
    logger.error('Error getting low stock items', { error: error.message });
    res.status(500).json({ error: 'Failed to get low stock items' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Inventory Service running on port ${PORT}`);
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
