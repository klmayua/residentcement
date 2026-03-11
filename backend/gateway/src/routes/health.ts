import { Router, Request, Response } from 'express';
import { 
  createHealthCheckService, 
  checkMemory,
  HealthCheckService 
} from '@resident-cement/kernel';

const router = Router();

// Create health check service for gateway
const healthService = createHealthCheckService('api-gateway', '1.0.0');

// Add memory check
healthService.addCheck('memory', () => checkMemory(0.9));

/**
 * GET /health
 * Basic health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const health = await healthService.getHealthStatus();
    
    res.json({
      status: health.status,
      service: health.service,
      version: health.version,
      timestamp: health.timestamp,
      uptime: health.uptime,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'api-gateway',
      error: error instanceof Error ? error.message : 'Health check failed',
    });
  }
});

/**
 * GET /health/ready
 * Readiness probe - checks if service is ready to accept traffic
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const health = await healthService.getHealthStatus();
    
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
  } catch (error) {
    res.status(503).json({
      ready: false,
      service: 'api-gateway',
      error: error instanceof Error ? error.message : 'Readiness check failed',
    });
  }
});

/**
 * GET /health/live
 * Liveness probe - checks if service is alive
 */
router.get('/live', async (req: Request, res: Response) => {
  res.json({
    alive: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health/detailed
 * Detailed health check with all diagnostic information
 */
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const health = await healthService.getHealthStatus();
    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'api-gateway',
      error: error instanceof Error ? error.message : 'Detailed health check failed',
    });
  }
});

export { router as healthRouter, healthService };
