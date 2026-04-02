#!/bin/bash

# B2B Portal Deployment Script for Ubuntu VPS
# Usage: ./deploy-b2b-portal.sh

set -e

echo "=========================================="
echo "Resident Ciment B2B Portal Deployment"
echo "=========================================="

# Configuration
PROJECT_DIR="/opt/residentcement"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
B2B_PORTAL_SERVICE="b2b-portal"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root"
   exit 1
fi

# Check prerequisites
log_info "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed"
    exit 1
fi

# Navigate to project directory
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Project directory $PROJECT_DIR does not exist"
    exit 1
fi

cd "$PROJECT_DIR"

# Check environment file
if [ ! -f ".env" ]; then
    log_warn ".env file not found. Please create one from .env.example"
    exit 1
fi

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    log_info "Pulling latest changes..."
    git pull origin build-phase-1
fi

# Build and deploy B2B Portal specifically
log_info "Building B2B Portal..."
docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache $B2B_PORTAL_SERVICE

log_info "Deploying B2B Portal..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d $B2B_PORTAL_SERVICE

# Wait for service to be healthy
log_info "Waiting for B2B Portal to be healthy..."
sleep 10

# Check service health
if docker-compose -f $DOCKER_COMPOSE_FILE ps $B2B_PORTAL_SERVICE | grep -q "healthy"; then
    log_info "B2B Portal is healthy and running"
else
    log_warn "B2B Portal may still be starting up..."
    log_info "Checking logs..."
    docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=20 $B2B_PORTAL_SERVICE
fi

# Cleanup old images
log_info "Cleaning up old Docker images..."
docker image prune -f

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "B2B Portal should be accessible at:"
echo "  - http://localhost:3002 (locally)"
echo "  - https://rcb2bportal.nyamabo.com (production)"
echo ""
echo "To view logs:"
echo "  docker-compose -f $DOCKER_COMPOSE_FILE logs -f $B2B_PORTAL_SERVICE"
echo ""
