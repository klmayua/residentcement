# ResidentCement Digital Ecosystem

**Enterprise-grade cement distribution management platform for Nigeria**

![Version](https://img.shields.io/badge/version-2030.1.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue.svg)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd PROJECTS/ResidentCement

# Install dependencies
npm install

# Start infrastructure (PostgreSQL, MongoDB, Redis, Kafka, MinIO)
npm run infra:up

# Start development servers
npm run dev

# Access the application
# Frontend: http://localhost:3000
# API Gateway: http://localhost:3001
# API Docs: http://localhost:3001/api-docs
```

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)

---

## 📖 Overview

ResidentCement is a comprehensive digital platform designed to modernize cement distribution management in Nigeria. The platform connects manufacturers, distributors, sales representatives, and customers through a unified ecosystem.

### Key Capabilities

- **Customer Management**: Complete CRM with tier-based pricing and credit limits
- **Order Processing**: End-to-end order lifecycle from quote to delivery
- **Inventory Management**: Real-time stock tracking across multiple warehouses
- **Pricing Engine**: Dynamic pricing with volume discounts and promotional rules
- **Payment Integration**: Multiple payment methods including cards, bank transfers, and USSD
- **Analytics**: Business intelligence dashboards and reporting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │Distributor      │  │Admin Dashboard  │  │Sales Rep Mobile │ │
│  │Portal (Next.js) │  │(React)          │  │App              │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│  • Authentication & Authorization  • Rate Limiting              │
│  • Request Routing                 • Response Caching           │
│  • Request/Response Transformation • API Versioning             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Microservices Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Customer  │ │ Order    │ │ Product  │ │Inventory │           │
│  │Service   │ │ Service  │ │ Service  │ │ Service  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │Payment   │ │ Pricing  │ │ Events   │                        │
│  │Service   │ │ Service  │ │ Service  │                        │
│  └──────────┘ └──────────┘ └──────────┘                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │PostgreSQL│ │ MongoDB  │ │  Redis   │ │  Kafka   │           │
│  │(Primary) │ │(Documents│ │ (Cache)  │ │ (Events) │           │
│  │          │ │ Store)   │ │          │ │          │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15 | React framework with App Router |
| React | 18.2 | UI library |
| TypeScript | 5.3 | Type safety |
| Tailwind CSS | 3.4 | Styling |
| Radix UI | latest | Accessible components |
| TanStack Query | 5 | Data fetching |
| React Hook Form | 7 | Form handling |
| Zod | 3.22 | Validation |
| Recharts | 2.10 | Charts |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 | Runtime |
| Express | 4.18 | Web framework |
| TypeScript | 5.3 | Type safety |
| Prisma | 5.9 | ORM |
| KafkaJS | 2.2 | Kafka client |
| ioredis | 5.3 | Redis client |
| Winston | 3.11 | Logging |
| Zod | 3.22 | Validation |

### Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| Docker | latest | Containerization |
| Kubernetes | 1.28 | Orchestration |
| PostgreSQL | 16 | Primary database |
| MongoDB | 7.0 | Document store |
| Redis | 7 | Cache |
| Kafka | 7.5 | Message broker |
| MinIO | latest | Object storage |
| Keycloak | 23 | Identity provider |

### Observability

| Technology | Version | Purpose |
|------------|---------|---------|
| Prometheus | 2.48 | Metrics |
| Grafana | 10.2 | Dashboards |
| Loki | 2.9 | Logs |
| Tempo | 2.3 | Tracing |
| Alertmanager | 0.26 | Alerts |

---

## ✨ Features

### Phase 1: Commercial Engagement

- [x] Distributor Portal
- [x] Sales Rep Mobile App
- [x] **USSD Service** (Africa's Talking Integration) ✅ IMPLEMENTED
  - Dial *384# (or configured shortcode)
  - Check balance, place orders, track deliveries
  - SMS confirmations via AT API
- [x] Intelligent Quote Engine
- [x] Payment Integration (Paystack, Flutterwave)
- [x] Command Dashboard

### Phase 2: Operational Core

- [ ] Mine Management
- [ ] Plant MES (Manufacturing Execution System)
- [ ] Inventory & Warehousing
- [ ] Inbound/Outbound Logistics
- [ ] Quality & Compliance Monitoring

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **Docker**: 24.0.0 or higher
- **Docker Compose**: 2.20.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd PROJECTS/ResidentCement

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Start infrastructure services
npm run infra:up

# 5. Run database migrations
npm run db:migrate

# 6. Seed initial data (optional)
npm run db:seed

# 7. Start development servers
npm run dev
```

### Verify Installation

```bash
# Check API health
curl http://localhost:3001/health

# Check frontend
curl http://localhost:3000

# View API documentation
open http://localhost:3001/api-docs
```

---

## 👨‍💻 Development

### Project Structure

```
resident-cement/
├── backend/
│   ├── gateway/              # API Gateway
│   ├── services/             # Microservices
│   │   ├── customer-service/
│   │   ├── order-service/
│   │   ├── product-service/
│   │   ├── inventory-service/
│   │   ├── payment-service/
│   │   └── pricing-service/
│   └── shared/               # Shared packages
│       └── kernel/           # Shared kernel
├── frontend/
│   └── apps/
│       ├── distributor-portal/
│       └── admin-dashboard/
├── infrastructure/
│   ├── docker/               # Docker configs
│   └── k8s/                  # Kubernetes manifests
├── tests/
│   ├── e2e/                  # E2E tests
│   └── integration/          # Integration tests
└── docs/                     # Documentation
```

### Development Commands

```bash
# Start all services
npm run dev

# Start specific service
npm run dev:gateway
npm run dev:frontend

# Build all
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# With coverage
npm run test:coverage

# E2E with UI
npm run test:e2e:ui

# E2E debug mode
npm run test:e2e:debug
```

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker images
docker build -t resident-cement/gateway -f backend/gateway/Dockerfile .
docker build -t resident-cement/frontend -f frontend/apps/distributor-portal/Dockerfile .

# Start with Docker Compose
cd infrastructure/docker
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f infrastructure/k8s/

# Check deployment
kubectl get pods -n resident-cement
kubectl get services -n resident-cement

# Scale services
kubectl scale deployment api-gateway --replicas=3 -n resident-cement
```

### CI/CD

The platform uses GitHub Actions for CI/CD:

- **Push to develop**: Deploys to staging
- **Push to main**: Deploys to production
- **Pull requests**: Runs tests and linting

---

## 📊 Monitoring

### Access Monitoring Stack

```bash
# Start monitoring services
cd infrastructure/docker
docker-compose -f docker-compose.monitoring.yml up -d

# Access dashboards
# Grafana: http://localhost:3200 (admin/admin_password_2026)
# Prometheus: http://localhost:9090
# Loki: http://localhost:3100
# Tempo: http://localhost:3201
```

### Key Dashboards

- **API Gateway**: Request rates, latency, error rates
- **Microservices**: Service health, dependencies
- **Infrastructure**: CPU, memory, disk usage
- **Business Metrics**: Orders, payments, customers

---

## 📚 API Documentation

### Interactive Documentation

Access the interactive API documentation at:

- **Development**: http://localhost:3001/api-docs
- **Staging**: https://staging-api.residentcement.com/api-docs
- **Production**: https://api.residentcement.com/api-docs

### OpenAPI Specification

```bash
# Download OpenAPI spec
curl http://localhost:3001/api-docs/swagger.json -o openapi.json

# Generate client SDKs
# Use openapi-generator-cli with the downloaded spec
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/register` | User registration |
| GET | `/api/v1/customers` | List customers |
| POST | `/api/v1/customers` | Create customer |
| GET | `/api/v1/orders` | List orders |
| POST | `/api/v1/orders` | Create order |
| GET | `/api/v1/products` | List products |
| POST | `/api/v1/payments` | Initiate payment |

---

## 🔒 Security

### Security Features

- **Authentication**: JWT + OAuth 2.0 (Keycloak)
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: TLS 1.3 for data in transit
- **Validation**: Input validation with Zod schemas
- **Rate Limiting**: Per-IP and per-user rate limits
- **Headers**: Security headers via Helmet
- **CORS**: Configured for allowed origins only

### Security Best Practices

1. Never commit secrets or `.env` files
2. Use strong passwords (min 12 characters)
3. Enable 2FA for all accounts
4. Rotate API keys regularly
5. Monitor for suspicious activity

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use Conventional Commits:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update config
```

---

## 📄 License

Proprietary - ResidentCement Platform  
© 2026 All Rights Reserved

---

## 📞 Support

- **Documentation**: `/api-docs`
- **Health Check**: `/health`
- **Status Page**: `/status`
- **Email**: support@residentcement.com

---

## 🙏 Acknowledgments

Built with ❤️ for the Nigerian cement distribution industry.
