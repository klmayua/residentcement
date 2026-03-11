# Infrastructure Map

**Audit Session:** `forensics_20260311_221530`  
**Generated:** 2026-03-11 22:15:30  
**Project:** ResidentCement Digital Ecosystem  

---

## Infrastructure Overview

ResidentCement uses a **containerized microservices architecture** with support for both Docker Compose (development/staging) and Kubernetes (production) deployments.

---

## Docker Compose Infrastructure

### Primary Stack (`docker-compose.yml`)

**Network:** `resident-cement-network` (bridge driver)

| Service | Image | Port Mapping | Volume | Restart |
|---------|-------|--------------|--------|---------|
| `residentcement` | Custom (residentcement:board-ready) | 8080→3001 | - | unless-stopped |
| `postgres` | postgres:16-alpine | 5432→5432 | postgres_data | unless-stopped |
| `mongodb` | mongo:7.0 | 27017→27017 | mongodb_data | unless-stopped |
| `redis` | redis:7-alpine | 6379→6379 | redis_data | unless-stopped |
| `zookeeper` | confluentinc/cp-zookeeper:7.5.0 | 2181 | - | unless-stopped |
| `kafka` | confluentinc/cp-kafka:7.5.0 | 9092→9092, 29092→29092 | kafka_data | unless-stopped |
| `kafka-ui` | provectuslabs/kafka-ui:latest | 8085→8080 | - | unless-stopped |
| `keycloak` | quay.io/keycloak:23.0 | 8180→8080 | - | unless-stopped |
| `minio` | minio/minio:latest | 9000→9000, 9002→9001 | minio_data | unless-stopped |

### Monitoring Stack (`docker-compose.monitoring.yml`)

**Network:** `resident-cement-monitoring` (bridge driver)

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `prometheus` | prom/prometheus:v2.48.0 | 9090 | Metrics collection |
| `grafana` | grafana/grafana:10.2.0 | 3200→3000 | Visualization/dashboards |
| `loki` | grafana/loki:2.9.3 | 3100 | Log aggregation |
| `promtail` | grafana/promtail:2.9.3 | - | Log shipper |
| `tempo` | grafana/tempo:2.3.1 | 3201, 4317, 4318 | Distributed tracing |
| `alertmanager` | prom/alertmanager:v0.26.0 | 9093 | Alert routing |
| `node-exporter` | prom/node-exporter:v1.7.0 | 9100 | Host metrics |
| `cadvisor` | gcr.io/cadvisor/cadvisor:v0.47.0 | 8088→8080 | Container metrics |

**Grafana Plugins Installed:**
- grafana-clock-panel
- grafana-simple-json-datasource
- grafana-piechart-panel

---

## Kubernetes Infrastructure

### Namespace

**File:** `infrastructure/k8s/namespace.yaml`

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: resident-cement
```

### Workload Manifests

| File | Purpose |
|------|---------|
| `api-gateway.yaml` | API Gateway deployment + service |
| `microservices.yaml` | Backend microservices deployments |
| `infrastructure.yaml` | Database, cache, message broker StatefulSets |
| `ingress.yaml` | Ingress rules and TLS termination |

---

## Container Security Analysis

### Dockerfile.simple (Production Image)

**Base Image:** `node:20-alpine`

**Security Features:**
```dockerfile
# Non-root user created
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs

# Production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Ownership set
RUN chown -R nodejs:nodejs /app

# Non-root user enforced
USER nodejs

# Health check configured
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3
```

**Security Labels:**
```dockerfile
LABEL audit.session="forensics1032026"
LABEL security.hardened="true"
```

**Exposed Port:** 3001

---

## Network Topology

### Docker Network Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                  resident-cement-network                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │residentcement│  │   postgres   │  │   mongodb    │          │
│  │  (3001)      │  │   (5432)     │  │   (27017)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    redis     │  │    kafka     │  │  keycloak    │          │
│  │   (6379)     │  │   (9092)     │  │   (8080)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │    minio     │  │  zookeeper   │                             │
│  │ (9000, 9001) │  │   (2181)     │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               resident-cement-monitoring-network                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  prometheus  │  │   grafana    │  │     loki     │          │
│  │   (9090)     │  │   (3000)     │  │   (3100)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    tempo     │  │alertmanager  │  │node-exporter │          │
│  │ (3200,4317)  │  │   (9093)     │  │   (9100)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │   cadvisor   │  │   promtail   │                             │
│  │   (8080)     │  │   (internal) │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Volume Persistence

| Volume Name | Service | Data Stored | Retention |
|-------------|---------|-------------|-----------|
| `postgres_data` | postgres | PostgreSQL data files | Persistent |
| `mongodb_data` | mongodb | MongoDB data files | Persistent |
| `redis_data` | redis | RDB/AOF snapshots | Persistent |
| `kafka_data` | kafka | Kafka log segments | Persistent |
| `minio_data` | minio | S3 objects | Persistent |
| `prometheus_data` | prometheus | TSDB metrics | 15 days |
| `grafana_data` | grafana | Dashboards, users | Persistent |
| `loki_data` | loki | Log chunks | Configurable |
| `tempo_data` | tempo | Trace data | Configurable |
| `alertmanager_data` | alertmanager | Silences, notifications | Persistent |

---

## Environment Variables (Infrastructure)

### Database Credentials

| Variable | Service | Default Value | Risk |
|----------|---------|---------------|------|
| `POSTGRES_PASSWORD` | postgres | `${DB_PASSWORD:-REDACTED_MVP}` | Medium |
| `MONGO_PASSWORD` | mongodb | `${MONGO_PASSWORD:-REDACTED_MVP}` | Medium |
| `DB_PASSWORD` | app | `REDACTED_MVP` | Medium |
| `MONGO_PASSWORD` | app | `REDACTED_MVP` | Medium |

### Application Secrets

| Variable | Service | Default Value | Risk |
|----------|---------|---------------|------|
| `JWT_SECRET` | app | `{REDACTED_2}_c534df0f16d125e6` | **High** |
| `API_KEY` | app | `REDACTED_MVP` | Medium |

### Third-Party Services

| Variable | Service | Default Value |
|----------|---------|---------------|
| `KEYCLOAK_ADMIN_PASSWORD` | keycloak | `admin_password_2026` |
| `MINIO_ROOT_PASSWORD` | minio | `minio_password_2026` |

---

## Health Check Configuration

| Service | Endpoint | Interval | Timeout | Retries |
|---------|----------|----------|---------|---------|
| `residentcement` | `http://localhost:3001/health` | 30s | 3s | 3 |
| `postgres` | `pg_isready -U resident_cement` | 10s | 5s | 5 |
| `prometheus` | `http://localhost:9090/-/healthy` | 30s | 10s | 3 |
| `grafana` | `http://localhost:3000/api/health` | 30s | 10s | 3 |
| `loki` | `http://localhost:3100/ready` | 30s | 10s | 3 |
| `tempo` | `http://localhost:3200/ready` | 30s | 10s | 3 |
| `alertmanager` | `http://localhost:9093/-/healthy` | 30s | 10s | 3 |

---

## Port Inventory

### External Ports (Host Accessible)

| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| 3001 | residentcement | HTTP | API Gateway (internal:8080) |
| 5432 | postgres | TCP | PostgreSQL |
| 27017 | mongodb | TCP | MongoDB |
| 6379 | redis | TCP | Redis |
| 9092 | kafka | TCP | Kafka broker (external) |
| 8085 | kafka-ui | HTTP | Kafka management UI |
| 8180 | keycloak | HTTP | Keycloak admin |
| 9000 | minio | HTTP | MinIO S3 API |
| 9001 | minio | HTTP | MinIO Console |
| 9090 | prometheus | HTTP | Prometheus UI |
| 3200 | grafana | HTTP | Grafana dashboards |
| 3100 | loki | HTTP | Loki API |
| 3201 | tempo | HTTP | Tempo API |
| 9093 | alertmanager | HTTP | Alertmanager UI |
| 9100 | node-exporter | HTTP | Node metrics |
| 8088 | cadvisor | HTTP | Container metrics |

### Internal Ports (Container Network)

| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| 29092 | kafka | TCP | Kafka broker (internal) |
| 2181 | zookeeper | TCP | Zookeeper client |
| 4317 | tempo | gRPC | OTLP gRPC |
| 4318 | tempo | HTTP | OTLP HTTP |

---

## Infrastructure Dependencies

### Application → Infrastructure

```
residentcement
├── postgres:5432 (DATABASE_URL)
├── mongodb:27017 (MONGODB_URI)
├── redis:6379 (REDIS_URL)
├── kafka:29092 (KAFKA_BROKERS)
└── keycloak:8080 (KEYCLOAK_URL)
```

### Monitoring → Application

```
prometheus
├── scrapes residentcement:3001/metrics
├── scrapes postgres:9187 (if exporter enabled)
├── scrapes kafka:9090 (JMX exporter)
└── scrapes node-exporter:9100

loki ← promtail
└── collects logs from /var/log/app

tempo
└── receives traces via OTLP (4317, 4318)
```

---

## Resource Constraints

**Note:** No explicit resource limits found in docker-compose.yml.

**Recommendations:**
- Add `deploy.resources.limits` for CPU/memory
- Configure PostgreSQL shared_buffers
- Set Kafka heap size (KAFKA_HEAP_OPTS)
- Limit MinIO storage capacity

---

## Disaster Recovery

### Backup Strategy

| Component | Backup Method | Frequency |
|-----------|---------------|-----------|
| PostgreSQL | `pg_dump` via cron | Daily |
| MongoDB | `mongodump` via cron | Daily |
| Redis | RDB snapshots | On write |
| MinIO | mc mirror to remote | Continuous |
| Kafka | Log segment replication | Real-time |

### Volume Backup Commands

```bash
# PostgreSQL backup
docker exec resident-cement-postgres pg_dump -U resident_cement resident_cement > backup.sql

# MongoDB backup
docker exec resident-cement-mongo mongodump --authenticationDatabase admin -u resident_cement -p *** --out /backup

# MinIO backup
mc mirror myminio/bucket /backup/minio
```

---

## Infrastructure Risks

| Risk | Severity | Evidence |
|------|----------|----------|
| Default passwords in docker-compose | **High** | `admin_password_2026`, `minio_password_2026` |
| No network segmentation | Medium | All services on single network |
| No resource limits | Medium | No CPU/memory constraints |
| Kafka auto-create topics | Low | `KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"` |
| Keycloak dev mode | Medium | `command: start-dev` |
| Exposed database ports | Medium | 5432, 27017 exposed to host |
| cAdvisor privileged | Low | `privileged: true` |

---

## Kubernetes vs Docker Compose Parity

| Component | Docker Compose | Kubernetes |
|-----------|----------------|------------|
| API Gateway | ✓ | ✓ (api-gateway.yaml) |
| Microservices | ✓ (bundled) | ✓ (microservices.yaml) |
| PostgreSQL | ✓ | ✓ (infrastructure.yaml) |
| MongoDB | ✓ | ✓ (infrastructure.yaml) |
| Redis | ✓ | ✓ (infrastructure.yaml) |
| Kafka | ✓ | ✓ (infrastructure.yaml) |
| Keycloak | ✓ | ✓ (infrastructure.yaml) |
| MinIO | ✓ | ✓ (infrastructure.yaml) |
| Monitoring | ✓ (separate compose) | TBD |

---

**END OF REPORT**
