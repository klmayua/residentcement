/**
 * ResidentCement Shared Kernel
 * 
 * Central shared package for microservices providing:
 * - Common types and interfaces
 * - Error handling utilities
 * - Centralized logging with correlation IDs
 * - Validation schemas
 * - Common utilities
 * - Health check infrastructure
 * - Express middleware
 */

// Types and Interfaces
export * from './types';

// Error Handling
export * from './errors';

// Logger
export * from './logger';

// Validation
export * from './validation';

// Utilities
export * from './utils';

// Middleware
export * from './middleware';

// Health Check
export * from './health';

// HTTP Client
export * from './http-client';
