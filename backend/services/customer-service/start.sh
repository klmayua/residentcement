#!/bin/sh
# Install OpenSSL 1.1 compatibility layer
echo "Installing OpenSSL..."
echo "http://dl-cdn.alpinelinux.org/alpine/v3.21/main" > /etc/apk/repositories
echo "http://dl-cdn.alpinelinux.org/alpine/v3.21/community" >> /etc/apk/repositories
apk update
apk add --no-cache openssl1.1-compat 2>/dev/null || apk add --no-cache libressl 2>/dev/null || true

# Start the service
echo "Starting service..."
cd /app
exec npx tsx src/index.ts
