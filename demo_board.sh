#!/bin/bash
# ResidentCement MVP - Board Demo Script (Linux/Mac)
# Audit Session: forensics1032026
# Usage: ./demo_board.sh

set -euo pipefail

echo "============================================"
echo "[ResidentCement MVP - Board Demo]"
echo "============================================"
echo ""

# Step 1: Check if image exists
echo "[1/4] Checking MVP image..."
if ! docker images residentcement-mvp:board-ready --format "{{.Repository}}:{{.Tag}}" | grep -q "residentcement-mvp:board-ready"; then
    echo "[ERROR] MVP image not found. Please run: docker build -f Dockerfile.mvp -t residentcement-mvp:board-ready ."
    exit 1
fi
echo "[OK] MVP image found"

# Step 2: Stop any existing demo container
echo "[2/4] Cleaning up existing containers..."
docker stop board-demo 2>/dev/null || true
docker rm board-demo 2>/dev/null || true

# Step 3: Start secure container
echo "[3/4] Starting secure container..."
docker run -d -p 8080:3001 --name board-demo -e DEMO_MODE=true -e ENV=board-presentation residentcement-mvp:board-ready

# Wait for container to start
echo "[INFO] Waiting for service to start..."
sleep 10

# Step 4: Health check
echo "[4/4] Running health check..."
if curl -s http://localhost:8080/health | grep -q "ok"; then
    echo "[OK] Health check passed"
else
    echo "[WARNING] Health check pending (service may still be starting)"
fi

echo ""
echo "============================================"
echo "[DEMO READY]"
echo "============================================"
echo ""
echo "Access the demo at: http://localhost:8080"
echo ""
echo "To stop the demo, press Ctrl+C"
echo "Then run: docker stop board-demo"
echo ""
echo "To view logs:"
echo "  docker logs -f board-demo"
echo ""
echo "============================================"

# Cleanup on exit
trap 'echo "[INFO] Stopping demo..."; docker stop board-demo 2>/dev/null || true' EXIT

# Keep running
tail -f /dev/null
