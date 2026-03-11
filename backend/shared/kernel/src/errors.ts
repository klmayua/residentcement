/**
 * Error Handling Utilities for ResidentCement Microservices
 * 
 * Provides standardized error classes and handling patterns
 */

// -----------------------------------------------------------------------------
// Base Error Classes
// -----------------------------------------------------------------------------

export interface ErrorDetails {
  code: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
  details?: Record<string, unknown>;
  cause?: Error;
  traceId?: string;
  timestamp?: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;
  public readonly cause?: Error;
  public readonly traceId?: string;
  public readonly timestamp: string;

  constructor({
    code,
    message,
    statusCode = 500,
    isOperational = true,
    details,
    cause,
    traceId,
  }: Partial<ErrorDetails> & { message: string }) {
    super(message);
    this.code = code || 'INTERNAL_ERROR';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.cause = cause;
    this.traceId = traceId;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      details: this.details,
      traceId: this.traceId,
      timestamp: this.timestamp,
    };
  }
}

// -----------------------------------------------------------------------------
// HTTP Error Classes
// -----------------------------------------------------------------------------

export class BadRequestError extends AppError {
  constructor(message: string, details?: Record<string, unknown>, traceId?: string) {
    super({
      code: 'BAD_REQUEST',
      message,
      statusCode: 400,
      details,
      traceId,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', traceId?: string) {
    super({
      code: 'UNAUTHORIZED',
      message,
      statusCode: 401,
      traceId,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', traceId?: string) {
    super({
      code: 'FORBIDDEN',
      message,
      statusCode: 403,
      traceId,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string, traceId?: string) {
    super({
      code: 'NOT_FOUND',
      message: id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      statusCode: 404,
      traceId,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>, traceId?: string) {
    super({
      code: 'CONFLICT',
      message,
      statusCode: 409,
      details,
      traceId,
    });
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests', traceId?: string) {
    super({
      code: 'TOO_MANY_REQUESTS',
      message,
      statusCode: 429,
      traceId,
    });
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string, details?: Record<string, unknown>, traceId?: string) {
    super({
      code: 'UNPROCESSABLE_ENTITY',
      message,
      statusCode: 422,
      details,
      traceId,
    });
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = 'Internal server error',
    cause?: Error,
    traceId?: string
  ) {
    super({
      code: 'INTERNAL_ERROR',
      message,
      statusCode: 500,
      isOperational: true,
      cause,
      traceId,
    });
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable', traceId?: string) {
    super({
      code: 'SERVICE_UNAVAILABLE',
      message,
      statusCode: 503,
      traceId,
    });
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message = 'Gateway timeout', traceId?: string) {
    super({
      code: 'GATEWAY_TIMEOUT',
      message,
      statusCode: 504,
      traceId,
    });
  }
}

// -----------------------------------------------------------------------------
// Domain Error Classes
// -----------------------------------------------------------------------------

export class ValidationError extends AppError {
  constructor(
    message: string,
    details?: Record<string, string[]>,
    traceId?: string
  ) {
    super({
      code: 'VALIDATION_ERROR',
      message,
      statusCode: 400,
      details: details as Record<string, unknown>,
      traceId,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', traceId?: string) {
    super({
      code: 'AUTHENTICATION_ERROR',
      message,
      statusCode: 401,
      traceId,
    });
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Authorization failed', traceId?: string) {
    super({
      code: 'AUTHORIZATION_ERROR',
      message,
      statusCode: 403,
      traceId,
    });
  }
}

export class ResourceNotFoundError extends NotFoundError {
  constructor(resource: string, id: string, traceId?: string) {
    super(resource, id, traceId);
  }
}

export class DuplicateResourceError extends ConflictError {
  constructor(resource: string, field: string, value: string, traceId?: string) {
    super(
      `${resource} with ${field} '${value}' already exists`,
      { field, value },
      traceId
    );
  }
}

export class InvalidStateError extends AppError {
  constructor(message: string, traceId?: string) {
    super({
      code: 'INVALID_STATE',
      message,
      statusCode: 400,
      traceId,
    });
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: Record<string, unknown>, traceId?: string) {
    super({
      code: 'BUSINESS_RULE_ERROR',
      message,
      statusCode: 400,
      details,
      traceId,
    });
  }
}

export class PaymentError extends AppError {
  constructor(
    message: string,
    provider?: string,
    providerCode?: string,
    traceId?: string
  ) {
    super({
      code: 'PAYMENT_ERROR',
      message,
      statusCode: 402,
      details: { provider, providerCode },
      traceId,
    });
  }
}

export class InventoryError extends AppError {
  constructor(message: string, details?: Record<string, unknown>, traceId?: string) {
    super({
      code: 'INVENTORY_ERROR',
      message,
      statusCode: 400,
      details,
      traceId,
    });
  }
}

export class InsufficientInventoryError extends AppError {
  constructor(
    productId: string,
    requested: number,
    available: number,
    traceId?: string
  ) {
    super({
      code: 'INSUFFICIENT_INVENTORY',
      message: `Insufficient inventory for product '${productId}'. Requested: ${requested}, Available: ${available}`,
      statusCode: 400,
      details: { productId, requested, available },
      traceId,
    });
  }
}

// -----------------------------------------------------------------------------
// External Service Error Classes
// -----------------------------------------------------------------------------

export class ExternalServiceError extends AppError {
  constructor(
    serviceName: string,
    message: string,
    statusCode?: number,
    traceId?: string
  ) {
    super({
      code: 'EXTERNAL_SERVICE_ERROR',
      message,
      statusCode: statusCode || 502,
      details: { serviceName },
      traceId,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, cause?: Error, traceId?: string) {
    super({
      code: 'DATABASE_ERROR',
      message,
      statusCode: 500,
      cause,
      traceId,
    });
  }
}

export class CacheError extends AppError {
  constructor(message: string, cause?: Error, traceId?: string) {
    super({
      code: 'CACHE_ERROR',
      message,
      statusCode: 500,
      cause,
      traceId,
    });
  }
}

export class MessageQueueError extends AppError {
  constructor(message: string, cause?: Error, traceId?: string) {
    super({
      code: 'MESSAGE_QUEUE_ERROR',
      message,
      statusCode: 500,
      cause,
      traceId,
    });
  }
}

// -----------------------------------------------------------------------------
// Error Handler Utilities
// -----------------------------------------------------------------------------

export interface ErrorHandlerOptions {
  includeStack?: boolean;
  includeCause?: boolean;
  maskSensitiveData?: boolean;
}

export function createErrorResponse(
  error: Error,
  options: ErrorHandlerOptions = {}
): Record<string, unknown> {
  const {
    includeStack = false,
    includeCause = false,
    maskSensitiveData = true,
  } = options;

  const response: Record<string, unknown> = {
    success: false,
  };

  if (error instanceof AppError) {
    response.error = {
      code: error.code,
      message: maskSensitiveData ? maskErrorMessage(error.message) : error.message,
      details: error.details,
      traceId: error.traceId,
      timestamp: error.timestamp,
    };

    if (includeStack && !error.isOperational) {
      (response.error as Record<string, unknown>).stack = error.stack;
    }

    if (includeCause && error.cause) {
      (response.error as Record<string, unknown>).cause = error.cause.message;
    }
  } else {
    response.error = {
      code: 'INTERNAL_ERROR',
      message: maskSensitiveData ? 'An unexpected error occurred' : error.message,
      timestamp: new Date().toISOString(),
    };

    if (includeStack) {
      (response.error as Record<string, unknown>).stack = error.stack;
    }
  }

  return response;
}

export function maskErrorMessage(message: string): string {
  // Mask potential sensitive information in error messages
  return message
    .replace(/password[=:]\s*\S+/gi, 'password=***')
    .replace(/token[=:]\s*\S+/gi, 'token=***')
    .replace(/secret[=:]\s*\S+/gi, 'secret=***')
    .replace(/key[=:]\s*\S+/gi, 'key=***');
}

export function isOperationalError(error: Error): boolean {
  return error instanceof AppError && error.isOperational;
}

export function getStatusCode(error: Error): number {
  return error instanceof AppError ? error.statusCode : 500;
}

export function getErrorCode(error: Error): string {
  return error instanceof AppError ? error.code : 'INTERNAL_ERROR';
}
