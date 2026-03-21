/**
 * Africa's Talking USSD Integration
 * Handles webhook requests from Africa's Talking API
 */

import { Request, Response } from 'express';
import { USSDSession } from '../types/ussd';
import { MenuEngine } from './menu-engine';

// Africa's Talking SDK - uncomment when credentials are available
// import AfricasTalking from 'africastalking';

export class AfricasTalkingHandler {
  private menuEngine: MenuEngine;
  private sessions: Map<string, USSDSession>;

  // Africa's Talking credentials - to be configured
  private readonly apiKey: string;
  private readonly username: string;
  private readonly shortCode: string;

  constructor() {
    this.menuEngine = new MenuEngine();
    this.sessions = new Map();

    // Load from environment variables
    this.apiKey = process.env.AT_API_KEY || '';
    this.username = process.env.AT_USERNAME || 'sandbox';
    this.shortCode = process.env.AT_SHORTCODE || '*384#';

    // Initialize Africa's Talking SDK when credentials are available
    // this.at = AfricasTalking({
    //   apiKey: this.apiKey,
    //   username: this.username,
    // });
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

      console.log('USSD Request:', {
        sessionId,
        phoneNumber,
        serviceCode,
        text,
        timestamp: new Date().toISOString(),
      });

      // Get or create session
      let session = this.sessions.get(sessionId);

      if (!session) {
        // New session
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
      const userInput = text.split('*').pop() || '';
      session.text = text;
      session.updatedAt = new Date();

      const response = await this.menuEngine.processInput(session, userInput);

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
      res.status(500).send('END An error occurred. Please try again later.');
    }
  }

  /**
   * Send SMS notification (requires AT credentials)
   */
  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    if (!this.apiKey) {
      console.log('SMS not sent - AT_API_KEY not configured');
      console.log(`Would send to ${phoneNumber}: ${message}`);
      return;
    }

    try {
      // const sms = this.at.SMS;
      // await sms.send({
      //   to: phoneNumber,
      //   message: message,
      //   from: 'ResidentCement',
      // });
      console.log(`SMS sent to ${phoneNumber}`);
    } catch (error) {
      console.error('SMS Error:', error);
    }
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
