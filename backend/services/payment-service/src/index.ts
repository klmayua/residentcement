/**
 * ResidentCement Payment Service
 * 
 * Payment processing with Paystack integration
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { 
  createLogger, requestIdMiddleware, requestLoggingMiddleware, errorHandler,
  createHealthCheckService, checkMemory, NotFoundError, PaymentError,
  initiatePaymentSchema, paymentQuerySchema,
} from '@resident-cement/kernel';
import { PrismaClient, PaymentStatus, PaymentMethod } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';
import crypto from 'crypto';

config();

const logger = createLogger({ service: 'payment-service', version: '1.0.0', environment: process.env.NODE_ENV || 'development' });
const app: Express = express();
const PORT = parseInt(process.env.PORT || '3005', 10);
const prisma = new PrismaClient({ log: ['error'] });
const kafkaClient = createKafkaClient('payment-service');
kafkaClient.connect().catch(() => {});

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY environment variable is required");
}
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const healthService = createHealthCheckService('payment-service', '1.0.0');
healthService.addCheck('database', async () => { const start = Date.now(); try { await prisma.$queryRaw`SELECT 1`; return { name: 'database', status: 'pass', responseTime: Date.now() - start }; } catch { return { name: 'database', status: 'fail', responseTime: Date.now() - start }; } });
healthService.addCheck('memory', () => checkMemory(0.9));

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(requestIdMiddleware());
app.use(requestLoggingMiddleware({ skipPaths: ['/health'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
app.use((req: Request, res: Response, next: NextFunction) => { (req as any).logger = logger.child({ requestId: req.id }); next(); });

const healthRouter = express.Router();
healthRouter.get('/', async (req: Request, res: Response) => { const h = await healthService.getHealthStatus(); res.json({ status: h.status, service: h.service, uptime: h.uptime }); });
healthRouter.get('/ready', async (req: Request, res: Response) => { const h = await healthService.getHealthStatus(); if (h.status === 'unhealthy') return res.status(503).json({ ready: false }); res.json({ ready: true }); });
healthRouter.get('/live', async (req: Request, res: Response) => { res.json({ alive: true, uptime: process.uptime() }); });
app.use('/health', healthRouter);

const paymentRouter = express.Router();

// GET /payments - List payments
paymentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = paymentQuerySchema.parse(req.query);
    const { page = 1, limit = 50, orderId, customerId, status, method } = query;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;
    if (method) where.method = method;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' }, include: { customer: { select: { name: true, email: true } }, order: { select: { orderNumber: true } } } }),
      prisma.payment.count({ where }),
    ]);

    res.json({ success: true, data: payments, meta: { requestId: req.id, timestamp: new Date().toISOString(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: offset + limit < total } } });
  } catch (error) { next(error); }
});

// GET /payments/:id - Get payment
paymentRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({ where: { id }, include: { customer: true, order: true } });
    if (!payment) throw new NotFoundError('Payment', id);
    res.json({ success: true, data: payment, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /payments/initiate - Initiate payment
paymentRouter.post('/initiate', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  try {
    const data = initiatePaymentSchema.parse(req.body);

    // Verify customer exists
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
    if (!customer) throw new NotFoundError('Customer', data.customerId);

    // Generate payment reference
    const paymentReference = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Initialize Paystack payment
    const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customer.email,
        amount: Math.round(data.amount.toNumber() * 100), // Convert to kobo
        currency: data.currency || 'NGN',
        reference: paymentReference,
        metadata: { ...data.metadata, customerId: data.customerId, orderId: data.orderId },
      }),
    });

    const paystackData = await paystackResponse.json();
    if (!paystackData.status) {
      throw new PaymentError('Failed to initialize payment', 'Paystack', paystackData.message);
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        id: uuidv4(),
        paymentReference,
        customerId: data.customerId,
        orderId: data.orderId || null,
        amount: data.amount,
        currency: data.currency || 'NGN',
        method: data.method,
        status: 'PENDING',
        provider: 'Paystack',
        providerReference: paystackData.data?.authorization_url,
        metadata: data.metadata || {},
      },
      include: { customer: { select: { name: true, email: true } } },
    });

    try { await kafkaClient.publish('payment.events', 'PAYMENT_INITIATED', { paymentId: payment.id, amount: payment.amount, method: payment.method }); } catch {}

    requestLogger.info('Payment initiated', { paymentId: payment.id, reference: paymentReference });
    res.json({
      success: true,
      data: {
        payment,
        authorizationUrl: paystackData.data?.authorization_url,
        accessCode: paystackData.data?.access_code,
      },
      meta: { requestId: req.id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// POST /payments/verify/:reference - Verify payment
paymentRouter.post('/verify/:reference', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  const { reference } = req.params;

  try {
    // Verify with Paystack
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: { 'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    const data = await response.json();

    if (!data.status) {
      throw new PaymentError('Payment verification failed', 'Paystack', data.message);
    }

    const paymentData = data.data;
    const status = paymentData.status === 'success' ? 'COMPLETED' : paymentData.status === 'failed' ? 'FAILED' : 'PROCESSING';

    // Update payment record
    const payment = await prisma.payment.updateMany({
      where: { paymentReference: reference },
      data: {
        status: status as PaymentStatus,
        paidAt: status === 'COMPLETED' ? new Date() : null,
        failedAt: status === 'FAILED' ? new Date() : null,
        providerResponse: paymentData,
        updatedAt: new Date(),
      },
    });

    const updatedPayment = await prisma.payment.findFirst({ where: { paymentReference: reference }, include: { customer: { select: { name: true, email: true } } } });

    if (updatedPayment) {
      try {
        const eventType = status === 'COMPLETED' ? 'PAYMENT_COMPLETED' : status === 'FAILED' ? 'PAYMENT_FAILED' : 'PAYMENT_UPDATED';
        await kafkaClient.publish('payment.events', eventType as any, { paymentId: updatedPayment.id, status });
      } catch {}
    }

    requestLogger.info('Payment verified', { reference, status });
    res.json({ success: true, data: updatedPayment, meta: { requestId: req.id, timestamp: new Date().toISOString() } });
  } catch (error) { next(error); }
});

// POST /payments/webhook - Paystack webhook
paymentRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  const requestLogger = (req as any).logger;
  
  // Verify webhook signature
  const signature = req.headers['x-paystack-signature'] as string;
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
  
  if (signature !== hash) {
    requestLogger.warn('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  try {
    switch (event.event) {
      case 'charge.success': {
        const payment = await prisma.payment.findFirst({ where: { paymentReference: event.data.reference } });
        if (payment && payment.status !== 'COMPLETED') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'COMPLETED', paidAt: new Date(), providerResponse: event.data },
          });
          try { await kafkaClient.publish('payment.events', 'PAYMENT_COMPLETED', { paymentId: payment.id }); } catch {}
        }
        break;
      }
      case 'charge.failed': {
        const payment = await prisma.payment.findFirst({ where: { paymentReference: event.data.reference } });
        if (payment && payment.status !== 'FAILED') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED', failedAt: new Date(), failureReason: event.data.gateway_response },
          });
          try { await kafkaClient.publish('payment.events', 'PAYMENT_FAILED', { paymentId: payment.id }); } catch {}
        }
        break;
      }
    }
    res.json({ received: true });
  } catch (error) { next(error); }
});

// GET /payments/:id/refund - Get refund info (placeholder)
paymentRouter.get('/:id/refund', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundError('Payment', id);
    if (payment.status !== 'COMPLETED') throw new PaymentError('Only completed payments can be refunded');

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        amount: payment.amount,
        refundable: payment.amount,
        refundedAmount: payment.refundAmount || 0,
      },
      meta: { requestId: req.id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/payments', paymentRouter);
app.use(errorHandler);
app.use((req: Request, res: Response) => { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found`, traceId: req.id } }); });

const gracefulShutdown = async (signal: string) => { await prisma.$disconnect(); await kafkaClient.disconnect(); process.exit(0); };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const server = app.listen(PORT, () => { logger.info(`Payment Service running on port ${PORT}`); logger.info(`Health: http://localhost:${PORT}/health`); });

export default app;
