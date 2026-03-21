/**
 * Africa's Talking Request Validation Middleware
 * Validates incoming USSD requests from Africa's Talking
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Validate Africa's Talking USSD request format
 */
export const validateATRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { sessionId, phoneNumber, serviceCode } = req.body;

  // Required fields for Africa's Talking
  if (!sessionId) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('END Invalid request: Missing session ID');
    return;
  }

  if (!phoneNumber) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('END Invalid request: Missing phone number');
    return;
  }

  if (!serviceCode) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('END Invalid request: Missing service code');
    return;
  }

  // Validate phone number format (should be international format)
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(phoneNumber)) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('END Invalid phone number format');
    return;
  }

  // Validate session ID (should be alphanumeric)
  const sessionRegex = /^[a-zA-Z0-9_-]+$/;
  if (!sessionRegex.test(sessionId)) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('END Invalid session ID');
    return;
  }

  next();
};

/**
 * Log USSD requests for debugging
 */
export const logUSSDRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { sessionId, phoneNumber, text, serviceCode } = req.body;

  console.log('USSD Request:', {
    timestamp: new Date().toISOString(),
    sessionId: sessionId ? `${sessionId.substring(0, 8)}...` : 'missing',
    phoneNumber: phoneNumber ? `${phoneNumber.substring(0, 6)}****` : 'missing',
    serviceCode,
    text: text || '(init)',
    userAgent: req.headers['user-agent'],
  });

  next();
};
