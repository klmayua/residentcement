# Dependency Inventory

**Audit Session:** `forensics_20260311_221530`  
**Generated:** 2026-03-11 22:15:30  
**Project:** ResidentCement Digital Ecosystem  

---

## Executive Summary

ResidentCement uses a **Node.js/TypeScript** technology stack with **6,200+ npm packages** across multiple workspaces. The project follows a **monorepo-style** structure with shared libraries.

---

## Root Dependencies

### package.json (Root)

| Dependency | Version | Type | Purpose |
|------------|---------|------|---------|
| `concurrently` | ^8.2.2 | devDependencies | Parallel command runner |

**Purpose:** Orchestrates multiple development servers simultaneously.

---

## Backend Gateway (`backend/gateway/`)

### Production Dependencies

| Package | Version | Purpose | Security Risk |
|---------|---------|---------|---------------|
| `@resident-cement/kernel` | file:../shared/kernel | Shared utilities | Low (internal) |
| `@prisma/client` | ^5.9.0 | Database ORM | Low |
| `bcryptjs` | ^2.4.3 | Password hashing | Low |
| `cors` | ^2.8.5 | CORS middleware | Low |
| `dotenv` | ^16.3.1 | Environment loading | Low |
| `express` | ^4.18.2 | Web framework | **Medium** (known vulnerabilities) |
| `express-rate-limit` | ^7.1.5 | Rate limiting | Low |
| `helmet` | ^7.1.0 | Security headers | Low |
| `ioredis` | ^5.3.2 | Redis client | Low |
| `jose` | ^5.2.0 | JWT handling | Low |
| `jsonwebtoken` | ^9.0.2 | JWT utilities | Low |
| `kafkajs` | ^2.2.4 | Kafka client | Low |
| `node-fetch` | ^2.7.0 | HTTP client | Low |
| `pg` | ^8.11.3 | PostgreSQL driver | Low |
| `swagger-jsdoc` | ^6.2.8 | OpenAPI generation | Low |
| `swagger-ui-express` | ^5.0.0 | API documentation | Low |
| `uuid` | ^9.0.1 | UUID generation | Low |
| `winston` | ^3.11.0 | Logging | Low |
| `zod` | ^3.22.4 | Schema validation | Low |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/*` | Various | TypeScript type definitions |
| `@typescript-eslint/*` | ^6.19.0 | ESLint TypeScript parser |
| `eslint` | ^8.56.0 | Linting |
| `jest` | ^29.7.0 | Testing framework |
| `ts-jest` | ^29.1.1 | Jest TypeScript preprocessor |
| `tsx` | ^4.7.0 | TypeScript execution |
| `typescript` | ^5.3.3 | TypeScript compiler |
| `prisma` | ^5.9.0 | Database migrations |

---

## Shared Kernel (`backend/shared/kernel/`)

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `uuid` | ^9.0.1 | UUID generation |
| `winston` | ^3.11.0 | Logging framework |
| `winston-transport` | ^4.7.0 | Winston transport base |
| `zod` | ^3.22.4 | Schema validation |

### Peer Dependencies

| Package | Version | Required By Host |
|---------|---------|------------------|
| `express` | ^4.18.2 | Gateway, microservices |

---

## Microservices Dependencies

### customer-service

**Pattern:** All services share similar dependency structure

| Package | Version | Purpose |
|---------|---------|---------|
| `@resident-cement/kernel` | file:../../shared/kernel | Shared utilities |
| `@prisma/client` | ^5.9.0 | Database ORM |
| `cors` | ^2.8.5 | CORS middleware |
| `dotenv` | ^16.3.1 | Environment loading |
| `express` | ^4.18.2 | Web framework |
| `express-rate-limit` | ^7.1.5 | Rate limiting |
| `helmet` | ^7.1.0 | Security headers |
| `ioredis` | ^5.3.2 | Redis client |
| `kafkajs` | ^2.2.4 | Kafka client |
| `uuid` | ^9.0.1 | UUID generation |
| `winston` | ^3.11.0 | Logging |
| `zod` | ^3.22.4 | Schema validation |

**Services using this pattern:**
- customer-service
- order-service
- product-service
- inventory-service
- payment-service
- pricing-service

---

## Frontend (Distributor Portal)

### Production Dependencies

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| `next` | 15.1.0 | React framework | Low |
| `react` | ^18.2.0 | UI library | Low |
| `react-dom` | ^18.2.0 | React DOM | Low |
| `@radix-ui/*` | Various | Headless UI components | Low |
| `@tanstack/react-query` | ^5.17.0 | Data fetching | Low |
| `@tanstack/react-table` | ^8.11.0 | Data tables | Low |
| `axios` | ^1.6.5 | HTTP client | Low |
| `class-variance-authority` | ^0.7.0 | CSS utilities | Low |
| `clsx` | ^2.1.0 | Class name utility | Low |
| `date-fns` | ^3.0.0 | Date utilities | Low |
| `lucide-react` | ^0.312.0 | Icon library | Low |
| `next-themes` | ^0.2.1 | Theme switching | Low |
| `react-hook-form` | ^7.49.0 | Form handling | Low |
| `recharts` | ^2.10.0 | Charts | Low |
| `tailwind-merge` | ^2.2.0 | Tailwind utilities | Low |
| `tailwindcss` | ^3.4.1 | CSS framework | Low |
| `tailwindcss-animate` | ^1.0.7 | Tailwind animations | Low |
| `zod` | ^3.22.4 | Schema validation | Low |
| `zustand` | ^4.5.0 | State management | Low |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | ^20.11.0 | Node.js types |
| `@types/react` | ^18.2.48 | React types |
| `@types/react-dom` | ^18.2.18 | React DOM types |
| `@typescript-eslint/*` | ^6.19.0 | ESLint TypeScript |
| `autoprefixer` | ^10.4.17 | PostCSS plugin |
| `eslint` | ^8.56.0 | Linting |
| `eslint-config-next` | 15.1.0 | Next.js ESLint config |
| `postcss` | ^8.4.33 | CSS processing |
| `prettier` | ^3.2.4 | Code formatting |
| `prettier-plugin-tailwindcss` | ^0.5.11 | Prettier Tailwind plugin |
| `typescript` | ^5.3.3 | TypeScript compiler |

---

## Infrastructure Dependencies

### Docker Base Images

| Image | Version | Used By | Risk |
|-------|---------|---------|------|
| `node` | 20-alpine | API Gateway | Low (Alpine) |
| `postgres` | 16-alpine | Database | Low |
| `mongo` | 7.0 | Document store | Low |
| `redis` | 7-alpine | Cache | Low |
| `confluentinc/cp-kafka` | 7.5.0 | Message bus | Low |
| `confluentinc/cp-zookeeper` | 7.5.0 | Kafka coordination | Low |
| `quay.io/keycloak/keycloak` | 23.0 | Identity provider | Low |
| `minio/minio` | latest | Object storage | Medium (floating tag) |
| `provectuslabs/kafka-ui` | latest | Kafka management | Medium (floating tag) |
| `prom/prometheus` | v2.48.0 | Metrics | Low |
| `grafana/grafana` | 10.2.0 | Dashboards | Low |
| `grafana/loki` | 2.9.3 | Logs | Low |
| `grafana/tempo` | 2.3.1 | Tracing | Low |

---

## Dependency Statistics

| Category | Count |
|----------|-------|
| Root packages | 1 |
| Gateway production deps | 18 |
| Gateway dev deps | 14 |
| Kernel production deps | 4 |
| Kernel dev deps | 13 |
| Per-service deps (avg) | 12 |
| Frontend production deps | 20 |
| Frontend dev deps | 11 |
| Docker images | 13 |
| **Total npm packages** | **6,200+** (including transitive) |

---

## Version Consistency Analysis

### Consistent Versions ✅

| Package | Version | Used By |
|---------|---------|---------|
| `typescript` | ^5.3.3 | All packages |
| `eslint` | ^8.56.0 | All packages |
| `@typescript-eslint/*` | ^6.19.0 | All packages |
| `@types/node` | ^20.11.0 | All packages |
| `zod` | ^3.22.4 | Backend + Frontend |
| `uuid` | ^9.0.1 | Backend services |
| `winston` | ^3.11.0 | Backend services |

### Version Discrepancies ⚠️

| Package | Gateway | Prisma Folder | Risk |
|---------|---------|---------------|------|
| `@prisma/client` | ^5.9.0 | ^7.4.2 | **High** - Schema mismatch |
| `prisma` | ^5.9.0 | ^7.4.2 | **High** - Migration issues |

**Finding:** The `backend/gateway/prisma/` folder has Prisma v7.4.2 while the gateway uses v5.9.0. This could cause:
- Schema generation mismatches
- Migration failures
- Runtime type errors

---

## Known Vulnerable Dependencies

### Express.js 4.18.2

**CVEs:**
- CVE-2024-29041 (Moderate) - Open redirect vulnerability
- CVE-2024-43796 (Moderate) - Path traversal

**Recommendation:** Upgrade to Express 4.19.2+ or consider migrating to Express 5.x

### node-fetch 2.7.0

**Status:** v2.x is in maintenance mode

**Recommendation:** Consider migrating to:
- `undici` (Node.js built-in)
- `node-fetch` v3+ (ESM only)

### bcryptjs 2.4.3

**Status:** Last updated 2020

**Recommendation:** Consider switching to:
- `bcrypt` (native bindings, actively maintained)
- `argon2` (modern hashing algorithm)

---

## Dependency Tree

```
resident-cement/
├── concurrently (root)
│
├── backend/gateway/
│   ├── @resident-cement/kernel
│   │   ├── uuid
│   │   ├── winston
│   │   ├── winston-transport
│   │   └── zod
│   ├── @prisma/client
│   ├── express
│   │   ├── body-parser
│   │   ├── cookie
│   │   ├── debug
│   │   └── ... (25+ sub-dependencies)
│   ├── helmet
│   ├── kafkajs
│   ├── ioredis
│   └── ... (18 production deps)
│
├── backend/services/* (6 services)
│   └── [Same pattern as gateway]
│
└── frontend/apps/distributor-portal/
    ├── next
    │   ├── react
    │   ├── react-dom
    │   └── ... (50+ sub-dependencies)
    ├── @radix-ui/* (8 packages)
    ├── @tanstack/* (2 packages)
    ├── axios
    ├── recharts
    └── ... (20 production deps)
```

---

## Engine Requirements

| Component | Node.js Version |
|-----------|----------------|
| Root | Not specified |
| Gateway | >=20.0.0 |
| Kernel | >=20.0.0 |
| Microservices | >=20.0.0 |
| Frontend | Not specified (Next.js 15 requires >=18.17) |

**Consensus:** Node.js 20.x LTS required

---

## License Inventory

| License | Packages |
|---------|----------|
| MIT | Majority of npm packages |
| Apache-2.0 | Prisma, KafkaJS |
| BSD-3-Clause | Some TypeScript types |
| PROPRIETARY | All ResidentCement packages |

---

**END OF REPORT**
