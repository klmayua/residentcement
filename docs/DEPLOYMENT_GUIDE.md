# ResidentCement Production Deployment Guide

**Version:** 2030.1.0  
**Last Updated:** 2026-03-11  
**Status:** PRODUCTION READY ✅

---

## Prerequisites

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 4 cores | 8 cores |
| RAM | 8 GB | 16 GB |
| Storage | 50 GB | 100 GB SSD |
| Network | 1 Gbps | 10 Gbps |

### Software Requirements

- Docker 24+ and Docker Compose 2.20+
- Node.js 20 LTS
- PostgreSQL 16
- MongoDB 7.0
- Redis 7
- Kafka 7.5
- Keycloak 23.0

---

## Phase 1: Pre-Deployment Checklist

### 1.1 Secret Generation

**CRITICAL:** Generate all secrets before deployment.

```bash
# Navigate to project directory
cd C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement

# Run secret rotation script
bash scripts/rotate_secrets.sh
```

**Secrets to Generate:**
- [ ] JWT_SECRET (64 characters base64)
- [ ] POSTGRES_PASSWORD (32 characters base64)
- [ ] MONGO_PASSWORD (32 characters base64)
- [ ] API_KEY (64 characters hex)
- [ ] MINIO_ACCESS_KEY (40 characters hex)
- [ ] MINIO_SECRET_KEY (64 characters hex)
- [ ] ENCRYPTION_KEY (64 characters hex)

### 1.2 Environment Configuration

1. Copy `.env.production.template` to `.env.production`
2. Replace all `REPLACE_WITH_*` placeholders with generated secrets
3. Verify all URLs point to production domains

```bash
# Copy template
cp .env.production.template .env.production

# Edit with your secrets (use a secure editor)
# IMPORTANT: Never commit .env.production to git
```

### 1.3 Keycloak Configuration

1. **Create Realm:**
   - Name: `resident-cement`
   - Display Name: `ResidentCement`

2. **Create Client:**
   - Client ID: `resident-cement-api`
   - Client Protocol: `openid-connect`
   - Access Type: `bearer-only`
   - Standard Flow Enabled: `false`
   - Direct Access Grants Enabled: `true`

3. **Create Roles:**
   - `admin` - Full system access
   - `staff` - Operational access
   - `distributor` - B2B customer access
   - `sales_rep` - Sales team access
   - `viewer` - Read-only access

4. **Configure JWKS:**
   - Note the JWKS URL: `https://auth.residentcement.com/realms/resident-cement/protocol/openid-connect/certs`
   - Update `.env.production` with correct JWKS URL

### 1.4 Database Setup

```bash
# Verify PostgreSQL is accessible
docker run --rm postgres:16-alpine pg_isready -h postgres -p 5432

# Verify MongoDB is accessible
docker run --rm mongo:7.0 mongosh --host mongodb --eval "db.adminCommand('ping')"
```

---

## Phase 2: Docker Deployment

### 2.1 Build Production Images

```bash
# Navigate to project root
cd C:\Users\UCHE\my-qwen-project\PROJECTS\ResidentCement

# Build main application image
docker build -f Dockerfile.simple \
  -t residentcement:2030.1.0 \
  -t residentcement:latest \
  .

# Verify build
docker images | grep residentcement
```

### 2.2 Start Infrastructure Services

```bash
# Start only infrastructure (databases, cache, message bus)
docker-compose up -d postgres mongodb redis kafka zookeeper minio keycloak

# Wait for services to be ready
echo "Waiting for services to start (60 seconds)..."
sleep 60

# Verify all services are healthy
docker-compose ps
```

### 2.3 Deploy Application

```bash
# Deploy with production environment
docker-compose --env-file .env.production up -d residentcement

# Check deployment status
docker-compose ps residentcement

# View application logs
docker-compose logs -f residentcement
```

### 2.4 Health Check Verification

```bash
# Basic health check
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","service":"api-gateway","version":"1.0.0"}

# Detailed health check
curl http://localhost:8080/health/detailed
```

---

## Phase 3: Database Migration

### 3.1 Run Prisma Migrations

```bash
# Navigate to gateway directory
cd backend/gateway

# Generate Prisma client (ensures schema is synced)
npm run prisma:generate

# Run migrations
npm run migrate

# Verify migration status
npx prisma migrate status
```

### 3.2 Seed Initial Data

```bash
# Seed database with initial data
npm run seed

# Verify seed data
npx prisma studio
```

### 3.3 Create Admin User

```bash
# Create initial admin user via API
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@residentcement.com",
    "password": "CHANGE_ME_IMMEDIATELY",
    "firstName": "System",
    "lastName": "Administrator",
    "companyName": "ResidentCement",
    "phone": "+234-000-0000",
    "address": "Head Office",
    "city": "Lagos",
    "state": "Lagos"
  }'

# IMPORTANT: Change the default admin password immediately after first login
```

---

## Phase 4: Verification

### 4.1 Service Health Checks

| Service | URL | Expected Status |
|---------|-----|-----------------|
| API Gateway | http://localhost:8080/health | 200 OK |
| PostgreSQL | localhost:5432 | Connected |
| MongoDB | localhost:27017 | Connected |
| Redis | localhost:6379 | Connected |
| Kafka UI | http://localhost:8085 | 200 OK |
| Keycloak | http://localhost:8180 | 200 OK |
| MinIO Console | http://localhost:9002 | 200 OK |

### 4.2 API Endpoint Tests

```bash
# Test authentication (should fail without token)
curl http://localhost:8080/api/v1/customers
# Expected: 401 Unauthorized

# Test health endpoint (should succeed)
curl http://localhost:8080/health
# Expected: 200 OK

# Test with valid token (after obtaining from Keycloak)
TOKEN=$(curl -X POST http://localhost:8180/realms/resident-cement/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&client_id=resident-cement-api&username=admin@residentcement.com&password=YOUR_PASSWORD" \
  | jq -r '.access_token')

curl http://localhost:8080/api/v1/customers \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK with customer list
```

### 4.3 Log Verification

```bash
# Check for errors in logs
docker-compose logs residentcement | grep -i error

# Check for successful startup
docker-compose logs residentcement | grep "API Gateway running"
# Expected: "API Gateway running on port 3001"
```

---

## Phase 5: Post-Deployment

### 5.1 Monitoring Setup

1. **Start Monitoring Stack:**
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

2. **Access Dashboards:**
   - Grafana: http://localhost:3200 (admin/admin_password_2026)
   - Prometheus: http://localhost:9090
   - Loki: http://localhost:3100

3. **Import Dashboards:**
   - Import dashboard ID 1860 (Node.js Exporter)
   - Import dashboard ID 10976 (PostgreSQL)
   - Import dashboard ID 2587 (MongoDB)

### 5.2 Backup Configuration

```bash
# Create backup script
cat > scripts/backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="/backups/residentcement/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# PostgreSQL backup
docker exec resident-cement-postgres pg_dump -U resident_cement resident_cement > $BACKUP_DIR/postgres.sql

# MongoDB backup
docker exec resident-cement-mongo mongodump --authenticationDatabase admin -u resident_cement -p $MONGO_PASSWORD --out $BACKUP_DIR/mongodb

# Compress backup
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "Backup completed: $BACKUP_DIR.tar.gz"
EOF

chmod +x scripts/backup.sh

# Schedule daily backups (add to crontab)
0 2 * * * /path/to/scripts/backup.sh
```

### 5.3 SSL/TLS Configuration

For production, configure HTTPS:

```nginx
# Example nginx reverse proxy configuration
server {
    listen 443 ssl http2;
    server_name api.residentcement.com;

    ssl_certificate /etc/ssl/certs/residentcement.crt;
    ssl_certificate_key /etc/ssl/private/residentcement.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

**Symptoms:** Container exits immediately

**Diagnosis:**
```bash
docker-compose logs residentcement
```

**Solutions:**
- Check DATABASE_URL is correct
- Verify PostgreSQL is running: `docker-compose ps postgres`
- Check JWT_SECRET is at least 32 characters

#### 2. Database Connection Errors

**Symptoms:** "Connection refused" or "Authentication failed"

**Solutions:**
- Verify credentials in `.env.production`
- Check network connectivity: `docker network inspect resident-cement-network`
- Restart database containers: `docker-compose restart postgres`

#### 3. JWT Verification Fails

**Symptoms:** 401 Unauthorized on all protected endpoints

**Solutions:**
- Verify Keycloak is running
- Check JWKS_URL is accessible: `curl $KEYCLOAK_JWKS_URL`
- Verify JWT_ISSUER matches Keycloak realm

#### 4. Prisma Client Errors

**Symptoms:** "Prisma Client not generated"

**Solutions:**
```bash
cd backend/gateway
npm run prisma:generate
docker-compose restart residentcement
```

---

## Rollback Procedure

### Quick Rollback

```bash
# Stop current deployment
docker-compose down

# Revert to previous image version
docker-compose --env-file .env.production up -d

# Verify rollback
curl http://localhost:8080/health
```

### Database Rollback

```bash
# List migrations
npx prisma migrate status

# Rollback one migration
npx prisma migrate resolve --rolled-back <migration_name>

# Or restore from backup
psql -U resident_cement -d resident_cement < backup.sql
```

---

## Security Hardening (Post-Deployment)

### 1. Update Default Passwords

- [ ] Keycloak admin password
- [ ] MinIO root password
- [ ] Grafana admin password
- [ ] PostgreSQL superuser password
- [ ] MongoDB root password

### 2. Network Isolation

```yaml
# Add to docker-compose.yml
services:
  residentcement:
    networks:
      - frontend-network
      - backend-network
  
  postgres:
    networks:
      - backend-network  # Not exposed to frontend

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true  # No external access
```

### 3. Resource Limits

```yaml
# Add to docker-compose.yml
services:
  residentcement:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## Support Contacts

| Issue | Contact | Escalation |
|-------|---------|------------|
| Technical | dev-team@residentcement.com | CTO |
| Security | security@residentcement.com | CISO |
| Infrastructure | ops@residentcement.com | VP Engineering |

---

## Deployment Sign-Off

```
================================================================================
                    PRODUCTION DEPLOYMENT CHECKLIST
================================================================================

Deployment Date: _______________
Version: 2030.1.0
Deployed By: _______________

Pre-Deployment:
[ ] Secrets generated and secured
[ ] Environment configuration complete
[ ] Keycloak realm configured
[ ] Database accessible
[ ] Backup procedure tested

Deployment:
[ ] Docker images built successfully
[ ] Infrastructure services started
[ ] Application deployed
[ ] Health checks passing
[ ] Database migrations run
[ ] Initial data seeded

Post-Deployment:
[ ] Monitoring configured
[ ] Backups scheduled
[ ] SSL/TLS configured
[ ] Default passwords changed
[ ] Security scan passed

Sign-Off:
Deployed By: _______________ Date: _______________
Approved By: _______________ Date: _______________

================================================================================
```

---

**Document Classification:** CONFIDENTIAL  
**Distribution:** Operations Team, DevOps Team  
**Review Cycle:** Quarterly
