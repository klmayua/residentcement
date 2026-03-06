/**
 * ResidentCement Payment Service
 * 
 * Domain microservice for payment processing
 * Handles Paystack integration, payment tracking, and webhooks
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { config } from 'dotenv';
import { PrismaClient, PaymentStatus, PaymentMethod } from '@prisma/client';
import { createLogger } from './utils/logger';
import { v4 as uuidv4 } from 'uuid';

config();

const logger = createLogger('payment-service');
const app: Express = express();
const PORT = process.env.PORT || 3005;

const prisma = new PrismaClient();

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_xxxxx';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'payment-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// POST /payments/initiate - Initiate a payment
app.post('/payments/initiate', async (req: Request, res: Response) => {
  try {
    const { orderId, customerId, amount, paymentMethod, email, phone, metadata } = req.body;
    
    // Validate required fields
    if (!orderId || !amount || !email) {
      return res.status(400).json({ error: 'orderId, amount, and email are required' });
    }
    
    // Generate payment reference
    const reference = `RC_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
    
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        id: `pay_${uuidv4()}`,
        orderId,
        customerId,
        amount,
        paymentMethod: paymentMethod || 'CARD',
        status: 'PENDING',
        reference,
        metadata: metadata || {}
      },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            status: true
          }
        }
      }
    });
    
    // Initialize Paystack payment if card/bank transfer
    if (paymentMethod === 'CARD' || paymentMethod === 'BANK_TRANSFER') {
      try {
        const paystackResponse = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            amount: amount * 100, // Paystack expects amount in kobo
            reference,
            metadata: {
              paymentId: payment.id,
              orderId,
              customerId,
              phone
            }
          })
        });
        
        const paystackData = await paystackResponse.json();
        
        if (paystackData.status) {
          // Update payment with Paystack authorization URL
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              paymentUrl: paystackData.data.authorization_url,
              paystackAccessCode: paystackData.data.access_code
            }
          });
          
          logger.info('Paystack payment initialized', { 
            paymentId: payment.id, 
            reference,
            authorizationUrl: paystackData.data.authorization_url 
          });
          
          res.json({
            paymentId: payment.id,
            reference,
            amount,
            paymentUrl: paystackData.data.authorization_url,
            accessCode: paystackData.data.access_code,
            message: 'Payment initialized. Redirect user to paymentUrl to complete payment.'
          });
        } else {
          throw new Error(paystackData.message || 'Paystack initialization failed');
        }
      } catch (paystackError: any) {
        logger.error('Paystack initialization error', { error: paystackError.message });
        
        // Update payment status to failed
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' }
        });
        
        res.status(502).json({
          error: 'Payment gateway error',
          details: paystackError.message,
          paymentId: payment.id,
          reference
        });
      }
    } else {
      // For bank transfer, return payment details
      const bankDetails = {
        bankName: 'ResidentCement Bank',
        accountName: 'Resident Cement Ltd',
        accountNumber: '1234567890',
        reference
      };
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: { metadata: { ...metadata, bankDetails } }
      });
      
      res.json({
        paymentId: payment.id,
        reference,
        amount,
        paymentMethod: 'BANK_TRANSFER',
        bankDetails,
        message: 'Please transfer the amount to the account details provided. Include the reference in the transfer description.'
      });
    }
  } catch (error: any) {
    logger.error('Error initiating payment', { error: error.message });
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// POST /payments/webhook - Handle Paystack webhook
app.post('/payments/webhook', async (req: Request, res: Response) => {
  try {
    // Verify Paystack webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== req.headers['x-paystack-signature']) {
      logger.warn('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const event = req.body;
    logger.info('Paystack webhook received', { event: event.event });
    
    switch (event.event) {
      case 'charge.success': {
        const { reference, status, amount, metadata } = event.data;
        
        if (status === 'success') {
          // Find payment by reference
          const payment = await prisma.payment.findFirst({
            where: { reference },
            include: { order: true }
          });
          
          if (payment) {
            // Update payment status
            await prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: 'COMPLETED',
                paidAt: new Date(),
                gatewayResponse: JSON.stringify(event.data),
                transactionId: event.data.id?.toString()
              }
            });
            
            // Update order status if exists
            if (payment.orderId) {
              await prisma.order.update({
                where: { id: payment.orderId },
                data: {
                  status: 'CONFIRMED',
                  paymentStatus: 'PAID'
                }
              });
            }
            
            logger.info('Payment completed successfully', { 
              paymentId: payment.id,
              reference,
              amount: amount / 100 // Convert from kobo
            });
          }
        }
        break;
      }
      
      case 'charge.failed': {
        const { reference } = event.data;
        
        const payment = await prisma.payment.findFirst({
          where: { reference }
        });
        
        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' }
          });
          
          logger.info('Payment failed', { paymentId: payment.id, reference });
        }
        break;
      }
      
      default:
        logger.info('Unhandled webhook event', { event: event.event });
    }
    
    res.json({ received: true });
  } catch (error: any) {
    logger.error('Error processing webhook', { error: error.message });
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// GET /payments - List payments
app.get('/payments', async (req: Request, res: Response) => {
  try {
    const { orderId, customerId, status, limit = 50, offset = 0 } = req.query;
    
    const where: any = {};
    
    if (orderId) {
      where.orderId = orderId as string;
    }
    
    if (customerId) {
      where.customerId = customerId as string;
    }
    
    if (status) {
      where.status = status as PaymentStatus;
    }
    
    const payments = await prisma.payment.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            status: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    const total = await prisma.payment.count({ where });
    
    res.json({
      data: payments,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total
      }
    });
  } catch (error: any) {
    logger.error('Error listing payments', { error: error.message });
    res.status(500).json({ error: 'Failed to list payments' });
  }
});

// GET /payments/:id - Get payment by ID
app.get('/payments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            status: true,
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error: any) {
    logger.error('Error getting payment', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get payment' });
  }
});

// GET /payments/:id/status - Get payment status
app.get('/payments/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id },
      select: {
        id: true,
        reference: true,
        status: true,
        amount: true,
        paymentMethod: true,
        paidAt: true,
        createdAt: true,
        order: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({
      paymentId: payment.id,
      reference: payment.reference,
      status: payment.status,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      orderStatus: payment.order?.status
    });
  } catch (error: any) {
    logger.error('Error getting payment status', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

// POST /payments/:id/refund - Initiate refund
app.post('/payments/:id/refund', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, amount } = req.body;
    
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { order: true }
    });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    if (payment.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only refund completed payments' });
    }
    
    // Initiate Paystack refund
    const refundAmount = amount || payment.amount.toNumber();
    
    try {
      const refundResponse = await fetch(`${PAYSTACK_BASE_URL}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction: payment.transactionId,
          amount: refundAmount * 100, // Convert to kobo
          reason: reason || 'Customer requested refund'
        })
      });
      
      const refundData = await refundResponse.json();
      
      if (refundData.status) {
        // Create refund record
        const refund = await prisma.payment.update({
          where: { id },
          data: {
            status: 'REFUNDED',
            metadata: {
              ...payment.metadata,
              refund: {
                reason,
                amount: refundAmount,
                date: new Date(),
                reference: refundData.data?.reference
              }
            }
          }
        });
        
        // Update order status
        if (payment.orderId) {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'CANCELLED' }
          });
        }
        
        logger.info('Refund processed', { 
          paymentId: id, 
          amount: refundAmount,
          reason 
        });
        
        res.json({
          message: 'Refund processed successfully',
          refund: {
            paymentId: id,
            amount: refundAmount,
            reason,
            status: 'REFUNDED'
          }
        });
      } else {
        throw new Error(refundData.message || 'Refund failed');
      }
    } catch (refundError: any) {
      logger.error('Refund error', { error: refundError.message });
      res.status(502).json({
        error: 'Refund processing error',
        details: refundError.message
      });
    }
  } catch (error: any) {
    logger.error('Error processing refund', { error: error.message });
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// GET /payments/stats - Get payment statistics
app.get('/payments/stats', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where: any = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }
    
    const [total, byStatus, byMethod, totalAmount] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      prisma.payment.groupBy({
        by: ['paymentMethod'],
        where,
        _count: true
      }),
      prisma.payment.aggregate({
        where,
        _sum: { amount: true }
      })
    ]);
    
    res.json({
      total,
      byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
      byMethod: byMethod.map(m => ({ method: m.paymentMethod, count: m._count })),
      totalAmount: totalAmount._sum.amount || 0
    });
  } catch (error: any) {
    logger.error('Error getting payment stats', { error: error.message });
    res.status(500).json({ error: 'Failed to get payment statistics' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Payment Service running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Webhook endpoint: http://localhost:${PORT}/payments/webhook`);
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
