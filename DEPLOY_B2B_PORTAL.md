# B2B Portal Deployment Guide

## Overview

This guide covers deploying the Resident Ciment B2B Portal to an Ubuntu VPS using Docker.

## Prerequisites

- Ubuntu 22.04 LTS server (2GB RAM minimum, 4GB recommended)
- Docker 24.0+ and Docker Compose 2.20+
- Domain name configured: `rcb2bportal.nyamabo.com`
- (Optional) SSL certificates for HTTPS

## Quick Start

### 1. Initial VPS Setup

Run the setup script on your fresh Ubuntu VPS:

```bash
# Copy the setup script to your VPS
scp scripts/setup-vps.sh user@your-vps-ip:/tmp/

# SSH into your VPS
ssh user@your-vps-ip

# Run the setup script
cd /tmp
chmod +x setup-vps.sh
./setup-vps.sh

# Log out and back in for Docker permissions to take effect
exit
ssh user@your-vps-ip
```

### 2. Deploy the B2B Portal

```bash
# Clone the repository
cd /opt/residentcement
git clone https://github.com/klmayua/residentcement.git .

# Configure environment
cp .env.example .env
nano .env  # Edit with your production values

# Deploy B2B Portal only
docker-compose -f docker-compose.prod.yml up -d b2b-portal

# Or deploy the entire stack
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Verify Deployment

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f b2b-portal

# Test health endpoint
curl http://localhost:3002/api/health
```

## Environment Variables

Required in `.env` file:

```bash
# Database
DB_USER=residentcement
DB_PASSWORD=your_secure_password
DB_NAME=residentcement

# MongoDB
MONGO_USER=residentcement
MONGO_PASSWORD=your_secure_password
MONGO_DB=residentcement

# Redis
REDIS_PASSWORD=your_redis_password

# JWT Secret
JWT_SECRET=your_jwt_secret

# API Key
API_KEY=your_api_key
```

## SSL/TLS Configuration (Production)

For HTTPS support, use Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d rcb2bportal.nyamabo.com

# Auto-renewal is configured automatically
```

## Monitoring

### View Logs

```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f b2b-portal

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 b2b-portal
```

### Resource Usage

```bash
# Container stats
docker stats

# System resource usage
htop
```

## Updates

To update the B2B Portal:

```bash
cd /opt/residentcement

# Pull latest changes
git pull origin build-phase-1

# Rebuild and restart B2B Portal
docker-compose -f docker-compose.prod.yml up -d --build b2b-portal

# Clean up old images
docker image prune -f
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs b2b-portal

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Restart service
docker-compose -f docker-compose.prod.yml restart b2b-portal
```

### Port Already in Use

```bash
# Find process using port 3002
sudo lsof -i :3002

# Kill process or change port in docker-compose.prod.yml
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose -f docker-compose.prod.yml ps postgres

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

## Backup

```bash
# Create backup script
./infrastructure/scripts/backup-database.sh

# Or manually backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup.sql
```

## Security Checklist

- [ ] Change default passwords
- [ ] Enable firewall (ufw)
- [ ] Configure fail2ban
- [ ] Enable HTTPS with SSL certificates
- [ ] Set up log rotation
- [ ] Enable automated security updates
- [ ] Restrict SSH access
- [ ] Configure regular backups

## Support

For deployment issues:
1. Check the logs: `docker-compose logs b2b-portal`
2. Review this deployment guide
3. Contact: devops@residentciment.com
