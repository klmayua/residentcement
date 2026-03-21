import request from 'supertest';
import express from 'express';

describe('Customer Service', () => {
  const app = express();
  app.use(express.json());

  // Mock routes
  app.get('/customers', (req, res) => {
    res.json([
      { id: '1', name: 'ABC Construction', email: 'abc@test.com' },
      { id: '2', name: 'XYZ Builders', email: 'xyz@test.com' },
    ]);
  });

  app.post('/customers', (req, res) => {
    const customer = { id: '3', ...req.body };
    res.status(201).json(customer);
  });

  describe('GET /customers', () => {
    it('should return list of customers', async () => {
      const response = await request(app).get('/customers');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('POST /customers', () => {
    it('should create a new customer', async () => {
      const newCustomer = { name: 'New Customer', email: 'new@test.com' };
      const response = await request(app)
        .post('/customers')
        .send(newCustomer);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newCustomer.name);
    });
  });
});
