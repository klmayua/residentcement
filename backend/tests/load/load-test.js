import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

/**
 * k6 Load Testing
 * Target: 100 concurrent users, <500ms response time
 * @see https://k6.io/docs/
 */

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

// Test configuration
export const options = {
  stages: [
    // Ramp up
    { duration: '1m', target: 10 },   // Warm up: 10 users
    { duration: '2m', target: 50 },  // Ramp to 50 users
    { duration: '3m', target: 100 }, // Peak load: 100 users
    // Steady state
    { duration: '5m', target: 100 }, // Maintain 100 users
    // Ramp down
    { duration: '2m', target: 50 },  // Scale down
    { duration: '1m', target: 0 },    // Cool down
  ],
  thresholds: {
    // 95% of requests must complete within 500ms
    http_req_duration: ['p(95)<500'],
    // Error rate must be less than 1%
    errors: ['rate<0.01'],
    // API latency p95 must be under 500ms
    api_latency: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000';

// Test data
const credentials = {
  email: 'demo@residentcement.com',
  password: 'password',
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Health check endpoint (lightweight)
  const healthRes = http.get(`${BASE_URL}/health`, params);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
    'health response time < 100ms': (r) => r.timings.duration < 100,
  });
  apiLatency.add(healthRes.timings.duration);

  // Products list (read-heavy)
  const productsRes = http.get(`${BASE_URL}/api/products`, params);
  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
    'products response time < 500ms': (r) => r.timings.duration < 500,
  });
  apiLatency.add(productsRes.timings.duration);
  errorRate.add(productsRes.status !== 200);

  // Customer list (authenticated)
  const customersRes = http.get(`${BASE_URL}/api/customers`, params);
  check(customersRes, {
    'customers status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  });

  // Orders list
  const ordersRes = http.get(`${BASE_URL}/api/orders`, params);
  check(ordersRes, {
    'orders status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  });

  // Simulate think time between requests
  sleep(Math.random() * 3 + 1);
}

// Setup function - runs once before the test
export function setup() {
  console.log(`Starting load test against ${BASE_URL}`);
  console.log(`Target: 100 concurrent users`);
  console.log(`Expected response time: <500ms p95`);
  return {};
}

// Teardown function - runs once after the test
export function teardown(data) {
  console.log('Load test completed');
}
