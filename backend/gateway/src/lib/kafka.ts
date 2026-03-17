/**
 * Kafka Event Publisher & Consumer Utility
 *
 * Publishes domain events to Kafka and consumes events for real-time updates
 */

import { Kafka, Producer, Consumer, logLevel, EachMessagePayload } from 'kafkajs';
import { createLogger } from '../utils/logger';
import { broadcastToAll, WSEvent, WSEventType } from './websocket';

const logger = createLogger({ service: 'kafka-events' });

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
let consumer: Consumer;

export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
    logger.info('Kafka producer connected');
  }
  return producer;
};

/**
 * Initialize Kafka consumer for real-time events
 */
export const initConsumer = async (): Promise<void> => {
  if (consumer) {
    logger.info('Kafka consumer already initialized');
    return;
  }

  consumer = kafka.consumer({
    groupId: 'gateway-websocket-consumer',
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
  });

  await consumer.connect();
  logger.info('Kafka consumer connected');

  // Subscribe to relevant topics
  const topics = [
    'order.events',
    'inventory.events',
    'inventory.alerts',
    'payment.events',
  ];

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    logger.info(`Subscribed to topic: ${topic}`);
  }

  // Process messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      try {
        const event = JSON.parse(message.value?.toString() || '{}');
        logger.debug('Kafka event received', { topic, partition, event });

        // Convert Kafka event to WebSocket event
        const wsEvent = convertToWSEvent(topic, event);
        if (wsEvent) {
          broadcastToAll(wsEvent);
        }
      } catch (error: any) {
        logger.error('Failed to process Kafka message', {
          topic,
          partition,
          error: error.message,
        });
      }
    },
  });

  logger.info('Kafka consumer running');
};

/**
 * Convert Kafka event to WebSocket event format
 */
const convertToWSEvent = (topic: string, event: any): WSEvent | null => {
  const eventType = event.eventType;

  const mapping: Record<string, WSEventType> = {
    'OrderPlaced': WSEventType.ORDER_CREATED,
    'OrderConfirmed': WSEventType.ORDER_STATUS_CHANGED,
    'OrderCancelled': WSEventType.ORDER_CANCELLED,
    'OrderFulfilled': WSEventType.ORDER_STATUS_CHANGED,
    'LowStockAlert': WSEventType.INVENTORY_LOW,
    'InventoryAdjusted': WSEventType.INVENTORY_UPDATED,
    'InventoryReserved': WSEventType.INVENTORY_UPDATED,
    'InventoryReleased': WSEventType.INVENTORY_UPDATED,
    'PaymentCompleted': WSEventType.PAYMENT_COMPLETED,
    'PaymentFailed': WSEventType.PAYMENT_FAILED,
  };

  const wsType = mapping[eventType];
  if (!wsType) return null;

  return {
    type: wsType,
    payload: event.data || event,
    timestamp: event.timestamp || new Date().toISOString(),
  };
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
