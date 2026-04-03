# Engineer Deployment Guide - ResidentCement ERP

## Quick Reference

| Item | Value |
|------|-------|
| **Repository** | `https://github.com/klmayua/residentcement.git` |
| **Branch** | `build-phase-1` |
| **Deploy Target** | Ubuntu 22.04 LTS VPS |
| **Container Engine** | Docker + Docker Compose |
| **Total Screens** | 25 |

---

## 1. VPS Requirements

### Minimum Specifications
```
CPU: 4 vCPU cores
RAM: 8 GB minimum (16 GB recommended)
Disk: 100 GB SSD (200 GB recommended for production data)
OS: Ubuntu 22.04 LTS (fresh install)
Network: Static IP, ports 22, 80, 443, 8080, 3000-3010 open
```

### Recommended VPS Providers
- **DigitalOcean**: Droplet with 8GB RAM (~$48/month)
- **AWS**: t3.xlarge or t3.2xlarge
- **Linode**: Dedicated 8GB plan
- **Vultr**: High Frequency 4 vCPU / 8GB

---

## 2. Pre-Deployment Server Setup

### SSH into your VPS
```bash
ssh root@YOUR_VPS_IP
```

### Create Deployment User
```bash
# Create user (recommended over root)
useradd -m -s /bin/bash residentcement
usermod -aG sudo residentcement
passwd residentcement

# Switch to user
su - residentcement
```

### Install Docker
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version  # Should show 24.0+
docker compose version  # Should show 2.20+
```

### Install Required Tools
```bash
sudo apt install -y git curl wget nano htop nginx certbot python3-certbot-nginx
```

---

## 3. Repository Setup

### Clone the Repository
```bash
# Create application directory
mkdir -p ~/apps
cd ~/apps

# Clone from GitHub
git clone https://github.com/klmayua/residentcement.git
cd residentcement

# Checkout the correct branch
git checkout build-phase-1

# Verify latest commit
git log --oneline -5
# Should show: fc22567 - Update sidebar navigation with new ERP modules
```

### Verify File Structure
```bash
# Check key files exist
ls -la docker-compose.yml
ls -la docker-compose.prod.yml
ls -la frontend/apps/admin-dashboard/src/app/\(dashboard\)/
ls -la backend/services/

# Verify 25 screens
find frontend/apps/admin-dashboard/src/app -name "page.tsx" | wc -l
# Should output: 25
```

---

## 4. Environment Configuration

### Create Environment File
```bash
cd ~/apps/residentcement

# Copy example environment
cp .env.example .env
nano .env
```

### Required Environment Variables
```bash
# ================================================
# DATABASE (PostgreSQL)
# ================================================
DB_USER=residentcement
DB_PASSWORD=$(openssl rand -base64 32)  # Generate strong password
DB_NAME=residentcement_prod
DB_PORT=5432

# ================================================
# MONGODB
# ================================================
MONGO_USER=residentcement
MONGO_PASSWORD=$(openssl rand -base64 32)
MONGO_DB=residentcement_prod

# ================================================
# REDIS
# ================================================
REDIS_PASSWORD=$(openssl rand -base64 32)

# ================================================
# JWT & SECURITY
# ================================================
JWT_SECRET=$(openssl rand -base64 64)
API_KEY=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# ================================================
# PAYSTACK PAYMENT
# ================================================
# Use production keys from Paystack dashboard
PAYSTACK_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
PAYSTACK_PUBLIC_KEY=pk_live_YOUR_PRODUCTION_KEY

# ================================================
# AFRICA'S TALKING (USSD/SMS)
# ================================================
AT_USERNAME=ResidentCement
AT_API_KEY=your_africas_talking_api_key
AT_SHORTCODE=*384#
AT_SENDER_ID=ResidentCement

# ================================================
# MINIO (Object Storage)
# ================================================
MINIO_USER=minio_admin
MINIO_PASSWORD=$(openssl rand -base64 32)

# ================================================
# KEYCLOAK (SSO)
# ================================================
KEYCLOAK_ADMIN=admin
KEYCLOAK_PASSWORD=$(openssl rand -base64 32)

# ================================================
# GRAFANA MONITORING
# ================================================
GRAFANA_PASSWORD=$(openssl rand -base64 16)

# ================================================
# DOMAINS
# ================================================
DOMAIN_CORPORATE=residentcement.nyamabo.com
DOMAIN_DEALERS=rcdportal.nyamabo.com
DOMAIN_B2B=rcb2bportal.nyamabo.com
DOMAIN_ERP=rcerp.nyamabo.com

# ================================================
# SSL / EMAIL
# ================================================
ACME_EMAIL=admin@nyamabo.com

# ================================================
# LOGGING
# ================================================
LOG_LEVEL=info
```

### Secure Environment File
```bash
chmod 600 .env
```

---

## 5. Build and Deploy

### Option A: Production Deployment (Recommended)
```bash
cd ~/apps/residentcement

# Build and start all services
sudo docker compose -f docker-compose.prod.yml up -d --build

# Wait for services to start (2-3 minutes)
sleep 180

# Verify all services are running
sudo docker compose -f docker-compose.prod.yml ps
```

### Option B: Development Deployment
```bash
cd ~/apps/residentcement

# Start with dev compose (if testing)
sudo docker compose up -d --build
```

### Verify Deployment
```bash
# Check all containers are healthy
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:3000/api/health

# Check logs if any issues
sudo docker logs residentcement-gateway --tail 100
sudo docker logs residentcement-postgres --tail 50
```

---

## 6. Database Setup

### Run Migrations
```bash
cd ~/apps/residentcement

# Deploy database migrations
sudo docker compose -f docker-compose.prod.yml exec -T gateway npx prisma migrate deploy

# Verify database tables
sudo docker compose -f docker-compose.prod.yml exec postgres psql -U $DB_USER -d $DB_NAME -c "\dt"
```

### Seed Initial Data (Optional)
```bash
# Seed admin user and default data
sudo docker compose -f docker-compose.prod.yml exec -T gateway npx prisma db seed
```

### Create Admin User Manually
```bash
# If seed fails, create admin via API
curl -X POST http://localhost:3001/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@residentcement.com",
    "password": "SecureTempPass123!",
    "firstName": "System",
    "lastName": "Administrator",
    "role": "SUPER_ADMIN"
  }'
```

---

## 7. Nginx Reverse Proxy & SSL

### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/residentcement
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/residentcement

upstream erp_backend {
    server localhost:3000;
    keepalive 32;
}

upstream gateway_backend {
    server localhost:3001;
    keepalive 32;
}

# ERP Dashboard
server {
    listen 80;
    server_name rcerp.nyamabo.com;
    
    location / {
        proxy_pass http://erp_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# API Gateway
server {
    listen 80;
    server_name api.residentcement.nyamabo.com;
    
    location / {
        proxy_pass http://gateway_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Corporate Website
server {
    listen 80;
    server_name residentcement.nyamabo.com;
    
    location / {
        proxy_pass http://localhost:18081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/residentcement /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificates
sudo certbot --nginx -d rcerp.nyamabo.com -d api.residentcement.nyamabo.com -d residentcement.nyamabo.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## 8. Post-Deployment Verification

### Test All Endpoints
```bash
# Test ERP login page
curl -s -o /dev/null -w "%{http_code}" https://rcerp.nyamabo.com/login
# Expected: 200

# Test API health
curl -s https://api.residentcement.nyamabo.com/health | jq
# Expected: {"status":"healthy"}

# Test corporate website
curl -s -o /dev/null -w "%{http_code}" https://residentcement.nyamabo.com
# Expected: 200
```

### Verify All Screens
```bash
# List of all 25 routes to verify
ROUTES=(
    "/"
    "/login"
    "/dashboard"
    "/analytics"
    "/board"
    "/orders"
    "/products"
    "/inventory"
    "/customers"
    "/production"
    "/logistics"
    "/logistics/fleet"
    "/logistics/dispatch"
    "/logistics/tracking"
    "/payments"
    "/quality"
    "/ess"
    "/ess/profile"
    "/ess/payslips"
    "/ess/leave"
    "/ess/expenses"
    "/investor"
    "/investor/reports"
    "/users"
    "/settings"
)

# Test each route (requires authentication, so expect 302 redirect to login)
for route in "${ROUTES[@]}"; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "https://rcerp.nyamabo.com${route}")
    echo "${route}: ${code}"
done
```

### Check Service Status
```bash
# View all running containers
echo "=== CONTAINER STATUS ==="
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.State}}"

# Check resource usage
echo "=== RESOURCE USAGE ==="
sudo docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# View recent logs
echo "=== RECENT LOGS ==="
sudo docker logs --since 5m residentcement-gateway
echo "..."
```

---

## 9. Monitoring Setup

### Access Monitoring Dashboards

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| Grafana | `https://rcerp.nyamabo.com:3001/grafana` | admin / [GRAFANA_PASSWORD] |
| Kafka UI | `http://localhost:8085` | - |
| MinIO Console | `http://localhost:9002` | [MINIO_USER] / [MINIO_PASSWORD] |
| Keycloak | `http://localhost:8180` | [KEYCLOAK_ADMIN] / [KEYCLOAK_PASSWORD] |

### Setup Uptime Monitoring
```bash
# Install node exporter for Prometheus (optional)
sudo docker run -d \
  --net="host" \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  quay.io/prometheus/node-exporter:latest \
  --path.rootfs=/host
```

---

## 10. Backup Configuration

### Automated Database Backups
```bash
# Create backup script
mkdir -p ~/apps/residentcement/backups
nano ~/apps/residentcement/scripts/backup.sh
```

```bash
#!/bin/bash
# ~/apps/residentcement/scripts/backup.sh

BACKUP_DIR="$HOME/apps/residentcement/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
docker exec residentcement-postgres pg_dump -U residentcement residentcement_prod | gzip > "${BACKUP_DIR}/postgres_${TIMESTAMP}.sql.gz"

# Keep only last 7 days
find ${BACKUP_DIR} -name "postgres_*.sql.gz" -mtime +7 -delete

echo "Backup completed: postgres_${TIMESTAMP}.sql.gz"
```

```bash
# Make executable and add to crontab
chmod +x ~/apps/residentcement/scripts/backup.sh
crontab -e

# Add line for daily backup at 2 AM
0 2 * * * /home/residentcement/apps/residentcement/scripts/backup.sh >> /var/log/residentcement-backup.log 2>&1
```

---

## 11. Troubleshooting

### Container Won't Start
```bash
# Check logs
sudo docker logs residentcement-gateway --tail 100

# Check for port conflicts
sudo netstat -tlnp | grep -E '3000|3001|5432|6379'

# Restart specific service
sudo docker compose -f docker-compose.prod.yml restart gateway
```

### Database Connection Issues
```bash
# Check database is running
sudo docker compose -f docker-compose.prod.yml ps postgres

# Check database logs
sudo docker logs residentcement-postgres --tail 50

# Test connection manually
docker exec -it residentcement-postgres psql -U residentcement -d residentcement_prod -c "SELECT NOW();"
```

### Out of Disk Space
```bash
# Clean up old images and volumes
docker system prune -af --volumes

# Check disk usage
docker system df

# Resize volume if using cloud provider (DigitalOcean example)
# - Shutdown droplet
# - Resize from dashboard
# - Extend partition: sudo resize2fs /dev/disk/by-label/DOROOT
```

### Memory Issues
```bash
# Check memory usage
free -h

# Add swap if needed (8GB)
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 12. Update Deployment

### Pull Latest Changes
```bash
cd ~/apps/residentcement

# Pull latest from build-phase-1 branch
git fetch origin
git checkout build-phase-1
git pull origin build-phase-1

# Verify latest commit
git log --oneline -3
```

### Rebuild and Deploy
```bash
# Rebuild and restart (zero downtime with rolling update)
sudo docker compose -f docker-compose.prod.yml up -d --build --no-deps gateway

# Or full restart if needed
sudo docker compose -f docker-compose.prod.yml down
sudo docker compose -f docker-compose.prod.yml up -d --build

# Clean up old images
docker image prune -f
```

---

## 13. Rollback Procedure

### Rollback to Previous Version
```bash
cd ~/apps/residentcement

# View previous commits
git log --oneline -10

# Rollback to specific commit
git checkout <COMMIT_HASH>

# Rebuild
sudo docker compose -f docker-compose.prod.yml up -d --build
```

### Database Rollback
```bash
# List available backups
ls -la ~/apps/residentcement/backups/

# Restore from backup
gunzip < backup_file.sql.gz | docker exec -i residentcement-postgres psql -U residentcement -d residentcement_prod
```

---

## 14. Security Hardening

### Firewall Setup
```bash
# Enable UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Check status
sudo ufw status verbose
```

### Fail2Ban Setup
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Configure
sudo tee /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
EOF

sudo systemctl restart fail2ban
```

### Docker Security
```bash
# Run Docker Bench Security (optional)
docker run -it --net host --pid host --userns host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/lib/systemd:/usr/lib/systemd \
  -v /etc:/etc --label docker_bench_security \
  docker/docker-bench-security
```

---

## Deployment Checklist

- [ ] VPS provisioned with Ubuntu 22.04 LTS
- [ ] Domain DNS records point to VPS IP
- [ ] Docker and Docker Compose installed
- [ ] Repository cloned from GitHub (`build-phase-1` branch)
- [ ] `.env` file created with all secrets
- [ ] `docker-compose.prod.yml` deployed successfully
- [ ] Database migrations applied
- [ ] Nginx configured with SSL certificates
- [ ] All 25 screens accessible
- [ ] Admin user created
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Firewall configured
- [ ] SSL certificates auto-renewing

---

## Quick Commands Reference

```bash
# Start all services
cd ~/apps/residentcement && sudo docker compose -f docker-compose.prod.yml up -d

# Stop all services
sudo docker compose -f docker-compose.prod.yml down

# View logs
sudo docker compose -f docker-compose.prod.yml logs -f

# Restart specific service
sudo docker compose -f docker-compose.prod.yml restart gateway

# Shell into container
sudo docker exec -it residentcement-gateway /bin/sh

# Database shell
sudo docker exec -it residentcement-postgres psql -U residentcement -d residentcement_prod

# View environment
cat ~/apps/residentcement/.env | grep -v PASSWORD
```

---

**Support**: For deployment issues, check logs with `docker-compose logs` and verify DNS configuration.

**Last Updated**: April 2026
**Version**: 1.0 (ERP Modules 5-10 Complete)
