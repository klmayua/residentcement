/**
 * ResidentCement Quality & Compliance Service
 *
 * Quality management and compliance tracking for cement production
 * - Quality standards management
 * - Compliance tracking and audits
 * - Certification management
 * - Non-conformance tracking
 * - CAPA (Corrective and Preventive Actions)
 * - Audit trails
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
  service: 'quality-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
});

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3009', 10);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const kafkaClient = createKafkaClient('quality-service');
kafkaClient.connect().catch((err: any) => logger.warn('Failed to connect to Kafka', err));

// HTTP clients for inter-service communication
const productClient = createHttpClient('quality-service', 'productService', logger);
const plantMesClient = createHttpClient('quality-service', 'plantMesService', logger);

// Health check
const healthService = createHealthCheckService('quality-service', '1.0.0');
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

// Quality Standards Routes
const standardsRouter = express.Router();

// GET /quality/standards - List quality standards
standardsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', category, status } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const [standards, total] = await Promise.all([
      prisma.qualityStandard.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { name: 'asc' },
        include: { _count: { select: { inspections: true } } },
      }),
      prisma.qualityStandard.count({ where }),
    ]);

    res.json({
      success: true,
      data: standards,
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

// GET /quality/standards/:id - Get quality standard
standardsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const standard = await prisma.qualityStandard.findUnique({
      where: { id },
      include: { inspections: { take: 10, orderBy: { createdAt: 'desc' } } },
    });

    if (!standard) throw new NotFoundError('Quality Standard', id);

    res.json({
      success: true,
      data: standard,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /quality/standards - Create quality standard
standardsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    if (!data.name) throw new ValidationError('Standard name is required');
    if (!data.category) throw new ValidationError('Category is required');

    const standard = await prisma.qualityStandard.create({
      data: {
        id: uuidv4(),
        code: data.code || `QS-${Date.now().toString(36).toUpperCase()}`,
        name: data.name,
        category: data.category,
        description: data.description,
        specifications: data.specifications || {},
        toleranceMin: data.toleranceMin,
        toleranceMax: data.toleranceMax,
        unitOfMeasure: data.unitOfMeasure,
        status: 'ACTIVE',
        version: '1.0',
      },
    });

    requestLogger.info('Quality standard created', { standardId: standard.id, name: standard.name });
    res.status(201).json({
      success: true,
      data: standard,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /quality/standards/:id - Update quality standard
standardsRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const data = req.body;

    const standard = await prisma.qualityStandard.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 0.1 },
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: standard,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Inspection Routes
const inspectionRouter = express.Router();

// GET /quality/inspections - List inspections
inspectionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, batchId, productId } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (batchId) where.batchId = batchId;
    if (productId) where.productId = productId;

    const [inspections, total] = await Promise.all([
      prisma.inspection.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { inspectionDate: 'desc' },
        include: { standard: true },
      }),
      prisma.inspection.count({ where }),
    ]);

    res.json({
      success: true,
      data: inspections,
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

// POST /quality/inspections - Create inspection
inspectionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    if (!data.standardId) throw new ValidationError('Standard ID is required');
    if (!data.batchId) throw new ValidationError('Batch ID is required');

    // Verify standard exists
    const standard = await prisma.qualityStandard.findUnique({ where: { id: data.standardId } });
    if (!standard) throw new NotFoundError('Quality Standard', data.standardId);

    // Determine result based on measurements
    let result = data.result || 'PENDING';
    if (data.measurements && standard.toleranceMin !== null && standard.toleranceMax !== null) {
      const value = parseFloat(data.measurements.value);
      if (value < standard.toleranceMin || value > standard.toleranceMax) {
        result = 'FAILED';
      } else {
        result = 'PASSED';
      }
    }

    const inspection = await prisma.inspection.create({
      data: {
        id: uuidv4(),
        standardId: data.standardId,
        batchId: data.batchId,
        productId: data.productId,
        result,
        measurements: data.measurements || {},
        notes: data.notes,
        inspectedBy: data.inspectedBy || 'system',
        inspectionDate: new Date(),
      },
      include: { standard: true },
    });

    // Publish event
    try {
      await kafkaClient.publish('quality.events', result === 'FAILED' ? 'QUALITY_CHECK_FAILED' : 'QUALITY_CHECK_PASSED', {
        inspectionId: inspection.id,
        batchId: inspection.batchId,
        standardId: inspection.standardId,
        result: inspection.result,
      });
    } catch (kafkaError: any) {
      requestLogger.warn('Failed to publish quality event', { error: kafkaError.message });
    }

    requestLogger.info('Inspection recorded', { inspectionId: inspection.id, result });
    res.status(201).json({
      success: true,
      data: inspection,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Non-Conformance Routes
const ncrRouter = express.Router();

// GET /quality/ncr - List non-conformance reports
ncrRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, severity } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const [ncrs, total] = await Promise.all([
      prisma.nonConformanceReport.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: { capa: true },
      }),
      prisma.nonConformanceReport.count({ where }),
    ]);

    res.json({
      success: true,
      data: ncrs,
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

// POST /quality/ncr - Create non-conformance report
ncrRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    if (!data.title) throw new ValidationError('Title is required');
    if (!data.description) throw new ValidationError('Description is required');

    const ncrNumber = `NCR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const ncr = await prisma.nonConformanceReport.create({
      data: {
        id: uuidv4(),
        ncrNumber,
        title: data.title,
        description: data.description,
        severity: data.severity || 'MEDIUM',
        status: 'OPEN',
        batchId: data.batchId,
        productId: data.productId,
        reportedBy: data.reportedBy || 'system',
      },
    });

    // Publish event
    try {
      await kafkaClient.publish('quality.events', 'NON_CONFORMANCE_CREATED', {
        ncrId: ncr.id,
        ncrNumber: ncr.ncrNumber,
        severity: ncr.severity,
        batchId: ncr.batchId,
      });
    } catch (kafkaError: any) {
      requestLogger.warn('Failed to publish NCR event', { error: kafkaError.message });
    }

    requestLogger.info('Non-conformance report created', { ncrId: ncr.id, ncrNumber });
    res.status(201).json({
      success: true,
      data: ncr,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /quality/ncr/:id/resolve - Resolve NCR
ncrRouter.patch('/:id/resolve', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { resolution, resolvedBy } = req.body;

  try {
    const ncr = await prisma.nonConformanceReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolution,
        resolvedBy,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: ncr,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// CAPA Routes
const capaRouter = express.Router();

// GET /quality/capa - List CAPA records
capaRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, priority } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [capas, total] = await Promise.all([
      prisma.cAPA.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: { ncr: true },
      }),
      prisma.cAPA.count({ where }),
    ]);

    res.json({
      success: true,
      data: capas,
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

// POST /quality/capa - Create CAPA
capaRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    if (!data.ncrId) throw new ValidationError('NCR ID is required');
    if (!data.description) throw new ValidationError('Description is required');

    // Verify NCR exists
    const ncr = await prisma.nonConformanceReport.findUnique({ where: { id: data.ncrId } });
    if (!ncr) throw new NotFoundError('Non-Conformance Report', data.ncrId);

    const capaNumber = `CAPA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const capa = await prisma.cAPA.create({
      data: {
        id: uuidv4(),
        capaNumber,
        ncrId: data.ncrId,
        description: data.description,
        rootCause: data.rootCause,
        correctiveAction: data.correctiveAction,
        preventiveAction: data.preventiveAction,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
        assignedTo: data.assignedTo,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: { ncr: true },
    });

    // Update NCR with CAPA reference
    await prisma.nonConformanceReport.update({
      where: { id: data.ncrId },
      data: { capaId: capa.id, updatedAt: new Date() },
    });

    requestLogger.info('CAPA created', { capaId: capa.id, capaNumber });
    res.status(201).json({
      success: true,
      data: capa,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// PATCH /quality/capa/:id/complete - Complete CAPA
capaRouter.patch('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { verificationNotes, verifiedBy } = req.body;

  try {
    const capa = await prisma.cAPA.update({
      where: { id },
      data: {
        status: 'CLOSED',
        verificationNotes,
        verifiedBy,
        closedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: capa,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Certification Routes
const certificationRouter = express.Router();

// GET /quality/certifications - List certifications
certificationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', status, type } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [certifications, total] = await Promise.all([
      prisma.certification.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { issueDate: 'desc' },
      }),
      prisma.certification.count({ where }),
    ]);

    res.json({
      success: true,
      data: certifications,
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

// POST /quality/certifications - Create certification
certificationRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = req.body;

    if (!data.name) throw new ValidationError('Certification name is required');
    if (!data.type) throw new ValidationError('Type is required');
    if (!data.certificateNumber) throw new ValidationError('Certificate number is required');

    const certification = await prisma.certification.create({
      data: {
        id: uuidv4(),
        certificateNumber: data.certificateNumber,
        name: data.name,
        type: data.type,
        issuingBody: data.issuingBody,
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        status: 'ACTIVE',
        scope: data.scope,
        attachments: data.attachments || {},
      },
    });

    requestLogger.info('Certification created', { certificationId: certification.id, name: certification.name });
    res.status(201).json({
      success: true,
      data: certification,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Audit Trail Routes
const auditRouter = express.Router();

// GET /quality/audit-trail - List audit records
auditRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50', entityType, action } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;

    const [audits, total] = await Promise.all([
      prisma.auditTrail.findMany({
        where,
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditTrail.count({ where }),
    ]);

    res.json({
      success: true,
      data: audits,
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

// POST /quality/audit-trail - Create audit record (internal use)
auditRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const audit = await prisma.auditTrail.create({
      data: {
        id: uuidv4(),
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        oldValues: data.oldValues || {},
        newValues: data.newValues || {},
        performedBy: data.performedBy || 'system',
        reason: data.reason,
      },
    });

    res.status(201).json({
      success: true,
      data: audit,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// Mount routers
app.use('/api/v1/quality/standards', standardsRouter);
app.use('/api/v1/quality/inspections', inspectionRouter);
app.use('/api/v1/quality/ncr', ncrRouter);
app.use('/api/v1/quality/capa', capaRouter);
app.use('/api/v1/quality/certifications', certificationRouter);
app.use('/api/v1/quality/audit-trail', auditRouter);

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
  logger.info(`Quality & Compliance Service running on port ${PORT}`);
  logger.info(`Health: http://localhost:${PORT}/health`);
});

export default app;
