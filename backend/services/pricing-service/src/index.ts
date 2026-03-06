/**
 * ResidentCement Pricing Service
 * 
 * Domain microservice for pricing and quote management
 * Handles dynamic pricing, tier-based discounts, and quote calculations
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient, CustomerTier } from '@prisma/client';
import { createLogger } from './utils/logger';
import { v4 as uuidv4 } from 'uuid';

config();

const logger = createLogger('pricing-service');
const app: Express = express();
const PORT = process.env.PORT || 3004;

const prisma = new PrismaClient();

// Tier-based discount percentages
const TIER_DISCOUNTS: Record<CustomerTier, number> = {
  STANDARD: 0,
  SILVER: 5,
  GOLD: 10,
  PLATINUM: 15,
  ENTERPRISE: 20
};

// Volume-based discount thresholds
const VOLUME_DISCOUNTS = [
  { minQuantity: 1000, discount: 3 },
  { minQuantity: 5000, discount: 5 },
  { minQuantity: 10000, discount: 8 },
  { minQuantity: 50000, discount: 12 }
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'pricing-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// POST /quotes/calculate - Calculate quote without saving
app.post('/quotes/calculate', async (req: Request, res: Response) => {
  try {
    const { customerId, items, deliveryLocation } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }
    
    // Get customer for tier-based pricing
    let customerTier: CustomerTier = 'STANDARD';
    let customerName = '';
    
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { tier: true, name: true }
      });
      
      if (customer) {
        customerTier = customer.tier || 'STANDARD';
        customerName = customer.name;
      }
    }
    
    // Calculate line items
    const lineItems = await Promise.all(
      items.map(async (item: any) => {
        const { productId, quantity } = item;
        
        // Get product pricing
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: {
            id: true,
            name: true,
            basePrice: true,
            unit: true,
            category: true
          }
        });
        
        if (!product) {
          throw new Error(`Product not found: ${productId}`);
        }
        
        const basePrice = product.basePrice.toNumber();
        const lineTotal = basePrice * quantity;
        
        return {
          productId,
          productName: product.name,
          quantity,
          unitPrice: basePrice,
          unit: product.unit,
          lineTotal
        };
      })
    );
    
    // Calculate subtotal
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    
    // Apply tier-based discount
    const tierDiscountRate = TIER_DISCOUNTS[customerTier] || 0;
    const tierDiscount = subtotal * (tierDiscountRate / 100);
    
    // Calculate total quantity for volume discount
    const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Apply volume-based discount
    const volumeDiscountTier = VOLUME_DISCOUNTS
      .slice()
      .reverse()
      .find(tier => totalQuantity >= tier.minQuantity);
    
    const volumeDiscountRate = volumeDiscountTier?.discount || 0;
    const volumeDiscount = subtotal * (volumeDiscountRate / 100);
    
    // Calculate total discount
    const totalDiscount = tierDiscount + volumeDiscount;
    
    // Calculate VAT (7.5% Nigeria VAT)
    const vatRate = 7.5;
    const vat = (subtotal - totalDiscount) * (vatRate / 100);
    
    // Calculate delivery fee (simplified - would be more complex in production)
    const deliveryFee = deliveryLocation ? 5000 : 0; // Flat rate for now
    
    // Calculate total
    const total = subtotal - totalDiscount + vat + deliveryFee;
    
    const quote = {
      quoteId: `quote_${uuidv4()}`,
      customerId,
      customerName,
      customerTier,
      items: lineItems,
      subtotal,
      discounts: {
        tier: {
          rate: tierDiscountRate,
          amount: tierDiscount
        },
        volume: {
          rate: volumeDiscountRate,
          amount: volumeDiscount,
          totalQuantity
        },
        total: totalDiscount
      },
      vat: {
        rate: vatRate,
        amount: vat
      },
      deliveryFee,
      total,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      calculatedAt: new Date().toISOString()
    };
    
    res.json(quote);
  } catch (error: any) {
    logger.error('Error calculating quote', { error: error.message });
    res.status(500).json({ 
      error: 'Failed to calculate quote',
      details: error.message 
    });
  }
});

// POST /quotes - Create and save quote
app.post('/quotes', async (req: Request, res: Response) => {
  try {
    const { customerId, items, deliveryLocation, notes, validDays = 7 } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }
    
    // Calculate pricing first
    const calcResponse = await fetch(`http://localhost:${PORT}/quotes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, items, deliveryLocation })
    });
    
    const calculation = await calcResponse.json();
    
    if (!calcResponse.ok) {
      return res.status(calcResponse.status).json(calculation);
    }
    
    // Create quote in database
    const quote = await prisma.quote.create({
      data: {
        id: calculation.quoteId,
        customerId,
        subtotal: calculation.subtotal,
        discount: calculation.discounts.total,
        vat: calculation.vat.amount,
        deliveryFee: calculation.deliveryFee,
        total: calculation.total,
        status: 'PENDING',
        validUntil: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000),
        notes,
        quoteItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.lineTotal
          }))
        }
      },
      include: {
        quoteItems: {
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
        customer: {
          select: {
            id: true,
            name: true,
            tier: true
          }
        }
      }
    });
    
    logger.info('Quote created', { 
      quoteId: quote.id, 
      customerId, 
      total: quote.total 
    });
    
    res.status(201).json(quote);
  } catch (error: any) {
    logger.error('Error creating quote', { error: error.message });
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// GET /quotes - List quotes
app.get('/quotes', async (req: Request, res: Response) => {
  try {
    const { customerId, status, limit = 50, offset = 0 } = req.query;
    
    const where: any = {};
    
    if (customerId) {
      where.customerId = customerId as string;
    }
    
    if (status) {
      where.status = status as string;
    }
    
    const quotes = await prisma.quote.findMany({
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
        quoteItems: {
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
        _count: {
          select: { quoteItems: true }
        }
      }
    });
    
    const total = await prisma.quote.count({ where });
    
    res.json({
      data: quotes,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total
      }
    });
  } catch (error: any) {
    logger.error('Error listing quotes', { error: error.message });
    res.status(500).json({ error: 'Failed to list quotes' });
  }
});

// GET /quotes/:id - Get quote by ID
app.get('/quotes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            tier: true,
            email: true,
            phone: true
          }
        },
        quoteItems: {
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
        }
      }
    });
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json(quote);
  } catch (error: any) {
    logger.error('Error getting quote', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get quote' });
  }
});

// POST /quotes/:id/convert - Convert quote to order
app.post('/quotes/:id/convert', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        quoteItems: true,
        customer: true
      }
    });
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    if (quote.status !== 'PENDING') {
      return res.status(400).json({ 
        error: 'Quote can only be converted if pending',
        currentStatus: quote.status
      });
    }
    
    if (quote.validUntil < new Date()) {
      return res.status(400).json({ 
        error: 'Quote has expired',
        validUntil: quote.validUntil
      });
    }
    
    // Create order from quote in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Update quote status
      await tx.quote.update({
        where: { id },
        data: { status: 'CONVERTED' }
      });
      
      // Create order
      return tx.order.create({
        data: {
          customerId: quote.customerId,
          status: 'PENDING',
          total: quote.total,
          discount: quote.discount,
          vat: quote.vat,
          deliveryFee: quote.deliveryFee,
          orderItems: {
            create: quote.quoteItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total
            }))
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
    });
    
    logger.info('Quote converted to order', { 
      quoteId: id, 
      orderId: order.id 
    });
    
    res.json({
      message: 'Quote converted to order successfully',
      order
    });
  } catch (error: any) {
    logger.error('Error converting quote to order', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to convert quote to order' });
  }
});

// DELETE /quotes/:id - Cancel/void quote
app.delete('/quotes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const quote = await prisma.quote.findUnique({
      where: { id }
    });
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    if (quote.status === 'CONVERTED') {
      return res.status(400).json({ 
        error: 'Cannot delete converted quote',
        status: quote.status
      });
    }
    
    await prisma.quote.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
    
    logger.info('Quote cancelled', { quoteId: id });
    res.json({ message: 'Quote cancelled successfully' });
  } catch (error: any) {
    logger.error('Error cancelling quote', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to cancel quote' });
  }
});

// GET /pricing/tiers - Get pricing tier information
app.get('/pricing/tiers', (req: Request, res: Response) => {
  res.json({
    tiers: Object.entries(TIER_DISCOUNTS).map(([tier, discount]) => ({
      tier,
      discountPercentage: discount,
      description: getTierDescription(tier)
    })),
    volumeDiscounts: VOLUME_DISCOUNTS
  });
});

function getTierDescription(tier: string): string {
  const descriptions: Record<string, string> = {
    STANDARD: 'Base pricing, no volume discounts',
    SILVER: '5% discount on all orders',
    GOLD: '10% discount + priority support',
    PLATINUM: '15% discount + dedicated account manager',
    ENTERPRISE: '20% discount + custom terms'
  };
  return descriptions[tier] || 'Standard pricing';
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Pricing Service running on port ${PORT}`);
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
