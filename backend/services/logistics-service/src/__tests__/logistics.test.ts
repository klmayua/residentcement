import request from 'supertest';
import express from 'express';

describe('Logistics Service', () => {
  const app = express();
  app.use(express.json());

  app.get('/deliveries', (req, res) => {
    res.json([
      { id: 'del_1', status: 'in_transit', destination: 'Lagos' },
      { id: 'del_2', status: 'delivered', destination: 'Abuja' },
    ]);
  });

  describe('GET /deliveries', () => {
    it('should return deliveries', async () => {
      const response = await request(app).get('/deliveries');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });
});
