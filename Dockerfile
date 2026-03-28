# ==============================================================================
# ResidentCement API Gateway — Production Dockerfile
# Multi-stage build: install deps → build kernel → run with tsx
# ==============================================================================

# --- Stage 1: Base image with build tools ---
FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++ gcc openssl-dev

# --- Stage 2: Build shared kernel ---
FROM base AS kernel-build
WORKDIR /build/kernel
COPY backend/shared/kernel/package*.json ./
RUN npm install --ignore-scripts
COPY backend/shared/kernel/src ./src
COPY backend/shared/kernel/tsconfig.json ./
RUN npx tsc --skipLibCheck --noEmitOnError false

# --- Stage 3: Install gateway dependencies ---
FROM base AS gateway-build
WORKDIR /build

# Set up the kernel as a local dependency
COPY --from=kernel-build /build/kernel /build/backend/shared/kernel

# Copy gateway package files
WORKDIR /build/backend/gateway
COPY backend/gateway/package*.json ./

# Rewrite kernel dependency to absolute path for npm install
RUN sed -i 's|"file:../shared/kernel"|"file:/build/backend/shared/kernel"|' package.json

# Install dependencies (including native modules like argon2 for Alpine)
RUN npm install

# Generate Prisma client
COPY backend/gateway/prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY backend/gateway/src ./src
COPY backend/gateway/tsconfig.json ./

# --- Stage 4: Production runtime ---
FROM node:20-alpine AS runtime
RUN apk add --no-cache curl dumb-init && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

WORKDIR /app

# Copy kernel dist
COPY --from=kernel-build --chown=nodejs:nodejs /build/kernel/dist ./backend/shared/kernel/dist
COPY --from=kernel-build --chown=nodejs:nodejs /build/kernel/package.json ./backend/shared/kernel/package.json

# Copy gateway node_modules, source, and prisma
COPY --from=gateway-build --chown=nodejs:nodejs /build/backend/gateway/node_modules ./node_modules
COPY --from=gateway-build --chown=nodejs:nodejs /build/backend/gateway/prisma ./prisma
COPY --from=gateway-build --chown=nodejs:nodejs /build/backend/gateway/package.json ./package.json
COPY --from=gateway-build --chown=nodejs:nodejs /build/backend/gateway/src ./src
COPY --from=gateway-build --chown=nodejs:nodejs /build/backend/gateway/tsconfig.json ./tsconfig.json

# Fix kernel resolution: node_modules/@resident-cement/kernel -> actual kernel
RUN mkdir -p node_modules/@resident-cement && \
    rm -rf node_modules/@resident-cement/kernel && \
    ln -s /app/backend/shared/kernel node_modules/@resident-cement/kernel

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chown nodejs:nodejs /app/logs

ENV NODE_ENV=production PORT=3001
EXPOSE 3001
USER nodejs

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -sf http://localhost:3001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "tsx", "src/index.ts"]
