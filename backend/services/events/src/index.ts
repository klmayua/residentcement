import { Kafka, Producer, Consumer, logLevel } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
import { createLogger } from "../utils/logger";
import { EventSchema } from "../schemas/event";

const logger = createLogger("event-bus");

export interface Event<T = Record<string, unknown>> {
  eventId: string;
  eventType: string;
  source: string;
  timestamp: string;
  data: T;
  traceId: string;
}

export class EventBus {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumers: Map<string, Consumer> = new Map();
  private isConnected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: "resident-cement",
      brokers: (process.env.KAFKA_BROKERS || "localhost:29092").split(","),
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
      logger.info("Event bus connected to Kafka");
    } catch (error) {
      logger.error({ error }, "Failed to connect to Kafka");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await Promise.all(
        Array.from(this.consumers.values()).map((consumer) => consumer.disconnect())
      );
      if (this.producer) {
        await this.producer.disconnect();
      }
      this.isConnected = false;
      logger.info("Event bus disconnected");
    } catch (error) {
      logger.error({ error }, "Error disconnecting from Kafka");
    }
  }

  async publish<T>(topic: string, eventType: string, data: T, source: string): Promise<string> {
    if (!this.producer) {
      throw new Error("Event bus not connected");
    }

    const event: Event<T> = {
      eventId: uuidv4(),
      eventType,
      source,
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
              source,
            },
          },
        ],
      });

      logger.info({ eventId: event.eventId, eventType, topic }, "Event published");
      return event.eventId;
    } catch (error) {
      logger.error({ error, eventType, topic }, "Failed to publish event");
      throw error;
    }
  }

  async subscribe(
    topic: string,
    groupId: string,
    handler: (event: Event) => Promise<void>
  ): Promise<void> {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          const event = JSON.parse(message.value.toString()) as Event;
          await handler(event);
        } catch (error) {
          logger.error({ error, topic }, "Error processing message");
        }
      },
    });

    this.consumers.set(`${topic}-${groupId}`, consumer);
    logger.info({ topic, groupId }, "Consumer subscribed");
  }
}

export const eventBus = new EventBus();
