import request from 'supertest';
import express from 'express';

describe('Quality Service', () => {
  const app = express();
  app.use(express.json());

  app.get('/quality/batches', (req, res) => {
    res.json([
      { batchId: 'B001', status: 'passed', grade: 'premium' },
      { batchId: 'B002', status: 'failed', grade: 'standard' },
    ]);
  });

  describe('GET /quality/batches', () => {
    it('should return quality test results', async () => {
      const response = await request(app).get('/quality/batches');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
