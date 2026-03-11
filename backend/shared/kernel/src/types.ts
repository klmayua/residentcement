/**
 * Common Types and Interfaces for ResidentCement Microservices
 */

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Base Entity Types
// -----------------------------------------------------------------------------

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: Date | null;
  isDeleted: boolean;
}

// -----------------------------------------------------------------------------
// User & Authentication Types
// -----------------------------------------------------------------------------

export type UserRole = 'ADMIN' | 'STAFF' | 'DISTRIBUTOR' | 'SALES_REP' | 'VIEWER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User extends BaseEntity {
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface Session extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

// -----------------------------------------------------------------------------
// Customer Types
// -----------------------------------------------------------------------------

export type CustomerTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'ENTERPRISE';

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PROSPECT';

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  lga?: string | null;
  tier: CustomerTier;
  status: CustomerStatus;
  creditLimit: number;
  contactPerson?: string | null;
  deactivatedAt?: Date | null;
}

// -----------------------------------------------------------------------------
// Product Types
// -----------------------------------------------------------------------------

export type ProductCategory = 'CEMENT' | 'CONCRETE' | 'AGGREGATE' | 'ADDITIVE' | 'EQUIPMENT';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED' | 'OUT_OF_STOCK';

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  description?: string | null;
  category: ProductCategory;
  status: ProductStatus;
  basePrice: number;
  unitOfMeasure: string;
  weight?: number | null;
  volume?: number | null;
}

// -----------------------------------------------------------------------------
// Inventory Types
// -----------------------------------------------------------------------------

export type InventoryStatus = 'AVAILABLE' | 'RESERVED' | 'IN_TRANSIT' | 'QUARANTINED';

export interface Inventory extends BaseEntity {
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  status: InventoryStatus;
  batchNumber?: string | null;
  manufacturingDate?: Date | null;
  expiryDate?: Date | null;
}

export interface Warehouse extends BaseEntity {
  name: string;
  code: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  capacity: number;
  isActive: boolean;
}

// -----------------------------------------------------------------------------
// Order Types
// -----------------------------------------------------------------------------

export type OrderStatus = 
  | 'DRAFT'
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'IN_PRODUCTION'
  | 'READY_FOR_SHIPMENT'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type OrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface Order extends BaseEntity {
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress?: string | null;
  deliveryDate?: Date | null;
  notes?: string | null;
  cancelledAt?: Date | null;
  cancelReason?: string | null;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

// -----------------------------------------------------------------------------
// Quote Types
// -----------------------------------------------------------------------------

export type QuoteStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED';

export interface Quote extends BaseEntity {
  quoteNumber: string;
  customerId: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  validUntil: Date;
  notes?: string | null;
  convertedToOrderId?: string | null;
  convertedAt?: Date | null;
}

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

// -----------------------------------------------------------------------------
// Payment Types
// -----------------------------------------------------------------------------

export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'USSD' | 'CASH' | 'CHEQUE' | 'CREDIT';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface Payment extends BaseEntity {
  paymentReference: string;
  orderId?: string | null;
  customerId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider?: string | null;
  providerReference?: string | null;
  metadata?: Record<string, unknown> | null;
  paidAt?: Date | null;
  failedAt?: Date | null;
  failureReason?: string | null;
}

// -----------------------------------------------------------------------------
// Pricing Types
// -----------------------------------------------------------------------------

export type PricingRuleType = 'FIXED' | 'PERCENTAGE' | 'TIERED' | 'VOLUME_BASED';

export type PricingScope = 'GLOBAL' | 'CUSTOMER_TIER' | 'CUSTOMER' | 'REGION' | 'PRODUCT_CATEGORY';

export interface PricingRule extends BaseEntity {
  name: string;
  description?: string | null;
  ruleType: PricingRuleType;
  scope: PricingScope;
  scopeValue?: string | null;
  productId?: string | null;
  categoryId?: string | null;
  customerTier?: CustomerTier | null;
  value: number;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  priority: number;
}

// -----------------------------------------------------------------------------
// Event Types (Kafka)
// -----------------------------------------------------------------------------

export interface DomainEvent<T = Record<string, unknown>> {
  eventId: string;
  eventType: string;
  source: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: string;
  data: T;
  metadata: EventMetadata;
}

export interface EventMetadata {
  traceId: string;
  correlationId: string;
  causationId?: string;
  userId?: string;
  serviceVersion: string;
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  traceId?: string;
}

export interface ResponseMeta {
  requestId: string;
  timestamp: string;
  duration?: number;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// -----------------------------------------------------------------------------
// Pagination & Query Types
// -----------------------------------------------------------------------------

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams {
  search?: string;
  filters?: Record<string, unknown>;
  fields?: string[];
}

// -----------------------------------------------------------------------------
// Audit Log Types
// -----------------------------------------------------------------------------

export interface AuditLog extends BaseEntity {
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  userId?: string | null;
  userEmail?: string | null;
  changes?: Record<string, ChangeEntry>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ChangeEntry {
  oldValue: unknown;
  newValue: unknown;
}
