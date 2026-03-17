/**
 * WebSocket Server for Real-time Updates
 *
 * Handles WebSocket connections for real-time order status updates,
 * inventory alerts, and other live events.
 */

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';
import { verify } from 'jsonwebtoken';
import { createLogger } from '../utils/logger';

const logger = createLogger({ service: 'websocket-server' });

// WebSocket client interface
interface WSClient {
  ws: WebSocket;
  userId?: string;
  correlationId: string;
}

// Event types that can be broadcast to clients
export enum WSEventType {
  ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  INVENTORY_LOW = 'INVENTORY_LOW',
  INVENTORY_UPDATED = 'INVENTORY_UPDATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

// WebSocket event payload
export interface WSEvent {
  type: WSEventType;
  payload: Record<string, any>;
  timestamp: string;
}

// Client map for broadcasting
const clients: Map<string, WSClient> = new Map();

/**
 * Create WebSocket server attached to HTTP server
 */
export const createWebSocketServer = (server: any): WebSocketServer => {
  const wss = new WebSocketServer({ 
    server, 
    path: '/ws',
  });

  wss.on('connection', handleConnection);
  wss.on('close', () => {
    logger.info('WebSocket server closed');
  });

  logger.info('WebSocket server initialized');

  return wss;
};

/**
 * Handle new WebSocket connection
 */
const handleConnection = (ws: WebSocket, request: IncomingMessage) => {
  const correlationId = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const client: WSClient = { ws, correlationId };

  // Extract token from URL query params
  const url = parse(request.url || '', true);
  const token = url.query.token as string;

  // Authenticate connection
  if (token) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'secret');
      client.userId = (decoded as any).userId || (decoded as any).sub;
      logger.info('WebSocket client authenticated', { 
        correlationId, 
        userId: client.userId 
      });
    } catch (error) {
      logger.warn('WebSocket authentication failed', { correlationId });
      ws.send(JSON.stringify({
        type: 'ERROR',
        payload: { message: 'Authentication failed' },
        timestamp: new Date().toISOString(),
      }));
      ws.close(4001, 'Unauthorized');
      return;
    }
  } else {
    logger.warn('WebSocket connection without token', { correlationId });
  }

  // Add client to map
  clients.set(correlationId, client);
  logger.info('WebSocket client connected', { 
    correlationId, 
    userId: client.userId,
    totalClients: clients.size 
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'CONNECTED',
    payload: { correlationId, message: 'Connected to ResidentCement WebSocket' },
    timestamp: new Date().toISOString(),
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      logger.debug('WebSocket message received', { correlationId, message });
      
      // Handle ping/pong for keepalive
      if (message.type === 'PING') {
        ws.send(JSON.stringify({
          type: 'PONG',
          timestamp: new Date().toISOString(),
        }));
      }
    } catch (error) {
      logger.error('Failed to parse WebSocket message', { correlationId });
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    clients.delete(correlationId);
    logger.info('WebSocket client disconnected', { 
      correlationId, 
      totalClients: clients.size 
    });
  });

  // Handle errors
  ws.on('error', (error) => {
    logger.error('WebSocket error', { correlationId, error: error.message });
  });
};

/**
 * Broadcast event to all connected clients
 */
export const broadcastToAll = (event: WSEvent): void => {
  const message = JSON.stringify(event);
  let sentCount = 0;

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
      sentCount++;
    }
  });

  logger.debug('Broadcast event', { 
    type: event.type, 
    sentCount,
    totalClients: clients.size 
  });
};

/**
 * Broadcast event to specific user
 */
export const broadcastToUser = (userId: string, event: WSEvent): void => {
  const message = JSON.stringify(event);
  let sentCount = 0;

  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
      sentCount++;
    }
  });

  logger.debug('Broadcast to user', { 
    type: event.type, 
    userId, 
    sentCount 
  });
};

/**
 * Get connected client count
 */
export const getClientCount = (): number => {
  return clients.size;
};

/**
 * Graceful shutdown - close all connections
 */
export const closeAllConnections = (): void => {
  clients.forEach((client) => {
    client.ws.close(1001, 'Server shutting down');
  });
  clients.clear();
  logger.info('All WebSocket connections closed');
};
