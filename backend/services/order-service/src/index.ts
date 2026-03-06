/**
 * ResidentCement Order Service
 * 
 * Domain microservice for order management
 * Handles order lifecycle, status transitions, and order items
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { createLogger } from './utils/logger';
import { v4 as uuidv4 } from 'uuid';

config();

const logger = createLogger('order-service');
const app: Express = express();
const PORT = process.env.PORT || 3007;

const prisma = new PrismaClient();

// Valid status transitions
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_DELIVERY: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'order-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /orders - List all orders with filtering
app.get('/orders', async (req: Request, res: Response) => {
  try {
    const { customerId, status, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    const where: any = {};
    
    if (customerId) {
      where.customerId = customerId as string;
    }
    
    if (status) {
      where.status = status as OrderStatus;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }
    
    const orders = await prisma.order.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            tier: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                unit: true
              }
            }
          }
        },
        payments: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            amount: true
          }
        },
        _count: {
          select: { orderItems: true, payments: true }
        }
      }
    });
    
    const total = await prisma.order.count({ where });
    
    res.json({
      data: orders,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total
      }
    });
  } catch (error: any) {
    logger.error('Error listing orders', { error: error.message });
    res.status(500).json({ error: 'Failed to list orders' });
  }
});

// GET /orders/:id - Get order by ID
app.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            tier: true,
            address: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                unit: true,
                category: true
              }
            }
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            amount: true,
            paymentMethod: true,
            paidAt: true,
            reference: true
          }
        },
        shipments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error: any) {
    logger.error('Error getting order', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// POST /orders - Create new order
app.post('/orders', async (req: Request, res: Response) => {
  try {
    const { customerId, items, deliveryAddress, deliveryCity, deliveryState, notes, quoteId } = req.body;
    
    // Validate required fields
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'customerId and items array are required' });
    }
    
    // Get customer for tier information
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        tier: true,
        creditLimit: true
      }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Calculate order total
    let subtotal = 0;
    const orderItemsData = [];
    
    for (const item of items) {
      const { productId, quantity } = item;
      
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          basePrice: true,
          name: true,
          unit: true
        }
      });
      
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${productId}` });
      }
      
      const itemTotal = product.basePrice.toNumber() * quantity;
      subtotal += itemTotal;
      
      orderItemsData.push({
        productId,
        quantity,
        unitPrice: product.basePrice,
        total: itemTotal
      });
    }
    
    // Apply tier-based discount
    const tierDiscounts: Record<string, number> = {
      STANDARD: 0,
      SILVER: 0.05,
      GOLD: 0.10,
      PLATINUM: 0.15,
      ENTERPRISE: 0.20
    };
    
    const discountRate = tierDiscounts[customer.tier] || 0;
    const discount = subtotal * discountRate;
    
    // Calculate VAT (7.5%)
    const vat = (subtotal - discount) * 0.075;
    
    // Delivery fee (simplified)
    const deliveryFee = deliveryAddress ? 5000 : 0;
    
    // Calculate total
    const total = subtotal - discount + vat + deliveryFee;
    
    // Check credit limit if applicable
    if (total > customer.creditLimit) {
      return res.status(400).json({
        error: 'Order total exceeds customer credit limit',
        orderTotal: total,
        creditLimit: customer.creditLimit
      });
    }
    
    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const createdOrder = await tx.order.create({
        data: {
          id: `ord_${uuidv4()}`,
          customerId,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          subtotal,
          discount,
          vat,
          deliveryFee,
          total,
          deliveryAddress,
          deliveryCity,
          deliveryState,
          notes,
          quoteId,
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              tier: true
            }
          }
        }
      });
      
      // Reserve inventory for each item
      for (const item of orderItemsData) {
        // Find inventory with sufficient stock
        const inventory = await tx.inventoryItem.findFirst({
          where: {
            productId: item.productId,
            quantity: { gte: item.quantity }
          },
          orderBy: { quantity: 'desc' }
        });
        
        if (inventory) {
          // Reserve inventory
          await tx.inventoryItem.update({
            where: { id: inventory.id },
            data: {
              quantity: inventory.quantity - item.quantity,
              reservedQuantity: (inventory.reservedQuantity || 0) + item.quantity
            }
          });
          
          logger.info('Inventory reserved for order', {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            inventoryId: inventory.id
          });
        } else {
          logger.warn('Insufficient inventory for order item', {
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity
          });
        }
      }
      
      return createdOrder;
    });
    
    logger.info('Order created', { 
      orderId: order.id, 
      customerId, 
      total: order.total 
    });
    
    res.status(201).json(order);
  } catch (error: any) {
    logger.error('Error creating order', { error: error.message });
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PATCH /orders/:id/status - Update order status
app.patch('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const newStatus = status as OrderStatus;
    
    // Get current order
    const order = await prisma.order.findUnique({
      where: { id }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Validate status transition
    const validTransitions = VALID_TRANSITIONS[order.status] || [];
    
    if (!validTransitions.includes(newStatus)) {
      return res.status(400).json({
        error: `Invalid status transition from ${order.status} to ${newStatus}`,
        validTransitions
      });
    }
    
    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
        statusHistory: {
          push: {
            status: newStatus,
            changedAt: new Date(),
            reason: reason || null
          }
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        customer: true
      }
    });
    
    // Handle inventory release on cancellation
    if (newStatus === 'CANCELLED') {
      await prisma.$transaction(async (tx) => {
        for (const item of order.orderItems) {
          // Find the inventory that was reserved
          const inventory = await tx.inventoryItem.findFirst({
            where: { productId: item.productId }
          });
          
          if (inventory) {
            // Release reserved inventory
            await tx.inventoryItem.update({
              where: { id: inventory.id },
              data: {
                quantity: inventory.quantity + item.quantity,
                reservedQuantity: Math.max(0, (inventory.reservedQuantity || 0) - item.quantity)
              }
            });
            
            logger.info('Inventory released due to order cancellation', {
              orderId: id,
              productId: item.productId,
              quantity: item.quantity
            });
          }
        }
      });
    }
    
    logger.info('Order status updated', { 
      orderId: id, 
      previousStatus: order.status,
      newStatus 
    });
    
    res.json(updatedOrder);
  } catch (error: any) {
    logger.error('Error updating order status', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// PATCH /orders/:id/cancel - Cancel order
app.patch('/orders/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const order = await prisma.order.findUnique({
      where: { id }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Order is already cancelled' });
    }
    
    if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
      return res.status(400).json({ 
        error: 'Cannot cancel delivered/completed order',
        status: order.status
      });
    }
    
    // Update order status to cancelled
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date(),
        statusHistory: {
          push: {
            status: 'CANCELLED',
            changedAt: new Date(),
            reason: reason || 'Customer requested cancellation'
          }
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        customer: true
      }
    });
    
    // Release reserved inventory
    await prisma.$transaction(async (tx) => {
      for (const item of updatedOrder.orderItems) {
        const inventory = await tx.inventoryItem.findFirst({
          where: { productId: item.productId }
        });
        
        if (inventory) {
          await tx.inventoryItem.update({
            where: { id: inventory.id },
            data: {
              quantity: inventory.quantity + item.quantity,
              reservedQuantity: Math.max(0, (inventory.reservedQuantity || 0) - item.quantity)
            }
          });
        }
      }
    });
    
    logger.info('Order cancelled', { 
      orderId: id, 
      reason: reason || 'Not provided' 
    });
    
    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error: any) {
    logger.error('Error cancelling order', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// GET /orders/stats - Get order statistics
app.get('/orders/stats', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where: any = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }
    
    const [total, byStatus, totalRevenue, pendingOrders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      prisma.order.aggregate({
        where: { ...where, status: { not: 'CANCELLED' } },
        _sum: { total: true }
      }),
      prisma.order.count({
        where: { ...where, status: 'PENDING' }
      })
    ]);
    
    res.json({
      total,
      byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      period: { startDate, endDate }
    });
  } catch (error: any) {
    logger.error('Error getting order stats', { error: error.message });
    res.status(500).json({ error: 'Failed to get order statistics' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Order Service running on port ${PORT}`);
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
