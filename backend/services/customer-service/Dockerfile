FROM node:20-bullseye

WORKDIR /app

# Install OpenSSL 1.1 (available in bullseye)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

# Copy and build kernel
COPY backend/shared/kernel ./kernel
WORKDIR /app/kernel
RUN npm install --legacy-peer-deps && npm run build

# Copy and setup customer-service
WORKDIR /app
COPY backend/services/customer-service ./customer-service
WORKDIR /app/customer-service
RUN npm install --legacy-peer-deps
RUN mkdir -p node_modules/@resident-cement && ln -sf /app/kernel node_modules/@resident-cement/kernel

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3002
ENV NODE_ENV=production PORT=3002
CMD ["npx", "tsx", "src/index.ts"]
