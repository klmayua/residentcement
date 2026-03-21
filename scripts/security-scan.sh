#!/bin/bash
set -e

# Security Scan Script
# Runs all security scans locally

echo "=========================================="
echo "ResidentCement Security Scan"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run npm audit
run_npm_audit() {
    local dir=$1
    local name=$2
    echo ""
    echo "Scanning $name..."
    if [ -d "$dir" ]; then
        (cd "$dir" && npm audit --audit-level=high) || {
            echo -e "${YELLOW}⚠️  $name has vulnerabilities${NC}"
            return 1
        }
        echo -e "${GREEN}✓ $name passed${NC}"
    else
        echo -e "${YELLOW}⚠️  $name directory not found${NC}"
    fi
}

# Function to scan Docker images
scan_docker_images() {
    echo ""
    echo "=========================================="
    echo "Scanning Docker Images"
    echo "=========================================="

    if ! command -v trivy &> /dev/null; then
        echo -e "${YELLOW}⚠️  Trivy not installed. Skipping container scan.${NC}"
        echo "Install Trivy: https://aquasecurity.github.io/trivy/v0.18/installation/"
        return
    fi

    for dockerfile in backend/*/Dockerfile backend/services/*/Dockerfile; do
        if [ -f "$dockerfile" ]; then
            dir=$(dirname "$dockerfile")
            name=$(basename "$dir")
            echo "Scanning $name..."

            # Build image
            docker build -t "resident-cement/$name:scan" "$dir" || continue

            # Scan with Trivy
            trivy image --severity HIGH,CRITICAL --exit-code 0 "resident-cement/$name:scan" || {
                echo -e "${RED}✗ $name has vulnerabilities${NC}"
            }
        fi
    done
}

# Run dependency audits
echo "=========================================="
echo "Dependency Vulnerability Scan"
echo "=========================================="

run_npm_audit "backend/gateway" "Gateway API" || true
run_npm_audit "frontend/apps/distributor-portal" "Distributor Portal" || true
run_npm_audit "frontend/apps/corporate-website" "Corporate Website" || true
run_npm_audit "frontend/apps/sales-rep-app" "Sales Rep App" || true

# Scan Docker images
scan_docker_images

echo ""
echo "=========================================="
echo "Security Scan Complete"
echo "=========================================="
echo "Review any warnings above and fix critical vulnerabilities"
