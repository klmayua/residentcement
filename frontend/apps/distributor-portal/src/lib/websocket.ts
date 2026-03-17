/**
 * WebSocket Hook for Real-time Updates
 *
 * Provides React hooks for consuming real-time events via WebSocket
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// WebSocket event types
export enum WSEventType {
  ORDER_STATUS_CHANGED = 'ORDER_STATUS_CHANGED',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  INVENTORY_LOW = 'INVENTORY_LOW',
  INVENTORY_UPDATED = 'INVENTORY_UPDATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

// WebSocket event interface
export interface WSEvent {
  type: WSEventType;
  payload: Record<string, any>;
  timestamp: string;
}

// Connection status
export type WSStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WSOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// Global WebSocket instance (singleton)
let wsInstance: WebSocket | null = null;
let reconnectAttempts = 0;
let reconnectTimeout: NodeJS.Timeout | null = null;
const listeners: Set<(event: WSEvent) => void> = new Set();
const statusListeners: Set<(status: WSStatus) => void> = new Set();
let currentStatus: WSStatus = 'disconnected';

/**
 * Get WebSocket URL
 */
const getWSUrl = (): string => {
  // In production, use relative path which Nginx proxies to gateway
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = process.env.NEXT_PUBLIC_WS_URL || window.location.host;
  return `${protocol}//${wsHost}/ws`;
};

/**
 * Get auth token for WebSocket connection
 */
const getToken = (): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
};

/**
 * Connect to WebSocket server
 */
const connect = (options: WSOptions = {}) => {
  const { reconnectInterval = 3000, maxReconnectAttempts = 5 } = options;

  if (wsInstance?.readyState === WebSocket.OPEN) {
    return;
  }

  currentStatus = 'connecting';
  statusListeners.forEach((listener) => listener(currentStatus));

  const url = getWSUrl();
  const token = getToken();
  const wsUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;

  try {
    wsInstance = new WebSocket(wsUrl);

    wsInstance.onopen = () => {
      console.log('[WebSocket] Connected');
      currentStatus = 'connected';
      reconnectAttempts = 0;
      statusListeners.forEach((listener) => listener(currentStatus));
    };

    wsInstance.onclose = () => {
      console.log('[WebSocket] Disconnected');
      currentStatus = 'disconnected';
      statusListeners.forEach((listener) => listener(currentStatus));

      // Attempt reconnection
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`[WebSocket] Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`);
        reconnectTimeout = setTimeout(() => connect(options), reconnectInterval);
      } else {
        console.log('[WebSocket] Max reconnection attempts reached');
        currentStatus = 'error';
        statusListeners.forEach((listener) => listener(currentStatus));
      }
    };

    wsInstance.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      currentStatus = 'error';
      statusListeners.forEach((listener) => listener(currentStatus));
    };

    wsInstance.onmessage = (event) => {
      try {
        const data: WSEvent = JSON.parse(event.data);
        listeners.forEach((listener) => listener(data));
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };
  } catch (error) {
    console.error('[WebSocket] Failed to connect:', error);
    currentStatus = 'error';
    statusListeners.forEach((listener) => listener(currentStatus));
  }
};

/**
 * Disconnect from WebSocket server
 */
const disconnect = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (wsInstance) {
    wsInstance.close();
    wsInstance = null;
  }

  currentStatus = 'disconnected';
  statusListeners.forEach((listener) => listener(currentStatus));
};

/**
 * Subscribe to all WebSocket events
 */
export const subscribe = (callback: (event: WSEvent) => void) => {
  listeners.add(callback);

  // Connect on first subscription
  if (!wsInstance) {
    connect();
  }

  return () => {
    listeners.delete(callback);
  };
};

/**
 * Subscribe to status changes
 */
export const subscribeToStatus = (callback: (status: WSStatus) => void) => {
  statusListeners.add(callback);
  // Immediately notify of current status
  callback(currentStatus);

  return () => {
    statusListeners.delete(callback);
  };
};

/**
 * Hook for order status updates
 */
export const useOrderUpdates = (orderId?: string) => {
  const [updates, setUpdates] = useState<WSEvent[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (
        event.type === WSEventType.ORDER_STATUS_CHANGED ||
        event.type === WSEventType.ORDER_CREATED ||
        event.type === WSEventType.ORDER_CANCELLED
      ) {
        // Filter by orderId if provided
        if (!orderId || event.payload.orderId === orderId || event.payload.id === orderId) {
          setUpdates((prev) => [...prev, event]);
        }
      }
    });

    return unsubscribe;
  }, [orderId]);

  return updates;
};

/**
 * Hook for low stock alerts
 */
export const useLowStockAlerts = () => {
  const [alerts, setAlerts] = useState<WSEvent[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === WSEventType.INVENTORY_LOW) {
        setAlerts((prev) => [...prev, event]);
      }
    });

    return unsubscribe;
  }, []);

  return alerts;
};

/**
 * Hook for WebSocket connection status
 */
export const useWebSocketStatus = (): WSStatus => {
  const [status, setStatus] = useState<WSStatus>(currentStatus);

  useEffect(() => {
    const unsubscribe = subscribeToStatus(setStatus);
    return unsubscribe;
  }, []);

  return status;
};

/**
 * Hook for custom event subscription
 */
export const useWebSocketEvent = (
  eventType: WSEventType | WSEventType[],
  callback: (event: WSEvent) => void
) => {
  const eventTypes = Array.isArray(eventType) ? eventType : [eventType];
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (eventTypes.includes(event.type)) {
        callbackRef.current(event);
      }
    });

    return unsubscribe;
  }, [eventTypes]);
};

// Cleanup on unmount (for Next.js SSR safety)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    disconnect();
  });
}
