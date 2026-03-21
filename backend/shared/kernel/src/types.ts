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

// -----------------------------------------------------------------------------
// Nigerian Accounting & Financial Types
// -----------------------------------------------------------------------------

// Currencies supported
export type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP';

// Primary currency is NGN
export const PRIMARY_CURRENCY: CurrencyCode = 'NGN';

// Nigerian Tax Types
export type TaxType = 'VAT' | 'WHT' | 'CIT' | 'EDT' | 'PAYE';

// VAT Configuration (Nigeria: 7.5% standard rate)
export interface VATConfig {
  standardRate: number;      // 0.075 (7.5%)
  exemptRate: number;        // 0.00
  zeroRated: number;         // 0.00
  registrationThreshold: number; // NGN 25,000,000 annual turnover
  filingFrequency: 'MONTHLY' | 'QUARTERLY';
  filingDeadline: number;    // Day of month (21st)
}

export const DEFAULT_VAT_CONFIG: VATConfig = {
  standardRate: 0.075,
  exemptRate: 0,
  zeroRated: 0,
  registrationThreshold: 25000000,
  filingFrequency: 'MONTHLY',
  filingDeadline: 21,
};

// WHT (Withholding Tax) Rates - Nigeria
export interface WHTRate {
  type: string;
  rate: number;
  applicableTo: string[];
}

export const WHT_RATES: WHTRate[] = [
  { type: 'DIVIDEND', rate: 0.10, applicableTo: ['dividends', 'distributions'] },
  { type: 'INTEREST', rate: 0.10, applicableTo: ['interest', 'deposit'] },
  { type: 'ROYALTY', rate: 0.10, applicableTo: ['royalties', 'intellectual_property'] },
  { type: 'DIRECTORS_FEES', rate: 0.10, applicableTo: ['director_fees', 'board_remuneration'] },
  { type: 'CONTRACTS', rate: 0.05, applicableTo: ['contracts', 'supplies', 'services'] },
  { type: 'RENT', rate: 0.10, applicableTo: ['rent', 'lease'] },
  { type: 'CONSULTANCY', rate: 0.10, applicableTo: ['consultancy', 'professional_services'] },
  { type: 'AGENCY', rate: 0.10, applicableTo: ['agency', 'commission'] },
];

// CIT (Company Income Tax) Rates - Nigeria
export interface CITRate {
  category: 'SMALL' | 'MEDIUM' | 'LARGE';
  turnoverThreshold: { min: number; max: number | null };
  rate: number;
  description: string;
}

export const CIT_RATES: CITRate[] = [
  {
    category: 'SMALL',
    turnoverThreshold: { min: 0, max: 25000000 },
    rate: 0,
    description: '0% for first 5 years (reinvestment allowance)',
  },
  {
    category: 'MEDIUM',
    turnoverThreshold: { min: 25000000, max: 100000000 },
    rate: 0.20,
    description: '20% for medium companies',
  },
  {
    category: 'LARGE',
    turnoverThreshold: { min: 100000000, max: null },
    rate: 0.30,
    description: '30% for large companies',
  },
];

// Minimum Tax (0.5% of gross profit if CIT is lower)
export const MINIMUM_TAX_RATE = 0.005;

// Accounting Period (Nigeria: January - December)
export type AccountingPeriod = {
  year: number;
  month: number; // 1-12
  startDate: Date;
  endDate: Date;
  status: 'OPEN' | 'CLOSED' | 'PENDING_CLOSE';
};

// Fiscal Year (Nigeria: Jan 1 - Dec 31)
export interface FiscalYear {
  year: number;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING';
  closedAt?: Date;
  closedBy?: string;
}

// Account Types (Nigerian GAAP)
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

// Account Subtypes
export type AccountSubType =
  | 'CURRENT_ASSET'
  | 'FIXED_ASSET'
  | 'INTANGIBLE_ASSET'
  | 'CURRENT_LIABILITY'
  | 'LONG_TERM_LIABILITY'
  | 'EQUITY'
  | 'OPERATING_REVENUE'
  | 'OTHER_REVENUE'
  | 'COST_OF_SALES'
  | 'OPERATING_EXPENSE'
  | 'OTHER_EXPENSE';

// Journal Entry Status
export type JournalEntryStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'POSTED' | 'REVERSED';

// Nigerian Banks (major ones for integrations)
export type NigerianBankCode =
  | '000014' // First Bank
  | '000015' // GTBank
  | '000016' // Zenith
  | '000018' // UBA
  | '000019' // Union Bank
  | '000020' | '000021' | '000022' | '000023' | '000024';

export interface NigerianBank {
  code: NigerianBankCode;
  name: string;
  shortName: string;
}

export const NIGERIAN_BANKS: NigerianBank[] = [
  { code: '000014', name: 'First Bank of Nigeria', shortName: 'FirstBank' },
  { code: '000015', name: 'Guaranty Trust Bank', shortName: 'GTBank' },
  { code: '000016', name: 'Zenith Bank', shortName: 'Zenith' },
  { code: '000018', name: 'United Bank for Africa', shortName: 'UBA' },
  { code: '000019', name: 'Union Bank of Nigeria', shortName: 'Union' },
  { code: '000020', name: 'Access Bank', shortName: 'Access' },
  { code: '000021', name: 'Ecobank Nigeria', shortName: 'Ecobank' },
  { code: '000022', name: 'Fidelity Bank', shortName: 'Fidelity' },
  { code: '000023', name: 'Stanbic IBTC Bank', shortName: 'Stanbic' },
  { code: '000024', name: 'Sterling Bank', shortName: 'Sterling' },
];

// Exchange Rate Configuration
export interface ExchangeRate {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  source: 'CBN' | 'PARALLEL' | 'CUSTOM';
  effectiveDate: Date;
  expiresAt?: Date;
}

// CBN Official Rates (daily update)
export interface CBNRate {
  currency: CurrencyCode;
  buyRate: number;
  sellRate: number;
  centralRate: number;
  date: Date;
}

// Financial Document Types (Nigerian compliance)
export type FinancialDocumentType =
  | 'INVOICE'
  | 'RECEIPT'
  | 'PAYMENT_VOUCHER'
  | 'JOURNAL_VOUCHER'
  | 'CREDIT_NOTE'
  | 'DEBIT_NOTE'
  | 'TAX_INVOICE'
  | 'DELIVERY_NOTE';

// Cost Center Structure (typical Nigerian manufacturing)
export type CostCenterType =
  | 'PRODUCTION'
  | 'ADMINISTRATION'
  | 'SALES'
  | 'DISTRIBUTION'
  | 'RESEARCH';

export interface CostCenter {
  code: string;
  name: string;
  type: CostCenterType;
  parentId?: string;
  manager?: string;
  budget?: number;
}

// Nigerian Regulatory References
export interface RegulatoryInfo {
  cacNumber?: string;       // Corporate Affairs Commission
  tin?: string;             // Tax Identification Number
  vatNumber?: string;       // VAT TIN
  rcNumber?: string;        // Registration Number
}

// Payment Terms (Nigerian business norms)
export type PaymentTerm =
  | 'CASH_ON_DELIVERY'
  | 'NET_7'
  | 'NET_14'
  | 'NET_30'
  | 'NET_45'
  | 'NET_60'
  | 'PREPAID';

// Depreciation Methods (Nigerian GAAP accepted)
export type DepreciationMethod = 'STRAIGHT_LINE' | 'REDUCING_BALANCE' | 'UNITS_OF_PRODUCTION';

// Financial Ratios (Nigerian banking covenant common metrics)
export interface FinancialRatios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  grossProfitMargin: number;
  netProfitMargin: number;
  inventoryTurnover: number;
  daysSalesOutstanding: number;
}

// Monthly VAT Return Summary (FIRS format)
export interface VATReturnSummary {
  period: string; // YYYY-MM
  outputVAT: number; // VAT on sales
  inputVAT: number; // VAT on purchases
  netVATPayable: number;
  totalSalesExclVAT: number;
  totalPurchasesExclVAT: number;
  exemptSupplies: number;
  zeroRatedSupplies: number;
}

// Annual Tax Computation
export interface TaxComputation {
  fiscalYear: number;
  assessableProfit: number;
  capitalAllowance: number;
  totalProfit: number;
  taxRate: number;
  taxPayable: number;
  minimumTax: number;
  educationTax: number; // 2% of assessable profit
  netTaxLiability: number;
  paymentsMade: number;
  balanceDue: number;
}
