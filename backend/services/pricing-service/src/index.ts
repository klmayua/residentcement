/**
 * ResidentCement Pricing Service
 * 
 * Dynamic pricing engine with rules-based discounts
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { 
  createLogger, requestIdMiddleware, requestLoggingMiddleware, errorHandler,
  createHealthCheckService, checkMemory, NotFoundError,
  createPricingRuleSchema, updatePricingRuleSchema, pricingQuerySchema,
} from '@resident-cement/kernel';
import { PrismaClient, PricingRuleType, PricingScope, PricingValueType } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({ service: 'pricing-service', version: '1.0.0', environment: process.env.NODE_ENV || 'development' });
const app: Express = express();
const PORT = parseInt(process.env.PORT || '3004', 10);
const prisma = new PrismaClient({ log: ['error'] });
const kafkaClient = createKafkaClient('pricing-service');
kafkaClient.connect().catch(() => {});

const healthService = createHealthCheckService('pricing-service', '1.0.0');
healthService.addCheck('database', async () => { const start = Date.now(); try { await prisma.$queryRaw`SELECT 1`; return { name: 'database', status: 'pass', responseTime: Date.now() - start }; } catch { return { name: 'database', status: 'fail', responseTime: Date.now() - start }; } });
healthService.addCheck('memory', () => checkMemory(0.9));

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(requestIdMiddleware());
app.use(requestLoggingMiddleware({ skipPaths: ['/health'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use((req: Request, res: Response, next: NextFunction) => { (req as any).logger = logger.child({ requestId: req.id }); next(); });

const healthRouter = express.Router();
healthRouter.get('/', async (req: Request, res: Response) => { const h = await healthService.getHealthStatus(); res.json({ status: h.status, service: h.service, uptime: h.uptime }); });
healthRouter.get('/ready', async (req: Request, res: Response) => { const h = await healthService.getHealthStatus(); if (h.status === 'unhealthy') return res.status(503).json({ ready: false }); res.json({ ready: true }); });
healthRouter.get('/live', async (req: Request, res: Response) => { res.json({ alive: true, uptime: process.uptime() }); });
app.use('/health', healthRouter);

const pricingRouter = express.Router();

// GET /pricing/rules - List pricing rules
pricingRouter.get('/rules', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = pricingQuerySchema.parse(req.query);
    const { page = 1, limit = 50, ruleType, scope, isActive, search } = query;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (ruleType) where.ruleType = ruleType;
    if (scope) where.scope = scope;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];

    const [rules, total] = await Promise.all([
      prisma.pricingRule.findMany({ where, take: limit, skip: offset, orderBy: { priority: 'desc' } }),
      prisma.pricingRule.count({ where }),
    ]);

    res.json({ success: true, data: rules, meta: { requestId: req.id, timestamp: new Date().toISOString(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: offset + limit < total } } });
  } catch (error) { next(error); }
});

// GET /pricing/rules/:id - Get pricing rule
pricingRouter.get('/rules/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const rule = await prisma.pricingRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundError('Pricing rule', id);
    res.json({ success: true, data: rule, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /pricing/rules - Create pricing rule
pricingRouter.post('/rules', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createPricingRuleSchema.parse(req.body);
    const rule = await prisma.pricingRule.create({
      data: { ...data, id: uuidv4() },
    });
    res.status(201).json({ success: true, data: rule, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// PATCH /pricing/rules/:id - Update pricing rule
pricingRouter.patch('/rules/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const data = updatePricingRuleSchema.parse(req.body);
    const existing = await prisma.pricingRule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Pricing rule', id);

    const rule = await prisma.pricingRule.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    res.json({ success: true, data: rule, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// DELETE /pricing/rules/:id - Delete pricing rule
pricingRouter.delete('/rules/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const existing = await prisma.pricingRule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Pricing rule', id);
    await prisma.pricingRule.update({ where: { id }, data: { isActive: false } });
    res.json({ success: true, data: { message: 'Pricing rule deactivated' }, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /pricing/calculate - Calculate price with applicable discounts
pricingRouter.post('/calculate', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const { productId, customerId, quantity = 1, basePrice } = req.body;

    if (!basePrice) throw new ValidationError('basePrice is required');

    // Fetch applicable pricing rules
    const rules = await prisma.pricingRule.findMany({
      where: {
        isActive: true,
        OR: [
          { scope: 'GLOBAL' },
          productId ? { scope: 'PRODUCT', productId } : {},
          { scope: 'PRODUCT_CATEGORY' },
          customerId ? { scope: 'CUSTOMER', scopeValue: customerId } : {},
        ].filter(Boolean),
        startDate: { lte: new Date() },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      },
      orderBy: { priority: 'desc' },
    });

    let finalPrice = parseFloat(basePrice);
    let totalDiscount = 0;
    const appliedRules: any[] = [];

    for (const rule of rules) {
      let applies = true;

      // Check quantity constraints
      if (rule.minQuantity && quantity < rule.minQuantity) applies = false;
      if (rule.maxQuantity && quantity > rule.maxQuantity) applies = false;

      if (applies) {
        let discount = 0;
        if (rule.ruleType === 'PERCENTAGE') {
          discount = rule.valueType === 'PERCENTAGE' 
            ? (finalPrice * rule.value.toNumber()) / 100 
            : rule.value.toNumber();
        } else if (rule.ruleType === 'FIXED') {
          discount = rule.value.toNumber();
        }

        if (rule.stackable || appliedRules.length === 0) {
          finalPrice -= discount;
          totalDiscount += discount;
          appliedRules.push({ ruleId: rule.id, name: rule.name, discount });
        }
      }
    }

    // Ensure price doesn't go below zero
    finalPrice = Math.max(0, finalPrice);

    const result = {
      productId,
      customerId,
      quantity,
      basePrice,
      finalPrice,
      totalDiscount,
      discountPercent: basePrice > 0 ? ((totalDiscount / basePrice) * 100) : 0,
      appliedRules,
      currency: 'NGN',
    };

    requestLogger.info('Price calculated', { productId, finalPrice, appliedRules: appliedRules.length });
    res.json({ success: true, data: result, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /pricing/quotes - Create quote
pricingRouter.post('/quotes', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const { customerId, items, validUntil, notes } = req.body;

    if (!customerId || !items || !validUntil) {
      throw new ValidationError('customerId, items, and validUntil are required');
    }

    // Generate quote number
    const quoteNumber = `QT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    let subtotal = 0;
    const quoteItems = [];

    for (const item of items) {
      // Calculate price for each item
      const calcResponse = await fetch(`http://localhost:${PORT}/api/v1/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.productId, quantity: item.quantity, basePrice: item.unitPrice }),
      });
      const calcData = await calcResponse.json();
      const itemTotal = calcData.data?.finalPrice * item.quantity;
      subtotal += itemTotal;

      quoteItems.push({
        id: uuidv4(),
        productId: item.productId,
        productName: calcData.data?.productName || '',
        sku: calcData.data?.sku || '',
        quantity: item.quantity,
        unitPrice: calcData.data?.finalPrice || item.unitPrice,
        discount: calcData.data?.totalDiscount || 0,
        total: itemTotal,
      });
    }

    const tax = subtotal * 0.075; // 7.5% VAT
    const total = subtotal + tax;

    const quote = await prisma.quote.create({
      data: {
        id: uuidv4(),
        quoteNumber,
        customerId,
        status: 'PENDING',
        items: { create: quoteItems },
        subtotal,
        tax,
        discount: 0,
        total,
        currency: 'NGN',
        validUntil: new Date(validUntil),
        notes,
      },
      include: { items: true, customer: { select: { name: true, email: true } } },
    });

    try { await kafkaClient.publish('quote.events', 'QUOTE_CREATED', { quoteId: quote.id, quoteNumber, total }); } catch {}

    requestLogger.info('Quote created', { quoteId: quote.id, quoteNumber });
    res.status(201).json({ success: true, data: quote, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /pricing/quotes/:id/convert - Convert quote to order
pricingRouter.post('/quotes/:id/convert', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const requestLogger = (req as any).logger;

  try {
    const quote = await prisma.quote.findUnique({ where: { id }, include: { items: true, customer: true } });
    if (!quote) throw new NotFoundError('Quote', id);
    if (quote.status !== 'PENDING' && quote.status !== 'APPROVED') {
      throw new ValidationError('Only pending or approved quotes can be converted');
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order from quote
    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        orderNumber,
        customerId: quote.customerId,
        status: 'PENDING',
        priority: 'NORMAL',
        source: 'QUOTE',
        subtotal: quote.subtotal,
        tax: quote.tax,
        discount: quote.discount,
        total: quote.total,
        currency: quote.currency,
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingLga: '',
        notes: quote.notes,
        items: {
          create: quote.items.map(item => ({
            id: uuidv4(),
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });

    // Update quote status
    await prisma.quote.update({
      where: { id },
      data: { status: 'CONVERTED', convertedToOrderId: order.id, convertedAt: new Date() },
    });

    try { await kafkaClient.publish('quote.events', 'QUOTE_CONVERTED', { quoteId: quote.id, orderId: order.id }); } catch {}

    requestLogger.info('Quote converted to order', { quoteId: quote.id, orderId: order.id });
    res.json({ success: true, data: { quote, order }, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

app.use('/api/v1/pricing', pricingRouter);
app.use('/api/v1/quotes', pricingRouter);
app.use(errorHandler);
app.use((req: Request, res: Response) => { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found`, traceId: req.id } }); });

const gracefulShutdown = async (signal: string) => { await prisma.$disconnect(); await kafkaClient.disconnect(); process.exit(0); };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const server = app.listen(PORT, () => { logger.info(`Pricing Service running on port ${PORT}`); logger.info(`Health: http://localhost:${PORT}/health`); });

export default app;
