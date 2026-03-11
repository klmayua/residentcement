# System Architecture Map

**Audit Session:** `forensics_20260311_221530`  
**Generated:** 2026-03-11 22:15:30  
**Project:** ResidentCement Digital Ecosystem  

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RESIDENTCEMENT ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │   Internet   │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │   Kong/API   │
                                    │   Gateway    │
                                    └──────┬───────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
           ┌────────▼────────┐   ┌────────▼────────┐   ┌────────▼────────┐
           │  Distributor    │   │    Admin        │   │   External      │
           │  Portal         │   │    Dashboard    │   │   Services      │
           │  (Next.js)      │   │    (Next.js)    │   │   (Paystack,    │
           └────────┬────────┘   └────────┬────────┘   │    Flutterwave) │
                    │                     │            └────────┬────────┘
                    └─────────────────────┼─────────────────────┘
                                          │
                              ┌───────────▼───────────┐
                              │   API Gateway         │
                              │   (Express.js)        │
                              │   Port: 3001          │
                              └───────────┬───────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
    ┌─────────▼─────────┐       ┌────────▼────────┐       ┌─────────▼─────────┐
    │   Auth Routes     │       │  Business       │       │   Health &        │
    │   /api/v1/auth    │       │  Routes         │       │   System          │
    │                   │       │  /api/v1/*      │       │   /health         │
    └─────────┬─────────┘       └────────┬────────┘       └───────────────────┘
              │                          │
              │              ┌───────────┴───────────┐
              │              │                       │
              │    ┌─────────▼──────────┐  ┌────────▼──────────┐
              │    │  Shared Kernel     │  │  Microservices    │
              │    │  (kernel)          │  │  (via Kafka)      │
              │    │  - Logger          │  │  - customer-svc   │
              │    │  - Auth            │  │  - order-svc      │
              │    │  - Middleware      │  │  - product-svc    │
              │    │  - Error Handler   │  │  - inventory-svc  │
              │    └────────────────────┘  │  - payment-svc    │
              │                            │  - pricing-svc    │
              │                            └─────────┬─────────┘
              │                                      │
    ┌─────────▼──────────────────────────────────────▼────────┐
    │                    KAFKA EVENT BUS                       │
    │                   (Event-Driven Comm)                    │
    └─────────┬──────────────────────────────────────┬────────┘
              │                                      │
    ┌─────────▼──────────┐                 ┌────────▼──────────┐
    │  PostgreSQL        │                 │  MongoDB           │
    │  (Primary DB)      │                 │  (Documents)       │
    │  Schemas: 7        │                 │  Audit logs, etc.  │
    └─────────┬──────────┘                 └───────────────────┘
              │
    ┌─────────▼──────────┐
    │  Redis             │
    │  (Cache/Sessions)  │
    └────────────────────┘
```

---

## Component Architecture

### 1. API Gateway Layer

**Technology:** Express.js + TypeScript  
**Port:** 3001  
**Location:** `backend/gateway/`

**Responsibilities:**
- Request routing
- Authentication/Authorization (JWT)
- Rate limiting
- Request tracing (X-Request-ID)
- CORS handling
- Input validation
- Response formatting

**Middleware Stack:**
```
Request → Helmet (security headers)
       → CORS
       → Request ID
       → Request Logging
       → Body Parser
       → Rate Limiter
       → Auth (protected routes)
       → Route Handler
       → Error Handler
```

**Route Structure:**
| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/health` | Health checks | No |
| `/api-docs` | Swagger UI | No |
| `/api/v1/auth` | Authentication | No (stricter rate limit) |
| `/api/v1/customers` | Customer CRUD | Yes |
| `/api/v1/orders` | Order management | Yes |
| `/api/v1/products` | Product catalog | Yes |
| `/api/v1/inventory` | Inventory mgmt | Yes |
| `/api/v1/pricing` | Pricing rules | Yes |
| `/api/v1/quotes` | Quote generation | Yes |
| `/api/v1/payments` | Payment processing | Yes |

---

### 2. Shared Kernel Library

**Location:** `backend/shared/kernel/`  
**Type:** TypeScript library (compiled to `dist/`)

**Exports:**
```typescript
- createLogger()      // Winston-based structured logging
- requestLoggingMiddleware
- errorHandler        // Global error handler
- requestIdMiddleware // X-Request-ID injection
- corsMiddleware      // CORS configuration
- securityHeadersMiddleware
- authenticateToken   // JWT verification
```

**Usage Pattern:**
```typescript
import { createLogger, errorHandler } from "@resident-cement/kernel";
```

---

### 3. Microservices Architecture

**Communication Pattern:** Event-driven via Kafka

**Services:**
| Service | Domain | Kafka Topics | Database Schema |
|---------|--------|--------------|-----------------|
| `customer-service` | Customer management | `customer.created`, `customer.updated` | `customer` |
| `order-service` | Order lifecycle | `order.created`, `order.status_changed` | `order` |
| `product-service` | Product catalog | `product.created`, `product.price_changed` | `product` |
| `inventory-service` | Stock management | `inventory.updated`, `stock.low` | `inventory` |
| `payment-service` | Payment processing | `payment.completed`, `payment.failed` | `payment` |
| `pricing-service` | Pricing engine | `pricing.rule_changed` | `pricing` |

**Event Flow Example:**
```
1. Customer places order → order.created event
2. Inventory service consumes → reserves stock
3. Payment service consumes → processes payment
4. Order service updates status → order.status_changed
```

---

### 4. Data Layer

#### PostgreSQL (Primary Database)

**Connection:** `postgresql://resident_cement:***@postgres:5432/resident_cement`  
**Schemas:** `public`, `customer`, `order`, `product`, `inventory`, `payment`, `pricing`

**Entity Relationship Summary:**
```
User ──┬── Customer ──┬── Order ──┬── OrderItem ── Product
       │              │           │
       │              │           └── Payment
       │              │
       │              └── Quote ──┬── QuoteItem
       │                          │
       │                          └── Payment
       │
       └── Session
       └── AuditLog
```

**Key Models:**
- `User` - System users with roles
- `Customer` - B2B distributors
- `Product` - Cement/products catalog
- `Order` - Order lifecycle
- `Payment` - Payment tracking
- `PricingRule` - Dynamic pricing engine

#### MongoDB (Document Store)

**Connection:** `mongodb://resident_cement:***@mongodb:27017/resident_cement`

**Use Cases:**
- Audit logs (high volume)
- System configurations
- Event archives
- Unstructured metadata

#### Redis (Cache Layer)

**Connection:** `redis://redis:6379`

**Use Cases:**
- Session storage
- Rate limit counters
- API response caching
- Distributed locks

---

### 5. Event Bus (Kafka)

**Broker:** `kafka:29092` (internal), `localhost:9092` (external)  
**Zookeeper:** `zookeeper:2181`

**Known Topics:**
| Topic | Producer | Consumer |
|-------|----------|----------|
| `customer.created` | customer-service | order-service, pricing-service |
| `customer.updated` | customer-service | multiple |
| `order.created` | order-service | inventory-service, payment-service |
| `order.status_changed` | order-service | customer-service, analytics |
| `payment.completed` | payment-service | order-service, customer-service |
| `payment.failed` | payment-service | order-service, notification-service |
| `inventory.updated` | inventory-service | order-service |
| `stock.low` | inventory-service | notification-service, order-service |
| `pricing.rule_changed` | pricing-service | order-service, product-service |

---

### 6. Identity & Access Management

**Provider:** Keycloak 23.0  
**URL:** `http://localhost:8180`

**Authentication Flow:**
```
1. User → Keycloak (login)
2. Keycloak → JWT token
3. User → API Gateway (with JWT)
4. Gateway → validates JWT (via kernel middleware)
5. Gateway → extracts user context
6. Request → microservice (with user context)
```

**User Roles:**
- `ADMIN` - Full system access
- `STAFF` - Operational access
- `DISTRIBUTOR` - B2B customer access
- `SALES_REP` - Sales team access
- `VIEWER` - Read-only access

---

### 7. Frontend Architecture

#### Distributor Portal

**Framework:** Next.js (React)  
**Location:** `frontend/apps/distributor-portal/`

**Features:**
- Product catalog browsing
- Quote requests
- Order placement
- Order tracking
- Payment history
- Account management

#### Admin Dashboard

**Location:** `frontend/apps/admin-dashboard/`

**Features:**
- Customer management
- Order approval/rejection
- Inventory oversight
- Pricing rule management
- Reporting/analytics

---

### 8. Infrastructure Services

| Service | Purpose | Port | Critical |
|---------|---------|------|----------|
| PostgreSQL | Primary database | 5432 | Yes |
| MongoDB | Document store | 27017 | No |
| Redis | Cache/sessions | 6379 | Yes |
| Kafka | Event bus | 9092 | Yes |
| Zookeeper | Kafka coordination | 2181 | Yes |
| Keycloak | Identity provider | 8180 | Yes |
| MinIO | Object storage | 9000/9002 | No |
| Kafka UI | Kafka management | 8085 | No |

---

## Deployment Architecture

### Docker Compose (Development/Staging)

**Network:** `resident-cement-network` (bridge)

**Container Layout:**
```
resident-cement-network
├── residentcement (app)
├── postgres
├── mongodb
├── redis
├── kafka
├── zookeeper
├── kafka-ui
├── keycloak
└── minio
```

### Kubernetes (Production)

**Namespace:** `resident-cement`

**Workloads:**
- Deployment: API Gateway
- Deployment: Frontend (Next.js)
- Deployment: Microservices (scaled independently)
- StatefulSet: PostgreSQL
- StatefulSet: MongoDB
- StatefulSet: Kafka/Zookeeper
- Deployment: Redis
- Deployment: Keycloak

**Ingress:**
- `/api/*` → API Gateway
- `/` → Frontend (Next.js)
- `/auth/*` → Keycloak

---

## Security Architecture

### Defense in Depth Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Network Security              │
│  - Kong API Gateway                     │
│  - Network policies (K8s)               │
└─────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 2: Application Security          │
│  - Helmet (security headers)            │
│  - CORS restrictions                    │
│  - Rate limiting                        │
└─────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 3: Authentication                │
│  - Keycloak (OIDC)                      │
│  - JWT validation                       │
│  - Role-based access control            │
└─────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 4: Input Validation              │
│  - Zod schema validation                │
│  - Input sanitizer middleware           │
│  - SQL injection prevention (Prisma)    │
└─────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 5: Data Security                 │
│  - Encrypted connections (TLS)          │
│  - Password hashing (bcrypt)            │
│  - Secrets management (.env, K8s)       │
└─────────────────────────────────────────┘
```

---

## Runtime Assumptions

| Assumption | Validation |
|------------|------------|
| Node.js 20+ required | Confirmed in Dockerfile |
| PostgreSQL 16 compatible | Confirmed in schema.prisma |
| Kafka topics auto-created | `KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"` |
| Shared kernel built before services | `npm run build:kernel` in CI |
| Environment variables loaded | `dotenv` in gateway |
| Non-root container user | `USER nodejs` in Dockerfile |

---

## Known Integration Points

| Integration | Type | Purpose |
|-------------|------|---------|
| Keycloak | OIDC | Authentication |
| Paystack | Payment API | Payment processing |
| Flutterwave | Payment API | Payment processing |
| MinIO | S3-compatible | Object storage |
| Kafka | Message broker | Event-driven communication |

---

**END OF REPORT**
