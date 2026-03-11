# API Surface Map

**Audit Session:** `forensics_20260311_221530`  
**Generated:** 2026-03-11 22:15:30  
**Project:** ResidentCement Digital Ecosystem  

---

## API Overview

| Metric | Value |
|--------|-------|
| **Total Endpoints** | 45+ |
| **Public Endpoints** | 8 |
| **Protected Endpoints** | 37+ |
| **API Version** | v1 |
| **Base Path** | `/api/v1` |

---

## Endpoint Inventory

### Public Endpoints (No Authentication)

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|------------|
| `GET` | `/health` | Basic health check | None |
| `GET` | `/health/ready` | Readiness probe | None |
| `GET` | `/health/live` | Liveness probe | None |
| `GET` | `/health/detailed` | Detailed health | None |
| `GET` | `/api-docs` | Swagger UI | None |
| `POST` | `/api/v1/auth/login` | User login | 20/15min |
| `POST` | `/api/v1/auth/register` | User registration | 20/15min |
| `POST` | `/api/v1/auth/refresh` | Token refresh | 20/15min |

---

### Protected Endpoints (Authentication Required)

#### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `POST` | `/logout` | User logout | Any |
| `GET` | `/me` | Get current user | Any |

#### Customer Routes (`/api/v1/customers`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `GET` | `/` | List customers | ADMIN, STAFF |
| `POST` | `/` | Create customer | ADMIN, STAFF |
| `GET` | `/:id` | Get customer by ID | ADMIN, STAFF |
| `PUT` | `/:id` | Update customer | ADMIN, STAFF |
| `DELETE` | `/:id` | Delete customer | ADMIN |
| `GET` | `/:id/orders` | Get customer orders | ADMIN, STAFF |
| `GET` | `/:id/addresses` | Get customer addresses | ADMIN, STAFF |
| `POST` | `/:id/addresses` | Add customer address | ADMIN, STAFF |

#### Order Routes (`/api/v1/orders`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `GET` | `/` | List orders | ADMIN, STAFF |
| `POST` | `/` | Create order | DISTRIBUTOR, ADMIN, STAFF |
| `GET` | `/:id` | Get order by ID | ADMIN, STAFF, DISTRIBUTOR (own) |
| `PUT` | `/:id` | Update order | ADMIN, STAFF |
| `DELETE` | `/:id` | Cancel order | ADMIN, STAFF, DISTRIBUTOR (own) |
| `POST` | `/:id/confirm` | Confirm order | ADMIN, STAFF |
| `POST` | `/:id/ship` | Ship order | ADMIN, STAFF |

#### Product Routes (`/api/v1/products`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `GET` | `/` | List products | Any |
| `POST` | `/` | Create product | ADMIN, STAFF |
| `GET` | `/:id` | Get product by ID | Any |
| `PUT` | `/:id` | Update product | ADMIN, STAFF |
| `DELETE` | `/:id` | Delete product | ADMIN |
| `GET` | `/sku/:sku` | Get product by SKU | Any |
| `GET` | `/category/:category` | Get products by category | Any |

#### Inventory Routes (`/api/v1/inventory`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `GET` | `/` | List inventory | ADMIN, STAFF |
| `GET` | `/warehouse/:warehouseId` | Get warehouse inventory | ADMIN, STAFF |
| `GET` | `/product/:productId` | Get product inventory | ADMIN, STAFF |
| `POST` | `/adjust` | Adjust inventory | ADMIN, STAFF |
| `POST` | `/transfer` | Transfer stock | ADMIN, STAFF |
| `GET` | `/low-stock` | Get low stock items | ADMIN, STAFF |

#### Pricing Routes (`/api/v1/pricing`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `GET` | `/rules` | List pricing rules | ADMIN, STAFF |
| `POST` | `/rules` | Create pricing rule | ADMIN |
| `GET` | `/rules/:id` | Get pricing rule | ADMIN, STAFF |
| `PUT` | `/rules/:id` | Update pricing rule | ADMIN |
| `DELETE` | `/rules/:id` | Delete pricing rule | ADMIN |
| `POST` | `/calculate` | Calculate price | Any |

#### Quote Routes (`/api/v1/quotes`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `GET` | `/` | List quotes | ADMIN, STAFF, DISTRIBUTOR (own) |
| `POST` | `/` | Create quote | DISTRIBUTOR, ADMIN, STAFF |
| `GET` | `/:id` | Get quote by ID | ADMIN, STAFF, DISTRIBUTOR (own) |
| `PUT` | `/:id` | Update quote | ADMIN, STAFF |
| `DELETE` | `/:id` | Reject quote | DISTRIBUTOR (own), ADMIN |
| `POST` | `/:id/convert` | Convert to order | DISTRIBUTOR (own) |

#### Payment Routes (`/api/v1/payments`)

| Method | Endpoint | Purpose | Role Required |
|--------|----------|---------|---------------|
| `GET` | `/` | List payments | ADMIN, STAFF, DISTRIBUTOR (own) |
| `POST` | `/` | Create payment | DISTRIBUTOR, ADMIN, STAFF |
| `GET` | `/:id` | Get payment by ID | ADMIN, STAFF, DISTRIBUTOR (own) |
| `POST` | `/:id/refund` | Refund payment | ADMIN, STAFF |
| `GET` | `/order/:orderId` | Get order payments | ADMIN, STAFF, DISTRIBUTOR (own) |
| `POST` | `/webhook/paystack` | Paystack webhook | None (signature verified) |

---

## Internal Routes (Not Exposed)

| Route | Service | Purpose |
|-------|---------|---------|
| `/internal/health` | All services | Internal health checks |
| `/internal/metrics` | All services | Prometheus metrics |
| `/kafka/publish` | Event service | Internal event publishing |
| `/kafka/subscribe` | Event service | Internal event subscription |

---

## API Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Gateway   │     │  Keycloak   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │  1. Login         │                    │
       │──────────────────>│                    │
       │                   │  2. Authenticate   │
       │                   │───────────────────>│
       │                   │                    │
       │                   │  3. JWT Token      │
       │                   │<───────────────────│
       │  4. Token         │                    │
       │<──────────────────│                    │
       │                   │                    │
       │  5. API Request   │                    │
       │  (with JWT)       │                    │
       │──────────────────>│                    │
       │                   │  6. Verify JWT     │
       │                   │───────────────────>│
       │                   │                    │
       │                   │  7. Valid          │
       │                   │<───────────────────│
       │                   │                    │
       │  8. Response      │                    │
       │<──────────────────│                    │
       │                   │                    │
```

---

## Rate Limiting Configuration

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| General API | 1000 requests | 15 minutes |
| Authentication | 20 requests | 15 minutes |
| Health Checks | Unlimited | - |
| Webhooks | Unlimited | - |

**Headers:**
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

---

## Request/Response Examples

### Login Request
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Login Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJSUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "DISTRIBUTOR"
    }
  }
}
```

### Create Order Request
```http
POST /api/v1/orders
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "customerId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 100
    }
  ],
  "shippingAddress": "123 Main St"
}
```

---

## API Versioning Strategy

**Current Version:** v1  
**Version Format:** URL path (`/api/v1/`)

**Deprecation Policy:**
- 6 months notice before deprecation
- 12 months support after deprecation
- Sunset header in responses

---

## CORS Configuration

| Environment | Allowed Origins |
|-------------|-----------------|
| Development | `http://localhost:3000`, `http://localhost:8180` |
| Production | `https://app.residentcement.com`, `https://admin.residentcement.com` |

**Credentials:** Enabled  
**Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS  
**Headers:** Content-Type, Authorization, x-request-id

---

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Invalid email format"]
    },
    "traceId": "req_abc123",
    "timestamp": "2026-03-11T22:15:30.000Z"
  }
}
```

---

**END OF REPORT**
