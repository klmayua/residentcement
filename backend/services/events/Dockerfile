# Multi-stage Dockerfile for Events Service (Kafka Consumer)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy service files
COPY backend/services/events/package*.json ./
RUN npm install

# Copy source code
COPY backend/services/events/src ./src
COPY backend/services/events/tsconfig.json ./

# Build the service
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy production files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
