/**
 * OpenAPI/Swagger Documentation for ResidentCement API
 * 
 * Comprehensive API documentation following OpenAPI 3.0 specification
 */

type OpenAPIV3Document = {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact?: { name?: string; email?: string; url?: string };
    license?: { name: string; url?: string };
    termsOfService?: string;
  };
  servers?: { url: string; description?: string }[];
  tags?: { name: string; description?: string }[];
  paths?: Record<string, any>;
  components?: Record<string, any>;
  security?: Record<string, any>[];
};

export const swaggerDefinition: OpenAPIV3Document = {
  openapi: '3.0.3',
  info: {
    title: 'ResidentCement API',
    description: `
## ResidentCement Digital Ecosystem API

Enterprise-grade API for cement distribution management in Nigeria.

### Features

- **Customer Management**: Complete CRM for distributor relationships
- **Order Processing**: End-to-end order lifecycle management
- **Inventory Management**: Real-time stock tracking across warehouses
- **Pricing Engine**: Dynamic pricing with tier-based discounts
- **Payment Integration**: Multiple payment methods including USSD
- **Analytics & Reporting**: Business intelligence and insights

### Authentication

All API endpoints (except health checks and documentation) require authentication.

**Authentication Methods:**

1. **Bearer Token (JWT)**
   \`\`\`
   Authorization: Bearer <your_jwt_token>
   \`\`\`

2. **OAuth 2.0 via Keycloak**
   - Authorization Code Flow for web applications
   - Client Credentials Flow for service-to-service

### Rate Limiting

- **General API**: 1000 requests per 15 minutes
- **Authentication**: 20 requests per 15 minutes
- **Health Checks**: No limit

Rate limit headers are included in all responses:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Requests remaining
- \`X-RateLimit-Reset\`: Unix timestamp when limit resets

### Response Format

All responses follow a consistent format:

\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-03-07T12:00:00.000Z"
  }
}
\`\`\`

### Error Handling

Errors follow a standard format:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Invalid email format"]
    },
    "traceId": "req_abc123"
  }
}
\`\`\`

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| BAD_REQUEST | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| VALIDATION_ERROR | 400 | Validation failed |
| TOO_MANY_REQUESTS | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Server error |
    `,
    version: '1.0.0',
    contact: {
      name: 'ResidentCement API Support',
      email: 'api-support@residentcement.com',
    },
    license: {
      name: 'Proprietary',
    },
    termsOfService: 'https://residentcement.com/terms',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'https://api-staging.residentcement.com',
      description: 'Staging server',
    },
    {
      url: 'https://api.residentcement.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check and monitoring endpoints',
    },
    {
      name: 'Authentication',
      description: 'User authentication and authorization',
    },
    {
      name: 'Customers',
      description: 'Customer management operations',
    },
    {
      name: 'Orders',
      description: 'Order processing and management',
    },
    {
      name: 'Products',
      description: 'Product catalog management',
    },
    {
      name: 'Inventory',
      description: 'Inventory tracking and management',
    },
    {
      name: 'Pricing',
      description: 'Pricing rules and quote generation',
    },
    {
      name: 'Payments',
      description: 'Payment processing and history',
    },
    {
      name: 'Analytics',
      description: 'Business intelligence and reporting',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token authentication',
      },
      oauth2: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'http://localhost:8180/realms/resident-cement/protocol/openid-connect/auth',
            tokenUrl: 'http://localhost:8180/realms/resident-cement/protocol/openid-connect/token',
            scopes: {
              'profile': 'User profile information',
              'email': 'User email address',
              'api:read': 'Read access to API resources',
              'api:write': 'Write access to API resources',
              'api:admin': 'Administrative access',
            },
          },
          clientCredentials: {
            tokenUrl: 'http://localhost:8180/realms/resident-cement/protocol/openid-connect/token',
            scopes: {
              'api:read': 'Read access to API resources',
              'api:write': 'Write access to API resources',
            },
          },
        },
      },
    },
    schemas: {
      // Common Schemas
      Id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
      DateTime: {
        type: 'string',
        format: 'date-time',
        description: 'ISO 8601 date-time string',
        example: '2026-03-07T12:00:00.000Z',
      },
      
      // Response Schemas
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object', nullable: true },
          meta: {
            type: 'object',
            properties: {
              requestId: { type: 'string', format: 'uuid' },
              timestamp: { type: 'string', format: 'date-time' },
              duration: { type: 'number', description: 'Response time in ms' },
            },
          },
        },
      },
      
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Invalid input data' },
              details: { 
                type: 'object',
                additionalProperties: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
              traceId: { type: 'string', format: 'uuid' },
            },
          },
        },
      },
      
      // Customer Schemas
      Customer: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/schemas/Id' },
          name: { type: 'string', example: 'Dangote Cement Distributors Ltd' },
          email: { type: 'string', format: 'email', example: 'contact@dangotedistributors.com' },
          phone: { type: 'string', example: '+234-800-123-4567' },
          address: { type: 'string', example: '1 Industrial Avenue, Lagos' },
          city: { type: 'string', example: 'Lagos' },
          state: { type: 'string', example: 'Lagos State' },
          lga: { type: 'string', example: 'Ikeja' },
          tier: { 
            type: 'string', 
            enum: ['STANDARD', 'SILVER', 'GOLD', 'PLATINUM', 'ENTERPRISE'],
            example: 'GOLD',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PROSPECT'],
            example: 'ACTIVE',
          },
          creditLimit: { type: 'number', example: 5000000 },
          contactPerson: { type: 'string', example: 'John Doe' },
          createdAt: { $ref: '#/components/schemas/DateTime' },
          updatedAt: { $ref: '#/components/schemas/DateTime' },
        },
      },
      
      // Order Schemas
      Order: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/schemas/Id' },
          orderNumber: { type: 'string', example: 'ORD-2026-001234' },
          customerId: { $ref: '#/components/schemas/Id' },
          status: {
            type: 'string',
            enum: [
              'DRAFT', 'PENDING', 'CONFIRMED', 'PROCESSING',
              'IN_PRODUCTION', 'READY_FOR_SHIPMENT', 'IN_TRANSIT',
              'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED',
            ],
            example: 'PENDING',
          },
          priority: {
            type: 'string',
            enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
            example: 'NORMAL',
          },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
          subtotal: { type: 'number', example: 1000000 },
          tax: { type: 'number', example: 75000 },
          discount: { type: 'number', example: 50000 },
          total: { type: 'number', example: 1025000 },
          currency: { type: 'string', example: 'NGN' },
          deliveryDate: { $ref: '#/components/schemas/DateTime' },
          createdAt: { $ref: '#/components/schemas/DateTime' },
        },
      },
      
      OrderItem: {
        type: 'object',
        properties: {
          productId: { $ref: '#/components/schemas/Id' },
          productName: { type: 'string', example: 'Dangote Cement 50kg' },
          quantity: { type: 'number', example: 100 },
          unitPrice: { type: 'number', example: 3500 },
          discount: { type: 'number', example: 0 },
          total: { type: 'number', example: 350000 },
        },
      },
      
      // Product Schemas
      Product: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/schemas/Id' },
          name: { type: 'string', example: 'Dangote Cement 50kg' },
          sku: { type: 'string', example: 'DANG-CEM-50KG' },
          description: { type: 'string', example: 'High-quality Portland cement' },
          category: {
            type: 'string',
            enum: ['CEMENT', 'CONCRETE', 'AGGREGATE', 'ADDITIVE', 'EQUIPMENT'],
            example: 'CEMENT',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK'],
            example: 'ACTIVE',
          },
          basePrice: { type: 'number', example: 3500 },
          unitOfMeasure: { type: 'string', example: 'bag' },
          weight: { type: 'number', example: 50, description: 'Weight in kg' },
        },
      },
      
      // Payment Schemas
      Payment: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/schemas/Id' },
          paymentReference: { type: 'string', example: 'PAY-2026-ABC123' },
          orderId: { $ref: '#/components/schemas/Id', nullable: true },
          customerId: { $ref: '#/components/schemas/Id' },
          amount: { type: 'number', example: 1025000 },
          currency: { type: 'string', example: 'NGN' },
          method: {
            type: 'string',
            enum: ['CARD', 'BANK_TRANSFER', 'USSD', 'CASH', 'CHEQUE', 'CREDIT'],
            example: 'CARD',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'],
            example: 'COMPLETED',
          },
          paidAt: { $ref: '#/components/schemas/DateTime', nullable: true },
          createdAt: { $ref: '#/components/schemas/DateTime' },
        },
      },
      
      // Pagination
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 50 },
          total: { type: 'number', example: 250 },
          totalPages: { type: 'number', example: 5 },
          hasMore: { type: 'boolean', example: true },
        },
      },
      
      // Health Check
      HealthStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['healthy', 'degraded', 'unhealthy'],
            example: 'healthy',
          },
          service: { type: 'string', example: 'api-gateway' },
          version: { type: 'string', example: '1.0.0' },
          timestamp: { $ref: '#/components/schemas/DateTime' },
          uptime: { type: 'number', example: 86400.5 },
        },
      },
    },
    
    parameters: {
      // Common Parameters
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'Resource identifier',
      },
      PageParam: {
        name: 'page',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1, default: 1 },
        description: 'Page number',
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
        description: 'Items per page',
      },
      SortByParam: {
        name: 'sortBy',
        in: 'query',
        required: false,
        schema: { type: 'string', default: 'createdAt' },
        description: 'Field to sort by',
      },
      SortOrderParam: {
        name: 'sortOrder',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        description: 'Sort order',
      },
    },
    
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      Unauthorized: {
        description: 'Authentication required',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
      ServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
          },
        },
      },
    },
  },
  
  security: [{ bearerAuth: [] }],
};

// API Paths - will be populated with actual route definitions
export const apiPaths: Record<string, any> = {
  // Health endpoints
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Basic health check',
      description: 'Returns basic health status of the API gateway',
      security: [],
      responses: {
        200: {
          description: 'Service is healthy',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/HealthStatus' },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  '/health/ready': {
    get: {
      tags: ['Health'],
      summary: 'Readiness probe',
      description: 'Checks if the service is ready to accept traffic',
      security: [],
      responses: {
        200: {
          description: 'Service is ready',
        },
        503: {
          description: 'Service is not ready',
        },
      },
    },
  },
  '/health/live': {
    get: {
      tags: ['Health'],
      summary: 'Liveness probe',
      description: 'Checks if the service is alive',
      security: [],
      responses: {
        200: {
          description: 'Service is alive',
        },
      },
    },
  },
  
  // Authentication endpoints
  '/api/v1/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'User login',
      description: 'Authenticate user and receive access tokens',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
                rememberMe: { type: 'boolean', default: false },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          accessToken: { type: 'string' },
                          refreshToken: { type: 'string' },
                          expiresIn: { type: 'number' },
                          user: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              email: { type: 'string' },
                              name: { type: 'string' },
                              role: { type: 'string' },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
        },
      },
    },
  },
  '/api/v1/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'User registration',
      description: 'Register a new user account',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password', 'name'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
                name: { type: 'string' },
                phone: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
        },
        400: {
          description: 'Invalid input',
        },
        409: {
          description: 'Email already exists',
        },
      },
    },
  },
  '/api/v1/auth/refresh': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description: 'Get new access token using refresh token',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: {
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Token refreshed successfully',
        },
        401: {
          description: 'Invalid refresh token',
        },
      },
    },
  },
};
