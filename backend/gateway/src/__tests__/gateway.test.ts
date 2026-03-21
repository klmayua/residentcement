import request from 'supertest';
import express from 'express';

// Simple test to verify Jest is working
describe('Gateway Health', () => {
  const app = express();
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'gateway' });
  });

  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('should include service name', async () => {
    const response = await request(app).get('/health');
    expect(response.body.service).toBe('gateway');
  });
});

describe('JWT Utils', () => {
  it('should have test environment configured', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBeDefined();
  });

  it('should mock console methods', () => {
    console.log('test');
    expect(console.log).toHaveBeenCalledWith('test');
  });
});
