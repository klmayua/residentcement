# Multi-stage Dockerfile for Pricing Service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the service
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -system -gid 1001 nodejs && \
    adduser -system -uid 1001 nodejs

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3004

ENV NODE_ENV=production
ENV PORT=3004

CMD ["node", "dist/index.js"]
