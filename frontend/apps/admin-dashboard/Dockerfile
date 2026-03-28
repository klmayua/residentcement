FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app/frontend/apps/admin-dashboard
COPY frontend/apps/admin-dashboard/package*.json ./
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app/frontend/apps/admin-dashboard
COPY --from=deps /app/frontend/apps/admin-dashboard/node_modules ./node_modules
COPY frontend/apps/admin-dashboard/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/frontend/apps/admin-dashboard/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/admin-dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/admin-dashboard/.next/static ./.next/static
USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
