/**
 * USSD Service - Entry Point
 * Africa's Talking USSD integration for ResidentCement
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { AfricasTalkingHandler } from './handlers/africastalking';
import { validateATRequest, logUSSDRequest } from './middleware/validateATRequest';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4008;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests from this IP',
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize USSD handler
const ussdHandler = new AfricasTalkingHandler();

// Health check endpoint
app.get('/health', (req, res) => {
  const stats = ussdHandler.getStats();
  res.json({
    status: 'ok',
    service: 'ussd-service',
    timestamp: new Date().toISOString(),
    activeSessions: stats.activeSessions,
  });
});

// USSD webhook endpoint (Africa's Talking)
app.post('/ussd', logUSSDRequest, validateATRequest, (req, res) => ussdHandler.handleRequest(req, res));

// Alternative endpoint for testing (no validation)
app.post('/ussd/test', logUSSDRequest, (req, res) => {
  // Simulate Africa's Talking format
  req.body = {
    ...req.body,
    networkCode: req.body.networkCode || 'TEST001',
    serviceCode: req.body.serviceCode || '*384#',
  };
  ussdHandler.handleRequest(req, res);
});

// Get current menu structure (for documentation)
app.get('/menus', (req, res) => {
  const { menus } = require('./handlers/menus');
  const menuList = Object.values(menus).map((menu: any) => ({
    id: menu.id,
    title: menu.title,
    options: menu.options.map((opt: any) => ({
      id: opt.id,
      label: opt.label,
      action: opt.action,
    })),
  }));
  res.json(menuList);
});

// Stats endpoint
app.get('/stats', (req, res) => {
  const stats = ussdHandler.getStats();
  res.json({
    ...stats,
    timestamp: new Date().toISOString(),
  });
});

// SMS delivery report webhook (Africa's Talking)
app.post('/ussd/delivery', (req, res) => {
  console.log('SMS Delivery Report:', req.body);
  res.json({ status: 'received' });
});

// Africa's Talking SMS callback endpoint
app.post('/sms/incoming', (req, res) => {
  const { from, text, to } = req.body;
  console.log('Incoming SMS:', { from, text, to });

  // Auto-respond to incoming SMS
  const responses: Record<string, string> = {
    'balance': 'Your account balance and credit limit information is available via USSD. Dial *384# to check.',
    'help': 'ResidentCement Support: Dial *384# for USSD menu, call 0700-RESIDENT, or WhatsApp +234 800 123 4567',
    'price': 'Current prices: Resident Cement NGN 4,500/bag. Dial *384# for full price list and bulk discounts.',
    'order': 'To place an order, dial *384# and select option 2. Or visit https://app.residentcement.com',
  };

  const lowerText = text.toLowerCase().trim();
  const response = responses[lowerText] || 'Thank you for contacting ResidentCement. Dial *384# for our USSD menu or call 0700-RESIDENT for support.';

  // Send response via AT if configured
  if (process.env.AT_SMS_ENABLED === 'true' && from) {
    ussdHandler.sendSMS(from, response)
      .then(() => console.log(`Auto-reply sent to ${from}`))
      .catch(err => console.error('Failed to send auto-reply:', err));
  }

  res.json({ status: 'ok' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('========================================');
  console.log('ResidentCement USSD Service');
  console.log('========================================');
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Africa's Talking Username: ${process.env.AT_USERNAME || 'NOT CONFIGURED'}`);
  console.log('========================================');
  console.log('Endpoints:');
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`  USSD Webhook: http://localhost:${PORT}/ussd`);
  console.log(`  Test USSD: http://localhost:${PORT}/ussd/test`);
  console.log(`  Menu Structure: http://localhost:${PORT}/menus`);
  console.log('========================================');
});

export default app;
