# ResidentCement - VPS Deployment Checklist
## Final Sweep Complete ✅

**Date:** March 21, 2026
**Status:** Ready for VPS Deployment

---

## ✅ COMPLETED IN FINAL SWEEP

### 1. USSD Service - Africa's Talking Integration
- ✅ Africa's Talking SDK enabled and configured
- ✅ Request validation middleware added
- ✅ SMS sending with phone number formatting
- ✅ Auto-replies for incoming SMS (balance, help, price, order)
- ✅ Docker Compose integration (dev + prod)
- ✅ Environment variables in `.env.example`

### 2. Docker Compose Production
- ✅ Added **accounting-service** (port 3011)
- ✅ Added **reporting-service** (port 3012)
- ✅ Added **ussd-service** (port 4008)
- ✅ Updated gateway environment with new service URLs
- ✅ All 13 microservices now in `docker-compose.prod.yml`

### 3. Environment Configuration
- ✅ Africa's Talking variables in root `.env.example`
- ✅ AT_SMS_ENABLED toggle for production
- ✅ Updated package.json dev scripts for all services

---

## 📊 FINAL PROJECT STATUS

| Component | Count | Status |
|-----------|-------|--------|
| **Backend Services** | 13 | ✅ All containerized |
| **Frontend Apps** | 4 | ✅ All with Dockerfiles |
| **Database Models** | 40+ | ✅ Prisma schema complete |
| **API Endpoints** | 200+ | ✅ Documented |
| **Dockerfiles** | 17 | ✅ All services |
| **Docker Compose** | 2 | ✅ Dev + Prod |
| **USSD Integration** | 1 | ✅ Africa's Talking |

### Services Deployed (13)
```
Core Services (10):
├── API Gateway (3001)
├── Customer Service (3002)
├── Inventory Service (3003)
├── Pricing Service (3004)
├── Payment Service (3005)
├── Product Service (3006)
├── Order Service (3007)
├── Plant MES (3008)
├── Quality Service (3009)
└── Logistics Service (3010)

ERP Services (3):
├── Accounting Service (3011) - Nigerian GAAP
├── Reporting Service (3012) - FIRS Reports
└── USSD Service (4008) - Africa's Talking
```

### Frontend Apps (4)
```
├── Distributor Portal (3000)
├── Admin Dashboard (3001/3002)
├── Corporate Website (3003)
└── Sales Rep Mobile App (3004)
```

---

## 🚀 VPS DEPLOYMENT REQUIREMENTS

### Minimum VPS Specs (Production)
```
CPU: 4 vCPU cores
RAM: 16 GB (8GB minimum for small deployments)
Disk: 100 GB SSD
OS: Ubuntu 22.04 LTS
Network: Public IP, ports 80/443 open
```

### Required Software
```bash
# Docker & Docker Compose
docker --version  # 24.0+
docker compose version  # 2.20+

# Git
git --version

# Optional: nginx for reverse proxy
nginx -v
```

---

## 📋 DEPLOYMENT STEPS

### Step 1: Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin

# Create app directory
mkdir -p /opt/residentcement
cd /opt/residentcement
```

### Step 2: Clone Repository
```bash
git clone https://github.com/klmayua/ResidentCement.git .
# Or copy project files
```

### Step 3: Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Generate secure secrets
JWT_SECRET=$(openssl rand -base64 64)
DB_PASSWORD=$(openssl rand -base64 32)

# Edit .env with production values
nano .env
```

**Required .env values for production:**
```bash
# Database
DB_PASSWORD=your_secure_db_password
DB_USER=residentcement
DB_NAME=residentcement

# JWT
JWT_SECRET=your_64_char_secret_here

# Payment Gateway (Paystack - get from dashboard)
PAYSTACK_SECRET_KEY=sk_live_your_live_key_here
PAYSTACK_PUBLIC_KEY=pk_live_your_live_key_here

# Africa's Talking (get from africastalking.com)
AT_USERNAME=your_at_username
AT_API_KEY=your_at_api_key
AT_SHORTCODE=*384*12345#
AT_SMS_ENABLED=true  # Enable for production

# Redis
REDIS_PASSWORD=your_secure_redis_password

# MinIO
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
```

### Step 4: Deploy with Docker Compose
```bash
# Deploy production stack
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

### Step 5: Verify Deployment
```bash
# Health checks
curl http://localhost:3001/health  # Gateway
curl http://localhost:4008/health  # USSD

# Check all services
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 🔐 SECURITY CHECKLIST

- [ ] Change all default passwords
- [ ] Enable UFW firewall
- [ ] Configure fail2ban
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Enable AT_SMS_ENABLED only after testing
- [ ] Rotate Paystack test keys to live keys
- [ ] Configure log rotation
- [ ] Set up automated backups

---

## 📱 USSD CONFIGURATION

### Africa's Talking Production Setup

1. **Get Credentials**
   - Register: https://account.africastalking.com/
   - Get API Key and Username
   - Request USSD shortcode (e.g., `*384*12345#`)

2. **Configure Webhook**
   - In AT Dashboard: SMS & USSD → USSD
   - Callback URL: `https://api.residentcement.com/ussd`
   - Delivery Reports: `https://api.residentcement.com/ussd/delivery`

3. **Test USSD**
   ```bash
   curl -X POST https://api.residentcement.com/ussd \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "sessionId=test123" \
     -d "phoneNumber=+2348012345678" \
     -d "serviceCode=*384*12345#" \
     -d "text="
   ```

---

## 🔧 TROUBLESHOOTING

### Services Not Starting
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs service-name

# Restart service
docker compose -f docker-compose.prod.yml restart service-name
```

### Database Connection Issues
```bash
# Check database health
docker compose -f docker-compose.prod.yml ps postgres

# Manual migration
docker compose -f docker-compose.prod.yml run --rm db-migrate
```

### USSD Not Working
```bash
# Check USSD service
curl http://localhost:4008/health

# Verify AT credentials in .env
grep AT_ .env
```

---

## 📊 MONITORING

### Access Points
```
Grafana:      http://your-vps-ip:3200 (if configured)
API Docs:     http://your-vps-ip:3001/api-docs
Health:       http://your-vps-ip:3001/health
USSD Test:    http://your-vps-ip:4008/ussd/test
```

---

## ✅ PRE-DEPLOYMENT VERIFICATION

- [ ] All 13 services have Dockerfiles
- [ ] docker-compose.prod.yml includes all services
- [ ] .env file configured with production values
- [ ] Africa's Talking credentials obtained
- [ ] Paystack live keys ready
- [ ] Database passwords generated
- [ ] JWT secret generated (64+ chars)
- [ ] VPS meets minimum specs
- [ ] Domain DNS configured (if using custom domain)
- [ ] SSL certificates ready (if not using auto-ssl)

---

## 🎯 POST-DEPLOYMENT CHECKLIST

- [ ] All containers running (`docker ps`)
- [ ] Health checks passing
- [ ] USSD working via AT
- [ ] Payment gateway configured
- [ ] Email notifications working
- [ ] Backups configured
- [ ] Monitoring dashboards accessible
- [ ] Documentation updated

---

**Ready for VPS deployment!** 🚀
