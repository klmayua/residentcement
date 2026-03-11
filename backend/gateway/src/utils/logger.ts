/**
 * Logger utility using ResidentCement Shared Kernel
 */

import { createLogger as kernelCreateLogger, getDefaultLogger } from '@resident-cement/kernel';

const logger = kernelCreateLogger({
  service: 'api-gateway',
  version: process.env.npm_package_version || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  level: (process.env.LOG_LEVEL as any) || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'both',
});

export default logger;
export { kernelCreateLogger as createLogger, getDefaultLogger };
