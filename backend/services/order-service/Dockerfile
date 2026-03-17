# Multi-stage Dockerfile for Order Service - Monorepo version
FROM node:20-alpine AS builder

WORKDIR /app

# Copy kernel first and build it
COPY backend/shared/kernel/package*.json ./kernel/
WORKDIR /app/kernel
RUN npm install --legacy-peer-deps
COPY backend/shared/kernel/src ./src
COPY backend/shared/kernel/tsconfig.json ./
RUN npm run build

# Copy and install order-service
WORKDIR /app/services/order-service
COPY backend/services/order-service/package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY backend/services/order-service/src ./src
COPY backend/services/order-service/tsconfig.json ./

# Copy built kernel and install as local dependency
WORKDIR /app
COPY backend/shared/kernel ./backend/shared/kernel
WORKDIR /app/services/order-service
RUN npm install --legacy-peer-deps

# Build the service
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built kernel
COPY --from=builder /app/backend/shared/kernel/dist ./backend/shared/kernel/dist
COPY --from=builder /app/backend/shared/kernel/package.json ./backend/shared/kernel/package.json

# Copy production files
COPY --from=builder /app/services/order-service/node_modules ./node_modules
COPY --from=builder /app/services/order-service/dist ./dist
COPY --from=builder /app/services/order-service/package.json ./package.json

# Create symlink for kernel
RUN mkdir -p node_modules/@resident-cement && \
    ln -sf /app/backend/shared/kernel node_modules/@resident-cement/kernel

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3007

ENV NODE_ENV=production
ENV PORT=3007

CMD ["node", "dist/index.js"]
