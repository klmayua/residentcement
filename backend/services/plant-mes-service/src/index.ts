/**
 * ResidentCement Plant MES Service
 *
 * Manufacturing Execution System for cement production
 * - Production order management
 * - Batch tracking and genealogy
 * - Equipment monitoring
 * - Quality checkpoints
 * - Production scheduling
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
  createHttpClient,
} from '@resident-cement/kernel';
import { PrismaClient } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({
  service: 'plant-mes-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
});

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3008', 10);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const kafkaClient = createKafkaClient('plant-mes-service');
kafkaClient.connect().catch((err: any) => logger.warn('Failed to connect to Kafka', err));

// HTTP clients for inter-service communication
const orderClient = createHttpClient('plant-mes-service', 'orderService', logger);
const inventoryClient = createHttpClient('plant-mes-service', 'inventoryService', logger);
const productClient = createHttpClient('plant-mes-service', 'productService', logger);

// Health check
const healthService = createHealthCheckService('plant-mes-service', '1.0.0');
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

app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).logger = logger.child({ requestId: (req as any).id });
  next();
});

// Health routes
const healthRouter = express.Router();
healthRouter.get('/', async (_req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  res.json({ status: health.status, service: health.service, version: health.version, uptime: health.uptime });
});
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  if (health.status === 'unhealthy') return res.status(503).json({ ready: false });
  res.json({ ready: true });
});
healthRouter.get('/live', async (_req: Request, res: Response) => {
  res.json({ alive: true, uptime: process.uptime() });
});
app.use('/health', healthRouter);

// Production Order Routes
const productionRouter = express.Router();

// GET /production/orders - List production orders
productionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, productId } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (productId) where.productId = productId;

    const [orders, total] = await Promise.all([
      prisma.productionOrder.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { scheduledDate: 'desc' },
        include: {
          batches: { take: 5 },
          _count: { select: { batches: true } },
        },
      }),
      prisma.productionOrder.count({ where }),
    ]);

    // Fetch product details via HTTP
    const productIds = [...new Set(orders.map((o: any) => o.productId))];
    const productMap: Record<string, any> = {};

    await Promise.all(productIds.map(async (pid: string) => {
      try {
        const response: any = await productClient.get(`/api/v1/products/${pid}`);
        if (response.data) productMap[pid] = response.data;
      } catch { /* ignore */ }
    }));

    const enrichedOrders = orders.map((order: any) => ({
      ...order,
      product: productMap[order.productId] || null,
    }));

    res.json({
      success: true,
      data: enrichedOrders,
      meta: {
        requestId: (req as any).id,
        timestamp: new Date().toISOString(),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error) { next(error); }
});

// GET /production/orders/:id - Get production order
productionRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const order = await prisma.productionOrder.findUnique({
      where: { id },
      include: { batches: true },
    });

    if (!order) throw new NotFoundError('Production Order', id);

    // Fetch product details
    let product = null;
    try {
      const response: any = await productClient.get(`/api/v1/products/${order.productId}`);
      product = response.data || null;
    } catch { /* ignore */ }

    res.json({
      success: true,
      data: { ...order, product },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /production/orders - Create production order
productionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    // Validate required fields
    if (!data.productId) throw new ValidationError('Product ID is required');
    if (!data.quantity || data.quantity <= 0) throw new ValidationError('Valid quantity is required');

    // Verify product exists
    try {
      const productResponse: any = await productClient.get(`/api/v1/products/${data.productId}`);
      if (!productResponse.data) throw new NotFoundError('Product', data.productId);
    } catch (error: any) {
      if (error.statusCode === 404) throw new NotFoundError('Product', data.productId);
      throw new BusinessRuleError(`Failed to verify product: ${error.message}`);
    }

    // Generate production order number
    const orderNumber = `PO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await prisma.productionOrder.create({
      data: {
        id: uuidv4(),
        orderNumber,
        productId: data.productId,
        quantity: data.quantity,
        status: 'SCHEDULED',
        priority: data.priority || 'NORMAL',
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : new Date(),
        estimatedCompletion: data.estimatedCompletion ? new Date(data.estimatedCompletion) : null,
        notes: data.notes,
        createdBy: data.createdBy || 'system',
      },
    });

    // Publish event
    try {
      await kafkaClient.publish('production.events', 'PRODUCTION_ORDER_CREATED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        productId: order.productId,
        quantity: order.quantity,
        scheduledDate: order.scheduledDate,
      });
    } catch (kafkaError: any) {
      requestLogger.warn('Failed to publish PRODUCTION_ORDER_CREATED event', { error: kafkaError.message });
    }

    requestLogger.info('Production order created', { orderId: order.id, orderNumber });
    res.status(201).json({
      success: true,
      data: order,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /production/orders/:id/status - Update production order status
productionRouter.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    if (!status) throw new ValidationError('Status is required');

    const validStatuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await prisma.productionOrder.update({
      where: { id },
      data: {
        status,
        notes: notes ? { set: notes } : undefined,
        actualCompletion: status === 'COMPLETED' ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });

    // Publish status change event
    try {
      await kafkaClient.publish('production.events', 'PRODUCTION_STATUS_CHANGED', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status,
        previousStatus: req.body.previousStatus,
      });
    } catch { /* ignore */ }

    res.json({
      success: true,
      data: order,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Batch Routes
const batchRouter = express.Router();

// GET /production/batches - List batches
batchRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, productionOrderId } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (productionOrderId) where.productionOrderId = productionOrderId;

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: { qualityChecks: { take: 3 } },
      }),
      prisma.batch.count({ where }),
    ]);

    res.json({
      success: true,
      data: batches,
      meta: {
        requestId: (req as any).id,
        timestamp: new Date().toISOString(),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error) { next(error); }
});

// POST /production/batches - Create batch
batchRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    if (!data.productionOrderId) throw new ValidationError('Production order ID is required');
    if (!data.quantity || data.quantity <= 0) throw new ValidationError('Valid quantity is required');

    // Verify production order exists
    const order = await prisma.productionOrder.findUnique({
      where: { id: data.productionOrderId },
    });
    if (!order) throw new NotFoundError('Production Order', data.productionOrderId);

    // Generate batch number
    const batchNumber = `BATCH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const batch = await prisma.batch.create({
      data: {
        id: uuidv4(),
        batchNumber,
        productionOrderId: data.productionOrderId,
        quantity: data.quantity,
        status: 'IN_PROGRESS',
        startTime: new Date(),
        notes: data.notes,
      },
    });

    // Update production order status if needed
    if (order.status === 'SCHEDULED') {
      await prisma.productionOrder.update({
        where: { id: data.productionOrderId },
        data: { status: 'IN_PROGRESS', updatedAt: new Date() },
      });
    }

    // Publish event
    try {
      await kafkaClient.publish('production.events', 'BATCH_CREATED', {
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        productionOrderId: batch.productionOrderId,
        quantity: batch.quantity,
      });
    } catch (kafkaError: any) {
      requestLogger.warn('Failed to publish BATCH_CREATED event', { error: kafkaError.message });
    }

    requestLogger.info('Batch created', { batchId: batch.id, batchNumber });
    res.status(201).json({
      success: true,
      data: batch,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /production/batches/:id/complete - Complete batch
batchRouter.patch('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { actualQuantity, notes } = req.body;

  try {
    const batch = await prisma.batch.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
        actualQuantity: actualQuantity || undefined,
        notes: notes || undefined,
        updatedAt: new Date(),
      },
    });

    // Publish event
    try {
      await kafkaClient.publish('production.events', 'BATCH_COMPLETED', {
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        actualQuantity: batch.actualQuantity,
      });
    } catch { /* ignore */ }

    res.json({
      success: true,
      data: batch,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Equipment Routes
const equipmentRouter = express.Router();

// GET /production/equipment - List equipment
equipmentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, type } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const equipment = await prisma.equipment.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: equipment,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /production/equipment - Register equipment
equipmentRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    if (!data.name) throw new ValidationError('Equipment name is required');
    if (!data.code) throw new ValidationError('Equipment code is required');

    const equipment = await prisma.equipment.create({
      data: {
        id: uuidv4(),
        code: data.code,
        name: data.name,
        type: data.type || 'PRODUCTION',
        status: 'OPERATIONAL',
        location: data.location,
        capacity: data.capacity,
        specifications: data.specifications || {},
      },
    });

    res.status(201).json({
      success: true,
      data: equipment,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /production/equipment/:id/status - Update equipment status
equipmentRouter.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  try {
    if (!status) throw new ValidationError('Status is required');

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        status,
        lastMaintenance: status === 'MAINTENANCE' ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: equipment,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Quality Check Routes
const qualityRouter = express.Router();

// POST /production/quality-checks - Record quality check
qualityRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    if (!data.batchId) throw new ValidationError('Batch ID is required');
    if (!data.checkType) throw new ValidationError('Check type is required');

    // Verify batch exists
    const batch = await prisma.batch.findUnique({ where: { id: data.batchId } });
    if (!batch) throw new NotFoundError('Batch', data.batchId);

    const qualityCheck = await prisma.qualityCheck.create({
      data: {
        id: uuidv4(),
        batchId: data.batchId,
        checkType: data.checkType,
        result: data.result || 'PENDING',
        measurements: data.measurements || {},
        notes: data.notes,
        checkedBy: data.checkedBy || 'system',
      },
    });

    // If quality check failed, update batch status
    if (data.result === 'FAILED') {
      await prisma.batch.update({
        where: { id: data.batchId },
        data: { status: 'QUARANTINE', updatedAt: new Date() },
      });

      try {
        await kafkaClient.publish('production.events', 'QUALITY_CHECK_FAILED', {
          batchId: data.batchId,
          batchNumber: batch.batchNumber,
          checkId: qualityCheck.id,
          checkType: data.checkType,
        });
      } catch { /* ignore */ }
    }

    requestLogger.info('Quality check recorded', { checkId: qualityCheck.id, batchId: data.batchId });
    res.status(201).json({
      success: true,
      data: qualityCheck,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// GET /production/quality-checks - List quality checks
qualityRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { batchId, result } = req.query;
    const where: any = {};
    if (batchId) where.batchId = batchId;
    if (result) where.result = result;

    const checks = await prisma.qualityCheck.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({
      success: true,
      data: checks,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Mount routers
app.use('/api/v1/production/orders', productionRouter);
app.use('/api/v1/production/batches', batchRouter);
app.use('/api/v1/production/equipment', equipmentRouter);
app.use('/api/v1/production/quality-checks', qualityRouter);

// Error handling
app.use(errorHandler);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      traceId: (req as any).id,
    },
  });
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

app.listen(PORT, () => {
  logger.info(`Plant MES Service running on port ${PORT}`);
  logger.info(`Health: http://localhost:${PORT}/health`);
});

export default app;
