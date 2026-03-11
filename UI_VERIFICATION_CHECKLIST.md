# ResidentCement Platform Verification Checklist
## Stop Gates for UI Preview

---

## GATE 0: Prerequisites Check

| # | Task | Command | Expected Result | Status |
|---|------|---------|-----------------|--------|
| 0.1 | Check Docker running | `docker ps` | Lists running containers | [ ] |
| 0.2 | Check Node.js version | `node -v` | v20+ | [ ] |
| 0.3 | Check npm version | `npm -v` | v10+ | [ ] |

---

## GATE 1: Infrastructure Services

| # | Task | Command | Expected Result | Status |
|---|------|---------|-----------------|--------|
| 1.1 | PostgreSQL | `docker ps \| grep postgres` | Running on :5432 | [ ] |
| 1.2 | MongoDB | `docker ps \| grep mongo` | Running on :27017 | [ ] |
| 1.3 | Redis | `docker ps \| grep redis` | Running on :6379 | [ ] |
| 1.4 | Kafka | `docker ps \| grep kafka` | Running on :9092 | [ ] |
| 1.5 | Keycloak | `docker ps \| grep keycloak` | Running on :8180 | [ ] |
| 1.6 | MinIO | `docker ps \| grep minio` | Running on :9000 | [ ] |

**STOP GATE 1**: All 6 infra services must be running before proceeding.

---

## GATE 2: Backend Dependencies

| # | Task | Command | Expected | Status |
|---|------|---------|----------|--------|
| 2.1 | Install root deps | `npm install` | node_modules created | [ ] |
| 2.2 | Install kernel deps | `cd backend/shared/kernel && npm install` | node_modules created | [ ] |
| 2.3 | Install gateway deps | `cd backend/gateway && npm install` | node_modules created | [ ] |
| 2.4 | Install frontend deps | `cd frontend/apps/distributor-portal && npm install` | node_modules created | [ ] |

**STOP GATE 2**: All npm dependencies installed.

---

## GATE 3: Database Setup

| # | Task | Command | Expected | Status |
|---|------|---------|----------|--------|
| 3.1 | Run migrations | `npm run db:migrate` | Tables created | [ ] |
| 3.2 | Seed database | `npm run db:seed` | Sample data loaded | [ ] |

**STOP GATE 3**: Database ready with schema and data.

---

## GATE 4: Backend Services Startup

| # | Service | Command | Port | Health Check | Status |
|---|---------|---------|------|--------------|--------|
| 4.1 | API Gateway | `cd backend/gateway && npm run dev` | 3001 | http://localhost:3001/health | [ ] |
| 4.2 | Customer Service | `cd backend/services/customer-service && npm run dev` | 3002 | http://localhost:3002/health | [ ] |
| 4.3 | Order Service | `cd backend/services/order-service && npm run dev` | 3007 | http://localhost:3007/health | [ ] |
| 4.4 | Product Service | `cd backend/services/product-service && npm run dev` | 3006 | http://localhost:3006/health | [ ] |
| 4.5 | Inventory Service | `cd backend/services/inventory-service && npm run dev` | 3003 | http://localhost:3003/health | [ ] |
| 4.6 | Payment Service | `cd backend/services/payment-service && npm run dev` | 3005 | http://localhost:3005/health | [ ] |
| 4.7 | Pricing Service | `cd backend/services/pricing-service && npm run dev` | 3004 | http://localhost:3004/health | [ ] |

**STOP GATE 4**: All backend services running and healthy.

---

## GATE 5: Frontend Startup

| # | Task | Command | Expected | Status |
|---|------|---------|----------|--------|
| 5.1 | Start Distributor Portal | `cd frontend/apps/distributor-portal && npm run dev` | http://localhost:3000 loads | [ ] |
| 5.2 | Start Admin Dashboard | `cd frontend/apps/admin-dashboard && npm run dev` | http://localhost:3001 (or different port) | [ ] |

**STOP GATE 5**: Frontend applications accessible.

---

## GATE 6: UI Verification

| # | Check | URL | Expected | Status |
|---|-------|-----|----------|--------|
| 6.1 | Distributor Portal Home | http://localhost:3000 | Landing page renders | [ ] |
| 6.2 | Login Page | http://localhost:3000/login | Login form visible | [ ] |
| 6.3 | Products Page | http://localhost:3000/products | Product listings | [ ] |
| 6.4 | Orders Page | http://localhost:3000/orders | Order interface | [ ] |
| 6.5 | API Docs | http://localhost:3001/api-docs | Swagger UI | [ ] |
| 6.6 | Health Endpoint | http://localhost:3001/health | {"status":"ok"} | [ ] |

**STOP GATE 6**: Platform fully functional - ready for build continuation.

---

## Quick Start Commands

```powershell
# Gate 0: Prerequisites
docker ps
node -v
npm -v

# Gate 1: Start Infrastructure (if not running)
npm run infra:up

# Gate 2: Install Dependencies
npm run install:all

# Gate 3: Database
npm run db:migrate
npm run db:seed

# Gate 4: Start Backend (separate terminals)
cd backend/gateway && npm run dev
cd backend/services/customer-service && npm run dev
cd backend/services/order-service && npm run dev
cd backend/services/product-service && npm run dev
cd backend/services/inventory-service && npm run dev
cd backend/services/payment-service && npm run dev
cd backend/services/pricing-service && npm run dev

# Gate 5: Start Frontend
cd frontend/apps/distributor-portal && npm run dev
```

---

## Expected URLs

| Service | URL |
|---------|-----|
| Distributor Portal | http://localhost:3000 |
| API Gateway | http://localhost:3001 |
| API Docs (Swagger) | http://localhost:3001/api-docs |
| Health Check | http://localhost:3001/health |

---

**STOP GATE 6 SIGN-OFF**: All checks must pass before proceeding with build.
