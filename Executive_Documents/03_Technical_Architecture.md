# RESIDENT CEMENT BAUCHI LTD
## RESIDENT CONNECT 360™
### Technical Architecture Document

---

**Document Classification:** Technical Reference  
**Date:** April 2, 2026  
**Version:** Final v1.0

---

## EXECUTIVE SUMMARY

This document presents the comprehensive technical architecture for the RESIDENT CONNECT 360™ digital ecosystem. The architecture is designed to be:

- **Scalable:** Supporting Resident Cement's growth trajectory
- **Secure:** Meeting enterprise security and NDPR compliance requirements
- **Resilient:** 99.9% uptime with automated failover
- **Integrated:** Seamless data flow across all 10 modules
- **Maintainable:** Modern DevOps practices with automated deployment

---

## ARCHITECTURE OVERVIEW

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      CLIENT LAYER                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│   │   Web       │  │   Mobile    │  │   IoT       │  │   Desktop   │  │   Third     │    │
│   │   Browser   │  │   (PWA/App) │  │   Sensors   │  │   (ERP)     │  │   Party     │    │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│          │                │                │                │                │            │
└──────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────────┘
           │                │                │                │                │
           └────────────────┴────────────────┴────────────────┴────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           │                LOAD BALANCER                     │
           │              (Cloudflare / AWS ALB)              │
           │          DDoS Protection + WAF                 │
           └────────────────────────┬────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────────────────┐
│                                    CDN LAYER                                              │
│                        (Cloudflare / AWS CloudFront)                                      │
│                    Static Assets, Images, Documents                                       │
└───────────────────────────────────┬───────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────────────────┐
│                              APPLICATION GATEWAY                                          │
│                        (Kong / AWS API Gateway / NGINX)                                 │
│                  Rate Limiting, Authentication, SSL Termination                             │
└───────────────────────────────────┬───────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────────────────┐
│                                 API LAYER                                                 │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│   │   Corporate  │  │   Dealers    │  │     B2B      │  │    ERP       │  │   Production │ │
│   │     API      │  │     API      │  │     API      │  │    API       │  │     API      │ │
│   │   (Next.js)  │  │   (Node.js)  │  │   (Django)   │  │  (ERPNext)   │  │(ThingsBoard) │ │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│          │                 │                │                │                │        │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│   │   Logistics  │  │     ESS      │  │   Investor   │  │     Board    │  │      BI      ││
│   │     API      │  │     API      │  │     API        │  │   Dashboard  │  │   Analytics  ││
│   │   (Node.js)  │  │   (Laravel)  │  │   (Next.js)    │  │    (React)   │  │  (Superset)  ││
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│
│          │                 │                │                │                │        │
└──────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────┘
           │                │                │                │                │
           └────────────────┴────────────────┴────────────────┴────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────────────────┐
│                               MESSAGE BUS                                               │
│                      (RabbitMQ / Apache Kafka / AWS SQS)                                │
│                  Event Streaming, Async Processing, Integration                           │
└───────────────────────────────────┬───────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────────────────┐
│                                DATA LAYER                                               │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│   │  PostgreSQL  │  │  TimescaleDB │  │    Redis     │  │ Elasticsearch │                │
│   │  (Primary)   │  │  (Time-Series)│  │   (Cache)    │  │   (Search)   │                │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                                           │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│   │  Data Lake   │  │  Data        │  │     S3       │  │   MongoDB    │                 │
│   │  (S3/MinIO)  │  │  Warehouse   │  │  (Files)     │  │  (Documents) │                 │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## DETAILED COMPONENT ARCHITECTURE

### 1. FRONTEND ARCHITECTURE

#### Web Application Stack

| Module | Framework | UI Library | State Management | Styling |
|--------|-----------|------------|------------------|---------|
| Corporate Website | Next.js 14 | Radix UI | Server Components | Tailwind CSS |
| Dealers Portal | React 18 | shadcn/ui | TanStack Query + Zustand | Tailwind CSS |
| B2B Portal | Next.js 14 | Headless UI | React Context + SWR | Tailwind CSS |
| ESS Portal | React 18 | Ant Design | Redux Toolkit | Styled Components |
| Investor Portal | Next.js 14 | Custom | React Query | Tailwind CSS |
| Board Dashboard | React 18 | D3.js/Recharts | Zustand | Tailwind CSS |
| BI Analytics | React 18 | Ant Design | Custom | Less |

#### Mobile Strategy

| Approach | Technology | Use Case |
|----------|------------|----------|
| **Progressive Web App (PWA)** | React + Workbox | ESS, Dealers (light usage) |
| **React Native** | React Native + Expo | Logistics (drivers), if needed |
| **Responsive Web** | CSS Media Queries | All other modules |

### 2. BACKEND ARCHITECTURE

#### Service Architecture Pattern: Microservices with API Gateway

```
┌────────────────────────────────────────────────────────────┐
│                    API GATEWAY                             │
├────────────────────────────────────────────────────────────┤
│  • Routing        • Rate Limiting     • Authentication      │
│  • Load Balancing • Request/Response  • Logging           │
│  • SSL Termination  Transformation    • CORS              │
└───────┬────────────────────────────────────────────────────┘
        │
        ├────────────────┬────────────────┬────────────────┬───────────────┐
        │                │                │                │               │
   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │ DEALERS │      │   B2B   │      │LOGISTICS│      │   ESS   │     │INVESTOR │
   │SERVICE  │      │SERVICE  │      │SERVICE  │      │SERVICE  │     │SERVICE  │
   └────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘     └────┬────┘
        │                │                │                │               │
        └────────────────┴────────────────┴────────────────┴───────────────┘
                                    │
                           ┌────────┴────────┐
                           │  SHARED SERVICES │
                           ├─────────────────┤
                           │ • Authentication │
                           │ • Authorization  │
                           │ • Notifications  │
                           │ • File Storage   │
                           │ • Audit Logging  │
                           └─────────────────┘
```

#### Backend Technology by Module

| Module | Runtime | Framework | Primary Database | Cache |
|--------|---------|-----------|------------------|-------|
| Dealers | Node.js | Express/Fastify | PostgreSQL | Redis |
| B2B | Python | Django/DRF | PostgreSQL | Redis |
| Logistics | Node.js | Express | PostgreSQL | Redis |
| ESS | PHP/Node.js | Laravel/NestJS | PostgreSQL | Redis |
| Investor | Node.js | Express | PostgreSQL | Redis |
| Board | Node.js | Express | PostgreSQL + DW | Redis |
| ERP | Python | Frappe Framework | MariaDB | Redis |
| Production | Java | ThingsBoard | TimescaleDB | Redis |
| BI | Python | Flask/FastAPI | PostgreSQL + DW | Redis |

### 3. DATABASE ARCHITECTURE

#### Database Strategy: Polyglot Persistence

| Data Type | Primary Database | Use Case |
|-----------|------------------|----------|
| **Transactional** | PostgreSQL 15 | ERP, user data, orders |
| **Time-Series** | TimescaleDB | IoT sensor data |
| **Document** | MongoDB | Logs, unstructured data |
| **Cache** | Redis 7 | Session, query cache |
| **Search** | Elasticsearch | Full-text search |
| **Analytics** | PostgreSQL + Column Store | Data warehouse |
| **Files** | AWS S3 / MinIO | Documents, images |

#### Database Schema Design Principles

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  PRIMARY DATABASE                        ││
│  │                   (PostgreSQL)                          ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐││
│  │  │  users   │ │  orders  │ │inventory │ │  finance │││
│  │  │   schema │ │   schema │ │  schema  │ │  schema  │││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                         │                                    │
│                         │ (Replication)                       │
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  READ REPLICAS                          ││
│  │            (Reporting, Analytics)                       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              TIME-SERIES DATABASE                        ││
│  │                 (TimescaleDB)                           ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                ││
│  │  │  sensor  │ │ equipment│ │ energy   │                ││
│  │  │  readings│ │   health │ │  data    │                ││
│  │  └──────────┘ └──────────┘ └──────────┘                ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4. IoT ARCHITECTURE

#### Production IoT Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                    FACTORY NETWORK                          │
│                 (Isolated VLAN)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  SENSOR     │  │  SENSOR     │  │  SENSOR     │         │
│  │  NODE 1     │  │  NODE 2     │  │  NODE N     │         │
│  │ (Modbus)    │  │ (MQTT)      │  │ (OPC-UA)    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                  │
│                        │                                    │
│                   ┌────▼────┐                               │
│                   │  EDGE   │                               │
│                   │ GATEWAY │                               │
│                   │(Advantech)│                             │
│                   └────┬────┘                               │
│                        │                                    │
│                   ┌────▼────┐                               │
│                   │  MQTT   │                               │
│                   │ BROKER  │                               │
│                   │(Mosquitto)│                             │
│                   └────┬────┘                               │
│                        │                                    │
│         ┌──────────────┼──────────────┐                    │
│         │              │              │                    │
│    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐                │
│    │ThingsBoard│ │  Local  │   │  Cloud  │                │
│    │ (Local)   │ │  HMI/SCADA│  │  Bridge │                │
│    └───────────┘ │         │   └─────────┘                │
│                  └─────────┘                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### IoT Protocol Stack

| Layer | Protocol | Purpose |
|-------|----------|---------|
| **Device** | Modbus RTU/TCP | Industrial sensors |
| **Edge** | MQTT | Lightweight telemetry |
| **SCADA** | OPC-UA | Interoperability |
| **Cloud** | HTTPS/MQTT | Secure transmission |

### 5. INTEGRATION ARCHITECTURE

#### Integration Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                   INTEGRATION PATTERNS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              API GATEWAY INTEGRATION                 │  │
│  │                                                      │  │
│  │   Web/Mobile → API Gateway → Backend Services       │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              EVENT-DRIVEN INTEGRATION              │  │
│  │                                                      │  │
│  │   Service A → Message Bus → Service B               │  │
│  │   (Async, decoupled)                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              DATABASE INTEGRATION                  │  │
│  │                                                      │  │
│  │   CDC → Data Warehouse → Analytics                   │  │
│  │   (Replication, ETL)                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              FILE-BASED INTEGRATION                │  │
│  │                                                      │  │
│  │   ERP Export → SFTP → BI Import                     │  │
│  │   (Batch processing)                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Message Bus Configuration

| Queue/Topic | Producer | Consumer | Purpose |
|-------------|----------|----------|---------|
| `orders.created` | B2B/Dealers | ERP, Logistics | Order processing |
| `inventory.updated` | ERP | All portals | Stock sync |
| `payments.received` | Payment Gateway | ERP, Dealers | Commission update |
| `production.metrics` | IoT | BI, Board Dashboard | Real-time metrics |
| `alerts.critical` | All systems | SMS Gateway, Email | Notifications |
| `audit.events` | All systems | Audit DB | Compliance logging |

### 6. SECURITY ARCHITECTURE

#### Defense in Depth Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 7 ┌─────────────────────────────────────────────────┐│
│  (App)   │ Input Validation, XSS Protection, CSRF Tokens    ││
│          └─────────────────────────────────────────────────┘│
│          ┌─────────────────────────────────────────────────┐│
│  Layer 6 │ Authentication (OAuth2/OIDC), MFA, RBAC         ││
│          └─────────────────────────────────────────────────┘│
│          ┌─────────────────────────────────────────────────┐│
│  Layer 5 │ API Security, Rate Limiting, Request Validation  ││
│          └─────────────────────────────────────────────────┘│
│          ┌─────────────────────────────────────────────────┐│
│  Layer 4 │ TLS 1.3, Certificate Pinning, HSTS              ││
│          └─────────────────────────────────────────────────┘│
│          ┌─────────────────────────────────────────────────┐│
│  Layer 3 │ Network Segmentation, VPC, Security Groups       ││
│          └─────────────────────────────────────────────────┘│
│          ┌─────────────────────────────────────────────────┐│
│  Layer 2 │ DDoS Protection (Cloudflare), WAF Rules          ││
│          └─────────────────────────────────────────────────┘│
│          ┌─────────────────────────────────────────────────┐│
│  Layer 1 │ Physical Security, Cloud Provider Security       ││
│          └─────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Identity  │────▶│   Token     │────▶│   API       │
│  (Web/App)  │     │   Provider  │     │   Service   │     │  Gateway    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  Login Request      Validate            JWT Token          Validate Token
  (Credentials)      Credentials         (Signed)           + RBAC Check
```

#### Security Standards Compliance

| Standard | Implementation |
|----------|----------------|
| **Authentication** | OAuth 2.0 + OpenID Connect |
| **Authorization** | RBAC + Attribute-based access |
| **Password Policy** | NIST 800-63B (12+ chars, complexity) |
| **Session Management** | JWT with refresh tokens, 15-min timeout |
| **API Security** | OAuth2 scopes, rate limiting |
| **Data Encryption** | AES-256 at rest, TLS 1.3 in transit |
| **Secrets Management** | HashiCorp Vault / AWS Secrets Manager |

---

## DEPLOYMENT ARCHITECTURE

### Infrastructure as Code (IaC)

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVOPS PIPELINE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│   │   Code   │───▶│  Build   │───▶│   Test   │              │
│   │  Commit  │    │  & Lint  │    │  & Scan  │              │
│   └──────────┘    └──────────┘    └──────────┘              │
│         │                                         │        │
│         │         ┌──────────┐    ┌──────────┐    │        │
│         └────────▶│  Deploy  │───▶│ Monitor  │────┘        │
│                   │  (K8s)   │    │  & Alert │               │
│                   └──────────┘    └──────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Container Orchestration: Kubernetes

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Orchestration** | Kubernetes (EKS/GKE) | Container management |
| **Service Mesh** | Istio / Linkerd | Traffic management |
| **Ingress** | NGINX Ingress Controller | External access |
| **Auto-scaling** | HPA + Cluster Autoscaler | Dynamic scaling |
| **Monitoring** | Prometheus + Grafana | Metrics collection |
| **Logging** | Fluentd + Elasticsearch | Log aggregation |

### Environment Strategy

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| **Development** | Active development | Single-node K8s |
| **Staging** | Pre-production testing | Multi-zone K8s |
| **Production** | Live system | Multi-region K8s |
| **DR** | Disaster recovery | Standby region |

---

## PERFORMANCE ARCHITECTURE

### Scalability Design

```
┌─────────────────────────────────────────────────────────────┐
│                   SCALABILITY STRATEGY                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              HORIZONTAL SCALING                      │  │
│  │                                                      │  │
│  │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │  │
│  │   │Pod 1│ │Pod 2│ │Pod 3│ │Pod 4│ │Pod N│        │  │
│  │   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │  │
│  │        ▲ Load Balancer (Round Robin)              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              CACHING STRATEGY                        │  │
│  │                                                      │  │
│  │   Browser → CDN → Redis → Database                  │  │
│  │   (Tiered caching)                                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              DATABASE OPTIMIZATION                   │  │
│  │                                                      │  │
│  │   • Read Replicas for queries                      │  │
│  │   • Connection Pooling (PgBouncer)                 │  │
│  │   • Query Optimization (Indexes)                   │  │
│  │   • Partitioning for time-series data              │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | < 2 seconds | Lighthouse |
| **API Response Time** | < 200ms p95 | APM |
| **Database Query** | < 50ms average | Query logs |
| **System Availability** | 99.9% | Uptime monitoring |
| **Concurrent Users** | 1000+ | Load testing |
| **IoT Throughput** | 10,000 events/sec | Benchmark |

---

## MONITORING & OBSERVABILITY

### Observability Stack

```
┌─────────────────────────────────────────────────────────────┐
│                   OBSERVABILITY STACK                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   METRICS    │  │    LOGS      │  │   TRACES     │     │
│  │  Prometheus  │  │ Elasticsearch│  │    Jaeger    │     │
│  │  + Grafana   │  │  + Kibana    │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                │               │
│         └────────────────┼────────────────┘               │
│                          ▼                                │
│                  ┌──────────────┐                         │
│                  │   APM Tool   │                         │
│                  │  (Datadog/   │                         │
│                  │   New Relic) │                         │
│                  └──────────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Alerting Thresholds

| Alert Level | Condition | Response |
|-------------|-----------|----------|
| **Critical** | Service down, Data loss | Page on-call, Escalate to leadership |
| **Warning** | High latency, High error rate | Create ticket, Notify team |
| **Info** | Resource usage trends | Dashboard notification |

---

## BACKUP & DISASTER RECOVERY

### Backup Strategy

| Data Type | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| **Database** | Daily full + hourly incremental | 30 days | Cross-region S3 |
| **File Storage** | Continuous replication | 90 days | Cross-region |
| **Configuration** | Every change | 1 year | Git + S3 |
| **IoT Data** | 7 days hot, 1 year cold | 7 years | S3 Glacier |

### Recovery Objectives

| Metric | Target | Rationale |
|--------|--------|-----------|
| **RPO (Recovery Point)** | 1 hour | Acceptable data loss |
| **RTO (Recovery Time)** | 4 hours | Business continuity |
| **DR Testing** | Quarterly | Validation |

---

## COMPLIANCE ARCHITECTURE

### NDPR Compliance Mapping

| NDPR Principle | Technical Implementation |
|----------------|-------------------------|
| **Lawful Processing** | Consent management system |
| **Purpose Limitation** | Data classification, access controls |
| **Data Minimization** | Field-level encryption, anonymization |
| **Accuracy** | Data validation, correction workflows |
| **Storage Limitation** | Automated data lifecycle management |
| **Integrity** | Encryption, access logging |
| **Accountability** | Audit trails, DPO dashboard |

### Audit Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   AUDIT SYSTEM                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  User    │  │  Data    │  │  API     │  │  System  │  │
│  │ Actions  │  │ Changes  │  │ Calls    │  │  Events  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │             │             │        │
│       └─────────────┴─────────────┴─────────────┘        │
│                     │                                     │
│                     ▼                                     │
│           ┌─────────────────┐                            │
│           │  Audit Logger   │                            │
│           │ (Immutable Log) │                            │
│           └────────┬────────┘                            │
│                    │                                     │
│                    ▼                                     │
│           ┌─────────────────┐                            │
│           │  Audit Database │                            │
│           │  (Write-Once)   │                            │
│           └────────┬────────┘                            │
│                    │                                     │
│                    ▼                                     │
│           ┌─────────────────┐                            │
│           │  Audit Dashboard│                            │
│           │  (Compliance)   │                            │
│           └─────────────────┘                            │
│                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## APPENDIX: TECHNOLOGY DECISIONS

### Technology Selection Rationale

| Decision | Selected Technology | Alternatives Considered | Rationale |
|----------|-------------------|------------------------|-----------|
| Frontend Framework | React + Next.js | Vue, Angular | Ecosystem, SSR support |
| Backend Runtime | Node.js + Python | Go, Java | Team expertise, libraries |
| Primary Database | PostgreSQL | MySQL, MongoDB | ACID, JSON support |
| Time-Series DB | TimescaleDB | InfluxDB | PostgreSQL compatible |
| Message Queue | RabbitMQ | Kafka, SQS | Balance of features/ops |
| IoT Platform | ThingsBoard | Custom build | Production-ready |
| BI Platform | Apache Superset | Tableau, PowerBI | Open source, cost |
| Cloud Provider | AWS | Azure, GCP | Nigerian presence |
| Container Orchestration | Kubernetes | Docker Swarm | Industry standard |
| Monitoring | Prometheus + Grafana | Datadog | Open source, flexibility |

---

**Document Control:**
- Version: 1.0
- Classification: Technical Reference
- Review Cycle: Quarterly
- Next Review: July 2026

---
