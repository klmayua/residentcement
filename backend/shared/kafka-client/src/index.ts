/**
 * ResidentCement Kafka Client
 * Shared event publishing utility for microservices
 */

import { Kafka, Producer, logLevel, ProducerRecord } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

export interface Event<T = Record<string, unknown>> {
  eventId: string;
  eventType: string;
  source: string;
  timestamp: string;
  data: T;
  traceId: string;
}

export type EventType =
  | 'CUSTOMER_CREATED'
  | 'CUSTOMER_UPDATED'
  | 'CUSTOMER_DELETED'
  | 'ORDER_CREATED'
  | 'ORDER_UPDATED'
  | 'ORDER_CANCELLED'
  | 'ORDER_COMPLETED'
  | 'ORDER_STATUS_CHANGED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'INVENTORY_RESERVED'
  | 'INVENTORY_RELEASED'
  | 'INVENTORY_ADJUSTED'
  | 'INVENTORY_LOW'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_REFUNDED'
  | 'QUOTE_CREATED'
  | 'QUOTE_UPDATED'
  | 'QUOTE_CONVERTED'
  | 'PRODUCTION_ORDER_CREATED'
  | 'PRODUCTION_STATUS_CHANGED'
  | 'BATCH_CREATED'
  | 'BATCH_COMPLETED'
  | 'QUALITY_CHECK_FAILED'
  | 'QUALITY_CHECK_PASSED'
  | 'NON_CONFORMANCE_CREATED';

export class KafkaClient {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private isConnected = false;
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.kafka = new Kafka({
      clientId: `resident-cement-${serviceName}`,
      brokers: (process.env.KAFKA_BROKERS || 'localhost:29092').split(','),
      logLevel: logLevel.WARN,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      this.producer = this.kafka.producer();
      await this.producer.connect();
      this.isConnected = true;
      console.log(`[${this.serviceName}] Kafka client connected`);
    } catch (error) {
      console.error(`[${this.serviceName}] Failed to connect to Kafka`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      if (this.producer) {
        await this.producer.disconnect();
      }
      this.isConnected = false;
      console.log(`[${this.serviceName}] Kafka client disconnected`);
    } catch (error) {
      console.error(`[${this.serviceName}] Error disconnecting from Kafka`, error);
    }
  }

  async publish<T>(
    topic: string,
    eventType: EventType,
    data: T,
    headers?: Record<string, string>
  ): Promise<string> {
    if (!this.producer) {
      throw new Error('Kafka client not connected');
    }

    const event: Event<T> = {
      eventId: uuidv4(),
      eventType,
      source: this.serviceName,
      timestamp: new Date().toISOString(),
      data,
      traceId: uuidv4(),
    };

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.eventId,
            value: JSON.stringify(event),
            headers: {
              eventType,
              source: this.serviceName,
              traceId: event.traceId,
              ...headers,
            },
          },
        ],
      });

      console.log(`[${this.serviceName}] Published event ${eventType} to ${topic}`, {
        eventId: event.eventId,
      });
      return event.eventId;
    } catch (error) {
      console.error(`[${this.serviceName}] Failed to publish event ${eventType}`, error);
      throw error;
    }
  }

  async publishBatch<T>(
    topic: string,
    events: Array<{ eventType: EventType; data: T }>
  ): Promise<string[]> {
    if (!this.producer) {
      throw new Error('Kafka client not connected');
    }

    const messages = events.map((event) => ({
      key: uuidv4(),
      value: JSON.stringify({
        eventId: uuidv4(),
        eventType: event.eventType,
        source: this.serviceName,
        timestamp: new Date().toISOString(),
        data: event.data,
        traceId: uuidv4(),
      }),
      headers: {
        eventType: event.eventType,
        source: this.serviceName,
      },
    }));

    try {
      await this.producer.send({
        topic,
        messages,
      });

      console.log(`[${this.serviceName}] Published ${events.length} events to ${topic}`);
      return messages.map((m) => m.key as string);
    } catch (error) {
      console.error(`[${this.serviceName}] Failed to publish batch events`, error);
      throw error;
    }
  }

  getConnected(): boolean {
    return this.isConnected;
  }
}

export const createKafkaClient = (serviceName: string): KafkaClient => {
  return new KafkaClient(serviceName);
};
