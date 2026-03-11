# Database Schema Audit

**Audit Session:** `forensics_20260311_221530`  
**Generated:** 2026-03-11 22:15:30  
**Project:** ResidentCement Digital Ecosystem  

---

## Database Overview

| Attribute | Value |
|-----------|-------|
| **Database Type** | PostgreSQL 16 |
| **ORM** | Prisma 5.9 |
| **Schemas** | 7 (public, customer, order, product, inventory, payment, pricing) |
| **Total Models** | 20 |
| **Total Fields** | 200+ |
| **Indexes** | 40+ |

---

## Schema Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RESIDENT_CEMENT DATABASE                      │
│                         (PostgreSQL 16)                          │
├─────────────────────────────────────────────────────────────────┤
│  SCHEMAS:                                                        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────────┐  │
│  │  public  │ customer │  order   │ product  │  inventory   │  │
│  ├──────────┼──────────┼──────────┼──────────┼──────────────┤  │
│  │ payment  │ pricing  │          │          │              │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Model Inventory by Schema

### Public Schema

| Model | Table | Fields | Purpose |
|-------|-------|--------|---------|
| `User` | `users` | 18 | System users |
| `Session` | `sessions` | 7 | Authentication sessions |
| `AuditLog` | `audit_logs` | 10 | Audit trail |
| `SystemConfig` | `system_configs` | 7 | System configuration |

### Customer Schema

| Model | Table | Fields | Purpose |
|-------|-------|--------|---------|
| `Customer` | `customers` | 22 | Customer records |
| `CustomerAddress` | `customer_addresses` | 14 | Delivery/billing addresses |

### Order Schema

| Model | Table | Fields | Purpose |
|-------|-------|--------|---------|
| `Order` | `orders` | 24 | Order headers |
| `OrderItem` | `order_items` | 15 | Order line items |
| `Quote` | `quotes` | 17 | Sales quotes |
| `QuoteItem` | `quote_items` | 14 | Quote line items |

### Product Schema

| Model | Table | Fields | Purpose |
|-------|-------|--------|---------|
| `Product` | `products` | 22 | Product catalog |
| `Inventory` | `inventory` | 16 | Stock levels |
| `Warehouse` | `warehouses` | 16 | Warehouse locations |
| `StockMovement` | `stock_movements` | 12 | Inventory transactions |

### Payment Schema

| Model | Table | Fields | Purpose |
|-------|-------|--------|---------|
| `Payment` | `payments` | 19 | Payment records |

### Pricing Schema

| Model | Table | Fields | Purpose |
|-------|-------|--------|---------|
| `PricingRule` | `pricing_rules` | 16 | Dynamic pricing rules |

---

## Critical Data Entities

### User Model (Authentication)

```prisma
model User {
  id               String    @id @default(uuid())
  email            String    @unique
  name             String
  phone            String?
  passwordHash     String          // ⚠️ SENSITIVE
  role             UserRole  @default(VIEWER)
  status           UserStatus @default(PENDING_VERIFICATION)
  emailVerified    Boolean   @default(false)
  twoFactorEnabled Boolean   @default(false)
  twoFactorSecret  String?         // ⚠️ SENSITIVE
  lastLoginAt      DateTime?
  lastLoginIp      String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  deletedAt        DateTime?
}
```

**Sensitive Fields:**
- `passwordHash` - BCrypt/Argon2 hash
- `twoFactorSecret` - TOTP secret
- `lastLoginIp` - PII

---

### Customer Model (PII)

```prisma
model Customer {
  id               String   @id @default(uuid())
  name             String
  email            String   @unique
  phone            String?
  address          String?
  city             String?
  state            String?
  lga              String?
  country          String   @default("Nigeria")
  postalCode       String?
  tier             CustomerTier @default(STANDARD)
  status           CustomerStatus @default(PROSPECT)
  creditLimit      Decimal  @default(0) @db.Decimal(15, 2)  // 💰 SENSITIVE
  contactPerson    String?
  contactEmail     String?
  contactPhone     String?
  taxId            String?         // 🏛️ SENSITIVE
  registrationNumber String?       // 🏛️ SENSITIVE
  notes            String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  deactivatedAt    DateTime?
}
```

**Sensitive Fields:**
- `email`, `phone` - PII
- `address`, `city`, `state`, `lga` - PII (Location)
- `creditLimit` - Financial data
- `taxId`, `registrationNumber` - Legal/Compliance

---

### Payment Model (Financial)

```prisma
model Payment {
  id               String   @id @default(uuid())
  paymentReference String   @unique
  orderId          String?
  customerId       String
  quoteId          String?
  amount           Decimal  @db.Decimal(15, 2)  // 💰 SENSITIVE
  currency         String   @default("NGN")
  method           PaymentMethod
  status           PaymentStatus @default(PENDING)
  provider         String?  // Paystack, Flutterwave
  providerReference String?
  providerResponse Json?    // ⚠️ May contain sensitive data
  paidAt           DateTime?
  refundedAt       DateTime?
  refundAmount     Decimal? @db.Decimal(15, 2)  // 💰 SENSITIVE
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

**Sensitive Fields:**
- `amount`, `refundAmount` - Financial data
- `providerResponse` - May contain PAN, tokens

---

## Index Analysis

### Primary Keys (All Models)
```
✅ All models have UUID primary keys
✅ Using @default(uuid()) for auto-generation
```

### Unique Indexes

| Model | Field | Purpose |
|-------|-------|---------|
| `User` | `email` | Unique user email |
| `User` | `Session.token` | Unique session token |
| `Customer` | `email` | Unique customer email |
| `Product` | `sku` | Unique product SKU |
| `Warehouse` | `code` | Unique warehouse code |
| `Order` | `orderNumber` | Unique order reference |
| `Quote` | `quoteNumber` | Unique quote reference |
| `Payment` | `paymentReference` | Unique payment reference |

### Composite Indexes

| Model | Fields | Purpose |
|-------|--------|---------|
| `User` | `[role, status]` | Role-based queries |
| `Customer` | `[email]` | Email lookup |
| `Customer` | `[phone]` | Phone lookup |
| `Customer` | `[tier, status]` | Segmentation |
| `Customer` | `[state, lga]` | Geographic queries |
| `Order` | `[orderNumber]` | Order lookup |
| `Order` | `[customerId]` | Customer orders |
| `Order` | `[status]` | Status filtering |
| `Order` | `[createdAt]` | Date range queries |
| `Inventory` | `[productId]` | Product stock |
| `Inventory` | `[warehouseId]` | Warehouse stock |
| `Inventory` | `[status]` | Stock status |
| `Payment` | `[paymentReference]` | Payment lookup |
| `Payment` | `[orderId]` | Order payments |
| `Payment` | `[customerId]` | Customer payments |
| `Payment` | `[status]` | Payment status |
| `Payment` | `[method]` | Payment method |

### Missing Indexes (Recommendations)

| Model | Suggested Index | Reason |
|-------|-----------------|--------|
| `Order` | `[status, createdAt]` | Combined filtering |
| `Payment` | `[status, paidAt]` | Payment reconciliation |
| `AuditLog` | `[entityType, action]` | Audit queries |
| `Session` | `[userId, expiresAt]` | Session cleanup |

---

## Relationship Analysis

### One-to-Many Relationships

```
User (1) ──┬── (M) Session
           ├── (M) AuditLog
           ├── (M) Customer (created)
           └── (M) Customer (updated)

Customer (1) ──┬── (M) Order
               ├── (M) Quote
               ├── (M) Payment
               └── (M) CustomerAddress

Order (1) ──┬── (M) OrderItem
            └── (M) Payment

Product (1) ──┬── (M) Inventory
              ├── (M) OrderItem
              ├── (M) QuoteItem
              └── (M) PricingRule

Warehouse (1) ──┬── (M) Inventory
                └── (M) StockMovement
```

### Cascade Delete Rules

| Relationship | On Delete |
|--------------|-----------|
| User → Session | Cascade |
| Customer → CustomerAddress | Cascade |
| Order → OrderItem | Cascade |
| Quote → QuoteItem | Cascade |
| Product → Inventory | Restrict (prevent data loss) |
| Warehouse → Inventory | Restrict (prevent data loss) |

---

## Data Sensitivity Classification

### PII (Personal Identifiable Information)

| Model | Fields | GDPR Category |
|-------|--------|---------------|
| `User` | `email`, `phone`, `name` | Art. 4(1) |
| `User` | `lastLoginIp` | Art. 4(1) |
| `Customer` | `email`, `phone`, `name` | Art. 4(1) |
| `Customer` | `address`, `city`, `state`, `lga` | Art. 4(1) |
| `CustomerAddress` | All address fields | Art. 4(1) |

### Financial Data

| Model | Fields | Regulation |
|-------|--------|------------|
| `Customer` | `creditLimit` | PCI DSS |
| `Order` | `subtotal`, `tax`, `total` | PCI DSS |
| `Payment` | `amount`, `refundAmount` | PCI DSS |
| `Payment` | `providerResponse` | PCI DSS |

### Authentication Data

| Model | Fields | Sensitivity |
|-------|--------|-------------|
| `User` | `passwordHash` | Critical |
| `User` | `twoFactorSecret` | Critical |
| `Session` | `token` | High |

### Business Sensitive

| Model | Fields | Impact |
|-------|--------|--------|
| `PricingRule` | `value`, `minQuantity` | Competitive |
| `Product` | `costPrice`, `basePrice` | Competitive |
| `Inventory` | `quantity`, `unitCost` | Operational |

---

## Data Retention Analysis

| Model | Retention Policy | Current Implementation |
|-------|------------------|----------------------|
| `User` | 7 years after deletion | ❌ `deletedAt` soft delete |
| `Customer` | 7 years after inactive | ❌ `deactivatedAt` soft delete |
| `Order` | 7 years | ❌ No deletion |
| `Payment` | 7 years | ❌ No deletion |
| `AuditLog` | 7 years | ❌ No deletion |
| `Session` | Until expiry | ✅ `expiresAt` field |

**Recommendation:** Implement automated data retention jobs

---

## Database Security Recommendations

### Immediate

1. **Enable Row-Level Security (RLS)**
   ```sql
   ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
   CREATE POLICY customer_isolation ON customers
     USING (customer_id = current_setting('app.current_customer_id')::uuid);
   ```

2. **Encrypt Sensitive Columns**
   ```sql
   -- Use pgcrypto for column-level encryption
   ALTER TABLE users ADD COLUMN password_hash_encrypted bytea;
   ```

3. **Audit Log Access**
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgaudit;
   ```

### Short-Term

4. **Add Missing Indexes** (see above)
5. **Implement Soft Delete Consistently**
6. **Add Data Retention Jobs**

### Long-Term

7. **Database Encryption at Rest**
8. **Implement Column-Level Encryption**
9. **Set Up Database Activity Monitoring**

---

## Migration History

| Migration | Date | Description |
|-----------|------|-------------|
| `init_migration.sql` | 2026-01-30 | Initial schema |

---

**END OF REPORT**
