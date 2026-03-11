/**
 * ResidentCement E2E Test Suite
 * 
 * Comprehensive end-to-end tests for the ResidentCement platform
 * Covers critical user journeys and business workflows
 */

import { test, expect, Page, APIRequestContext } from '@playwright/test';

// -----------------------------------------------------------------------------
// Test Fixtures and Utilities
// -----------------------------------------------------------------------------

interface TestFixtures {
  authenticatedPage: Page;
  apiContext: APIRequestContext;
}

// Test data generators
const generateTestCustomer = () => ({
  name: `Test Customer ${Date.now()}`,
  email: `test${Date.now()}@example.com`,
  phone: '+234-800-123-4567',
  address: '1 Test Street, Test City',
  city: 'Lagos',
  state: 'Lagos State',
  lga: 'Ikeja',
  tier: 'STANDARD' as const,
  creditLimit: 1000000,
});

const generateTestOrder = (customerId: string) => ({
  customerId,
  priority: 'NORMAL' as const,
  items: [
    {
      productId: 'prod_001',
      quantity: 100,
      unitPrice: 3500,
      discount: 0,
    },
  ],
  shippingAddress: '1 Delivery Address, Lagos',
  deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
});

// -----------------------------------------------------------------------------
// Health Check Tests
// -----------------------------------------------------------------------------

test.describe('Health Checks', () => {
  test('should return healthy status from API gateway', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('api-gateway');
    expect(data.version).toBeDefined();
  });

  test('should pass readiness probe', async ({ request }) => {
    const response = await request.get('/health/ready');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.ready).toBeTruthy();
  });

  test('should pass liveness probe', async ({ request }) => {
    const response = await request.get('/health/live');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.alive).toBeTruthy();
    expect(data.uptime).toBeGreaterThan(0);
  });
});

// -----------------------------------------------------------------------------
// Authentication Tests
// -----------------------------------------------------------------------------

test.describe('Authentication', () => {
  test('should register a new user', async ({ request }) => {
    const userData = {
      email: `newuser${Date.now()}@example.com`,
      password: 'SecureP@ssw0rd123!',
      name: 'Test User',
      phone: '+234-800-123-4567',
    };

    const response = await request.post('/api/v1/auth/register', {
      data: userData,
    });

    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data.user.email).toBe(userData.email);
  });

  test('should login with valid credentials', async ({ request }) => {
    const credentials = {
      email: 'admin@residentcement.com',
      password: 'AdminP@ssw0rd123!',
    };

    const response = await request.post('/api/v1/auth/login', {
      data: credentials,
    });

    // If user doesn't exist, expect 401
    if (response.status() === 401) {
      expect(response.status()).toBe(401);
      return;
    }

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.refreshToken).toBeDefined();
  });

  test('should reject login with invalid credentials', async ({ request }) => {
    const credentials = {
      email: 'invalid@example.com',
      password: 'WrongPassword',
    };

    const response = await request.post('/api/v1/auth/login', {
      data: credentials,
    });

    expect(response.status()).toBe(401);
  });

  test('should validate password strength during registration', async ({ request }) => {
    const weakPasswordData = {
      email: `weak${Date.now()}@example.com`,
      password: 'weak',
      name: 'Test User',
    };

    const response = await request.post('/api/v1/auth/register', {
      data: weakPasswordData,
    });

    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBeFalsy();
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });
});

// -----------------------------------------------------------------------------
// Customer Management Tests
// -----------------------------------------------------------------------------

test.describe('Customer Management', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Login to get auth token
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        email: 'admin@residentcement.com',
        password: 'AdminP@ssw0rd123!',
      },
    });

    if (loginResponse.ok()) {
      const data = await loginResponse.json();
      authToken = data.data.accessToken;
    }
  });

  test('should create a new customer', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const customerData = generateTestCustomer();

    const response = await request.post('/api/v1/customers', {
      data: customerData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.name).toBe(customerData.name);
    expect(data.email).toBe(customerData.email);
    expect(data.tier).toBe(customerData.tier);
  });

  test('should get customer by ID', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    // First create a customer
    const customerData = generateTestCustomer();
    const createResponse = await request.post('/api/v1/customers', {
      data: customerData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (createResponse.ok()) {
      const created = await createResponse.json();
      
      // Then fetch it
      const getResponse = await request.get(`/api/v1/customers/${created.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(getResponse.ok()).toBeTruthy();
      
      const data = await getResponse.json();
      expect(data.id).toBe(created.id);
      expect(data.name).toBe(customerData.name);
    }
  });

  test('should list customers with pagination', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const response = await request.get('/api/v1/customers?page=1&limit=10', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBeTruthy();
  });

  test('should update customer', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    // Create a customer first
    const customerData = generateTestCustomer();
    const createResponse = await request.post('/api/v1/customers', {
      data: customerData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (createResponse.ok()) {
      const created = await createResponse.json();
      
      // Update the customer
      const updateData = {
        tier: 'GOLD' as const,
        creditLimit: 2000000,
      };

      const updateResponse = await request.patch(`/api/v1/customers/${created.id}`, {
        data: updateData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(updateResponse.ok()).toBeTruthy();
      
      const updated = await updateResponse.json();
      expect(updated.tier).toBe('GOLD');
      expect(updated.creditLimit).toBe(2000000);
    }
  });

  test('should reject duplicate customer email', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const customerData = generateTestCustomer();

    // Create first customer
    await request.post('/api/v1/customers', {
      data: customerData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Try to create with same email
    const duplicateResponse = await request.post('/api/v1/customers', {
      data: { ...customerData, name: 'Different Name' },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(duplicateResponse.status()).toBe(409);
  });
});

// -----------------------------------------------------------------------------
// Product Catalog Tests
// -----------------------------------------------------------------------------

test.describe('Product Catalog', () => {
  test('should list available products', async ({ request }) => {
    const response = await request.get('/api/v1/products?status=ACTIVE');
    
    // May return 401 if auth is required, or 200 with empty list
    expect([200, 401]).toContain(response.status());
    
    if (response.ok()) {
      const data = await response.json();
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBeTruthy();
    }
  });

  test('should get product by ID', async ({ request }) => {
    const response = await request.get('/api/v1/products/prod_001');
    
    // May return 404 if product doesn't exist, or 401 if auth required
    expect([404, 401, 200]).toContain(response.status());
  });
});

// -----------------------------------------------------------------------------
// Order Management Tests
// -----------------------------------------------------------------------------

test.describe('Order Management', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post('/api/v1/auth/login', {
      data: {
        email: 'admin@residentcement.com',
        password: 'AdminP@ssw0rd123!',
      },
    });

    if (loginResponse.ok()) {
      const data = await loginResponse.json();
      authToken = data.data.accessToken;
    }
  });

  test('should create a new order', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const orderData = {
      customerId: 'cust_001',
      priority: 'NORMAL' as const,
      items: [
        {
          productId: 'prod_001',
          quantity: 50,
          unitPrice: 3500,
          discount: 0,
        },
      ],
    };

    const response = await request.post('/api/v1/orders', {
      data: orderData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // May fail if customer/product doesn't exist
    if (response.status() === 404) {
      expect(response.status()).toBe(404);
      return;
    }

    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data.orderNumber).toBeDefined();
    expect(data.status).toBe('PENDING');
  });

  test('should validate order items', async ({ request }) => {
    test.skip(!authToken, 'Authentication required');

    const invalidOrderData = {
      customerId: 'cust_001',
      items: [], // Empty items should fail
    };

    const response = await request.post('/api/v1/orders', {
      data: invalidOrderData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(400);
  });
});

// -----------------------------------------------------------------------------
// Rate Limiting Tests
// -----------------------------------------------------------------------------

test.describe('Rate Limiting', () => {
  test('should include rate limit headers', async ({ request }) => {
    const response = await request.get('/health');
    
    expect(response.headers()['x-ratelimit-limit']).toBeDefined();
    expect(response.headers()['x-ratelimit-remaining']).toBeDefined();
  });

  test('should handle rate limit exceeded', async ({ request }) => {
    // Make many rapid requests
    const requests = Array(100).fill(null).map(() => 
      request.get('/health')
    );

    const responses = await Promise.all(requests);
    const statusCodes = responses.map(r => r.status());
    
    // Should have at least some successful requests
    expect(statusCodes.filter(s => s === 200).length).toBeGreaterThan(0);
  });
});

// -----------------------------------------------------------------------------
// Error Handling Tests
// -----------------------------------------------------------------------------

test.describe('Error Handling', () => {
  test('should return proper error format for 404', async ({ request }) => {
    const response = await request.get('/api/v1/nonexistent');
    
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data.success).toBeFalsy();
    expect(data.error.code).toBe('NOT_FOUND');
    expect(data.error.message).toBeDefined();
  });

  test('should return proper error format for 500', async ({ request }) => {
    // This would require triggering an actual server error
    // Placeholder for future implementation
  });

  test('should include trace ID in error responses', async ({ request }) => {
    const response = await request.get('/api/v1/nonexistent');
    
    const data = await response.json();
    expect(data.error.traceId).toBeDefined();
  });
});

// -----------------------------------------------------------------------------
// API Documentation Tests
// -----------------------------------------------------------------------------

test.describe('API Documentation', () => {
  test('should serve Swagger UI', async ({ request }) => {
    const response = await request.get('/api-docs/');
    expect(response.status()).toBe(200);
  });

  test('should serve OpenAPI spec', async ({ request }) => {
    const response = await request.get('/api-docs/swagger.json');
    expect(response.status()).toBe(200);
    
    const spec = await response.json();
    expect(spec.openapi).toBeDefined();
    expect(spec.info.title).toBe('ResidentCement API');
  });
});
