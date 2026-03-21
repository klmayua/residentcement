import request from 'supertest';
import express from 'express';

describe('Product Service', () => {
  const app = express();

  app.get('/products', (req, res) => {
    res.json({
      products: [
        { id: 'prod_1', name: 'Dangote Cement 50kg', price: 4500 },
        { id: 'prod_2', name: 'Premium Cement 50kg', price: 4800 },
      ],
      total: 2,
    });
  });

  describe('GET /products', () => {
    it('should return product catalog', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(response.body.products).toHaveLength(2);
    });
  });
});
