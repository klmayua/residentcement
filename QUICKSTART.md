# ResidentCement Platform - Quick Start Guide

## 🚀 GET STARTED IN 5 MINUTES

### Prerequisites

Ensure you have installed:
- **Node.js 20+** - [Download](https://nodejs.org)
- **Docker Desktop** - [Download](https://docker.com)
- **Git** - [Download](https://git-scm.com)

### Quick Start

```bash
# 1. Navigate to project
cd C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement

# 2. Install all dependencies
npm install

# 3. Start infrastructure (PostgreSQL, MongoDB, Redis, Kafka, MinIO)
npm run infra:up

# Wait 30 seconds for services to initialize

# 4. Seed the database with sample data
npm run db:seed

# 5. Start all development servers
npm run dev
```

### Access the Platform

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend (Distributor Portal)** | http://localhost:3000 | admin@residentcement.com / AdminP@ssw0rd123! |
| **API Gateway** | http://localhost:3001 | - |
| **API Documentation** | http://localhost:3001/api-docs | - |
| **Health Check** | http://localhost:3001/health | - |

---

## 📦 What's Included

### Backend Services (All Running)

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3001 | Central API entry point |
| Customer Service | 3002 | Customer management |
| Inventory Service | 3003 | Warehouse & inventory |
| Pricing Service | 3004 | Dynamic pricing engine |
| Payment Service | 3005 | Payment processing |
| Product Service | 3006 | Product catalog |
| Order Service | 3007 | Order management |

### Infrastructure Services

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Primary database |
| MongoDB | 27017 | Document store |
| Redis | 6379 | Cache |
| Kafka | 9092 | Message broker |
| Kafka UI | 8085 | Kafka management |
| Keycloak | 8180 | Identity provider |
| MinIO | 9000 | Object storage |
| MinIO Console | 9001 | MinIO UI |

### Monitoring Stack

| Service | Port | Description |
|---------|------|-------------|
| Prometheus | 9090 | Metrics collection |
| Grafana | 3200 | Dashboards (admin/admin_password_2026) |
| Loki | 3100 | Log aggregation |
| Tempo | 3201 | Distributed tracing |
| Alertmanager | 9093 | Alert routing |

---

## 🎯 Sample Data Included

The database comes pre-populated with:

- **1 Admin User** - admin@residentcement.com
- **5 Customers** - Demo Distributors, BuildMax, etc.
- **6 Products** - Resident Cement 42.5R, 32.5R, 52.5R, etc.
- **3 Warehouses** - Lagos, Abuja, Port Harcourt
- **4 Inventory Records** - Stock across warehouses
- **3 Orders** - Sample orders in various states
- **2 Payments** - Completed payment records
- **3 Pricing Rules** - Volume and tier-based discounts

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start all services
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only

# Infrastructure
npm run infra:up         # Start all infrastructure
npm run infra:down       # Stop all infrastructure
npm run docker:logs      # View logs

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:reset         # Reset database

# Testing
npm test                 # Run all tests
npm run test:e2e         # E2E tests
npm run test:integration # Integration tests

# Build
npm run build            # Build all services
npm run build:kernel     # Build shared kernel
```

---

## 📱 Frontend Features

### Distributor Portal (http://localhost:3000)

- **Dashboard** - Overview with stats, recent orders, low stock alerts
- **Orders** - Create, view, and manage orders
- **Products** - Browse product catalog with availability
- **Customers** - Customer management with credit limits
- **Inventory** - Real-time stock levels across warehouses
- **Quotes** - Generate and convert quotes to orders
- **Payments** - Payment processing with Paystack integration

---

## 🔐 API Authentication

### Get Access Token

```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@residentcement.com",
    "password": "AdminP@ssw0rd123!"
  }'
```

### Use Token

```bash
# Include in requests
curl http://localhost:3001/api/v1/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ Troubleshooting

### Port Already in Use

```bash
# Windows - Find and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Failed

```bash
# Restart infrastructure
npm run infra:down
npm run infra:up

# Wait 30 seconds, then seed
npm run db:seed
```

### Services Not Starting

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild shared kernel
npm run build:kernel
```

---

## 📊 Monitoring Dashboard

Access Grafana at http://localhost:3200

**Credentials:**
- Username: `admin`
- Password: `admin_password_2026`

**Pre-configured Dashboards:**
- API Gateway Performance
- Service Health Overview
- Database Metrics
- Business Metrics

---

## 🎓 Next Steps

1. **Explore the API** - Visit http://localhost:3001/api-docs
2. **Try the Frontend** - Browse http://localhost:3000
3. **Create Your First Order** - Use the dashboard or API
4. **Monitor Performance** - Check Grafana dashboards
5. **Read Full Documentation** - See README.md and BUILD_SUMMARY.md

---

## 📞 Support

For issues or questions:
- Check logs: `npm run docker:logs`
- Health checks: http://localhost:3001/health
- API docs: http://localhost:3001/api-docs

---

**🎉 You're all set! Start building with ResidentCement.**
