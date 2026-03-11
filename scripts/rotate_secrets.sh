#!/bin/bash
# ResidentCement Secret Rotation Script
# Run this script to generate new secure secrets for production deployment

set -e

echo "=========================================="
echo "ResidentCement Secret Rotation Script"
echo "=========================================="
echo ""

# Generate JWT Secret (64 characters base64)
echo "Generating JWT Secret..."
JWT_SECRET=$(openssl rand -base64 48)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate Database Password (32 characters base64)
echo "Generating PostgreSQL Password..."
POSTGRES_PASSWORD=$(openssl rand -base64 32)
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo ""

# Generate MongoDB Password
echo "Generating MongoDB Password..."
MONGO_PASSWORD=$(openssl rand -base64 32)
echo "MONGO_PASSWORD=$MONGO_PASSWORD"
echo ""

# Generate API Key (64 characters hex)
echo "Generating API Key..."
API_KEY=$(openssl rand -hex 32)
echo "API_KEY=$API_KEY"
echo ""

# Generate MinIO Credentials
echo "Generating MinIO Credentials..."
MINIO_ACCESS_KEY=$(openssl rand -hex 20)
MINIO_SECRET_KEY=$(openssl rand -hex 32)
echo "MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY"
echo "MINIO_SECRET_KEY=$MINIO_SECRET_KEY"
echo ""

# Generate Encryption Key (32 bytes for AES-256)
echo "Generating Encryption Key..."
ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

echo "=========================================="
echo "Secret Generation Complete!"
echo "=========================================="
echo ""
echo "IMPORTANT: Copy these secrets to your:"
echo "  1. .env.production file (never commit!)"
echo "  2. Secrets manager (Vault, AWS Secrets Manager, etc.)"
echo "  3. CI/CD pipeline secrets"
echo ""
echo "Then run:"
echo "  docker-compose --env-file .env.production up -d"
echo ""
