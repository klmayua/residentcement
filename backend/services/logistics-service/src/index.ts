/**
 * ResidentCement Logistics Service
 *
 * Fleet management, route optimization, and delivery tracking
 * - Vehicle management
 * - Driver management
 * - Trip scheduling and tracking
 * - Proof of delivery
 * - Real-time location updates
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
} from '@resident-cement/kernel';
import { PrismaClient } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({
  service: 'logistics-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
});

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3010', 10);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const kafkaClient = createKafkaClient('logistics-service');
kafkaClient.connect().catch((err: any) => logger.warn('Failed to connect to Kafka', err));

// Health check
const healthService = createHealthCheckService('logistics-service', '1.0.0');
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

// =============================================================================
// VEHICLE ROUTES
// =============================================================================

const vehicleRouter = express.Router();

// GET /logistics/vehicles - List all vehicles
vehicleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, type } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          driver: { select: { id: true, name: true, phone: true } },
          _count: { select: { trips: true } },
        },
      }),
      prisma.vehicle.count({ where }),
    ]);

    res.json({
      success: true,
      data: vehicles,
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

// GET /logistics/vehicles/:id - Get vehicle details
vehicleRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        driver: true,
        trips: { take: 5, orderBy: { createdAt: 'desc' } },
        maintenanceRecords: { take: 5, orderBy: { performedAt: 'desc' } },
      },
    });

    if (!vehicle) throw new NotFoundError('Vehicle', id);

    res.json({
      success: true,
      data: vehicle,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /logistics/vehicles - Register new vehicle
vehicleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { registration, type, make, model, year, capacityKg, capacityVolume, fuelType } = req.body;

    // Check for duplicate registration
    const existing = await prisma.vehicle.findUnique({ where: { registration } });
    if (existing) throw new ConflictError(`Vehicle with registration ${registration} already exists`);

    const vehicle = await prisma.vehicle.create({
      data: {
        id: uuidv4(),
        registration,
        type,
        make,
        model,
        year,
        capacityKg,
        capacityVolume,
        fuelType: fuelType || 'DIESEL',
        status: 'AVAILABLE',
      },
    });

    // Publish event
    try {
      await kafkaClient.publish('logistics.events', 'VEHICLE_CREATED', {
        vehicleId: vehicle.id,
        registration: vehicle.registration,
        type: vehicle.type,
        createdAt: vehicle.createdAt,
      });
    } catch (kafkaError: any) {
      logger.warn('Failed to publish VEHICLE_CREATED event', { error: kafkaError.message });
    }

    res.status(201).json({
      success: true,
      data: vehicle,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /logistics/vehicles/:id - Update vehicle
vehicleRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, driverId, ...updates } = req.body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...updates,
        status,
        driverId,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: vehicle,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /logistics/vehicles/:id/location - Update vehicle location
vehicleRouter.post('/:id/location', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
        lastLocationAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: vehicle,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/logistics/vehicles', vehicleRouter);

// =============================================================================
// DRIVER ROUTES
// =============================================================================

const driverRouter = express.Router();

// GET /logistics/drivers - List all drivers
driverRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { name: 'asc' },
        include: {
          vehicle: { select: { id: true, registration: true, type: true, status: true } },
          _count: { select: { trips: true } },
        },
      }),
      prisma.driver.count({ where }),
    ]);

    res.json({
      success: true,
      data: drivers,
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

// GET /logistics/drivers/:id - Get driver details
driverRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        vehicle: true,
        trips: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!driver) throw new NotFoundError('Driver', id);

    res.json({
      success: true,
      data: driver,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /logistics/drivers - Create new driver
driverRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, licenseNumber, licenseType, licenseExpiry, idNumber, address, emergencyContact } = req.body;

    // Check for duplicate license
    const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
    if (existing) throw new ConflictError(`Driver with license ${licenseNumber} already exists`);

    const driver = await prisma.driver.create({
      data: {
        id: uuidv4(),
        name,
        phone,
        email,
        licenseNumber,
        licenseType,
        licenseExpiry: new Date(licenseExpiry),
        idNumber,
        address,
        emergencyContact,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({
      success: true,
      data: driver,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /logistics/drivers/:id - Update driver
driverRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const driver = await prisma.driver.update({
      where: { id },
      data: { ...updates, updatedAt: new Date() },
    });

    res.json({
      success: true,
      data: driver,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/logistics/drivers', driverRouter);

// =============================================================================
// TRIP ROUTES
// =============================================================================

const tripRouter = express.Router();

// GET /logistics/trips - List all trips
tripRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, vehicleId, driverId, dateFrom, dateTo } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;
    if (dateFrom || dateTo) {
      where.scheduledDate = {};
      if (dateFrom) where.scheduledDate.gte = new Date(dateFrom as string);
      if (dateTo) where.scheduledDate.lte = new Date(dateTo as string);
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { scheduledDate: 'desc' },
        include: {
          vehicle: { select: { id: true, registration: true, type: true } },
          driver: { select: { id: true, name: true, phone: true } },
          deliveries: true,
          _count: { select: { deliveries: true } },
        },
      }),
      prisma.trip.count({ where }),
    ]);

    res.json({
      success: true,
      data: trips,
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

// GET /logistics/trips/:id - Get trip details
tripRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
        deliveries: {
          orderBy: { scheduledTime: 'asc' },
        },
      },
    });

    if (!trip) throw new NotFoundError('Trip', id);

    res.json({
      success: true,
      data: trip,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /logistics/trips - Create new trip
tripRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      vehicleId,
      driverId,
      scheduledDate,
      startLocation,
      endLocation,
      orderIds,
      estimatedDuration,
      notes,
    } = req.body;

    // Verify vehicle is available
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundError('Vehicle', vehicleId);
    if (vehicle.status !== 'AVAILABLE') throw new BusinessRuleError('Vehicle is not available');

    // Verify driver is active
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundError('Driver', driverId);
    if (driver.status !== 'ACTIVE') throw new BusinessRuleError('Driver is not active');

    // Generate trip number
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const tripCount = await prisma.trip.count({ where: { scheduledDate: { gte: new Date(scheduledDate) } } });
    const tripNumber = `TRIP-${dateStr}-${String(tripCount + 1).padStart(3, '0')}`;

    const trip = await prisma.trip.create({
      data: {
        id: uuidv4(),
        tripNumber,
        vehicleId,
        driverId,
        scheduledDate: new Date(scheduledDate),
        startLocation,
        endLocation,
        orderIds: orderIds || [],
        estimatedDuration,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        vehicle: { select: { id: true, registration: true } },
        driver: { select: { id: true, name: true } },
      },
    });

    // Update vehicle status
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'IN_USE' },
    });

    // Publish event
    try {
      await kafkaClient.publish('logistics.events', 'TRIP_CREATED', {
        tripId: trip.id,
        tripNumber: trip.tripNumber,
        vehicleId,
        driverId,
        scheduledDate: trip.scheduledDate,
      });
    } catch (kafkaError: any) {
      logger.warn('Failed to publish TRIP_CREATED event', { error: kafkaError.message });
    }

    res.status(201).json({
      success: true,
      data: trip,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /logistics/trips/:id/status - Update trip status
tripRouter.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateData: any = { status, updatedAt: new Date() };
    if (status === 'IN_PROGRESS') updateData.startedAt = new Date();
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
      const trip = await prisma.trip.findUnique({ where: { id } });
      if (trip?.startedAt) {
        updateData.actualDuration = Math.round((Date.now() - trip.startedAt.getTime()) / 60000);
      }
    }

    const trip = await prisma.trip.update({
      where: { id },
      data: updateData,
      include: {
        vehicle: { select: { id: true, registration: true } },
        driver: { select: { id: true, name: true } },
      },
    });

    // Update vehicle status if trip completed or cancelled
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      await prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE' },
      });
    }

    // Publish event
    try {
      await kafkaClient.publish('logistics.events', 'TRIP_STATUS_CHANGED', {
        tripId: trip.id,
        tripNumber: trip.tripNumber,
        status,
        timestamp: new Date().toISOString(),
      });
    } catch (kafkaError: any) {
      logger.warn('Failed to publish TRIP_STATUS_CHANGED event', { error: kafkaError.message });
    }

    res.json({
      success: true,
      data: trip,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/logistics/trips', tripRouter);

// =============================================================================
// DELIVERY ROUTES
// =============================================================================

const deliveryRouter = express.Router();

// GET /logistics/deliveries/:id/tracking - Track delivery
deliveryRouter.get('/:id/tracking', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        trip: {
          include: {
            vehicle: { select: { id: true, registration: true, currentLatitude: true, currentLongitude: true, lastLocationAt: true } },
            driver: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    });

    if (!delivery) throw new NotFoundError('Delivery', id);

    res.json({
      success: true,
      data: {
        delivery,
        currentLocation: delivery.trip.vehicle ? {
          latitude: delivery.trip.vehicle.currentLatitude,
          longitude: delivery.trip.vehicle.currentLongitude,
          lastUpdated: delivery.trip.vehicle.lastLocationAt,
        } : null,
      },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /logistics/deliveries/:id/confirm - Confirm delivery (Proof of Delivery)
deliveryRouter.post('/:id/confirm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { signatureUrl, photoUrls, notes, deliveredBy } = req.body;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
        proofOfDelivery: { signatureUrl, photoUrls, notes },
        deliveredBy,
      },
      include: {
        trip: { select: { id: true, tripNumber: true } },
      },
    });

    // Publish event
    try {
      await kafkaClient.publish('logistics.events', 'DELIVERY_COMPLETED', {
        deliveryId: delivery.id,
        deliveryNumber: delivery.deliveryNumber,
        orderId: delivery.orderId,
        tripId: delivery.tripId,
        deliveredAt: delivery.deliveredAt,
      });
    } catch (kafkaError: any) {
      logger.warn('Failed to publish DELIVERY_COMPLETED event', { error: kafkaError.message });
    }

    res.json({
      success: true,
      data: delivery,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /logistics/deliveries/:id/fail - Mark delivery as failed
deliveryRouter.post('/:id/fail', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        status: 'FAILED',
        failureReason: reason,
        retryCount: { increment: 1 },
      },
    });

    res.json({
      success: true,
      data: delivery,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/logistics/deliveries', deliveryRouter);

// =============================================================================
// ERROR HANDLING
// =============================================================================

// Conflict Error class
class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

app.use(errorHandler);

// 404 handler
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

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  try {
    await prisma.$disconnect();
    await kafkaClient.disconnect();
    logger.info('Connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// =============================================================================
// START SERVER
// =============================================================================

const server = app.listen(PORT, () => {
  logger.info(`Logistics Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

server.on('error', (error: Error) => {
  logger.error('Server error', error);
});

export default app;
