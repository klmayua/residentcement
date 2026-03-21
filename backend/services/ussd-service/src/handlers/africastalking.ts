/**
 * Africa's Talking USSD Integration
 * Handles webhook requests from Africa's Talking API
 */

import { Request, Response } from 'express';
import AfricasTalking from 'africastalking';
import { USSDSession } from '../types/ussd';
import { MenuEngine } from './menu-engine';

export class AfricasTalkingHandler {
  private menuEngine: MenuEngine;
  private sessions: Map<string, USSDSession>;
  private at: any;

  // Africa's Talking credentials
  private readonly apiKey: string;
  private readonly username: string;
  private readonly shortCode: string;
  private readonly smsEnabled: boolean;

  constructor() {
    this.menuEngine = new MenuEngine();
    this.sessions = new Map();

    // Load from environment variables
    this.apiKey = process.env.AT_API_KEY || '';
    this.username = process.env.AT_USERNAME || 'sandbox';
    this.shortCode = process.env.AT_SHORTCODE || '*384#';
    this.smsEnabled = process.env.AT_SMS_ENABLED === 'true';

    // Initialize Africa's Talking SDK
    if (this.apiKey && this.username !== 'sandbox') {
      try {
        this.at = AfricasTalking({
          apiKey: this.apiKey,
          username: this.username,
        });
        console.log('Africa\'s Talking SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Africa\'s Talking SDK:', error);
        this.at = null;
      }
    } else {
      console.log('Africa\'s Talking SDK not initialized - running in sandbox/test mode');
      this.at = null;
    }
  }

  /**
   * Handle incoming USSD request from Africa's Talking
   */
  async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      // Africa's Talking request format
      const {
        sessionId,
        phoneNumber,
        networkCode,
        serviceCode,
        text,
      } = req.body;

      // Validate required fields
      if (!sessionId || !phoneNumber) {
        console.error('Invalid USSD request:', req.body);
        res.set('Content-Type', 'text/plain');
        res.status(400).send('END Invalid request. Please try again.');
        return;
      }

      console.log('USSD Request:', {
        sessionId: sessionId.substring(0, 8) + '...',
        phoneNumber: phoneNumber.substring(0, 6) + '****',
        serviceCode,
        text: text || '(new session)',
        networkCode,
        timestamp: new Date().toISOString(),
      });

      // Get or create session
      let session = this.sessions.get(sessionId);

      if (!session) {
        // New session - welcome message
        session = {
          sessionId,
          phoneNumber,
          networkCode,
          serviceCode,
          text: '',
          currentMenu: 'main',
          data: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.sessions.set(sessionId, session);

        // Return main menu
        const response = this.menuEngine.initializeSession();
        res.set('Content-Type', 'text/plain');
        res.send(response.text);
        return;
      }

      // Process user input
      const userInput = text ? text.split('*').pop() || '' : '';
      session.text = text || '';
      session.updatedAt = new Date();

      const response = await this.menuEngine.processInput(session, userInput);

      // Send SMS confirmation for order completion
      if (response.isEnd && response.text.includes('Order placed successfully')) {
        const orderIdMatch = response.text.match(/Order ID:\s*(\w+)/i);
        if (orderIdMatch) {
          const orderId = orderIdMatch[1];
          // Fire and forget SMS
          this.sendOrderConfirmation(phoneNumber, orderId, session.data.quantity * 4500 || 0)
            .catch(err => console.error('Failed to send order confirmation SMS:', err));
        }
      }

      // Clean up session if ended
      if (response.isEnd) {
        this.sessions.delete(sessionId);
      }

      // Africa's Talking expects plain text response
      res.set('Content-Type', 'text/plain');
      res.send(response.text);

    } catch (error) {
      console.error('USSD Error:', error);
      res.set('Content-Type', 'text/plain');
      res.status(500).send('END An error occurred. Please try again later or call 0700-RESIDENT for assistance.');
    }
  }

  /**
   * Send SMS notification via Africa's Talking
   */
  async sendSMS(phoneNumber: string, message: string, sender?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Format phone number (ensure it has country code)
    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    if (!this.at || !this.smsEnabled) {
      console.log('SMS not sent - Africa\'s Talking not configured or SMS disabled');
      console.log(`Would send to ${formattedNumber}: ${message}`);
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      const sms = this.at.SMS;
      const result = await sms.send({
        to: [formattedNumber],
        message: message,
        from: sender || process.env.AT_SENDER_ID || 'ResidentCement',
      });

      console.log(`SMS sent to ${formattedNumber}:`, result);
      return {
        success: true,
        messageId: result.SMSMessageData?.MessageId,
      };
    } catch (error: any) {
      console.error('SMS Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
      };
    }
  }

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmation(phoneNumber: string, orderId: string, amount: number): Promise<void> {
    const message = `ResidentCement: Your order ${orderId} has been received. Amount: NGN ${amount.toLocaleString()}. You will receive delivery updates via SMS. Thank you!`;
    await this.sendSMS(phoneNumber, message);
  }

  /**
   * Send delivery notification SMS
   */
  async sendDeliveryNotification(phoneNumber: string, orderId: string, status: string): Promise<void> {
    const message = `ResidentCement: Order ${orderId} is now ${status}. Track your delivery at https://residentcement.com/track`;
    await this.sendSMS(phoneNumber, message);
  }

  /**
   * Format phone number for Africa's Talking (ensure +234 format)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // If starts with 0, replace with +234
    if (cleaned.startsWith('0')) {
      cleaned = '+234' + cleaned.substring(1);
    }

    // If doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      // Assume it's already in international format without +
      if (cleaned.length === 13 && cleaned.startsWith('234')) {
        cleaned = '+' + cleaned;
      } else {
        cleaned = '+234' + cleaned;
      }
    }

    return cleaned;
  }

  /**
   * Get session statistics
   */
  getStats(): { activeSessions: number; totalSessions: number } {
    return {
      activeSessions: this.sessions.size,
      totalSessions: this.sessions.size, // In production, track total separately
    };
  }

  /**
   * Clean up expired sessions
   */
  cleanupSessions(): void {
    const now = new Date();
    const maxAge = 30 * 60 * 1000; // 30 minutes

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now.getTime() - session.updatedAt.getTime() > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Cleanup expired sessions every 5 minutes
const handler = new AfricasTalkingHandler();
setInterval(() => handler.cleanupSessions(), 5 * 60 * 1000);

export default handler;
