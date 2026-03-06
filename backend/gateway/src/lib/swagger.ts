/**
 * Swagger/OpenAPI Configuration for ResidentCement API Gateway
 * 
 * Provides interactive API documentation at /api-docs
 */

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ResidentCement API Gateway',
    version: '1.0.0',
    description: 'Enterprise-grade digital platform for cement distribution management in Nigeria',
    contact: {
      name: 'API Support',
      email: 'support@residentcement.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'https://api.residentcement.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
    },
    schemas: {
      // Customer schemas
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cust_001' },
          name: { type: 'string', example: 'ABC Construction Ltd' },
          email: { type: 'string', format: 'email', example: 'contact@abcconstruction.com' },
          phone: { type: 'string', example: '+2348012345678' },
          tier: { type: 'string', enum: ['STANDARD', 'SILVER', 'GOLD', 'PLATINUM', 'ENTERPRISE'] },
          creditLimit: { type: 'number', example: 5000000 },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      
      // Product schemas
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'prod_001' },
          name: { type: 'string', example: 'Dangote Cement 42.5R' },
          description: { type: 'string' },
          category: { type: 'string', enum: ['ORDINARY_PORTLAND_CEMENT_42_5', 'ORDINARY_PORTLAND_CEMENT_32_5', 'POZZOLANIC_CEMENT'] },
          basePrice: { type: 'number', example: 4500 },
          unit: { type: 'string', example: 'bags' },
          isActive: { type: 'boolean' },
        },
      },
      
      // Order schemas
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'ord_001' },
          customerId: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED'] },
          total: { type: 'number', example: 900000 },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'number', example: 200 },
                unitPrice: { type: 'number', example: 4500 },
                total: { type: 'number', example: 900000 },
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      
      // Payment schemas
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'pay_001' },
          orderId: { type: 'string' },
          amount: { type: 'number', example: 900000 },
          paymentMethod: { type: 'string', enum: ['CARD', 'BANK_TRANSFER', 'USSD'] },
          status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'] },
          reference: { type: 'string', example: 'RC_TXN_123456' },
          paidAt: { type: 'string', format: 'date-time' },
        },
      },
      
      // Inventory schemas
      InventoryItem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'inv_001' },
          productId: { type: 'string' },
          depotId: { type: 'string' },
          quantity: { type: 'number', example: 5000 },
          reservedQuantity: { type: 'number', example: 500 },
          location: { type: 'string', example: 'Lagos Depot' },
          lastUpdated: { type: 'string', format: 'date-time' },
        },
      },
      
      // Quote schemas
      Quote: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'quote_001' },
          customerId: { type: 'string' },
          items: { type: 'array', items: { type: 'object' } },
          subtotal: { type: 'number', example: 900000 },
          discount: { type: 'number', example: 45000 },
          vat: { type: 'number', example: 64125 },
          total: { type: 'number', example: 919125 },
          status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'CONVERTED', 'CANCELLED'] },
          validUntil: { type: 'string', format: 'date-time' },
        },
      },
      
      // Error schemas
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          code: { type: 'string' },
        },
      },
      
      // Health check schemas
      Health: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          service: { type: 'string', example: 'gateway' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'number', example: 3600 },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Authentication', description: 'User authentication and authorization' },
    { name: 'Customers', description: 'Customer management operations' },
    { name: 'Products', description: 'Product catalog management' },
    { name: 'Orders', description: 'Order lifecycle management' },
    { name: 'Inventory', description: 'Inventory and stock management' },
    { name: 'Pricing', description: 'Pricing and quote management' },
    { name: 'Payments', description: 'Payment processing' },
    { name: 'Health', description: 'Health check endpoints' },
  ],
};

// API endpoint documentation
export const apiPaths = {
  // Authentication
  '/api/v1/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'User login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', format: 'password' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful login',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                  user: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  },
  
  // Customers
  '/api/v1/customers': {
    get: {
      tags: ['Customers'],
      summary: 'List customers',
      parameters: [
        { name: 'tier', in: 'query', schema: { type: 'string' } },
        { name: 'status', in: 'query', schema: { type: 'string' } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'limit', in: 'query', schema: { type: 'number', default: 50 } },
        { name: 'offset', in: 'query', schema: { type: 'number', default: 0 } },
      ],
      responses: {
        '200': {
          description: 'List of customers',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: '#/components/schemas/Customer' } },
                  pagination: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  },
  
  // Products
  '/api/v1/products': {
    get: {
      tags: ['Products'],
      summary: 'List products',
      parameters: [
        { name: 'category', in: 'query', schema: { type: 'string' } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'inStock', in: 'query', schema: { type: 'boolean' } },
      ],
      responses: {
        '200': {
          description: 'List of products',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                  pagination: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  },
  
  // Orders
  '/api/v1/orders': {
    get: {
      tags: ['Orders'],
      summary: 'List orders',
      parameters: [
        { name: 'customerId', in: 'query', schema: { type: 'string' } },
        { name: 'status', in: 'query', schema: { type: 'string' } },
        { name: 'limit', in: 'query', schema: { type: 'number', default: 50 } },
      ],
      responses: {
        '200': {
          description: 'List of orders',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                  pagination: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Orders'],
      summary: 'Create new order',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['customerId', 'items'],
              properties: {
                customerId: { type: 'string' },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['productId', 'quantity'],
                    properties: {
                      productId: { type: 'string' },
                      quantity: { type: 'number', minimum: 1 },
                    },
                  },
                },
                deliveryAddress: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Order created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' },
            },
          },
        },
      },
    },
  },
  
  // Inventory
  '/api/v1/inventory': {
    get: {
      tags: ['Inventory'],
      summary: 'List inventory items',
      parameters: [
        { name: 'productId', in: 'query', schema: { type: 'string' } },
        { name: 'depotId', in: 'query', schema: { type: 'string' } },
        { name: 'lowStock', in: 'query', schema: { type: 'boolean' } },
      ],
      responses: {
        '200': {
          description: 'List of inventory items',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: '#/components/schemas/InventoryItem' } },
                  pagination: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  },
  
  // Payments
  '/api/v1/payments/initiate': {
    post: {
      tags: ['Payments'],
      summary: 'Initiate payment',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['orderId', 'amount', 'email'],
              properties: {
                orderId: { type: 'string' },
                amount: { type: 'number' },
                email: { type: 'string', format: 'email' },
                paymentMethod: { type: 'string', enum: ['CARD', 'BANK_TRANSFER', 'USSD'] },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Payment initiated',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Payment' },
            },
          },
        },
      },
    },
  },
  
  // Health
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      responses: {
        '200': {
          description: 'Service is healthy',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Health' },
            },
          },
        },
      },
    },
  },
};
