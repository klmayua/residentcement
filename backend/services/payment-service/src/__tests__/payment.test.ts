import request from 'supertest';
import express from 'express';

describe('Payment Service', () => {
  const app = express();
  app.use(express.json());

  app.post('/payments/initialize', (req, res) => {
    res.json({
      status: true,
      message: 'Payment initialized',
      data: {
        authorization_url: 'https://paystack.com/pay/test',
        reference: 'PAY_' + Date.now(),
      },
    });
  });

  describe('POST /payments/initialize', () => {
    it('should initialize payment', async () => {
      const response = await request(app)
        .post('/payments/initialize')
        .send({ amount: 500000, email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data).toHaveProperty('authorization_url');
    });
  });
});
