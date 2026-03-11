/**
 * ResidentCement Inventory Service
 * 
 * Warehouse and inventory management
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { 
  createLogger, requestIdMiddleware, requestLoggingMiddleware, errorHandler,
  createHealthCheckService, checkMemory, NotFoundError, InventoryError,
  updateInventorySchema, reserveInventorySchema, inventoryQuerySchema,
} from '@resident-cement/kernel';
import { PrismaClient } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({ service: 'inventory-service', version: '1.0.0', environment: process.env.NODE_ENV || 'development' });
const app: Express = express();
const PORT = parseInt(process.env.PORT || '3003', 10);
const prisma = new PrismaClient({ log: ['error'] });
const kafkaClient = createKafkaClient('inventory-service');
kafkaClient.connect().catch(() => {});

const healthService = createHealthCheckService('inventory-service', '1.0.0');
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

const inventoryRouter = express.Router();

// GET /inventory - List inventory
inventoryRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = inventoryQuerySchema.parse(req.query);
    const { page = 1, limit = 50, productId, warehouseId, status } = query;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (status) where.status = status;

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({ where, take: limit, skip: offset, include: { product: { select: { name: true, sku: true } }, warehouse: { select: { name: true, code: true } } } }),
      prisma.inventory.count({ where }),
    ]);

    res.json({ success: true, data: inventory, meta: { requestId: req.id, timestamp: new Date().toISOString(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: offset + limit < total } } });
  } catch (error) { next(error); }
});

// GET /inventory/:id - Get inventory item
inventoryRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const inventory = await prisma.inventory.findUnique({ where: { id }, include: { product: true, warehouse: true } });
    if (!inventory) throw new NotFoundError('Inventory', id);
    res.json({ success: true, data: inventory, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// PATCH /inventory/:id - Update inventory
inventoryRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const data = updateInventorySchema.parse(req.body);
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Inventory', id);

    const inventory = await prisma.inventory.update({
      where: { id },
      data: { ...data, availableQuantity: data.quantity - (existing.reservedQuantity || 0), updatedAt: new Date() },
      include: { product: { select: { name: true, sku: true } }, warehouse: true },
    });

    res.json({ success: true, data: inventory, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /inventory/reserve - Reserve inventory
inventoryRouter.post('/reserve', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const { productId, warehouseId, quantity, orderId } = reserveInventorySchema.parse(req.body);

    const inventory = await prisma.inventory.findFirst({
      where: { productId, warehouseId, status: 'AVAILABLE' },
    });

    if (!inventory) throw new InventoryError('Inventory not found');
    if (inventory.availableQuantity < quantity) {
      throw new InventoryError('Insufficient inventory', { requested: quantity, available: inventory.availableQuantity });
    }

    const updated = await prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        reservedQuantity: { increment: quantity },
        availableQuantity: { decrement: quantity },
        status: quantity === inventory.availableQuantity ? 'RESERVED' : inventory.status,
      },
      include: { product: { select: { name: true, sku: true } }, warehouse: true },
    });

    // Create stock movement
    await prisma.stockMovement.create({
      data: {
        id: uuidv4(),
        inventoryId: inventory.id,
        warehouseId,
        type: 'RESERVATION',
        quantity: -quantity,
        referenceType: 'ORDER',
        referenceId: orderId,
      },
    });

    try { await kafkaClient.publish('inventory.events', 'INVENTORY_RESERVED', { inventoryId: inventory.id, productId, warehouseId, quantity, orderId }); } catch {}

    requestLogger.info('Inventory reserved', { inventoryId: inventory.id, quantity });
    res.json({ success: true, data: updated, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /inventory/release - Release reserved inventory
inventoryRouter.post('/release', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inventoryId, quantity } = req.body;
    if (!inventoryId || !quantity) throw new ValidationError('inventoryId and quantity required');

    const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
    if (!inventory) throw new NotFoundError('Inventory', inventoryId);
    if (inventory.reservedQuantity < quantity) throw new InventoryError('Reserved quantity exceeds available');

    const updated = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        reservedQuantity: { decrement: quantity },
        availableQuantity: { increment: quantity },
        status: 'AVAILABLE',
      },
    });

    try { await kafkaClient.publish('inventory.events', 'INVENTORY_RELEASED', { inventoryId, quantity }); } catch {}

    res.json({ success: true, data: updated, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// GET /inventory/low-stock - Get low stock items
inventoryRouter.get('/low-stock', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { threshold = 100 } = req.query;
    const inventory = await prisma.inventory.findMany({
      where: { availableQuantity: { lte: Number(threshold) }, status: 'AVAILABLE' },
      include: { product: { select: { name: true, sku: true } }, warehouse: { select: { name: true, code: true } } },
      orderBy: { availableQuantity: 'asc' },
    });

    res.json({ success: true, data: inventory, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// Warehouse routes
const warehouseRouter = express.Router();

warehouseRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warehouses = await prisma.warehouse.findMany({ where: { isActive: true }, include: { _count: { select: { inventory: true } } } });
    res.json({ success: true, data: warehouses, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

warehouseRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const warehouse = await prisma.warehouse.findUnique({ where: { id }, include: { inventory: { include: { product: { select: { name: true, sku: true } } } } } });
    if (!warehouse) throw new NotFoundError('Warehouse', id);
    res.json({ success: true, data: warehouse, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/warehouses', warehouseRouter);
app.use(errorHandler);
app.use((req: Request, res: Response) => { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found`, traceId: req.id } }); });

const gracefulShutdown = async (signal: string) => { await prisma.$disconnect(); await kafkaClient.disconnect(); process.exit(0); };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const server = app.listen(PORT, () => { logger.info(`Inventory Service running on port ${PORT}`); logger.info(`Health: http://localhost:${PORT}/health`); });

export default app;
