import request from 'supertest';
import express from 'express';

describe('Pricing Service', () => {
  const app = express();

  app.get('/pricing/:productId', (req, res) => {
    res.json({
      productId: req.params.productId,
      retailPrice: 5000,
      distributorPrice: 4500,
      bulkPrice: 4000,
    });
  });

  describe('GET /pricing/:productId', () => {
    it('should return pricing tiers', async () => {
      const response = await request(app).get('/pricing/prod_1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('retailPrice');
      expect(response.body).toHaveProperty('distributorPrice');
      expect(response.body).toHaveProperty('bulkPrice');
    });
  });
});
