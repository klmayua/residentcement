/**
 * Centralized Logging Infrastructure for ResidentCement
 * 
 * Features:
 * - Correlation ID tracking across services
 * - Structured JSON logging
 * - Multiple transport support
 * - Log levels and filtering
 * - Performance metrics
 * - Error context enrichment
 */

import winston, { format, Logger, LogEntry, LeveledLogMethod } from 'winston';
import { TransformableInfo } from 'logform';

// -----------------------------------------------------------------------------
// Log Level Configuration
// -----------------------------------------------------------------------------

export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  verbose: 5,
  silly: 6,
};

export type LogLevel = keyof typeof LOG_LEVELS;

// -----------------------------------------------------------------------------
// Log Entry Types
// -----------------------------------------------------------------------------

export interface LogContext {
  service: string;
  version?: string;
  environment?: string;
  traceId?: string;
  correlationId?: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  action?: string;
  resource?: string;
  duration?: number;
  [key: string]: unknown;
}

export interface ErrorContext extends LogContext {
  error: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

export interface HttpLogContext extends LogContext {
  request: {
    method: string;
    url: string;
    path: string;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  };
  response: {
    statusCode: number;
    duration: number;
  };
}

export interface PerformanceContext extends LogContext {
  metric: {
    name: string;
    value: number;
    unit: string;
    tags?: Record<string, string>;
  };
}

// -----------------------------------------------------------------------------
// Custom Format Options
// -----------------------------------------------------------------------------

interface CustomFormatOptions {
  includeTimestamp?: boolean;
  includeService?: boolean;
  includeTrace?: boolean;
  maskSensitiveFields?: boolean;
  prettyPrint?: boolean;
}

const DEFAULT_OPTIONS: Required<CustomFormatOptions> = {
  includeTimestamp: true,
  includeService: true,
  includeTrace: true,
  maskSensitiveFields: true,
  prettyPrint: false,
};

// -----------------------------------------------------------------------------
// Sensitive Fields to Mask
// -----------------------------------------------------------------------------

const SENSITIVE_FIELDS = [
  'password',
  'secret',
  'token',
  'apiKey',
  'api_key',
  'authorization',
  'cookie',
  'creditCard',
  'credit_card',
  'cvv',
  'pin',
];

// -----------------------------------------------------------------------------
// Logger Configuration
// -----------------------------------------------------------------------------

interface LoggerConfig {
  service: string;
  version?: string;
  environment?: string;
  level?: LogLevel;
  format?: 'json' | 'console' | 'both';
  options?: CustomFormatOptions;
}

// -----------------------------------------------------------------------------
// Custom Formats
// -----------------------------------------------------------------------------

function createJsonFormat(options: Required<CustomFormatOptions>) {
  const formats = [
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  ];

  if (options.maskSensitiveFields) {
    formats.push(format(sanitizeSensitiveData as any)());
  }

  formats.push(
    format.json({
      space: options.prettyPrint ? 2 : 0,
    })
  );

  return format.combine(...formats);
}

function createConsoleFormat(options: Required<CustomFormatOptions>) {
  const formats = [
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.colorize({ all: true }),
  ];

  if (options.maskSensitiveFields) {
    formats.push(format(sanitizeSensitiveData as any)());
  }

  formats.push(
    format.printf(({ level, message, timestamp, service, traceId, ...meta }) => {
      let log = `${timestamp} [${level}]`;
      if (service) log += ` [${service}]`;
      if (traceId) log += ` [${traceId}]`;
      log += `: ${message}`;

      if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta, null, 2)}`;
      }

      return log;
    })
  );

  return format.combine(...formats);
}

// -----------------------------------------------------------------------------
// Custom Sanitizer
// -----------------------------------------------------------------------------

function sanitizeSensitiveData() {
  return {
    transform: (info: TransformableInfo): TransformableInfo => {
      const sanitized: Record<string, unknown> = { ...info };

      function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(obj)) {
          const lowerKey = key.toLowerCase();

          if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
            result[key] = '***REDACTED***';
          } else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value as Record<string, unknown>);
          } else {
            result[key] = value;
          }
        }

        return result;
      }

      return { ...sanitizeObject(sanitized), level: info.level, message: info.message };
    },
  };
}

// -----------------------------------------------------------------------------
// Custom Transports
// -----------------------------------------------------------------------------

interface TransportConfig {
  console?: {
    enabled: boolean;
    level?: LogLevel;
  };
  file?: {
    enabled: boolean;
    level?: LogLevel;
    dirname?: string;
    filename?: string;
    maxSize?: string;
    maxFiles?: number;
  };
  http?: {
    enabled: boolean;
    host?: string;
    port?: number;
    path?: string;
  };
}

function createTransports(config: TransportConfig): winston.transport[] {
  const transports: winston.transport[] = [];

  if (config.console?.enabled !== false) {
    transports.push(
      new winston.transports.Console({
        level: config.console?.level || 'info',
      })
    );
  }

  if (config.file?.enabled) {
    transports.push(
      new winston.transports.File({
        level: config.file.level || 'info',
        dirname: config.file.dirname || 'logs',
        filename: config.file.filename || 'app.log',
        maxsize: parseInt(config.file.maxSize || '10485760', 10), // 10MB
        maxFiles: config.file.maxFiles || 5,
        format: format.json(),
      })
    );

    // Separate error log
    transports.push(
      new winston.transports.File({
        level: 'error',
        dirname: config.file.dirname || 'logs',
        filename: 'error.log',
        maxsize: parseInt(config.file.maxSize || '10485760', 10),
        maxFiles: config.file.maxFiles || 5,
        format: format.json(),
      })
    );
  }

  return transports;
}

// -----------------------------------------------------------------------------
// Logger Factory
// -----------------------------------------------------------------------------

const loggers = new Map<string, Logger>();

export function createLogger(config: LoggerConfig): Logger {
  const loggerKey = config.service;

  if (loggers.has(loggerKey)) {
    return loggers.get(loggerKey)!;
  }

  const options: Required<CustomFormatOptions> = {
    ...DEFAULT_OPTIONS,
    ...config.options,
  };

  const defaultMeta: LogContext = {
    service: config.service,
    version: config.version || '1.0.0',
    environment: config.environment || process.env.NODE_ENV || 'development',
  };

  let formatter;
  if (config.format === 'console') {
    formatter = createConsoleFormat(options);
  } else if (config.format === 'both') {
    formatter = createJsonFormat(options);
  } else {
    formatter = createJsonFormat(options);
  }

  const logger = winston.createLogger({
    level: config.level || 'info',
    levels: LOG_LEVELS,
    defaultMeta,
    format: formatter,
    transports: createTransports({
      console: {
        enabled: true,
        level: config.level || 'info',
      },
      file: {
        enabled: process.env.NODE_ENV === 'production',
        level: config.level || 'info',
      },
    }),
    exitOnError: false,
  });

  // Add child logger methods
  const childLogger = logger.child({
    service: config.service,
  });

  loggers.set(loggerKey, childLogger);

  return childLogger;
}

// -----------------------------------------------------------------------------
// Context-Aware Logger Wrapper
// -----------------------------------------------------------------------------

export class ContextLogger {
  private logger: Logger;
  private context: LogContext;

  constructor(logger: Logger, context: LogContext) {
    this.logger = logger;
    this.context = context;
  }

  private enrichContext(additional: Record<string, unknown> = {}): LogContext {
    return { ...this.context, ...additional };
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(message, this.enrichContext(context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(message, this.enrichContext(context));
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(message, this.enrichContext(context));
  }

  http(message: string, context?: Record<string, unknown>): void {
    this.logger.http(message, this.enrichContext(context));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(message, this.enrichContext(context));
  }

  verbose(message: string, context?: Record<string, unknown>): void {
    this.logger.verbose(message, this.enrichContext(context));
  }

  silly(message: string, context?: Record<string, unknown>): void {
    this.logger.silly(message, this.enrichContext(context));
  }

  child(additionalContext: LogContext): ContextLogger {
    return new ContextLogger(this.logger, this.enrichContext(additionalContext));
  }
}

// -----------------------------------------------------------------------------
// Express Middleware for Request Logging
// -----------------------------------------------------------------------------

export function requestLoggingMiddleware(options: {
  skipPaths?: string[];
  includeBody?: boolean;
  includeHeaders?: boolean;
} = {}) {
  const { skipPaths = ['/health', '/health/ready'], includeBody = false, includeHeaders = false } = options;

  return (req: any, res: any, next: any) => {
    const start = Date.now();
    const traceId = req.headers['x-trace-id'] || req.id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Set trace ID for the request
    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);

    // Skip health check endpoints
    if (skipPaths.includes(req.path)) {
      return next();
    }

    const logContext: Partial<HttpLogContext> = {
      traceId,
      request: {
        method: req.method,
        url: req.originalUrl,
        path: req.path,
      },
    };

    if (includeBody && req.body && Object.keys(req.body).length > 0) {
      logContext.request!.body = req.body;
    }

    if (includeHeaders) {
      logContext.request!.headers = req.headers;
    }

    res.on('finish', () => {
      const duration = Date.now() - start;
      logContext.response = {
        statusCode: res.statusCode,
        duration,
      };

      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      
      (req.logger as Logger)?.log(level, `${req.method} ${req.path}`, logContext);
    });

    next();
  };
}

// -----------------------------------------------------------------------------
// Error Logging Helper
// -----------------------------------------------------------------------------

export function logError(
  logger: Logger,
  error: Error,
  context: LogContext
): void {
  const errorContext: ErrorContext = {
    ...context,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...((error as unknown as Record<string, unknown>).code) && { code: String((error as unknown as Record<string, unknown>).code) },
      ...((error as unknown as Record<string, unknown>).details) && { details: (error as unknown as Record<string, unknown>).details as Record<string, unknown> },
    },
  };

  logger.error(error.message, errorContext);
}

// -----------------------------------------------------------------------------
// Performance Logging Helper
// -----------------------------------------------------------------------------

export function logPerformance(
  logger: Logger,
  metricName: string,
  value: number,
  unit: string,
  context: LogContext = {} as LogContext
): void {
  const perfContext: PerformanceContext = {
    ...context,
    metric: {
      name: metricName,
      value,
      unit,
    },
  };

  logger.info(`Performance metric: ${metricName}`, perfContext);
}

// -----------------------------------------------------------------------------
// Default Logger Export
// -----------------------------------------------------------------------------

export function getDefaultLogger(service: string = 'unknown'): Logger {
  return createLogger({
    service,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    level: (process.env.LOG_LEVEL as LogLevel) || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'both',
  });
}
