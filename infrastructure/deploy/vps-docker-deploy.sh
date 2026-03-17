#!/bin/bash
# ResidentCement VPS Deployment Script
# Run this on your VPS as root or with sudo

set -e

echo "🚀 Starting ResidentCement Deployment..."

# Configuration
APP_DIR="/opt/resident-cement"
DOMAIN="${DOMAIN:-residentcement.com}"
EMAIL="${EMAIL:-admin@residentcement.com}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
apt-get update && apt-get upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    usermod -aG docker $SUDO_USER
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installing Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create app directory
echo -e "${YELLOW}Creating application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository (or copy files)
echo -e "${YELLOW}Setting up application files...${NC}"
# If you have git access:
# git clone https://github.com/yourusername/resident-cement.git .

# If copying files manually, ensure these are in place:
# - docker-compose.prod.yml
# - .env
# - infrastructure/docker/nginx/nginx.conf

echo -e "${YELLOW}Please ensure your project files are in: $APP_DIR${NC}"
echo -e "${YELLOW}Copy files with: scp -r . root@your-vps-ip:$APP_DIR${NC}"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file with your configuration${NC}"
    exit 1
fi

# Create necessary directories
mkdir -p infrastructure/docker/nginx/conf.d
mkdir -p data/postgres
mkdir -p data/mongodb
mkdir -p data/redis
mkdir -p data/kafka
mkdir -p data/minio

# Pull latest images
echo -e "${YELLOW}Pulling Docker images...${NC}"
docker-compose -f docker-compose.prod.yml pull

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 30

# Check service health
echo -e "${YELLOW}Checking service health...${NC}"
docker-compose -f docker-compose.prod.yml ps

# Install Nginx for reverse proxy
echo -e "${YELLOW}Setting up Nginx...${NC}"
apt-get install -y nginx certbot python3-certbot-nginx

# Create Nginx config
cat > /etc/nginx/sites-available/resident-cement << 'EOF'
server {
    listen 80;
    server_name api.residentcement.com residentcement.com admin.residentcement.com;

    location / {
        proxy_pass http://localhost:80;
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
EOF

ln -sf /etc/nginx/sites-available/resident-cement /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl restart nginx

# Setup SSL with Let's Encrypt
echo -e "${YELLOW}Setting up SSL certificates...${NC}"
certbot --nginx -d api.residentcement.com -d residentcement.com -d admin.residentcement.com --non-interactive --agree-tos --email $EMAIL || true

# Setup auto-renewal for SSL
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

# Setup firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create update script
cat > /opt/update-resident-cement.sh << 'EOF'
#!/bin/bash
cd /opt/resident-cement
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
docker system prune -f
echo "Update completed!"
EOF
chmod +x /opt/update-resident-cement.sh

# Create backup script
cat > /opt/backup-resident-cement.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/resident-cement/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec rc-postgres pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/postgres.sql

# Backup MongoDB
docker exec rc-mongodb mongodump --out $BACKUP_DIR/mongodb

# Backup Redis (if persistence enabled)
cp data/redis/dump.rdb $BACKUP_DIR/redis.rdb 2>/dev/null || true

# Compress backup
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

# Keep only last 7 backups
ls -t /backups/resident-cement/*.tar.gz | tail -n +8 | xargs rm -f

echo "Backup completed: $BACKUP_DIR.tar.gz"
EOF
chmod +x /opt/backup-resident-cement.sh

# Setup daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backup-resident-cement.sh") | crontab -

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}Your application is now running at:${NC}"
echo "  - Website: https://residentcement.com"
echo "  - API: https://api.residentcement.com"
echo "  - Admin: https://admin.residentcement.com"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Update: /opt/update-resident-cement.sh"
echo "  Backup: /opt/backup-resident-cement.sh"
echo "  Restart: docker-compose -f docker-compose.prod.yml restart"
echo ""
echo -e "${YELLOW}Health check:${NC}"
curl -s http://localhost:3001/health && echo -e " ${GREEN}✓ API is healthy${NC}" || echo -e " ${RED}✗ API health check failed${NC}"
