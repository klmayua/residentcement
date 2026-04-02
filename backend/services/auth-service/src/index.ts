import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://rcerp.nyamabo.com',
  ],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 minutes
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
  skipSuccessfulRequests: true,
});
app.use('/auth/login', authLimiter);
app.use('/auth/forgot-password', authLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    code: 'NOT_FOUND',
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
