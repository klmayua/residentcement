#!/bin/bash

# VPS Setup Script for Resident Ciment Platform
# Run this on a fresh Ubuntu 22.04 LTS VPS

set -e

echo "=========================================="
echo "Resident Ciment VPS Setup"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker installed successfully"
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo apt install -y docker-compose-plugin
    echo "Docker Compose installed successfully"
else
    echo "Docker Compose already installed"
fi

# Install additional tools
echo "Installing additional tools..."
sudo apt install -y git curl wget htop nano

# Create project directory
echo "Creating project directory..."
sudo mkdir -p /opt/residentcement
sudo chown $USER:$USER /opt/residentcement

# Setup log rotation
echo "Setting up log rotation..."
sudo tee /etc/logrotate.d/residentcement <<EOF
/opt/residentcement/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

# Setup firewall (optional)
echo "Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow http
    sudo ufw allow https
    sudo ufw --force enable
    echo "Firewall configured"
fi

# Create swap file (if not exists)
if [ ! -f /swapfile ]; then
    echo "Creating swap file..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Setup system limits for containers
echo "Setting up system limits..."
sudo tee -a /etc/sysctl.conf <<EOF
# Resident Ciment optimizations
vm.max_map_count=262144
fs.file-max=65536
EOF

sudo sysctl -p

echo ""
echo "=========================================="
echo "VPS Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clone the repository to /opt/residentcement"
echo "2. Copy .env.example to .env and configure"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "Please log out and log back in for Docker permissions to take effect."
echo ""
