# ResidentCement Production Deployment Guide

## Overview

This guide covers deploying the ResidentCement platform to production using Docker Compose with Traefik reverse proxy.

## Prerequisites

- Linux server (Ubuntu 22.04 LTS recommended)
- Docker 24.0+ and Docker Compose 2.20+
- Domain names configured:
  - `residentcement.com` (corporate website)
  - `app.residentcement.com` (distributor portal)
  - `api.residentcement.com` (API gateway)
  - `grafana.residentcement.com` (monitoring)
- SSL certificates (auto-provisioned via Let's Encrypt)

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/klmayua/ResidentCement.git
cd ResidentCement

# 2. Configure environment
cp infrastructure/docker/.env.example infrastructure/docker/.env
# Edit .env with production values

# 3. Deploy
cd infrastructure/docker
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify
curl https://api.residentcement.com/health
```

## Detailed Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Create directories
sudo mkdir -p /opt/residentcement
sudo chown $USER:$USER /opt/residentcement
```

### 2. Environment Configuration

Create `.env` file:

```bash
# Database
DB_USER=residentcement
DB_PASSWORD=$(openssl rand -base64 32)
DB_NAME=residentcement

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)

# Paystack (production keys)
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...

# Grafana
GRAFANA_PASSWORD=$(openssl rand -base64 16)

# Domains
DOMAIN_RESIDENTCEMENT=residentcement.com
DOMAIN_API=api.residentcement.com
DOMAIN_APP=app.residentcement.com

# Email for SSL
ACME_EMAIL=admin@residentcement.com
```

### 3. Database Migration

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec gateway npx prisma migrate deploy

# Seed initial data (optional)
docker-compose -f docker-compose.prod.yml exec gateway npx prisma db seed
```

### 4. SSL Certificates

Traefik automatically provisions SSL certificates via Let's Encrypt. First run may take a few minutes.

### 5. Monitoring Setup

Access monitoring dashboards:
- Grafana: https://grafana.residentcement.com
- Prometheus: https://prometheus.residentcement.com
- Traefik Dashboard: https://monitor.residentcement.com

Default Grafana credentials: admin / (from GRAFANA_PASSWORD env var)

### 6. Backup Configuration

```bash
# Setup automated backups
sudo mkdir -p /opt/residentcement/backups
sudo cp infrastructure/scripts/backup-database.sh /opt/residentcement/
sudo chmod +x /opt/residentcement/backup-database.sh

# Setup cron
sudo infrastructure/scripts/setup-cron.sh
```

## Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f gateway
```

### Update Deployment

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Restart with new images
docker-compose -f docker-compose.prod.yml up -d

# Clean up old images
docker image prune -f
```

### Database Backup

```bash
# Manual backup
./infrastructure/scripts/backup-database.sh full

# Restore from backup
./infrastructure/scripts/disaster-recovery.sh /backups/postgres/full_20240101_000000.sql.gz
```

### Scaling

```bash
# Scale a service
docker-compose -f docker-compose.prod.yml up -d --scale gateway=3
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs service-name

# Check resource usage
docker stats
```

### Database Connection Issues

```bash
# Verify database is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready
```

### SSL Certificate Issues

```bash
# Check Traefik logs
docker-compose -f docker-compose.prod.yml logs traefik

# Verify DNS records
dig residentcement.com
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (ufw)
- [ ] Configure fail2ban
- [ ] Set up log rotation
- [ ] Enable automated security updates
- [ ] Review Traefik access logs regularly
- [ ] Rotate API keys quarterly

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Review monitoring dashboards
3. Contact: devops@residentcement.com
