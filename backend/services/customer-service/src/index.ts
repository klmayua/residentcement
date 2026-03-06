/**
 * ResidentCement Customer Service
 * 
 * Domain microservice for customer management
 * Handles CRUD operations, customer tier management, and credit limits
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createLogger } from './utils/logger';

config();

const logger = createLogger('customer-service');
const app: Express = express();
const PORT = process.env.PORT || 3002;

const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'customer-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /customers - List all customers with optional filtering
app.get('/customers', async (req: Request, res: Response) => {
  try {
    const { tier, status, search, limit = 50, offset = 0 } = req.query;
    
    const where: any = {};
    
    if (tier) {
      where.tier = tier as string;
    }
    
    if (status) {
      where.status = status as string;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    const customers = await prisma.customer.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { orders: true }
        }
      }
    });
    
    const total = await prisma.customer.count({ where });
    
    res.json({
      data: customers,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total
      }
    });
  } catch (error: any) {
    logger.error('Error listing customers', { error: error.message });
    res.status(500).json({ error: 'Failed to list customers' });
  }
});

// GET /customers/:id - Get customer by ID
app.get('/customers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: { orders: true, quotes: true, payments: true }
        }
      }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error: any) {
    logger.error('Error getting customer', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

// POST /customers - Create new customer
app.post('/customers', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, state, lga, tier, creditLimit, contactPerson } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // Check for duplicate email
    const existing = await prisma.customer.findUnique({
      where: { email }
    });
    
    if (existing) {
      return res.status(409).json({ error: 'Customer with this email already exists' });
    }
    
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        lga,
        tier: tier || 'STANDARD',
        creditLimit: creditLimit || 0,
        contactPerson,
        status: 'ACTIVE'
      }
    });
    
    logger.info('Customer created', { customerId: customer.id, email: customer.email });
    res.status(201).json(customer);
  } catch (error: any) {
    logger.error('Error creating customer', { error: error.message });
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PATCH /customers/:id - Update customer
app.patch('/customers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if customer exists
    const existing = await prisma.customer.findUnique({
      where: { id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Check for duplicate email if email is being updated
    if (updates.email && updates.email !== existing.email) {
      const duplicate = await prisma.customer.findUnique({
        where: { email: updates.email }
      });
      
      if (duplicate) {
        return res.status(409).json({ error: 'Customer with this email already exists' });
      }
    }
    
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });
    
    logger.info('Customer updated', { customerId: customer.id });
    res.json(customer);
  } catch (error: any) {
    logger.error('Error updating customer', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /customers/:id - Deactivate customer (soft delete)
app.delete('/customers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if customer exists
    const existing = await prisma.customer.findUnique({
      where: { id }
    });
    
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Check for active orders
    const activeOrders = await prisma.order.count({
      where: {
        customerId: id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PROCESSING']
        }
      }
    });
    
    if (activeOrders > 0) {
      return res.status(400).json({ 
        error: 'Cannot deactivate customer with active orders',
        activeOrders 
      });
    }
    
    // Soft delete - update status to INACTIVE
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        deactivatedAt: new Date()
      }
    });
    
    logger.info('Customer deactivated', { customerId: customer.id });
    res.json({ message: 'Customer deactivated successfully', customer });
  } catch (error: any) {
    logger.error('Error deactivating customer', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to deactivate customer' });
  }
});

// GET /customers/:id/credit-status - Get customer credit status
app.get('/customers/:id/credit-status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        creditLimit: true,
        tier: true
      }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Calculate outstanding balance
    const orders = await prisma.order.findMany({
      where: { customerId: id },
      select: {
        total: true,
        status: true
      }
    });
    
    const payments = await prisma.payment.findMany({
      where: { customerId: id },
      select: {
        amount: true,
        status: true
      }
    });
    
    const totalOrders = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total.toNumber(), 0);
    
    const totalPayments = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount.toNumber(), 0);
    
    const outstandingBalance = totalOrders - totalPayments;
    const availableCredit = customer.creditLimit - outstandingBalance;
    
    res.json({
      customerId: customer.id,
      customerName: customer.name,
      creditLimit: customer.creditLimit,
      outstandingBalance,
      availableCredit,
      creditUtilization: (outstandingBalance / customer.creditLimit) * 100,
      tier: customer.tier
    });
  } catch (error: any) {
    logger.error('Error getting credit status', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get credit status' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Customer Service running on port ${PORT}`);
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
