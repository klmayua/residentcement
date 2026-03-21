import request from 'supertest';
import express from 'express';

describe('Order Service', () => {
  const app = express();
  app.use(express.json());

  app.get('/orders', (req, res) => {
    res.json([
      { id: 'ord_1', status: 'pending', total: 500000 },
      { id: 'ord_2', status: 'completed', total: 1200000 },
    ]);
  });

  app.get('/orders/:id', (req, res) => {
    res.json({ id: req.params.id, status: 'pending', total: 500000 });
  });

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const response = await request(app).get('/orders');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a specific order', async () => {
      const response = await request(app).get('/orders/ord_1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('ord_1');
    });
  });
});
