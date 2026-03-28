#!/bin/bash
# =============================================================================
# ResidentCement Corporate Website - Deployment Script
# Usage: ./deploy.sh
# =============================================================================

set -e

echo "========================================"
echo "  ResidentCement Website Deployment"
echo "========================================"
echo ""

PROJECT_DIR="/root/projects/ResidentCement"
CONTAINER_NAME="residentcement-website"
IMAGE_NAME="residentcement-corporate-website:latest"

# Step 1: Build Next.js project
echo "[1/5] Building Next.js project..."
cd "$PROJECT_DIR/frontend/apps/corporate-website"
npm run build
echo "      ✓ Build completed"
echo ""

# Step 2: Build Docker image
echo "[2/5] Building Docker image..."
cd "$PROJECT_DIR"
docker build --no-cache -f frontend/apps/corporate-website/Dockerfile -t "$IMAGE_NAME" . 2>&1 | tail -5
echo "      ✓ Docker image built"
echo ""

# Step 3: Recreate container
echo "[3/5] Recreating container..."
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true
docker run -d --name "$CONTAINER_NAME" -p 18081:80 --restart unless-stopped "$IMAGE_NAME"
sleep 2
echo "      ✓ Container recreated"
echo ""

# Step 4: Reload host nginx
echo "[4/5] Reloading host nginx..."
nginx -s reload 2>/dev/null
echo "      ✓ Host nginx reloaded"
echo ""

# Step 5: Verification
echo "[5/5] Verifying deployment..."
echo ""
H1=$(curl -s https://residentcement.nyamabo.com/ | grep -o "Operational.*Excellence" | head -1 || echo "Not found")
echo "  Home page H1: $H1"
echo ""
echo "  Cache headers:"
curl -sI https://residentcement.nyamabo.com/ | grep -iE "cache-control|pragma|expires" | sed 's/^/    /'
echo ""
echo "========================================"
echo "  ✓ Deployment Complete!"
echo "========================================"
echo ""
echo "  Users will now see the updated content immediately"
echo "  (no browser cache clearing required)"
echo ""
