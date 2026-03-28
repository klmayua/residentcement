# ResidentCement Production Deployment Guide

## Overview

This guide covers deploying the ResidentCement platform to production using Docker Compose with Nginx host-based routing.

## Prerequisites

- Linux server (Ubuntu 22.04 LTS recommended)
- Docker 24.0+ and Docker Compose 2.20+
- Domain names configured:
  - `residentcement.nyamabo.com` (corporate website)
  - `rcdportal.nyamabo.com` (dealers portal)
  - `rcb2bportal.nyamabo.com` (partners/B2B portal)
  - `rcerp.nyamabo.com` (ERP dashboard)
- SSL certificates provisioned for all four subdomains

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/klmayua/ResidentCement.git
cd ResidentCement

# 2. Configure environment
cp .env.example .env
# Edit .env with production values and secrets

# 3. Deploy
docker compose -f docker-compose.prod.yml up -d --build

# 4. Verify
curl -H "Host: residentcement.nyamabo.com" http://<VPS_IP>/health
curl -H "Host: rcdportal.nyamabo.com" http://<VPS_IP>/health
curl -H "Host: rcb2bportal.nyamabo.com" http://<VPS_IP>/health
curl -H "Host: rcerp.nyamabo.com" http://<VPS_IP>/health
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
DOMAIN_CORPORATE=residentcement.nyamabo.com
DOMAIN_DEALERS=rcdportal.nyamabo.com
DOMAIN_B2B=rcb2bportal.nyamabo.com
DOMAIN_ERP=rcerp.nyamabo.com

# Email for SSL
ACME_EMAIL=admin@nyamabo.com
```

### 3. Database Migration

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec gateway npx prisma migrate deploy

# Seed initial data (optional)
docker-compose -f docker-compose.prod.yml exec gateway npx prisma db seed
```

### 4. SSL Certificates

Nginx is the active reverse proxy for this stack. Provision certificates with Certbot (or your CA of choice) for:

- `residentcement.nyamabo.com`
- `rcdportal.nyamabo.com`
- `rcb2bportal.nyamabo.com`
- `rcerp.nyamabo.com`

Mount certificate files into `infrastructure/docker/nginx/` and add HTTPS server blocks.

### 5. Monitoring Setup

Access monitoring dashboards:
- Grafana: https://grafana.residentcement.com
- Prometheus: https://prometheus.residentcement.com
- Nginx logs: `docker compose -f docker-compose.prod.yml logs -f nginx`

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
# Check Nginx logs
docker-compose -f docker-compose.prod.yml logs nginx

# Verify DNS records
dig residentcement.nyamabo.com
dig rcdportal.nyamabo.com
dig rcb2bportal.nyamabo.com
dig rcerp.nyamabo.com
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (ufw)
- [ ] Configure fail2ban
- [ ] Set up log rotation
- [ ] Enable automated security updates
- [ ] Review Nginx access logs regularly
- [ ] Rotate API keys quarterly

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Review monitoring dashboards
3. Contact: devops@residentciment.com
