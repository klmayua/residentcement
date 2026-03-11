# Project Structure Map

**Audit Session:** `forensics_20260311_221530`  
**Generated:** 2026-03-11 22:15:30  
**Project:** ResidentCement Digital Ecosystem  
**Version:** 2030.1.0  

---

## Executive Overview

ResidentCement is a **microservices-based digital ecosystem** for cement/construction material distribution. The architecture follows a **gateway pattern** with multiple backend services communicating via Kafka event bus.

---

## Root Directory Structure

```
ResidentCement/
├── backend/                    # Backend services and gateway
│   ├── gateway/               # API Gateway (central entry point)
│   ├── services/              # Microservices (7 services)
│   └── shared/                # Shared libraries
│       ├── kernel/            # Core logging, security, middleware
│       └── kafka-client/      # Kafka client library
├── frontend/
│   └── apps/
│       ├── admin-dashboard/   # Internal admin interface
│       └── distributor-portal/ # External distributor interface
├── infrastructure/
│   ├── docker/                # Docker Compose configurations
│   └── k8s/                   # Kubernetes manifests
├── middleware/                # Python middleware utilities
├── .github/
│   └── workflows/             # CI/CD pipelines
├── tests/                     # Test suites
├── scripts/                   # Build and deployment scripts
├── docs/                      # Documentation
└── reports/                   # Generated reports
```

---

## Backend Architecture

### API Gateway (`backend/gateway/`)

**Role:** Central entry point for all API requests

**Key Files:**
- `src/index.ts` - Main Express application
- `src/routes/` - Route handlers (auth, customer, order, product, inventory, pricing, payment)
- `src/middleware/` - Custom middleware
- `src/lib/` - Utilities (Swagger, config)
- `prisma/schema.prisma` - Database schema (7 schemas)
- `Dockerfile` - Container build instructions

**Dependencies:**
- Express.js, Prisma, KafkaJS, Redis (ioredis)
- JWT authentication (jose, jsonwebtoken)
- Security: helmet, cors, express-rate-limit
- Documentation: swagger-ui-express

### Microservices (`backend/services/`)

| Service | Purpose | Port | Schema |
|---------|---------|------|--------|
| `customer-service` | Customer management | - | `customer` |
| `order-service` | Order processing | - | `order` |
| `product-service` | Product catalog | - | `product` |
| `inventory-service` | Inventory/Warehouse | - | `inventory` |
| `payment-service` | Payment processing | - | `payment` |
| `pricing-service` | Pricing rules engine | - | `pricing` |
| `events` | Event handlers | - | - |

**Pattern:** Each service has isolated database schema but shares Prisma models via gateway.

### Shared Kernel (`backend/shared/kernel/`)

**Purpose:** Cross-cutting concerns library

**Exports:**
- Logger (Winston-based)
- Authentication middleware
- Request tracing
- Error handlers
- CORS utilities
- Security headers

---

## Frontend Applications

### Distributor Portal (`frontend/apps/distributor-portal/`)

- **Framework:** Next.js (React)
- **Purpose:** B2B distributor self-service portal
- **Features:** Order placement, quote requests, payment tracking

### Admin Dashboard (`frontend/apps/admin-dashboard/`)

- **Purpose:** Internal staff administration
- **Features:** Customer management, order approval, reporting

---

## Infrastructure

### Docker Compose (`infrastructure/docker/`)

**Services Defined:**
| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `residentcement` | Custom | 8080→3001 | Main application |
| `postgres` | postgres:16-alpine | 5432 | Primary RDBMS |
| `mongodb` | mongo:7.0 | 27017 | Document store |
| `redis` | redis:7-alpine | 6379 | Cache/sessions |
| `kafka` | confluentinc/cp-kafka:7.5.0 | 9092 | Event bus |
| `zookeeper` | confluentinc/cp-zookeeper:7.5.0 | 2181 | Kafka coordination |
| `kafka-ui` | provectuslabs/kafka-ui | 8085 | Kafka management UI |
| `keycloak` | quay.io/keycloak:23.0 | 8180 | Identity provider |
| `minio` | minio/minio:latest | 9000/9002 | S3-compatible storage |

### Kubernetes (`infrastructure/k8s/`)

- Namespace definitions
- Deployment manifests
- Service configurations
- Ingress rules

---

## CI/CD Pipeline (`.github/workflows/`)

### `ci-cd.yml` - Full Pipeline

**Jobs:**
1. **Lint** - ESLint, Prettier, TypeScript type check
2. **Test Unit** - Jest unit tests with coverage
3. **Test Integration** - Integration tests (requires all services)
4. **Test E2E** - Playwright end-to-end tests
5. **Build** - Docker image build and push to GHCR
6. **Deploy Staging** - Kubernetes deployment (develop branch)
7. **Deploy Production** - Kubernetes deployment (main branch)

**Triggers:**
- Push to `main`, `develop`, `feature/*`, `release/*`
- Pull requests
- Manual workflow dispatch

---

## Middleware Layer

### Python Middleware (`middleware/`)

- `input_sanitizer.py` - Input validation/sanitization decorator
- Addresses forensic audit finding: Input Validation

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Runtime environment variables |
| `.env.example` | Template for environment setup |
| `package.json` | Root package configuration |
| `tsconfig.json` | TypeScript configuration |
| `.eslintrc.json` | ESLint rules |
| `.prettierrc` | Code formatting rules |
| `docker-compose.yml` | Container orchestration |
| `Dockerfile.simple` | Production container build |

---

## Database Schema Summary

**Schemas:** `public`, `customer`, `order`, `product`, `inventory`, `payment`, `pricing`

**Core Entities:**
- `User`, `Session` - Authentication
- `Customer`, `CustomerAddress` - Customer management
- `Product`, `Inventory`, `Warehouse`, `StockMovement` - Product/inventory
- `Order`, `OrderItem` - Order processing
- `Quote`, `QuoteItem` - Quotation system
- `Payment` - Payment tracking
- `PricingRule` - Dynamic pricing engine
- `AuditLog`, `SystemConfig` - System utilities

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Language | TypeScript 5.3 |
| Framework | Express.js 4.18 |
| ORM | Prisma 5.9 |
| Database | PostgreSQL 16 |
| Document Store | MongoDB 7.0 |
| Cache | Redis 7 |
| Message Bus | Kafka 7.5 |
| Auth | Keycloak 23.0, JWT |
| Frontend | Next.js (React) |
| Container | Docker, Kubernetes |
| Object Storage | MinIO |

---

## File Count Summary

| Category | Count |
|----------|-------|
| Backend Services | 7 |
| API Routes | 9 |
| Database Models | 20+ |
| Docker Services | 9 |
| CI/CD Jobs | 7 |
| Frontend Apps | 2 |

---

**END OF REPORT**
