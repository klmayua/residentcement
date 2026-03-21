# ResidentCement ERP Implementation Plan
## Complete ERP Build with Nigerian Accounting Best Practices

**Document ID:** RC-ERP-PLAN-001
**Date:** March 21, 2026
**Scope:** Full ERP Implementation
**Timeline:** 6-8 weeks
**Status:** Planning Phase

---

## 1. Executive Summary

This plan outlines the complete implementation of ResidentCement's ERP system following Nigerian accounting standards and best practices. The implementation will transform the current UI prototype into a fully functional ERP with real business logic, data persistence, and financial compliance.

### Nigerian Regulatory Framework
- **Financial Reporting Council (FRC)** - Compliance with Nigerian Accounting Standards (NAS)
- **Corporate Affairs Commission (CAC)** - Company registration and filing requirements
- **Federal Inland Revenue Service (FIRS)** - Tax compliance (VAT, WHT, CIT)
- **Central Bank of Nigeria (CBN)** - Foreign exchange and banking regulations

---

## 2. Implementation Phases

### Phase 1: Foundation (Week 1)
**Priority: CRITICAL**

#### 1.1 Shared Kernel Enhancements
- Nigerian financial types (NGN currency, accounting periods)
- VAT calculation utilities (7.5% standard rate)
- Multi-currency support (NGN primary, USD secondary)
- Audit trail infrastructure
- Financial validation schemas

#### 1.2 Database Schema Completion
- General Ledger (GL) chart of accounts
- Journal entries and posting layers
- Tax tables (VAT, WHT, CIT)
- Bank reconciliation tables
- Fixed asset register

### Phase 2: Core Financial Services (Week 2)
**Priority: CRITICAL**

#### 2.1 Accounting Service (NEW)
**Port:** 3011

**Features:**
- Double-entry bookkeeping system
- Chart of accounts (Nigerian GAAP compliant)
- Journal entry posting
- Trial balance generation
- General ledger maintenance
- Subsidiary ledgers (AR, AP, Inventory)
- Period-end closing procedures
- Financial year management (Jan-Dec)

**Nigerian Compliance:**
- FRS-compliant account codes
- VAT input/output tracking
- WHT calculation and reporting
- CIT provision calculation

#### 2.2 Enhanced Payment Service
**Port:** 3005

**Features:**
- Paystack integration (complete)
- Bank transfer processing
- Payment reconciliation
- Multi-bank support (GTBank, Zenith, FirstBank, UBA)
- Bank statement import (CSV, OFX)
- Automated reconciliation
- Payment receipts generation

### Phase 3: Operational Services (Week 3)
**Priority: HIGH**

#### 3.1 Complete Inventory Service
**Port:** 3003

**Features:**
- FIFO/LIFO valuation methods
- Weighted average cost calculation
- Stock movement tracking
- Reorder point automation
- ABC analysis
- Cycle counting
- Batch/lot tracking
- Expiry date management
- Warehouse transfers
- Stock adjustments with approval workflow

**Nigerian Requirements:**
- Import duty tracking
- NAFDAC compliance tracking
- Quality inspection gates

#### 3.2 Complete Order Service
**Port:** 3007

**Features:**
- Full order lifecycle (Quote → Order → Delivery → Invoice)
- Credit limit checking
- Pricing rules engine
- Discount approval workflow
- Order splitting by warehouse
- Backorder management
- Order profitability analysis
- Customer profitability tracking

#### 3.3 Complete Product Service
**Port:** 3006

**Features:**
- Product master with variants
- Cost tracking (standard, actual, average)
- Bill of materials (BOM)
- Product profitability
- Price history
- SKU management
- Barcode integration

### Phase 4: Customer & Sales (Week 4)
**Priority: HIGH**

#### 4.1 Complete Customer Service
**Port:** 3002

**Features:**
- Customer master with credit management
- Territory management
- Sales representative assignment
- Credit limit approval workflow
- Customer aging reports
- Statement generation
- Distributor tier management
- KYC documentation tracking

**Nigerian Requirements:**
- TIN (Tax Identification Number) tracking
- CAC registration number
- BVN verification integration

#### 4.2 Enhanced Pricing Service
**Port:** 3004

**Features:**
- Dynamic pricing engine
- Volume discounts
- Customer tier pricing
- Promotional pricing
- Price validity periods
- Currency conversion
- Cost-plus pricing

### Phase 5: Production & Quality (Week 5)
**Priority: MEDIUM**

#### 5.1 Complete Plant MES Service
**Port:** 3008

**Features:**
- Production order management
- Batch tracking
- Raw material consumption
- Yield calculation
- Cost of production
- Equipment maintenance
- Downtime tracking
- OEE calculation

#### 5.2 Complete Quality Service
**Port:** 3009

**Features:**
- Quality inspection workflows
- NCR (Non-Conformance Report) management
- CAPA (Corrective and Preventive Action)
- Quality certificates
- Lab test results
- Certificate of analysis
- ISO 9001 compliance tracking

### Phase 6: Logistics & Reporting (Week 6)
**Priority: MEDIUM**

#### 6.1 Complete Logistics Service
**Port:** 3010

**Features:**
- Fleet management
- Route optimization
- Delivery scheduling
- Driver management
- Vehicle maintenance
- Fuel tracking
- Delivery confirmation
- Proof of delivery (POD)
- Trip costing

#### 6.2 Reporting & Analytics Service (NEW)
**Port:** 3012

**Features:**
- Real-time KPI dashboard
- Financial reports (P&L, Balance Sheet, Cash Flow)
- Management reports
- Boardroom executive dashboard
- Custom report builder
- Scheduled reports
- Export (PDF, Excel, CSV)

**Nigerian Financial Reports:**
- Schedule of Fixed Assets (FIRS)
- VAT returns (monthly)
- WHT returns (monthly)
- Annual tax returns
- Audited financial statements

### Phase 7: Integration & Frontend Wiring (Week 7-8)
**Priority: HIGH**

#### 7.1 Service Integration
- Kafka event wiring (complete)
- Saga pattern for distributed transactions
- Circuit breakers
- Retry logic
- Dead letter queues

#### 7.2 Frontend Data Binding
- Replace all mock data with real API calls
- TanStack Query implementation
- Real-time updates via WebSockets
- Offline capability
- Error handling

#### 7.3 Boardroom Dashboard
- Real-time KPIs from actual data
- Executive summaries
- Trend analysis
- Drill-down capability
- Mobile-responsive executive view

---

## 3. Nigerian Accounting Standards Implementation

### 3.1 Chart of Accounts Structure

```
1xxx - Assets
  11xx - Current Assets
    1101 - Cash and Bank
    1102 - Accounts Receivable
    1103 - Inventory
    1104 - Prepayments
  12xx - Fixed Assets
    1201 - Land
    1202 - Buildings
    1203 - Plant & Machinery
    1204 - Vehicles
    1205 - Furniture & Fittings
  13xx - Intangible Assets

2xxx - Liabilities
  21xx - Current Liabilities
    2101 - Accounts Payable
    2102 - VAT Payable
    2103 - WHT Payable
    2104 - Accrued Expenses
    2105 - Short-term Loans
  22xx - Long-term Liabilities
    2201 - Long-term Loans
    2202 - Bonds

3xxx - Equity
  3101 - Share Capital
  3102 - Share Premium
  3103 - Retained Earnings

4xxx - Revenue
  4101 - Cement Sales - 42.5R
  4102 - Cement Sales - 32.5R
  4103 - Cement Sales - 52.5R
  4104 - Cement Sales - Pozzolana
  4105 - Bulk Cement Sales
  4201 - Transport Revenue
  4301 - Other Income

5xxx - Cost of Goods Sold
  5101 - Raw Materials
  5102 - Direct Labour
  5103 - Manufacturing Overhead
  5201 - Freight Out

6xxx - Operating Expenses
  6101 - Salaries and Wages
  6102 - Employee Benefits
  6201 - Rent and Rates
  6202 - Utilities
  6203 - Repairs and Maintenance
  6301 - Marketing and Advertising
  6302 - Distribution Costs
  6401 - Administrative Expenses
  6402 - Professional Fees
  6403 - Audit Fees
  6404 - Legal Fees

7xxx - Other Income/Expense
  7101 - Interest Income
  7201 - Interest Expense
  7202 - Bank Charges

8xxx - Taxation
  8101 - Company Income Tax
  8102 - Deferred Tax
  8201 - VAT Expense
```

### 3.2 Nigerian Tax Configuration

#### VAT (Value Added Tax)
- **Standard Rate:** 7.5%
- **Registration Threshold:** ₦25 million turnover
- **Filing:** Monthly (21st of following month)
- **Output VAT:** On sales
- **Input VAT:** On purchases (recoverable)

#### WHT (Withholding Tax)
- **Dividends:** 10%
- **Interest:** 10%
- **Royalties:** 10%
- **Directors Fees:** 10%
- **Contracts:** 5%
- **Rent:** 10%
- **Consultancy:** 10%
- **Agency:** 10%

#### CIT (Company Income Tax)
- **Rate:** 30% for large companies (>₦100M turnover)
- **Rate:** 20% for medium (₦25M-₦100M)
- **Rate:** 0% for small (<₦25M) - first 5 years
- **Minimum Tax:** 0.5% of gross profit
- **Filing:** Annual (within 6 months of year-end)

### 3.3 Multi-Currency Support

**Primary Currency:** NGN (Nigerian Naira)
**Secondary Currencies:** USD, EUR, GBP

**CBN Integration:**
- Daily exchange rate updates
- Official vs parallel rate tracking
- FX gain/loss calculation
- Forward contract support

---

## 4. Technical Architecture

### 4.1 Service Communication

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                          │
│                      (Express.js)                             │
└────────────────────┬────────────────────────────────────────┘
                     │
       ┌─────────────┼─────────────┬─────────────┐
       │             │             │             │
       ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Customer │  │  Order   │  │ Inventory│  │  Product │
│ Service  │  │ Service  │  │ Service  │  │ Service  │
│ (:3002)  │  │ (:3007)  │  │ (:3003)  │  │ (:3006)  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     │             │             │             │
┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
│ Payment  │  │  Pricing │  │ Accounting│  │  Plant   │
│ Service  │  │ Service  │  │ Service  │  │   MES    │
│ (:3005)  │  │ (:3004)  │  │ (:3011)  │  │ (:3008)  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     │             │             │             │
┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
│ Logistics│  │  Quality │  │Reporting │  │  Events  │
│ Service  │  │ Service  │  │ Service  │  │ Service  │
│ (:3010)  │  │ (:3009)  │  │ (:3012)  │  │ (:3001)  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Kafka Bus     │
            │  (Event Stream) │
            └─────────────────┘
```

### 4.2 Event Types (Kafka Topics)

```
// Financial Events
account.journal.posted
account.period.closed
account.trial.balance.ready
payment.received
payment.processed
invoice.generated

// Sales Events
customer.created
customer.updated
order.created
order.approved
order.shipped
order.delivered
order.invoiced
order.paid

// Inventory Events
inventory.movement
inventory.reorder.triggered
inventory.adjusted
inventory.received
inventory.shipped

// Production Events
production.order.started
production.order.completed
batch.created
quality.inspection.passed
quality.inspection.failed

// Logistics Events
shipment.dispatched
shipment.in.transit
shipment.delivered
delivery.confirmed
```

### 4.3 Data Consistency (Saga Pattern)

**Order Processing Saga:**
```
1. Order Created
2. Reserve Inventory (compensate: Release Inventory)
3. Check Credit (compensate: None)
4. Create Invoice (compensate: Void Invoice)
5. Process Payment (compensate: Refund Payment)
6. Post to GL (compensate: Reversing Entry)
7. Confirm Order
```

---

## 5. Database Schema Additions

### 5.1 General Ledger Tables

```sql
-- Chart of Accounts
create table accounts (
  id text primary key,
  code text unique not null,
  name text not null,
  type account_type not null, -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  subtype text,
  parent_id text references accounts(id),
  is_bank_account boolean default false,
  is_control_account boolean default false,
  currency text default 'NGN',
  opening_balance decimal(18,2) default 0,
  current_balance decimal(18,2) default 0,
  created_at timestamp default now()
);

-- Journal Entries
CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  entry_number TEXT UNIQUE NOT NULL,
  entry_date DATE NOT NULL,
  period_id TEXT REFERENCES accounting_periods(id),
  reference TEXT,
  description TEXT NOT NULL,
  source_document TEXT, -- invoice, payment, etc.
  source_id TEXT,
  total_debit DECIMAL(18,2) NOT NULL DEFAULT 0,
  total_credit DECIMAL(18,2) NOT NULL DEFAULT 0,
  status journal_status DEFAULT 'DRAFT',
  posted_at TIMESTAMP,
  posted_by TEXT REFERENCES users(id),
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Journal Entry Lines
CREATE TABLE journal_entry_lines (
  id TEXT PRIMARY KEY,
  journal_entry_id TEXT REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id),
  description TEXT,
  debit_amount DECIMAL(18,2) DEFAULT 0,
  credit_amount DECIMAL(18,2) DEFAULT 0,
  cost_center TEXT,
  project_code TEXT,
  line_order INTEGER
);

-- Accounting Periods
CREATE TABLE accounting_periods (
  id TEXT PRIMARY KEY,
  fiscal_year INTEGER NOT NULL,
  period_number INTEGER NOT NULL, -- 1-12 for monthly
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status period_status DEFAULT 'OPEN',
  is_closed BOOLEAN DEFAULT FALSE,
  closed_at TIMESTAMP,
  closed_by TEXT REFERENCES users(id)
);
```

### 5.2 Tax Tables

```sql
-- Tax Configuration
CREATE TABLE tax_rates (
  id TEXT PRIMARY KEY,
  tax_type tax_type NOT NULL, -- VAT, WHT, CIT
  name TEXT NOT NULL,
  rate DECIMAL(5,4) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tax Transactions
CREATE TABLE tax_transactions (
  id TEXT PRIMARY KEY,
  tax_type TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  period_id TEXT REFERENCES accounting_periods(id),
  base_amount DECIMAL(18,2) NOT NULL,
  tax_amount DECIMAL(18,2) NOT NULL,
  document_type TEXT, -- INVOICE, PAYMENT, etc.
  document_id TEXT,
  customer_id TEXT REFERENCES customers(id),
  supplier_id TEXT,
  status TEXT DEFAULT 'PENDING'
);
```

### 5.3 Fixed Assets

```sql
CREATE TABLE fixed_assets (
  id TEXT PRIMARY KEY,
  asset_code TEXT UNIQUE NOT NULL,
  asset_name TEXT NOT NULL,
  category TEXT NOT NULL,
  acquisition_date DATE NOT NULL,
  acquisition_cost DECIMAL(18,2) NOT NULL,
  residual_value DECIMAL(18,2) DEFAULT 0,
  useful_life_years INTEGER NOT NULL,
  depreciation_method depreciation_method DEFAULT 'STRAIGHT_LINE',
  accumulated_depreciation DECIMAL(18,2) DEFAULT 0,
  net_book_value DECIMAL(18,2),
  location TEXT,
  custodian TEXT,
  status asset_status DEFAULT 'ACTIVE'
);
```

---

## 6. Frontend Implementation

### 6.1 Admin Dashboard Enhancements

#### Financial Module
- Chart of Accounts management
- Journal Entry posting
- General Ledger inquiry
- Trial Balance
- Financial Statements (P&L, Balance Sheet, Cash Flow)
- Bank Reconciliation
- Budget vs Actual

#### Reporting Module
- Boardroom Executive Dashboard
- Real-time KPIs
- Financial Reports
- Operational Reports
- Custom Report Builder

### 6.2 Data Binding Strategy

1. Replace all mock arrays with TanStack Query hooks
2. Implement optimistic updates
3. Add real-time subscriptions (WebSockets)
4. Offline support with sync
5. Error boundaries and retry logic

---

## 7. Testing Strategy

### 7.1 Unit Tests
- Service layer: >80% coverage
- Business logic: 100% coverage
- Utility functions: >90% coverage

### 7.2 Integration Tests
- API endpoint testing
- Database transaction testing
- Kafka event flow testing
- Saga pattern testing

### 7.3 Financial Compliance Tests
- VAT calculation accuracy
- WHT computation
- GL posting validation
- Trial balance balancing

### 7.4 E2E Tests
- Order-to-cash workflow
- Procure-to-pay workflow
- Record-to-report workflow
- Month-end closing

---

## 8. Security & Compliance

### 8.1 Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Field-level encryption for sensitive data
- PII masking in logs

### 8.2 Access Control
- Role-based access control (RBAC)
- Principle of least privilege
- Segregation of duties
- Four-eyes principle for financial transactions

### 8.3 Audit Requirements
- Complete audit trail
- Immutable transaction logs
- User action logging
- Data change history

---

## 9. Deployment Strategy

### 9.1 Environment Strategy
- Development
- Staging (mirror of production)
- Production
- DR Site

### 9.2 Migration Plan
1. Database migrations
2. Service deployment (blue-green)
3. Frontend deployment
4. Data migration (if applicable)
5. Smoke tests
6. Rollback plan

---

## 10. Success Metrics

### 10.1 Technical Metrics
- API response time < 200ms (p95)
- System uptime > 99.9%
- Data accuracy: 100%
- Test coverage > 80%

### 10.2 Business Metrics
- Order processing time: < 5 minutes
- Month-end closing: < 3 days
- Payment reconciliation: < 24 hours
- Inventory accuracy: > 99%

---

## 11. Resource Requirements

### 11.1 Development Team
- 2 Backend Developers (4 weeks)
- 1 Frontend Developer (2 weeks)
- 1 QA Engineer (2 weeks)
- 1 DevOps Engineer (1 week)

### 11.2 Infrastructure
- Kubernetes cluster (3 nodes minimum)
- PostgreSQL (HA setup)
- Kafka cluster (3 brokers)
- Redis cluster
- Monitoring stack

---

## 12. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Data migration issues | Parallel run for 1 month |
| Performance degradation | Load testing, caching |
| Integration failures | Circuit breakers, fallbacks |
| Security breaches | Penetration testing, audits |
| Compliance gaps | External audit before launch |

---

## 13. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CTO | | | |
| CFO | | | |
| Project Sponsor | | | |

---

**Next Step:** Proceed to Phase 1 implementation upon approval.
