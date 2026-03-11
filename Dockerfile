# ResidentCement - Board Demo Dockerfile
# Using pre-built local node_modules

FROM node:20-alpine

LABEL audit.session="forensics1032026"
LABEL security.hardened="true"

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs

COPY backend/gateway/package*.json ./backend/gateway/
COPY backend/gateway/node_modules ./backend/gateway/node_modules

WORKDIR /app/backend/gateway

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
