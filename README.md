# Resident Cement Digital Ecosystem

Enterprise-grade digital platform for cement distribution management in Nigeria.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **API Gateway**: Express.js with TypeScript
- **Database**: PostgreSQL (relational), MongoDB (documents)
- **Cache**: Redis
- **Event Bus**: Apache Kafka
- **Authentication**: JWT with Keycloak

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Testing**: Playwright (E2E)

## Project Structure

```
resident-cement/
├── frontend/
│   └── apps/
│       └── distributor-portal/     # Distributor web portal
├── backend/
│   ├── gateway/                     # API Gateway
│   └── services/
│       └── events/                  # Event bus service
├── infrastructure/
│   └── docker/                     # Docker configurations
└── tests/
    └── e2e/                        # Playwright tests
```

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start infrastructure services:
   ```bash
   cd infrastructure/docker
   docker-compose up -d
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

### Services

| Service | URL | Description |
|---------|-----|-------------|
| Distributor Portal | http://localhost:3000 | Main web application |
| API Gateway | http://localhost:3001 | REST API |
| PostgreSQL | localhost:5432 | Primary database |
| MongoDB | localhost:27017 | Document store |
| Redis | localhost:6379 | Cache |
| Kafka | localhost:9092 | Message queue |
| Kafka UI | http://localhost:8085 | Kafka management |
| Keycloak | http://localhost:8180 | Identity provider |
| MinIO | http://localhost:9000 | Object storage |

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token

### Customers
- `GET /api/v1/customers` - List customers
- `GET /api/v1/customers/:id` - Get customer
- `PATCH /api/v1/customers/:id` - Update customer

### Orders
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order
- `PATCH /api/v1/orders/:id/cancel` - Cancel order

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product
- `GET /api/v1/products/:id/availability` - Check stock

### Pricing
- `POST /api/v1/quotes/calculate` - Calculate quote
- `POST /api/v1/quotes` - Create quote
- `POST /api/v1/quotes/:id/convert` - Convert to order

### Payments
- `POST /api/v1/payments/initiate` - Initiate payment
- `GET /api/v1/payments/:id/status` - Check payment status

## Testing

Run E2E tests:
```bash
npm run test:e2e
```

## Architecture

The system follows a microservices architecture with:
- API Gateway for request routing
- Domain microservices for business logic
- Event-driven communication via Kafka
- Polyglot persistence (PostgreSQL, MongoDB, Redis)

## Phase 1 Features (Commercial Engagement)
- Distributor Portal
- Sales Rep Mobile App
- USSD Fallback
- Intelligent Quote Engine
- Payment Integration
- Command Dashboard

## Phase 2 Features (Operational Core)
- Mine Management
- Plant MES
- Inventory & Warehousing
- Inbound/Outbound Logistics
- Quality & Compliance Monitoring

## License

Proprietary - All rights reserved
