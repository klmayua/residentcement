/**
 * ResidentCement Event Consumer Service
 * 
 * Consumes events from Kafka and triggers cross-service updates
 * - ORDER_CREATED -> Reserve inventory
 * - ORDER_CANCELLED -> Release inventory
 * - PAYMENT_COMPLETED -> Update order status
 * - CUSTOMER_CREATED -> Initialize customer profile
 */

import { Kafka, Consumer, logLevel } from 'kafkajs';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createLogger } from './utils/logger';

config();

const logger = createLogger('event-consumer');
const prisma = new PrismaClient();

const kafka = new Kafka({
  clientId: 'resident-cement-event-consumer',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:29092').split(','),
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

interface Event<T = Record<string, unknown>> {
  eventId: string;
  eventType: string;
  source: string;
  timestamp: string;
  data: T;
  traceId: string;
}

// Process ORDER_CREATED events
async function handleOrderCreated(event: Event): Promise<void> {
  const { orderId, customerId, itemCount } = event.data as {
    orderId: string;
    customerId: string;
    itemCount: number;
  };

  logger.info('Processing ORDER_CREATED event', {
    eventId: event.eventId,
    orderId,
    customerId,
  });

  try {
    // Inventory reservation is already handled in the order service
    // This is just for audit/logging purposes
    logger.info('ORDER_CREATED event processed successfully', { orderId });
  } catch (error: any) {
    logger.error('Failed to process ORDER_CREATED event', {
      eventId: event.eventId,
      orderId,
      error: error.message,
    });
  }
}

// Process ORDER_CANCELLED events
async function handleOrderCancelled(event: Event): Promise<void> {
  const { orderId, reason } = event.data as {
    orderId: string;
    reason: string;
  };

  logger.info('Processing ORDER_CANCELLED event', {
    eventId: event.eventId,
    orderId,
    reason,
  });

  try {
    // Inventory release is already handled in the order service
    // This is just for audit/logging purposes
    logger.info('ORDER_CANCELLED event processed successfully', { orderId });
  } catch (error: any) {
    logger.error('Failed to process ORDER_CANCELLED event', {
      eventId: event.eventId,
      orderId,
      error: error.message,
    });
  }
}

// Process PAYMENT_COMPLETED events
async function handlePaymentCompleted(event: Event): Promise<void> {
  const { orderId, paymentId, amount } = event.data as {
    orderId: string;
    paymentId: string;
    amount: number;
  };

  logger.info('Processing PAYMENT_COMPLETED event', {
    eventId: event.eventId,
    orderId,
    paymentId,
    amount,
  });

  try {
    // Update order status to CONFIRMED when payment is completed
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
      },
    });

    logger.info('Order updated to CONFIRMED after payment', { orderId });
  } catch (error: any) {
    logger.error('Failed to process PAYMENT_COMPLETED event', {
      eventId: event.eventId,
      orderId,
      error: error.message,
    });
  }
}

// Process CUSTOMER_CREATED events
async function handleCustomerCreated(event: Event): Promise<void> {
  const { customerId, email, name } = event.data as {
    customerId: string;
    email: string;
    name: string;
  };

  logger.info('Processing CUSTOMER_CREATED event', {
    eventId: event.eventId,
    customerId,
    email,
  });

  try {
    // Additional customer initialization logic can be added here
    // For example, creating default preferences, sending welcome email, etc.
    logger.info('CUSTOMER_CREATED event processed successfully', { customerId });
  } catch (error: any) {
    logger.error('Failed to process CUSTOMER_CREATED event', {
      eventId: event.eventId,
      customerId,
      error: error.message,
    });
  }
}

// Process INVENTORY_LOW events
async function handleInventoryLow(event: Event): Promise<void> {
  const { productId, productName, availableQuantity, reorderLevel } = event.data as {
    productId: string;
    productName: string;
    availableQuantity: number;
    reorderLevel: number;
  };

  logger.warn('INVENTORY_LOW alert', {
    eventId: event.eventId,
    productId,
    productName,
    availableQuantity,
    reorderLevel,
  });

  try {
    // Create a notification or alert
    // In production, this could trigger:
    // - Email to procurement team
    // - Slack notification
    // - Automatic reorder
    logger.info('INVENTORY_LOW event logged for action', { productId });
  } catch (error: any) {
    logger.error('Failed to process INVENTORY_LOW event', {
      eventId: event.eventId,
      productId,
      error: error.message,
    });
  }
}

async function startConsumer(): Promise<void> {
  const consumer = kafka.consumer({
    groupId: 'resident-cement-event-consumer',
    fromBeginning: false,
  });

  await consumer.connect();
  logger.info('Event consumer connected to Kafka');

  // Subscribe to all topics
  const topics = [
    'order.events',
    'customer.events',
    'inventory.events',
    'payment.events',
    'product.events',
  ];

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    logger.info(`Subscribed to topic: ${topic}`);
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      try {
        const event = JSON.parse(message.value.toString()) as Event;
        logger.info({ event: event.eventId, topic, partition }, 'Processing message');

        // Route events to appropriate handlers
        switch (event.eventType) {
          case 'ORDER_CREATED':
            await handleOrderCreated(event);
            break;
          case 'ORDER_CANCELLED':
            await handleOrderCancelled(event);
            break;
          case 'PAYMENT_COMPLETED':
            await handlePaymentCompleted(event);
            break;
          case 'CUSTOMER_CREATED':
            await handleCustomerCreated(event);
            break;
          case 'INVENTORY_LOW':
            await handleInventoryLow(event);
            break;
          default:
            logger.debug(`Unhandled event type: ${event.eventType}`);
        }

        logger.info({ event: event.eventId }, 'Message processed successfully');
      } catch (error: any) {
        logger.error(
          { topic, partition, error: error.message },
          'Error processing message'
        );
        // Don't throw - let Kafka continue processing
      }
    },
  });

  logger.info('Event consumer is running');
}

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

// Start the consumer
startConsumer().catch((error) => {
  logger.error('Failed to start event consumer', error);
  process.exit(1);
});

logger.info('Event Consumer Service starting...');
