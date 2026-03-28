FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app/frontend/apps/corporate-website
COPY frontend/apps/corporate-website/package*.json ./
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app/frontend/apps/corporate-website
COPY --from=deps /app/frontend/apps/corporate-website/node_modules ./node_modules
COPY frontend/apps/corporate-website/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/frontend/apps/corporate-website/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
