/**
 * ResidentCement Order Service
 * 
 * Domain microservice for order management
 * Handles order lifecycle from creation to delivery
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import {
  createLogger,
  requestIdMiddleware,
  requestLoggingMiddleware,
  errorHandler,
  createHealthCheckService,
  checkMemory,
  NotFoundError,
  ValidationError,
  BusinessRuleError,
  createOrderSchema,
  updateOrderSchema,
  cancelOrderSchema,
  orderQuerySchema,
  createHttpClient,
} from '@resident-cement/kernel';
import { PrismaClient } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({
  service: 'order-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  level: (process.env.LOG_LEVEL as any) || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'both',
});

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3007', 10);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const kafkaClient = createKafkaClient('order-service');
kafkaClient.connect().catch(err => logger.warn('Failed to connect to Kafka', err));

// HTTP clients for inter-service communication
const customerClient = createHttpClient('order-service', 'customerService', logger);
const productClient = createHttpClient('order-service', 'productService', logger);
const inventoryClient = createHttpClient('order-service', 'inventoryService', logger);

// Health check
const healthService = createHealthCheckService('order-service', '1.0.0');
healthService.addCheck('database', async () => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: 'database', status: 'pass', responseTime: Date.now() - start };
  } catch {
    return { name: 'database', status: 'fail', responseTime: Date.now() - start };
  }
});
healthService.addCheck('memory', () => checkMemory(0.9));

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(requestIdMiddleware());
app.use(requestLoggingMiddleware({ skipPaths: ['/health'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).logger = logger.child({ requestId: req.id });
  next();
});

// Health routes
const healthRouter = express.Router();
healthRouter.get('/', async (req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  res.json({ status: health.status, service: health.service, version: health.version, uptime: health.uptime });
});
healthRouter.get('/ready', async (req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  if (health.status === 'unhealthy') return res.status(503).json({ ready: false });
  res.json({ ready: true });
});
healthRouter.get('/live', async (req: Request, res: Response) => {
  res.json({ alive: true, uptime: process.uptime() });
});
app.use('/health', healthRouter);

// Order routes
const orderRouter = express.Router();

// GET /orders - List orders
orderRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = orderQuerySchema.parse(req.query);
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc', customerId, status } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: { take: 5 },
          _count: { select: { payments: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    // Fetch customer data via HTTP for each order
    const customerIds = [...new Set(orders.map((o: any) => o.customerId))];
    const customerMap: Record<string, any> = {};

    await Promise.all(customerIds.map(async (id: any) => {
      try {
        const response: any = await customerClient.get(`/api/v1/customers/${id}`);
        if (response.data) customerMap[id] = response.data;
      } catch { /* ignore - customer may not exist */ }
    }));

    // Enrich orders with customer data
    const enrichedOrders = orders.map((order: any) => ({
      ...order,
      customer: customerMap[order.customerId] || { name: 'Unknown', email: '' },
    }));

    res.json({
      success: true,
      data: enrichedOrders,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: offset + limit < total } },
    });
  } catch (error) { next(error); }
});

// GET /orders/:id - Get order by ID
orderRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });

    if (!order) throw new NotFoundError('Order', id);

    // Fetch customer data via HTTP
    let customer = null;
    try {
      const customerResponse: any = await customerClient.get(`/api/v1/customers/${order.customerId}`);
      customer = customerResponse.data || null;
    } catch { /* ignore */ }

    // Fetch product details for items via HTTP
    const productIds = order.items.map((item: any) => item.productId);
    const productMap: Record<string, any> = {};

    await Promise.all(productIds.map(async (pid: string) => {
      try {
        const productResponse: any = await productClient.get(`/api/v1/products/${pid}`);
        if (productResponse.data) productMap[pid] = productResponse.data;
      } catch { /* ignore */ }
    }));

    // Enrich items with product data
    const enrichedItems = order.items.map((item: any) => ({
      ...item,
      product: productMap[item.productId] || null,
    }));

    const enrichedOrder = {
      ...order,
      customer: customer || { name: 'Unknown', email: '' },
      items: enrichedItems,
    };

    res.json({ success: true, data: enrichedOrder, meta: { requestId: (req as any).id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /orders - Create order
orderRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = createOrderSchema.parse(req.body);

    // Verify customer exists via HTTP call to customer-service
    let customer: any;
    try {
      customer = await customerClient.get(`/api/v1/customers/${data.customerId}`);
      if (!customer.data) throw new NotFoundError('Customer', data.customerId);
      customer = customer.data;
    } catch (error: any) {
      if (error.statusCode === 404) throw new NotFoundError('Customer', data.customerId);
      throw new BusinessRuleError(`Failed to verify customer: ${error.message}`);
    }

    // Verify products and get product details via HTTP call to product-service
    const items = data.items || [];
    const productIds = items.map((item: any) => item.productId);
    const productDetails: Record<string, any> = {};

    for (const productId of productIds) {
      try {
        const productResponse: any = await productClient.get(`/api/v1/products/${productId}`);
        if (!productResponse.data) throw new NotFoundError('Product', productId);
        productDetails[productId] = productResponse.data;
      } catch (error: any) {
        if (error.statusCode === 404) throw new NotFoundError('Product', productId);
        throw new BusinessRuleError(`Failed to verify product ${productId}: ${error.message}`);
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Calculate totals with actual product data
    const subtotal = items.reduce((sum: number, item: any) => {
      const product = productDetails[item.productId];
      const price = item.unitPrice || product?.price || 0;
      return sum + ((item.quantity || 0) * price);
    }, 0);
    const tax = subtotal * 0.075; // 7.5% VAT
    const shippingCost = (data as any).shippingCost || 0;
    const discount = (data as any).discount || 0;
    const total = subtotal + tax + shippingCost - discount;

    // Create order items with product details
    const orderItems = items.map((item: any) => {
      const product = productDetails[item.productId];
      const unitPrice = item.unitPrice || product?.price || 0;
      const itemSubtotal = (item.quantity || 0) * unitPrice;
      return {
        id: uuidv4(),
        productId: item.productId,
        productName: product?.name || '',
        sku: product?.sku || '',
        quantity: item.quantity || 0,
        unitPrice,
        discount: item.discount || 0,
        tax: itemSubtotal * 0.075,
        total: itemSubtotal * 1.075,
      };
    });

    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        orderNumber,
        customerId: data.customerId,
        status: 'PENDING',
        priority: data.priority || 'NORMAL',
        source: 'WEB',
        subtotal,
        tax,
        discount: discount,
        shippingCost: shippingCost,
        total,
        currency: 'NGN',
        shippingAddress: data.shippingAddress || '',
        shippingCity: '',
        shippingState: '',
        shippingLga: '',
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        notes: data.notes,
        items: { create: orderItems },
      },
      include: { items: true, customer: { select: { name: true, email: true } } },
    });

    // Reserve inventory via HTTP call to inventory-service
    try {
      const warehouseId = (data as any).warehouseId || 'default';
      for (const item of orderItems) {
        await inventoryClient.post('/api/v1/inventory/reserve', {
          productId: item.productId,
          quantity: item.quantity,
          orderId: order.id,
          warehouseId: warehouseId,
        });
      }
      requestLogger.info('Inventory reserved for order', { orderId: order.id });
    } catch (inventoryError: any) {
      requestLogger.warn('Failed to reserve inventory', { orderId: order.id, error: inventoryError.message });
      // Continue - inventory reservation failure shouldn't block order creation
    }

    // Publish event
    try {
      await kafkaClient.publish('order.events', 'ORDER_CREATED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      });
    } catch (kafkaError) { requestLogger.warn('Failed to publish ORDER_CREATED event', kafkaError); }

    requestLogger.info('Order created', { orderId: order.id, orderNumber: order.orderNumber });
    res.status(201).json({ success: true, data: order, meta: { requestId: (req as any).id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// PATCH /orders/:id - Update order
orderRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const data = updateOrderSchema.parse(req.body);

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Order', id);

    // Prevent updating completed/cancelled orders
    if (['COMPLETED', 'CANCELLED'].includes(existing.status)) {
      throw new BusinessRuleError('Cannot modify completed or cancelled orders');
    }

    const order = await prisma.order.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: { items: true, customer: { select: { name: true, email: true } } },
    });

    try {
      await kafkaClient.publish('order.events', 'ORDER_UPDATED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        updatedAt: order.updatedAt,
      });
    } catch (kafkaError) { /* ignore */ }

    res.json({ success: true, data: order, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// PATCH /orders/:id/cancel - Cancel order
orderRouter.patch('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const { reason } = cancelOrderSchema.parse(req.body);

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Order', id);

    if (['COMPLETED', 'CANCELLED', 'DELIVERED'].includes(existing.status)) {
      throw new BusinessRuleError(`Cannot cancel order with status ${existing.status}`);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: reason },
      include: { items: true, customer: { select: { name: true, email: true } } },
    });

    try {
      await kafkaClient.publish('order.events', 'ORDER_CANCELLED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        reason,
        cancelledAt: order.cancelledAt,
      });
    } catch (kafkaError) { /* ignore */ }

    res.json({ success: true, data: order, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// PATCH /orders/:id/status - Update order status
orderRouter.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const { status } = req.body;
    if (!status) throw new ValidationError('Status is required');

    const order = await prisma.order.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { items: true, customer: { select: { name: true, email: true } } },
    });

    try {
      await kafkaClient.publish('order.events', 'ORDER_STATUS_CHANGED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status,
        previousStatus: req.body.previousStatus,
      });
    } catch (kafkaError) { /* ignore */ }

    res.json({ success: true, data: order, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

app.use('/api/v1/orders', orderRouter);
app.use(errorHandler);
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found`, traceId: req.id } });
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received`);
  await prisma.$disconnect();
  await kafkaClient.disconnect();
  process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const server = app.listen(PORT, () => {
  logger.info(`Order Service running on port ${PORT}`);
  logger.info(`Health: http://localhost:${PORT}/health`);
});

export default app;
