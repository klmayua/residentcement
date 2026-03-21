import request from 'supertest';
import express from 'express';

describe('Inventory Service', () => {
  const app = express();

  app.get('/inventory', (req, res) => {
    res.json([
      { productId: 'prod_1', quantity: 5000, warehouse: 'Lagos' },
      { productId: 'prod_2', quantity: 3000, warehouse: 'Abuja' },
    ]);
  });

  describe('GET /inventory', () => {
    it('should return inventory levels', async () => {
      const response = await request(app).get('/inventory');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
