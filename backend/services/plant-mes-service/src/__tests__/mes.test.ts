import request from 'supertest';
import express from 'express';

describe('Plant MES Service', () => {
  const app = express();

  app.get('/production/status', (req, res) => {
    res.json({
      plantId: 'plant_1',
      status: 'running',
      currentBatch: 'BATCH_001',
      outputRate: 100,
    });
  });

  describe('GET /production/status', () => {
    it('should return production status', async () => {
      const response = await request(app).get('/production/status');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('currentBatch');
    });
  });
});
