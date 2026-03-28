FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app/frontend/apps/distributor-portal
COPY frontend/apps/distributor-portal/package*.json ./
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app/frontend/apps/distributor-portal
COPY --from=deps /app/frontend/apps/distributor-portal/node_modules ./node_modules
COPY frontend/apps/distributor-portal/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/frontend/apps/distributor-portal/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/distributor-portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/distributor-portal/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]