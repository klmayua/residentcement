/**
 * ResidentCement Customer Service
 * 
 * Domain microservice for customer management
 * Handles CRUD operations, customer tier management, and credit limits
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { 
  createLogger, 
  ContextLogger,
  requestIdMiddleware,
  requestLoggingMiddleware,
  errorHandler,
  validateRequest,
  createHealthCheckService,
  checkMemory,
  AppError,
  NotFoundError,
  ConflictError,
  ValidationError,
  Customer,
  CustomerTier,
  CustomerStatus,
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
  paginationSchema,
} from '@resident-cement/kernel';
import { PrismaClient } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({
  service: 'customer-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  level: (process.env.LOG_LEVEL as any) || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'both',
});

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3002', 10);

// Initialize Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Initialize Kafka
const kafkaClient = createKafkaClient('customer-service');

// Health check service
const healthService = createHealthCheckService('customer-service', '1.0.0');
healthService.addCheck('database', async () => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      name: 'database',
      status: 'pass' as const,
      responseTime: Date.now() - start,
      details: { type: 'PostgreSQL' },
    };
  } catch (error) {
    return {
      name: 'database',
      status: 'fail' as const,
      message: error instanceof Error ? error.message : 'Database connection failed',
      responseTime: Date.now() - start,
    };
  }
});
healthService.addCheck('memory', () => checkMemory(0.9));

// Connect to Kafka on startup
kafkaClient.connect().catch(err => logger.warn('Failed to connect to Kafka', err));

// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(requestIdMiddleware());
app.use(requestLoggingMiddleware({ skipPaths: ['/health'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Add logger to request
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).logger = logger.child({ requestId: req.id });
  next();
});

// -----------------------------------------------------------------------------
// Health Routes
// -----------------------------------------------------------------------------

import { Router } from 'express';
const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  res.json({
    status: health.status,
    service: health.service,
    version: health.version,
    timestamp: health.timestamp,
    uptime: health.uptime,
  });
});

healthRouter.get('/ready', async (req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  if (health.status === 'unhealthy') {
    return res.status(503).json({ ready: false, checks: health.checks.filter(c => c.status === 'fail') });
  }
  res.json({ ready: true, service: health.service });
});

healthRouter.get('/live', async (req: Request, res: Response) => {
  res.json({ alive: true, uptime: process.uptime() });
});

app.use('/health', healthRouter);

// -----------------------------------------------------------------------------
// Customer Routes
// -----------------------------------------------------------------------------

const customerRouter = Router();

/**
 * GET /customers
 * List all customers with pagination and filtering
 */
customerRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger as ContextLogger;
  
  try {
    const query = customerQuerySchema.parse(req.query);
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc', search, tier, status } = query;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (tier) where.tier = tier;
    if (status) where.status = status;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sortBy]: sortOrder },
        include: {
          orders: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: { id: true, orderNumber: true, total: true, status: true, createdAt: true },
          },
          _count: {
            select: { orders: true, quotes: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    requestLogger.info('Customers listed', { count: customers.length, total, page, limit });

    res.json({
      success: true,
      data: customers,
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /customers/:id
 * Get customer by ID
 */
customerRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger as ContextLogger;
  const { id } = req.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        quotes: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            quoteNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            paymentReference: true,
            amount: true,
            status: true,
            paidAt: true,
          },
        },
        addresses: true,
        _count: {
          select: { orders: true, quotes: true, payments: true },
        },
      },
    });

    if (!customer) {
      requestLogger.warn('Customer not found', { id });
      throw new NotFoundError('Customer', id);
    }

    requestLogger.info('Customer retrieved', { id });
    res.json({
      success: true,
      data: customer,
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /customers
 * Create new customer
 */
customerRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger as ContextLogger;

  try {
    const data = createCustomerSchema.parse(req.body);

    // Check for duplicate email
    const existing = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      requestLogger.warn('Duplicate email', { email: data.email });
      throw new ConflictError(`Customer with email ${data.email} already exists`);
    }

    const customer = await prisma.customer.create({
      data: {
        ...data,
        id: uuidv4(),
        creditLimit: data.creditLimit || 0,
        tier: data.tier || 'STANDARD',
        status: data.status || 'PROSPECT',
        country: data.country || 'Nigeria',
      },
      include: {
        _count: { select: { orders: true } },
      },
    });

    // Publish event to Kafka
    try {
      await kafkaClient.publish('customer.events', 'CUSTOMER_CREATED', {
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
        tier: customer.tier,
        createdAt: customer.createdAt,
      });
    } catch (kafkaError: any) {
      requestLogger.warn('Failed to publish CUSTOMER_CREATED event', { error: kafkaError.message });
    }

    requestLogger.info('Customer created', { customerId: customer.id, email: customer.email });
    
    res.status(201).json({
      success: true,
      data: customer,
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /customers/:id
 * Update customer
 */
customerRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger as ContextLogger;
  const { id } = req.params;

  try {
    const data = updateCustomerSchema.parse(req.body);

    // Check if customer exists
    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      requestLogger.warn('Customer not found', { id });
      throw new NotFoundError('Customer', id);
    }

    // Check for duplicate email if email is being updated
    if (data.email && data.email !== existing.email) {
      const duplicate = await prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (duplicate) {
        requestLogger.warn('Duplicate email on update', { email: data.email });
        throw new ConflictError(`Customer with email ${data.email} already exists`);
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // Publish event to Kafka
    try {
      await kafkaClient.publish('customer.events', 'CUSTOMER_UPDATED', {
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
        tier: customer.tier,
        updatedAt: customer.updatedAt,
        changes: Object.keys(data),
      });
    } catch (kafkaError: any) {
      requestLogger.warn('Failed to publish CUSTOMER_UPDATED event', { error: kafkaError.message });
    }

    requestLogger.info('Customer updated', { customerId: customer.id });
    
    res.json({
      success: true,
      data: customer,
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /customers/:id
 * Deactivate customer (soft delete)
 */
customerRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger as ContextLogger;
  const { id } = req.params;

  try {
    // Check if customer exists
    const existing = await prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      requestLogger.warn('Customer not found', { id });
      throw new NotFoundError('Customer', id);
    }

    // Check for active orders
    const activeOrders = await prisma.order.count({
      where: {
        customerId: id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PROCESSING'],
        },
      },
    });

    if (activeOrders > 0) {
      requestLogger.warn('Cannot deactivate customer with active orders', { activeOrders });
      throw new AppError({
        code: 'BUSINESS_RULE_ERROR',
        message: 'Cannot deactivate customer with active orders',
        statusCode: 400,
        details: { activeOrders },
      });
    }

    // Soft delete - update status to INACTIVE
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        deactivatedAt: new Date(),
      },
    });

    // Publish event to Kafka
    try {
      await kafkaClient.publish('customer.events', 'CUSTOMER_DELETED', {
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
        deactivatedAt: customer.deactivatedAt,
      });
    } catch (kafkaError: any) {
      requestLogger.warn('Failed to publish CUSTOMER_DELETED event', { error: kafkaError.message });
    }

    requestLogger.info('Customer deactivated', { customerId: customer.id });
    
    res.json({
      success: true,
      data: { message: 'Customer deactivated successfully', customer },
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /customers/:id/credit-status
 * Get customer credit status
 */
customerRouter.get('/:id/credit-status', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger as ContextLogger;
  const { id } = req.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        creditLimit: true,
        tier: true,
      },
    });

    if (!customer) {
      requestLogger.warn('Customer not found', { id });
      throw new NotFoundError('Customer', id);
    }

    // Calculate outstanding balance
    const orders = await prisma.order.findMany({
      where: { customerId: id },
      select: { total: true, status: true },
    });

    const payments = await prisma.payment.findMany({
      where: { customerId: id },
      select: { amount: true, status: true },
    });

    const totalOrders = orders
      .filter((o: any) => o.status !== 'CANCELLED')
      .reduce((sum: number, o: any) => sum + o.total.toNumber(), 0);

    const totalPayments = payments
      .filter((p: any) => p.status === 'COMPLETED')
      .reduce((sum: number, p: any) => sum + p.amount.toNumber(), 0);

    const outstandingBalance = totalOrders - totalPayments;
    const availableCredit = customer.creditLimit.toNumber() - outstandingBalance;
    const creditUtilization = customer.creditLimit.toNumber() > 0
      ? (outstandingBalance / customer.creditLimit.toNumber()) * 100
      : 0;

    requestLogger.info('Credit status retrieved', { id });
    
    res.json({
      success: true,
      data: {
        customerId: customer.id,
        customerName: customer.name,
        creditLimit: customer.creditLimit.toNumber(),
        outstandingBalance,
        availableCredit,
        creditUtilization: Math.round(creditUtilization * 100) / 100,
        tier: customer.tier,
      },
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Mount customer routes
app.use('/api/v1/customers', customerRouter);

// -----------------------------------------------------------------------------
// Error Handling
// -----------------------------------------------------------------------------

app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      traceId: req.id,
    },
  });
});

// -----------------------------------------------------------------------------
// Graceful Shutdown
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------

const server = app.listen(PORT, () => {
  logger.info(`Customer Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

server.on('error', (error: Error) => {
  logger.error('Server error', error);
});

export default app;
