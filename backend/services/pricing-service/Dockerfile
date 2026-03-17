# Multi-stage Dockerfile for Pricing Service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including tsx for runtime
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy all from builder (including source for tsx)
COPY --from=builder /app ./

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3004

ENV NODE_ENV=production
ENV PORT=3004

CMD ["npx", "tsx", "src/index.ts"]
