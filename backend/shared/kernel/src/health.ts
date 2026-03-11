/**
 * Health Check Service for ResidentCement Microservices
 * 
 * Provides comprehensive health monitoring including:
 * - Basic health status
 * - Readiness probes (dependencies check)
 * - Liveness probes
 * - Detailed service metrics
 */

import { Router, Request, Response } from 'express';

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  responseTime?: number;
  details?: Record<string, unknown>;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  checks: HealthCheck[];
}

export interface HealthCheckOptions {
  serviceName: string;
  version?: string;
  checks?: Array<{
    name: string;
    check: () => Promise<HealthCheck>;
    critical?: boolean;
  }>;
}

export class HealthCheckService {
  private serviceName: string;
  private version: string;
  private checks: Array<{
    name: string;
    check: () => Promise<HealthCheck>;
    critical: boolean;
  }>;

  constructor(options: HealthCheckOptions) {
    this.serviceName = options.serviceName;
    this.version = options.version || '1.0.0';
    this.checks = (options.checks || []).map(c => ({ ...c, critical: c.critical ?? true }));
  }

  addCheck(
    name: string,
    check: () => Promise<HealthCheck>,
    critical: boolean = true
  ): void {
    this.checks.push({ name, check, critical });
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];
    let hasCriticalFailure = false;
    let hasWarning = false;

    // Run all health checks in parallel
    const results = await Promise.allSettled(
      this.checks.map(({ check }) => check())
    );

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const checkConfig = this.checks[i];

      if (result.status === 'fulfilled') {
        checks.push(result.value);
        if (result.value.status === 'fail' && checkConfig.critical) {
          hasCriticalFailure = true;
        }
        if (result.value.status === 'warn') {
          hasWarning = true;
        }
      } else {
        // Check failed with an error
        checks.push({
          name: checkConfig.name,
          status: 'fail',
          message: result.reason instanceof Error ? result.reason.message : 'Unknown error',
        });
        if (checkConfig.critical) {
          hasCriticalFailure = true;
        }
      }
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (hasCriticalFailure) {
      status = 'unhealthy';
    } else if (hasWarning || checks.some((c) => c.status === 'warn')) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return {
      status,
      service: this.serviceName,
      version: this.version,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    };
  }
}

// -----------------------------------------------------------------------------
// Pre-built Health Checks
// -----------------------------------------------------------------------------

export async function checkDatabase(
  db: { query: (sql: string) => Promise<unknown> },
  timeout: number = 5000
): Promise<HealthCheck> {
  const startTime = Date.now();
  
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database check timed out')), timeout)
    );
    
    const checkPromise = db.query('SELECT 1');
    
    await Promise.race([checkPromise, timeoutPromise]);
    
    const responseTime = Date.now() - startTime;
    
    return {
      name: 'database',
      status: 'pass',
      responseTime,
      details: { type: 'PostgreSQL' },
    };
  } catch (error) {
    return {
      name: 'database',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Database connection failed',
      details: { type: 'PostgreSQL' },
    };
  }
}

export async function checkRedis(
  redis: { ping: () => Promise<string> },
  timeout: number = 5000
): Promise<HealthCheck> {
  const startTime = Date.now();
  
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis check timed out')), timeout)
    );
    
    const checkPromise = redis.ping();
    
    const result = await Promise.race([checkPromise, timeoutPromise]);
    
    const responseTime = Date.now() - startTime;
    
    return {
      name: 'redis',
      status: result === 'PONG' ? 'pass' : 'warn',
      responseTime,
      details: { type: 'Redis' },
    };
  } catch (error) {
    return {
      name: 'redis',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Redis connection failed',
      details: { type: 'Redis' },
    };
  }
}

export async function checkKafka(
  kafkaClient: { getConnected: () => boolean; connect?: () => Promise<void> },
  timeout: number = 5000
): Promise<HealthCheck> {
  const startTime = Date.now();
  
  try {
    const timeoutPromise = new Promise<HealthCheck>((_, reject) =>
      setTimeout(() => reject(new Error('Kafka check timed out')), timeout)
    );
    
    const checkPromise = (async () => {
      const connected = kafkaClient.getConnected();
      
      if (!connected && kafkaClient.connect) {
        await kafkaClient.connect();
      }
      
      const status: 'pass' | 'warn' = kafkaClient.getConnected() ? 'pass' : 'warn';
      return {
        name: 'kafka',
        status,
        responseTime: Date.now() - startTime,
        details: { type: 'Kafka' },
      };
    })();
    
    return await Promise.race([checkPromise, timeoutPromise]);
  } catch (error) {
    return {
      name: 'kafka',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Kafka connection failed',
      details: { type: 'Kafka' },
    };
  }
}

export async function checkMemory(
  threshold: number = 0.9
): Promise<HealthCheck> {
  const memUsage = process.memoryUsage();
  const heapUsedRatio = memUsage.heapUsed / memUsage.heapTotal;
  
  if (heapUsedRatio >= threshold) {
    return {
      name: 'memory',
      status: 'warn',
      message: `Memory usage is high: ${(heapUsedRatio * 100).toFixed(2)}%`,
      responseTime: 0,
      details: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        heapUsedRatio: heapUsedRatio,
        rss: memUsage.rss,
      },
    };
  }
  
  return {
    name: 'memory',
    status: 'pass',
    responseTime: 0,
    details: {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      heapUsedRatio: heapUsedRatio,
      rss: memUsage.rss,
    },
  };
}

export async function checkDiskSpace(
  threshold: number = 0.9
): Promise<HealthCheck> {
  // Simple implementation - in production, use a library like 'diskusage'
  return {
    name: 'disk',
    status: 'pass',
    message: 'Disk space check not implemented',
    responseTime: 0,
  };
}

export async function checkExternalService(
  name: string,
  url: string,
  timeout: number = 5000
): Promise<HealthCheck> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response: { ok: boolean; status: number } = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    }) as { ok: boolean; status: number };
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        name,
        status: 'pass',
        responseTime,
        details: { url, statusCode: response.status },
      };
    }
    
    return {
      name,
      status: 'warn',
      message: `External service returned ${response.status}`,
      responseTime,
      details: { url, statusCode: response.status },
    };
  } catch (error) {
    return {
      name,
      status: 'fail',
      message: error instanceof Error ? error.message : 'External service check failed',
      details: { url },
    };
  }
}

// -----------------------------------------------------------------------------
// Express Router
// -----------------------------------------------------------------------------

export function createHealthRouter(
  service: HealthCheckService,
  options: { includeDetails?: boolean } = {}
) {
  const router = Router();
  const { includeDetails = true } = options;

  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Basic health check
   *     description: Returns basic health status of the service
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [healthy, degraded, unhealthy]
   *                 service:
   *                   type: string
   *                 version:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                 uptime:
   *                   type: number
   */
  router.get('/', async (req: Request, res: Response) => {
    const health = await service.getHealthStatus();
    
    const simplifiedHealth: Partial<HealthStatus> = {
      status: health.status,
      service: health.service,
      version: health.version,
      timestamp: health.timestamp,
      uptime: health.uptime,
    };
    
    res.json(includeDetails ? health : simplifiedHealth);
  });

  /**
   * @openapi
   * /health/ready:
   *   get:
   *     summary: Readiness probe
   *     description: Checks if the service is ready to accept traffic
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is ready
   *       503:
   *         description: Service is not ready
   */
  router.get('/ready', async (req: Request, res: Response) => {
    const health = await service.getHealthStatus();
    
    if (health.status === 'unhealthy') {
      return res.status(503).json({
        ready: false,
        service: health.service,
        checks: health.checks.filter((c) => c.status === 'fail'),
      });
    }
    
    res.json({
      ready: true,
      service: health.service,
      version: health.version,
    });
  });

  /**
   * @openapi
   * /health/live:
   *   get:
   *     summary: Liveness probe
   *     description: Checks if the service is alive
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is alive
   *       503:
   *         description: Service is not alive
   */
  router.get('/live', async (req: Request, res: Response) => {
    // Simple liveness check - just verify the process is running
    const isAlive = true;
    
    res.json({
      alive: isAlive,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @openapi
   * /health/detailed:
   *   get:
   *     summary: Detailed health check
   *     description: Returns comprehensive health information with all checks
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Detailed health status
   */
  router.get('/detailed', async (req: Request, res: Response) => {
    const health = await service.getHealthStatus();
    res.json(health);
  });

  return router;
}

// -----------------------------------------------------------------------------
// Factory Function
// -----------------------------------------------------------------------------

export function createHealthCheckService(
  serviceName: string,
  version?: string
): HealthCheckService {
  return new HealthCheckService({
    serviceName,
    version,
  });
}
