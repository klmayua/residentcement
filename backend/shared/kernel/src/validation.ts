/**
 * Validation Schemas for ResidentCement
 * 
 * Reusable Zod schemas for request/response validation
 */

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Common Validators
// -----------------------------------------------------------------------------

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255);

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s-()]{10,20}$/, 'Invalid phone number')
  .optional()
  .nullable();

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .max(2048)
  .optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  search: z.string().max(255).optional(),
  filters: z.record(z.unknown()).optional(),
});

// -----------------------------------------------------------------------------
// Address Schemas
// -----------------------------------------------------------------------------

export const addressSchema = z.object({
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  lga: z.string().max(100).optional().nullable(),
  country: z.string().max(100).default('Nigeria'),
  postalCode: z.string().max(20).optional().nullable(),
});

// -----------------------------------------------------------------------------
// Authentication Schemas
// -----------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2).max(100),
  phone: phoneSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

// -----------------------------------------------------------------------------
// Customer Schemas
// -----------------------------------------------------------------------------

export const customerTierSchema = z.enum([
  'STANDARD',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'ENTERPRISE',
]);

export const customerStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'PROSPECT',
]);

export const createCustomerSchema = z.object({
  name: z.string().min(2).max(200),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  lga: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().default('Nigeria'),
  tier: customerTierSchema.optional().default('STANDARD'),
  creditLimit: z.number().nonnegative().optional().default(0),
  contactPerson: z.string().max(200).optional().nullable(),
  status: customerStatusSchema.optional().default('PROSPECT'),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerQuerySchema = paginationSchema.merge(
  z.object({
    tier: customerTierSchema.optional(),
    status: customerStatusSchema.optional(),
    search: z.string().optional(),
  })
);

// -----------------------------------------------------------------------------
// Product Schemas
// -----------------------------------------------------------------------------

export const productCategorySchema = z.enum([
  'CEMENT',
  'CONCRETE',
  'AGGREGATE',
  'ADDITIVE',
  'EQUIPMENT',
]);

export const productStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'DISCONTINUED',
  'OUT_OF_STOCK',
]);

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  sku: z.string().min(3).max(50),
  description: z.string().max(2000).optional().nullable(),
  category: productCategorySchema,
  basePrice: z.number().positive(),
  unitOfMeasure: z.string().max(50),
  weight: z.number().positive().optional().nullable(),
  volume: z.number().positive().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = paginationSchema.merge(
  z.object({
    category: productCategorySchema.optional(),
    status: productStatusSchema.optional(),
    search: z.string().optional(),
  })
);

// -----------------------------------------------------------------------------
// Order Schemas
// -----------------------------------------------------------------------------

export const orderStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'IN_PRODUCTION',
  'READY_FOR_SHIPMENT',
  'IN_TRANSIT',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
]);

export const orderPrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']);

export const orderItemSchema = z.object({
  productId: uuidSchema,
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().nonnegative().optional().default(0),
});

export const createOrderSchema = z.object({
  customerId: uuidSchema,
  priority: orderPrioritySchema.optional().default('NORMAL'),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: z.string().max(500).optional().nullable(),
  deliveryDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateOrderSchema = createOrderSchema.partial();

export const cancelOrderSchema = z.object({
  reason: z.string().min(10).max(500),
});

export const orderQuerySchema = paginationSchema.merge(
  z.object({
    customerId: uuidSchema.optional(),
    status: orderStatusSchema.optional(),
    priority: orderPrioritySchema.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
  })
);

// -----------------------------------------------------------------------------
// Quote Schemas
// -----------------------------------------------------------------------------

export const quoteStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
  'CONVERTED',
]);

export const quoteItemSchema = z.object({
  productId: uuidSchema,
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().nonnegative().optional().default(0),
});

export const createQuoteSchema = z.object({
  customerId: uuidSchema,
  items: z.array(quoteItemSchema).min(1, 'Quote must have at least one item'),
  validUntil: z.string().datetime(),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateQuoteSchema = createQuoteSchema.partial();

export const quoteQuerySchema = paginationSchema.merge(
  z.object({
    customerId: uuidSchema.optional(),
    status: quoteStatusSchema.optional(),
    search: z.string().optional(),
  })
);

// -----------------------------------------------------------------------------
// Payment Schemas
// -----------------------------------------------------------------------------

export const paymentMethodSchema = z.enum([
  'CARD',
  'BANK_TRANSFER',
  'USSD',
  'CASH',
  'CHEQUE',
  'CREDIT',
]);

export const paymentStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REFUNDED',
  'CANCELLED',
]);

export const initiatePaymentSchema = z.object({
  customerId: uuidSchema,
  orderId: uuidSchema.optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('NGN'),
  method: paymentMethodSchema,
  metadata: z.record(z.unknown()).optional(),
});

export const paymentQuerySchema = paginationSchema.merge(
  z.object({
    orderId: uuidSchema.optional(),
    customerId: uuidSchema.optional(),
    status: paymentStatusSchema.optional(),
    method: paymentMethodSchema.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
);

// -----------------------------------------------------------------------------
// Inventory Schemas
// -----------------------------------------------------------------------------

export const inventoryStatusSchema = z.enum([
  'AVAILABLE',
  'RESERVED',
  'IN_TRANSIT',
  'QUARANTINED',
]);

export const updateInventorySchema = z.object({
  quantity: z.number().int().nonnegative(),
  status: inventoryStatusSchema.optional(),
});

export const reserveInventorySchema = z.object({
  productId: uuidSchema,
  warehouseId: uuidSchema,
  quantity: z.number().int().positive(),
  orderId: uuidSchema.optional(),
});

export const inventoryQuerySchema = paginationSchema.merge(
  z.object({
    productId: uuidSchema.optional(),
    warehouseId: uuidSchema.optional(),
    status: inventoryStatusSchema.optional(),
  })
);

// -----------------------------------------------------------------------------
// Pricing Schemas
// -----------------------------------------------------------------------------

export const pricingRuleTypeSchema = z.enum([
  'FIXED',
  'PERCENTAGE',
  'TIERED',
  'VOLUME_BASED',
]);

export const pricingScopeSchema = z.enum([
  'GLOBAL',
  'CUSTOMER_TIER',
  'CUSTOMER',
  'REGION',
  'PRODUCT_CATEGORY',
]);

export const createPricingRuleSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(500).optional().nullable(),
  ruleType: pricingRuleTypeSchema,
  scope: pricingScopeSchema,
  scopeValue: z.string().optional().nullable(),
  productId: uuidSchema.optional().nullable(),
  customerTier: customerTierSchema.optional().nullable(),
  value: z.number(),
  minQuantity: z.number().int().positive().optional().nullable(),
  maxQuantity: z.number().int().positive().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
});

export const updatePricingRuleSchema = createPricingRuleSchema.partial();

export const pricingQuerySchema = paginationSchema.merge(
  z.object({
    ruleType: pricingRuleTypeSchema.optional(),
    scope: pricingScopeSchema.optional(),
    isActive: z.boolean().optional(),
    search: z.string().optional(),
  })
);

// -----------------------------------------------------------------------------
// Health Check Schemas
// -----------------------------------------------------------------------------

export const healthCheckResponseSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  service: z.string(),
  version: z.string(),
  timestamp: z.string(),
  uptime: z.number(),
  checks: z.array(
    z.object({
      name: z.string(),
      status: z.enum(['pass', 'fail', 'warn']),
      message: z.string().optional(),
      responseTime: z.number().optional(),
      details: z.record(z.unknown()).optional(),
    })
  ),
});

// -----------------------------------------------------------------------------
// API Response Schemas
// -----------------------------------------------------------------------------

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.array(z.string())).optional(),
        traceId: z.string().optional(),
      })
      .optional(),
    meta: z
      .object({
        requestId: z.string(),
        timestamp: z.string(),
        duration: z.number().optional(),
        pagination: z
          .object({
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
            hasMore: z.boolean(),
          })
          .optional(),
      })
      .optional(),
  });

// -----------------------------------------------------------------------------
// Nigerian Accounting & Financial Validation Schemas
// -----------------------------------------------------------------------------

// Currency Schema
export const currencyCodeSchema = z.enum(['NGN', 'USD', 'EUR', 'GBP']);

// Nigerian Bank Account Validation
export const nigerianBankAccountSchema = z.object({
  bankCode: z.string().regex(/^\d{6}$/, 'Invalid bank code'),
  accountNumber: z.string().regex(/^\d{10}$/, 'Nigerian account number must be 10 digits'),
  accountName: z.string().min(2).max(100),
});

// NGN Currency Amount (2 decimal places)
export const ngnAmountSchema = z.number().nonnegative().multipleOf(0.01);

// VAT Calculation Schema
export const vatCalculationSchema = z.object({
  amount: z.number().positive(),
  isInclusive: z.boolean().default(false),
  vatRate: z.number().default(0.075), // 7.5% standard
});

// Tax Transaction Schema
export const taxTransactionSchema = z.object({
  taxType: z.enum(['VAT', 'WHT', 'CIT', 'EDT', 'PAYE']),
  baseAmount: z.number().positive(),
  taxRate: z.number().positive(),
  taxAmount: z.number().nonnegative(),
  documentType: z.enum([
    'INVOICE',
    'RECEIPT',
    'PAYMENT_VOUCHER',
    'JOURNAL_VOUCHER',
    'CREDIT_NOTE',
    'DEBIT_NOTE',
    'TAX_INVOICE',
    'DELIVERY_NOTE',
  ]),
  documentId: z.string().uuid(),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be YYYY-MM format'),
});

// Journal Entry Line Schema (Double Entry)
export const journalEntryLineSchema = z.object({
  accountId: z.string().uuid(),
  description: z.string().min(1).max(500),
  debitAmount: z.number().nonnegative().default(0),
  creditAmount: z.number().nonnegative().default(0),
  costCenter: z.string().optional(),
  projectCode: z.string().optional(),
}).refine(
  (data) => (data.debitAmount > 0) !== (data.creditAmount > 0),
  { message: 'Line must have either debit or credit amount, not both' }
);

// Journal Entry Schema (must balance)
export const journalEntrySchema = z.object({
  entryDate: z.string().datetime(),
  reference: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
  lines: z.array(journalEntryLineSchema).min(2),
  sourceDocument: z.string().optional(),
  sourceId: z.string().uuid().optional(),
}).refine(
  (data) => {
    const totalDebits = data.lines.reduce((sum, line) => sum + line.debitAmount, 0);
    const totalCredits = data.lines.reduce((sum, line) => sum + line.creditAmount, 0);
    return Math.abs(totalDebits - totalCredits) < 0.01; // Allow for rounding
  },
  { message: 'Journal entry must balance: total debits must equal total credits' }
);

// Chart of Accounts Schema
export const accountSchema = z.object({
  code: z.string().regex(/^\d{4}$/, 'Account code must be 4 digits'),
  name: z.string().min(2).max(200),
  type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']),
  subtype: z.enum([
    'CURRENT_ASSET',
    'FIXED_ASSET',
    'INTANGIBLE_ASSET',
    'CURRENT_LIABILITY',
    'LONG_TERM_LIABILITY',
    'EQUITY',
    'OPERATING_REVENUE',
    'OTHER_REVENUE',
    'COST_OF_SALES',
    'OPERATING_EXPENSE',
    'OTHER_EXPENSE',
  ]),
  parentId: z.string().uuid().optional(),
  isBankAccount: z.boolean().default(false),
  isControlAccount: z.boolean().default(false),
  currency: currencyCodeSchema.default('NGN'),
  openingBalance: z.number().default(0),
});

// Accounting Period Schema
export const accountingPeriodSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['OPEN', 'CLOSED', 'PENDING_CLOSE']),
});

// Fiscal Year Schema (Nigeria: Jan-Dec)
export const fiscalYearSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['ACTIVE', 'CLOSED', 'PENDING']),
});

// Nigerian Regulatory Info Schema
export const regulatoryInfoSchema = z.object({
  cacNumber: z.string().regex(/^RC\d{6,7}$/, 'CAC number format: RC######').optional(),
  tin: z.string().regex(/^\d{10,15}$/, 'TIN must be 10-15 digits').optional(),
  vatNumber: z.string().regex(/^\d{10,15}$/, 'VAT number must be 10-15 digits').optional(),
  rcNumber: z.string().optional(),
});

// Payment Terms Schema
export const paymentTermSchema = z.enum([
  'CASH_ON_DELIVERY',
  'NET_7',
  'NET_14',
  'NET_30',
  'NET_45',
  'NET_60',
  'PREPAID',
]);

// Financial Ratios Schema
export const financialRatiosSchema = z.object({
  currentRatio: z.number().nonnegative(),
  quickRatio: z.number().nonnegative(),
  debtToEquity: z.number().nonnegative(),
  returnOnAssets: z.number(),
  returnOnEquity: z.number(),
  grossProfitMargin: z.number(),
  netProfitMargin: z.number(),
  inventoryTurnover: z.number().nonnegative(),
  daysSalesOutstanding: z.number().nonnegative(),
});

// VAT Return Summary Schema
export const vatReturnSummarySchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/),
  outputVAT: z.number().nonnegative(),
  inputVAT: z.number().nonnegative(),
  netVATPayable: z.number(),
  totalSalesExclVAT: z.number().nonnegative(),
  totalPurchasesExclVAT: z.number().nonnegative(),
  exemptSupplies: z.number().nonnegative(),
  zeroRatedSupplies: z.number().nonnegative(),
});

// Tax Computation Schema
export const taxComputationSchema = z.object({
  fiscalYear: z.number().int(),
  assessableProfit: z.number().nonnegative(),
  capitalAllowance: z.number().nonnegative(),
  totalProfit: z.number().nonnegative(),
  taxRate: z.number().positive(),
  taxPayable: z.number().nonnegative(),
  minimumTax: z.number().nonnegative(),
  educationTax: z.number().nonnegative(),
  netTaxLiability: z.number().nonnegative(),
  paymentsMade: z.number().nonnegative(),
  balanceDue: z.number(),
});

// Cost Center Schema
export const costCenterSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(2).max(100),
  type: z.enum(['PRODUCTION', 'ADMINISTRATION', 'SALES', 'DISTRIBUTION', 'RESEARCH']),
  parentId: z.string().uuid().optional(),
  manager: z.string().optional(),
  budget: z.number().nonnegative().optional(),
});

// Exchange Rate Schema
export const exchangeRateSchema = z.object({
  fromCurrency: currencyCodeSchema,
  toCurrency: currencyCodeSchema,
  rate: z.number().positive(),
  source: z.enum(['CBN', 'PARALLEL', 'CUSTOM']),
  effectiveDate: z.string().datetime(),
});

// Depreciation Method Schema
export const depreciationMethodSchema = z.enum([
  'STRAIGHT_LINE',
  'REDUCING_BALANCE',
  'UNITS_OF_PRODUCTION',
]);

// Fixed Asset Schema
export const fixedAssetSchema = z.object({
  assetCode: z.string().min(1).max(50),
  assetName: z.string().min(2).max(200),
  category: z.string().min(1),
  acquisitionDate: z.string().datetime(),
  acquisitionCost: z.number().positive(),
  residualValue: z.number().nonnegative().default(0),
  usefulLifeYears: z.number().int().positive(),
  depreciationMethod: depreciationMethodSchema.default('STRAIGHT_LINE'),
  location: z.string().optional(),
  custodian: z.string().optional(),
  accountId: z.string().uuid(),
  depreciationAccountId: z.string().uuid(),
});

// Financial Document Schema
export const financialDocumentSchema = z.object({
  documentType: z.enum([
    'INVOICE',
    'RECEIPT',
    'PAYMENT_VOUCHER',
    'JOURNAL_VOUCHER',
    'CREDIT_NOTE',
    'DEBIT_NOTE',
    'TAX_INVOICE',
    'DELIVERY_NOTE',
  ]),
  documentNumber: z.string().min(1).max(50),
  documentDate: z.string().datetime(),
  reference: z.string().max(100).optional(),
  description: z.string().max(500),
  amount: z.number().positive(),
  currency: currencyCodeSchema.default('NGN'),
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'POSTED', 'CANCELLED']),
});
  // Auth
  login: loginSchema,
  register: registerSchema,
  refreshToken: refreshTokenSchema,
  changePassword: changePasswordSchema,

  // Customer
  createCustomer: createCustomerSchema,
  updateCustomer: updateCustomerSchema,
  customerQuery: customerQuerySchema,

  // Product
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
  productQuery: productQuerySchema,

  // Order
  createOrder: createOrderSchema,
  updateOrder: updateOrderSchema,
  cancelOrder: cancelOrderSchema,
  orderQuery: orderQuerySchema,

  // Quote
  createQuote: createQuoteSchema,
  updateQuote: updateQuoteSchema,
  quoteQuery: quoteQuerySchema,

  // Payment
  initiatePayment: initiatePaymentSchema,
  paymentQuery: paymentQuerySchema,

  // Inventory
  updateInventory: updateInventorySchema,
  reserveInventory: reserveInventorySchema,
  inventoryQuery: inventoryQuerySchema,

  // Pricing
  createPricingRule: createPricingRuleSchema,
  updatePricingRule: updatePricingRuleSchema,
  pricingQuery: pricingQuerySchema,

  // Common
  pagination: paginationSchema,
  search: searchSchema,
  uuid: uuidSchema,
  email: emailSchema,
  phone: phoneSchema,
  url: urlSchema,

  // Nigerian Accounting
  currencyCode: currencyCodeSchema,
  nigerianBankAccount: nigerianBankAccountSchema,
  ngnAmount: ngnAmountSchema,
  vatCalculation: vatCalculationSchema,
  taxTransaction: taxTransactionSchema,
  journalEntryLine: journalEntryLineSchema,
  journalEntry: journalEntrySchema,
  account: accountSchema,
  accountingPeriod: accountingPeriodSchema,
  fiscalYear: fiscalYearSchema,
  regulatoryInfo: regulatoryInfoSchema,
  paymentTerm: paymentTermSchema,
  financialRatios: financialRatiosSchema,
  vatReturnSummary: vatReturnSummarySchema,
  taxComputation: taxComputationSchema,
  costCenter: costCenterSchema,
  exchangeRate: exchangeRateSchema,
  depreciationMethod: depreciationMethodSchema,
  fixedAsset: fixedAssetSchema,
  financialDocument: financialDocumentSchema,
};
