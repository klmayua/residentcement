/**
 * Kafka Event Publisher Utility
 * 
 * Publishes domain events to Kafka for inter-service communication
 */

import { Kafka, Producer, logLevel } from 'kafkajs';
import { createLogger } from './utils/logger';

const logger = createLogger('event-publisher');

const kafka = new Kafka({
  clientId: 'resident-cement-events',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
  logLevel: logLevel.WARN,
});

let producer: Producer;

export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    logger.info('Kafka producer connected');
  }
  return producer;
};

// Event types
export enum EventType {
  // Customer Events
  CUSTOMER_CREATED = 'CustomerCreated',
  CUSTOMER_UPDATED = 'CustomerUpdated',
  
  // Order Events
  ORDER_PLACED = 'OrderPlaced',
  ORDER_CONFIRMED = 'OrderConfirmed',
  ORDER_CANCELLED = 'OrderCancelled',
  ORDER_FULFILLED = 'OrderFulfilled',
  
  // Payment Events
  PAYMENT_INITIATED = 'PaymentInitiated',
  PAYMENT_COMPLETED = 'PaymentCompleted',
  PAYMENT_FAILED = 'PaymentFailed',
  PAYMENT_REFUNDED = 'PaymentRefunded',
  
  // Inventory Events
  INVENTORY_ADJUSTED = 'InventoryAdjusted',
  INVENTORY_RESERVED = 'InventoryReserved',
  INVENTORY_RELEASED = 'InventoryReleased',
  LOW_STOCK_ALERT = 'LowStockAlert',
  
  // Product Events
  PRODUCT_CREATED = 'ProductCreated',
  PRODUCT_UPDATED = 'ProductUpdated',
  PRODUCT_PRICE_CHANGED = 'ProductPriceChanged',
  
  // Quote Events
  QUOTE_CREATED = 'QuoteCreated',
  QUOTE_CONVERTED = 'QuoteConverted',
}

// Event interface
export interface DomainEvent {
  eventId: string;
  eventType: EventType;
  aggregateId: string;
  aggregateType: string;
  timestamp: string;
  version: number;
  data: Record<string, any>;
  metadata: {
    userId?: string;
    service: string;
    correlationId?: string;
  };
}

/**
 * Publish a domain event to Kafka
 */
export const publishEvent = async (event: DomainEvent): Promise<void> => {
  try {
    const producer = await getProducer();
    
    const topic = getTopicForEvent(event.eventType);
    
    await producer.send({
      topic,
      messages: [
        {
          key: event.aggregateId,
          value: JSON.stringify(event),
          headers: {
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            correlationId: event.metadata.correlationId || event.eventId,
          },
        },
      ],
    });
    
    logger.info('Event published', {
      eventId: event.eventId,
      eventType: event.eventType,
      topic,
      aggregateId: event.aggregateId,
    });
  } catch (error: any) {
    logger.error('Failed to publish event', {
      error: error.message,
      eventType: event.eventType,
      eventId: event.eventId,
    });
    throw error;
  }
};

/**
 * Get Kafka topic for an event type
 */
const getTopicForEvent = (eventType: EventType): string => {
  const topicMap: Record<EventType, string> = {
    [EventType.CUSTOMER_CREATED]: 'customer.events',
    [EventType.CUSTOMER_UPDATED]: 'customer.events',
    [EventType.ORDER_PLACED]: 'order.events',
    [EventType.ORDER_CONFIRMED]: 'order.events',
    [EventType.ORDER_CANCELLED]: 'order.events',
    [EventType.ORDER_FULFILLED]: 'order.events',
    [EventType.PAYMENT_INITIATED]: 'payment.events',
    [EventType.PAYMENT_COMPLETED]: 'payment.events',
    [EventType.PAYMENT_FAILED]: 'payment.events',
    [EventType.PAYMENT_REFUNDED]: 'payment.events',
    [EventType.INVENTORY_ADJUSTED]: 'inventory.events',
    [EventType.INVENTORY_RESERVED]: 'inventory.events',
    [EventType.INVENTORY_RELEASED]: 'inventory.events',
    [EventType.LOW_STOCK_ALERT]: 'inventory.alerts',
    [EventType.PRODUCT_CREATED]: 'product.events',
    [EventType.PRODUCT_UPDATED]: 'product.events',
    [EventType.PRODUCT_PRICE_CHANGED]: 'product.events',
    [EventType.QUOTE_CREATED]: 'quote.events',
    [EventType.QUOTE_CONVERTED]: 'quote.events',
  };
  
  return topicMap[eventType] || 'domain.events';
};

/**
 * Create a domain event with standard structure
 */
export const createEvent = (
  eventType: EventType,
  aggregateId: string,
  aggregateType: string,
  data: Record<string, any>,
  metadata: { userId?: string; service: string; correlationId?: string }
): DomainEvent => {
  return {
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    eventType,
    aggregateId,
    aggregateType,
    timestamp: new Date().toISOString(),
    version: 1,
    data,
    metadata,
  };
};

/**
 * Graceful shutdown
 */
export const disconnectProducer = async (): Promise<void> => {
  if (producer) {
    await producer.disconnect();
    logger.info('Kafka producer disconnected');
  }
};
