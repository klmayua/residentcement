/**
 * ResidentCement Product Service
 * 
 * Product catalog management with inventory tracking
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { 
  createLogger, requestIdMiddleware, requestLoggingMiddleware, errorHandler,
  createHealthCheckService, checkMemory, NotFoundError, ConflictError,
  createProductSchema, updateProductSchema, productQuerySchema,
} from '@resident-cement/kernel';
import { PrismaClient } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({ service: 'product-service', version: '1.0.0', environment: process.env.NODE_ENV || 'development' });
const app: Express = express();
const PORT = parseInt(process.env.PORT || '3006', 10);
const prisma = new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'] });
const kafkaClient = createKafkaClient('product-service');
kafkaClient.connect().catch(() => {});

// Health
const healthService = createHealthCheckService('product-service', '1.0.0');
healthService.addCheck('database', async () => {
  const start = Date.now();
  try { await prisma.$queryRaw`SELECT 1`; return { name: 'database', status: 'pass', responseTime: Date.now() - start }; }
  catch { return { name: 'database', status: 'fail', responseTime: Date.now() - start }; }
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
app.use((req: Request, _res: Response, next: NextFunction) => { (req as any).logger = logger.child({ requestId: (req as any).id }); next(); });

// Health routes
const healthRouter = express.Router();
healthRouter.get('/', async (req: Request, res: Response) => { const h = await healthService.getHealthStatus(); res.json({ status: h.status, service: h.service, version: h.version, uptime: h.uptime }); });
healthRouter.get('/ready', async (req: Request, res: Response) => { const h = await healthService.getHealthStatus(); if (h.status === 'unhealthy') return res.status(503).json({ ready: false }); res.json({ ready: true }); });
healthRouter.get('/live', async (req: Request, res: Response) => { res.json({ alive: true, uptime: process.uptime() }); });
app.use('/health', healthRouter);

// Product routes
const productRouter = express.Router();

// GET /products - List products
productRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = productQuerySchema.parse(req.query);
    const { page = 1, limit = 50, category, status, search } = query;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' }, include: { _count: { select: { inventory: true } } } }),
      prisma.product.count({ where }),
    ]);

    res.json({ success: true, data: products, meta: { requestId: req.id, timestamp: new Date().toISOString(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: offset + limit < total } } });
  } catch (error) { next(error); }
});

// GET /products/:id - Get product
productRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id }, include: { inventory: { include: { warehouse: true } } } });
    if (!product) throw new NotFoundError('Product', id);
    res.json({ success: true, data: product, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /products - Create product
productRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductSchema.parse(req.body);
    const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existing) throw new ConflictError(`Product with SKU ${data.sku} already exists`);

    const product = await prisma.product.create({
      data: { ...data, id: uuidv4(), status: 'ACTIVE' },
      include: { _count: { select: { inventory: true } } },
    });

    try { await kafkaClient.publish('product.events', 'PRODUCT_CREATED', { productId: product.id, sku: product.sku, name: product.name }); } catch {}

    res.status(201).json({ success: true, data: product, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// PATCH /products/:id - Update product
productRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const data = updateProductSchema.parse(req.body);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Product', id);

    if (data.sku && data.sku !== existing.sku) {
      const duplicate = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (duplicate) throw new ConflictError(`Product with SKU ${data.sku} already exists`);
    }

    const product = await prisma.product.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    try { await kafkaClient.publish('product.events', 'PRODUCT_UPDATED', { productId: product.id, sku: product.sku }); } catch {}

    res.json({ success: true, data: product, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// DELETE /products/:id - Delete product (soft)
productRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Product', id);

    const product = await prisma.product.update({ where: { id }, data: { status: 'DISCONTINUED', deletedAt: new Date() } });
    try { await kafkaClient.publish('product.events', 'PRODUCT_DELETED', { productId: product.id, sku: product.sku }); } catch {}

    res.json({ success: true, data: { message: 'Product discontinued', product }, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// GET /products/:id/availability - Check product availability
productRouter.get('/:id/availability', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id }, include: { inventory: { where: { status: 'AVAILABLE' } } } });
    if (!product) throw new NotFoundError('Product', id);

    const totalAvailable = product.inventory.reduce((sum: number, inv: any) => sum + (inv.availableQuantity || 0), 0);
    const totalQuantity = product.inventory.reduce((sum: number, inv: any) => sum + (inv.quantity || 0), 0);

    res.json({
      success: true,
      data: { productId: id, sku: product.sku, name: product.name, totalAvailable, totalQuantity, warehouses: product.inventory.map((i: any) => ({ warehouse: i.warehouseId, available: i.availableQuantity, quantity: i.quantity })) },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/products', productRouter);
app.use(errorHandler);
app.use((req: Request, res: Response) => { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found`, traceId: (req as any).id } }); });

const gracefulShutdown = async (signal: string) => { logger.info(`${signal} received`); await prisma.$disconnect(); await kafkaClient.disconnect(); process.exit(0); };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

app.listen(PORT, () => { logger.info(`Product Service running on port ${PORT}`); logger.info(`Health: http://localhost:${PORT}/health`); });

export default app;
