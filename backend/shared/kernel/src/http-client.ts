/**
 * HTTP Client for Service-to-Service Communication
 *
 * Provides a robust HTTP client for inter-service communication with:
 * - Automatic retries with exponential backoff
 * - Circuit breaker pattern
 * - Request/response logging
 * - Timeout handling
 * - Correlation ID propagation
 */

import { Logger } from 'winston';

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  circuitBreakerThreshold?: number;
  circuitBreakerResetTime?: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export class CircuitBreakerError extends Error {
  constructor(serviceName: string) {
    super(`Circuit breaker is open for service: ${serviceName}`);
    this.name = 'CircuitBreakerError';
  }
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

export class HttpClient {
  private config: Required<HttpClientConfig>;
  private logger: Logger;
  private failureCount = 0;
  private lastFailureTime?: number;
  private circuitState: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private serviceName: string,
    config: HttpClientConfig,
    logger: Logger
  ) {
    this.config = {
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      circuitBreakerThreshold: 5,
      circuitBreakerResetTime: 30000,
      ...config,
    };
    this.logger = logger;
  }

  private isCircuitOpen(): boolean {
    if (this.circuitState === 'OPEN') {
      if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.config.circuitBreakerResetTime) {
        this.circuitState = 'HALF_OPEN';
        this.logger.info(`Circuit breaker entering HALF_OPEN state for ${this.serviceName}`);
        return false;
      }
      return true;
    }
    return false;
  }

  private recordSuccess(): void {
    if (this.circuitState === 'HALF_OPEN') {
      this.circuitState = 'CLOSED';
      this.failureCount = 0;
      this.logger.info(`Circuit breaker CLOSED for ${this.serviceName}`);
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.circuitBreakerThreshold) {
      this.circuitState = 'OPEN';
      this.logger.error(`Circuit breaker OPENED for ${this.serviceName} after ${this.failureCount} failures`);
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest<T>(
    method: string,
    path: string,
    body?: any,
    config?: RequestConfig
  ): Promise<T> {
    if (this.isCircuitOpen()) {
      throw new CircuitBreakerError(this.serviceName);
    }

    const url = `${this.config.baseURL}${path}`;
    const timeout = config?.timeout || this.config.timeout;
    const retries = config?.retries ?? this.config.retries;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    // Add correlation ID if available
    const correlationId = headers['x-correlation-id'] || headers['X-Correlation-Id'];
    if (!correlationId) {
      headers['X-Correlation-Id'] = `${this.serviceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        this.logger.debug(`[${method}] ${url}`, { attempt: attempt + 1, correlationId: headers['X-Correlation-Id'] });

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new HttpClientError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorBody
          );
        }

        const data = await response.json();
        this.recordSuccess();
        return data as T;

      } catch (error) {
        lastError = error as Error;

        if (error instanceof HttpClientError && error.statusCode && error.statusCode < 500) {
          // Don't retry client errors (4xx)
          throw error;
        }

        if (attempt < retries) {
          const delayMs = this.config.retryDelay * Math.pow(2, attempt);
          this.logger.warn(`Request failed, retrying in ${delayMs}ms`, {
            attempt: attempt + 1,
            error: lastError.message
          });
          await this.delay(delayMs);
        }
      }
    }

    this.recordFailure();
    throw lastError || new HttpClientError('Request failed after all retries');
  }

  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>('GET', path, undefined, config);
  }

  async post<T>(path: string, body: any, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>('POST', path, body, config);
  }

  async put<T>(path: string, body: any, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>('PUT', path, body, config);
  }

  async patch<T>(path: string, body: any, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>('PATCH', path, body, config);
  }

  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>('DELETE', path, undefined, config);
  }

  getCircuitState(): string {
    return this.circuitState;
  }

  resetCircuit(): void {
    this.circuitState = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = undefined;
    this.logger.info(`Circuit breaker manually reset for ${this.serviceName}`);
  }
}

// Service registry for easy access to other services
export interface ServiceRegistry {
  gateway: { host: string; port: number };
  customerService: { host: string; port: number };
  inventoryService: { host: string; port: number };
  orderService: { host: string; port: number };
  paymentService: { host: string; port: number };
  pricingService: { host: string; port: number };
  productService: { host: string; port: number };
  plantMesService: { host: string; port: number };
  qualityService: { host: string; port: number };
}

export const defaultServiceRegistry: ServiceRegistry = {
  gateway: { host: 'localhost', port: 3001 },
  customerService: { host: 'localhost', port: 3002 },
  inventoryService: { host: 'localhost', port: 3003 },
  pricingService: { host: 'localhost', port: 3004 },
  paymentService: { host: 'localhost', port: 3005 },
  productService: { host: 'localhost', port: 3006 },
  orderService: { host: 'localhost', port: 3007 },
  plantMesService: { host: 'localhost', port: 3008 },
  qualityService: { host: 'localhost', port: 3009 },
};

export function createServiceUrl(service: { host: string; port: number }): string {
  return `http://${service.host}:${service.port}`;
}

// Factory function to create HTTP clients for services
export function createHttpClient(
  serviceName: string,
  targetService: keyof ServiceRegistry,
  logger: Logger,
  registry: ServiceRegistry = defaultServiceRegistry
): HttpClient {
  const service = registry[targetService];
  return new HttpClient(serviceName, {
    baseURL: createServiceUrl(service),
  }, logger);
}
