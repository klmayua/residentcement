# Multi-stage Dockerfile for Logistics Service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy kernel first and build it
COPY backend/shared/kernel/package*.json ./kernel/
WORKDIR /app/kernel
RUN npm install --legacy-peer-deps
COPY backend/shared/kernel/src ./src
COPY backend/shared/kernel/tsconfig.json ./
RUN npm run build

# Copy kafka-client and build it
WORKDIR /app
COPY backend/shared/kafka-client/package*.json ./kafka-client/
WORKDIR /app/kafka-client
RUN npm install --legacy-peer-deps
COPY backend/shared/kafka-client/src ./src
COPY backend/shared/kafka-client/tsconfig.json ./
RUN npm run build

# Copy and install logistics-service
WORKDIR /app/services/logistics-service
COPY backend/services/logistics-service/package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY backend/services/logistics-service/src ./src
COPY backend/services/logistics-service/tsconfig.json ./
COPY backend/services/logistics-service/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the service
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built kernel
COPY --from=builder /app/backend/shared/kernel/dist ./backend/shared/kernel/dist
COPY --from=builder /app/backend/shared/kernel/package.json ./backend/shared/kernel/package.json

# Copy built kafka-client
COPY --from=builder /app/backend/shared/kafka-client/dist ./backend/shared/kafka-client/dist
COPY --from=builder /app/backend/shared/kafka-client/package.json ./backend/shared/kafka-client/package.json

# Copy production files
COPY --from=builder /app/services/logistics-service/node_modules ./node_modules
COPY --from=builder /app/services/logistics-service/dist ./dist
COPY --from=builder /app/services/logistics-service/package.json ./package.json
COPY --from=builder /app/services/logistics-service/prisma ./prisma

# Create symlinks for shared packages
RUN mkdir -p node_modules/@resident-cement && \
    ln -sf /app/backend/shared/kernel node_modules/@resident-cement/kernel && \
    ln -sf /app/backend/shared/kafka-client node_modules/@resident-cement/kafka-client

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3010

ENV NODE_ENV=production
ENV PORT=3010

CMD ["node", "dist/index.js"]
