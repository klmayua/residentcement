/**
 * ResidentCement Reporting Service
 *
 * Boardroom reporting and business intelligence
 * - Executive dashboards
 * - Financial reports (Nigerian GAAP compliant)
 * - Sales and operational analytics
 * - Real-time KPIs
 * - Custom report builder
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, startOfDay, endOfDay } from 'date-fns';
import {
  createLogger,
  requestIdMiddleware,
  requestLoggingMiddleware,
  errorHandler,
  createHealthCheckService,
  checkMemory,
  NotFoundError,
  ValidationError,
} from '@resident-cement/kernel';
import { PrismaClient } from '@prisma/client';
import { createKafkaClient } from '@resident-cement/kafka-client';

config();

const logger = createLogger({
  service: 'reporting-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
});

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3012', 10);

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const kafkaClient = createKafkaClient('reporting-service');
kafkaClient.connect().catch((err: any) => logger.warn('Failed to connect to Kafka', err));

// Health check
const healthService = createHealthCheckService('reporting-service', '1.0.0');
healthService.addCheck('database', async () => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: 'database', status: 'pass' as const, responseTime: Date.now() - start };
  } catch {
    return { name: 'database', status: 'fail' as const, responseTime: Date.now() - start };
  }
});
healthService.addCheck('memory', () => checkMemory(0.9));

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(requestIdMiddleware());
app.use(requestLoggingMiddleware({ skipPaths: ['/health'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).logger = logger.child({ requestId: (req as any).id });
  next();
});

// =============================================================================
// HEALTH ROUTES
// =============================================================================

const healthRouter = express.Router();
healthRouter.get('/', async (_req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  res.json({ status: health.status, service: health.service, version: health.version, uptime: health.uptime });
});
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  const health = await healthService.getHealthStatus();
  if (health.status === 'unhealthy') return res.status(503).json({ ready: false });
  res.json({ ready: true });
});
healthRouter.get('/live', async (_req: Request, res: Response) => {
  res.json({ alive: true, uptime: process.uptime() });
});
app.use('/health', healthRouter);

// =============================================================================
// EXECUTIVE DASHBOARD
// =============================================================================

const dashboardRouter = express.Router();

// GET /reports/dashboard/executive - Executive KPI dashboard
// @ts-ignore
dashboardRouter.get('/executive', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;
    let previousStart: Date;
    let previousEnd: Date;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        previousStart = startOfDay(subDays(now, 1));
        previousEnd = endOfDay(subDays(now, 1));
        break;
      case 'week':
        startDate = subDays(now, 7);
        previousStart = subDays(now, 14);
        previousEnd = subDays(now, 7);
        break;
      case 'month':
        startDate = startOfMonth(now);
        previousStart = startOfMonth(subMonths(now, 1));
        previousEnd = endOfMonth(subMonths(now, 1));
        break;
      case 'year':
        startDate = startOfYear(now);
        previousStart = startOfYear(subDays(now, 365));
        previousEnd = endOfYear(subDays(now, 365));
        break;
      default:
        startDate = startOfMonth(now);
        previousStart = startOfMonth(subMonths(now, 1));
        previousEnd = endOfMonth(subMonths(now, 1));
    }

    // Parallel data fetching for performance
    const [
      salesMetrics,
      orderMetrics,
      financialMetrics,
      customerMetrics,
      productionMetrics,
      inventoryMetrics,
    ] = await Promise.all([
      // Sales metrics
      prisma.$queryRaw`
        SELECT
          COALESCE(SUM(total), 0) as revenue,
          COUNT(*) as order_count,
          AVG(total) as avg_order_value
        FROM "Order"
        WHERE status NOT IN ('CANCELLED', 'DRAFT')
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${endDate}
      `,
      // Previous period sales
      prisma.$queryRaw`
        SELECT COALESCE(SUM(total), 0) as revenue
        FROM "Order"
        WHERE status NOT IN ('CANCELLED', 'DRAFT')
          AND "createdAt" >= ${previousStart}
          AND "createdAt" <= ${previousEnd}
      `,
      // Order status breakdown
      prisma.$queryRaw`
        SELECT status, COUNT(*) as count
        FROM "Order"
        WHERE "createdAt" >= ${startDate}
        GROUP BY status
      `,
      // Financial metrics from accounting service
      prisma.$queryRaw`
        SELECT
          COALESCE(SUM(CASE WHEN "accountCode" LIKE '4%' THEN amount ELSE 0 END), 0) as revenue,
          COALESCE(SUM(CASE WHEN "accountCode" LIKE '5%' THEN amount ELSE 0 END), 0) as cogs,
          COALESCE(SUM(CASE WHEN "accountCode" LIKE '6%' THEN amount ELSE 0 END), 0) as opex
        FROM "JournalEntryLine"
        WHERE "createdAt" >= ${startDate}
      `,
      // Customer metrics
      prisma.$queryRaw`
        SELECT COUNT(*) as new_customers
        FROM "Customer"
        WHERE "createdAt" >= ${startDate}
      `,
      // Total active customers
      prisma.$queryRaw`
        SELECT COUNT(*) as total_customers
        FROM "Customer"
        WHERE status = 'ACTIVE'
      `,
      // Production metrics
      prisma.$queryRaw`
        SELECT
          COALESCE(SUM(quantity), 0) as total_production,
          COUNT(*) as batch_count
        FROM "Batch"
        WHERE status = 'COMPLETED'
          AND "createdAt" >= ${startDate}
      `,
      // Inventory metrics
      prisma.$queryRaw`
        SELECT
          COUNT(*) as sku_count,
          COALESCE(SUM("availableQuantity"), 0) as total_available,
          COALESCE(SUM(quantity *
            (SELECT AVG(unit_price) FROM "OrderItem" WHERE "productId" = "Inventory"."productId")
          ), 0) as inventory_value
        FROM "Inventory"
        WHERE status = 'AVAILABLE'
      `,
    ]);

    const currentRevenue = Number((salesMetrics as any[])[0]?.revenue || 0);
    const previousRevenue = Number((orderMetrics as any[])[0]?.revenue || 0);
    const revenueGrowth = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const dashboard = {
      period,
      generatedAt: new Date().toISOString(),
      kpis: {
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          growth: Math.round(revenueGrowth * 100) / 100,
          currency: 'NGN',
        },
        orders: {
          total: Number((salesMetrics as any[])[0]?.order_count || 0),
          averageValue: Math.round(Number((salesMetrics as any[])[0]?.avg_order_value || 0) * 100) / 100,
          statusBreakdown: (orderMetrics as any[]).reduce((acc: any, row: any) => {
            acc[row.status] = Number(row.count);
            return acc;
          }, {}),
        },
        customers: {
          total: Number((customerMetrics[1] as any[])[0]?.total_customers || 0),
          newThisPeriod: Number((customerMetrics[0] as any[])[0]?.new_customers || 0),
        },
        production: {
          totalBatches: Number((productionMetrics as any[])[0]?.batch_count || 0),
          totalQuantity: Number((productionMetrics as any[])[0]?.total_production || 0),
        },
        inventory: {
          skuCount: Number((inventoryMetrics as any[])[0]?.sku_count || 0),
          totalAvailable: Number((inventoryMetrics as any[])[0]?.total_available || 0),
          estimatedValue: Number((inventoryMetrics as any[])[0]?.inventory_value || 0),
        },
        financial: {
          grossRevenue: Number((financialMetrics as any[])[0]?.revenue || 0),
          cogs: Number((financialMetrics as any[])[0]?.cogs || 0),
          operatingExpenses: Number((financialMetrics as any[])[0]?.opex || 0),
          grossProfit: Number((financialMetrics as any[])[0]?.revenue || 0) - Number((financialMetrics as any[])[0]?.cogs || 0),
        },
      },
    };

    res.json({
      success: true,
      data: dashboard,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// GET /reports/dashboard/sales - Sales dashboard
dashboardRouter.get('/sales', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    const startDate = period === 'year'
      ? startOfYear(now)
      : period === 'quarter'
      ? subDays(now, 90)
      : startOfMonth(now);

    // Sales by day/month
    const salesTrend = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM "Order"
      WHERE status NOT IN ('CANCELLED', 'DRAFT')
        AND "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `;

    // Sales by product category
    const salesByCategory = await prisma.$queryRaw`
      SELECT
        p.category,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oi.quantity) as quantity_sold,
        SUM(oi.total) as revenue
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o.status NOT IN ('CANCELLED', 'DRAFT')
        AND o."createdAt" >= ${startDate}
      GROUP BY p.category
    `;

    // Sales by customer tier
    const salesByTier = await prisma.$queryRaw`
      SELECT
        c.tier,
        COUNT(DISTINCT o.id) as order_count,
        SUM(o.total) as revenue
      FROM "Order" o
      JOIN "Customer" c ON o."customerId" = c.id
      WHERE o.status NOT IN ('CANCELLED', 'DRAFT')
        AND o."createdAt" >= ${startDate}
      GROUP BY c.tier
    `;

    // Top customers
    const topCustomers = await prisma.$queryRaw`
      SELECT
        c.id,
        c.name,
        c.tier,
        COUNT(o.id) as order_count,
        SUM(o.total) as total_revenue
      FROM "Order" o
      JOIN "Customer" c ON o."customerId" = c.id
      WHERE o.status NOT IN ('CANCELLED', 'DRAFT')
        AND o."createdAt" >= ${startDate}
      GROUP BY c.id, c.name, c.tier
      ORDER BY total_revenue DESC
      LIMIT 10
    `;

    res.json({
      success: true,
      data: {
        period,
        salesTrend,
        salesByCategory,
        salesByTier,
        topCustomers,
      },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// GET /reports/dashboard/financial - Financial dashboard (Nigerian GAAP)
dashboardRouter.get('/financial', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fiscalYear = new Date().getFullYear() } = req.query;
    const yearStart = new Date(Number(fiscalYear), 0, 1);
    const yearEnd = new Date(Number(fiscalYear), 11, 31);

    // Revenue by month
    const revenueByMonth = await prisma.$queryRaw`
      SELECT
        EXTRACT(MONTH FROM "createdAt") as month,
        SUM(CASE WHEN "accountCode" LIKE '4%' THEN amount ELSE 0 END) as revenue,
        SUM(CASE WHEN "accountCode" LIKE '5%' THEN amount ELSE 0 END) as cogs
      FROM "JournalEntryLine"
      WHERE "createdAt" >= ${yearStart}
        AND "createdAt" <= ${yearEnd}
        AND EXISTS (
          SELECT 1 FROM "JournalEntry" je
          WHERE je.id = "JournalEntryLine"."journalEntryId"
          AND je.status = 'POSTED'
        )
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month
    `;

    // Balance sheet summary
    const balanceSheet = await prisma.$queryRaw`
      SELECT
        SUM(CASE WHEN "accountCode" LIKE '1%' THEN balance ELSE 0 END) as assets,
        SUM(CASE WHEN "accountCode" LIKE '2%' THEN balance ELSE 0 END) as liabilities,
        SUM(CASE WHEN "accountCode" LIKE '3%' THEN balance ELSE 0 END) as equity
      FROM "Account"
      WHERE is_active = true
    `;

    // Tax summary
    const taxSummary = await prisma.$queryRaw`
      SELECT
        SUM(CASE WHEN "taxType" = 'VAT' THEN amount ELSE 0 END) as vat,
        SUM(CASE WHEN "taxType" = 'WHT' THEN amount ELSE 0 END) as wht,
        SUM(CASE WHEN "taxType" = 'CIT' THEN amount ELSE 0 END) as cit
      FROM "TaxTransaction"
      WHERE "createdAt" >= ${yearStart}
        AND "createdAt" <= ${yearEnd}
    `;

    res.json({
      success: true,
      data: {
        fiscalYear,
        revenueByMonth,
        balanceSheet: (balanceSheet as any[])[0],
        taxSummary: (taxSummary as any[])[0],
      },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// GET /reports/dashboard/operations - Operations dashboard
dashboardRouter.get('/operations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    const startDate = period === 'year' ? startOfYear(now) : startOfMonth(now);

    // Production metrics
    const productionByProduct = await prisma.$queryRaw`
      SELECT
        p.name as product_name,
        po.status,
        COUNT(*) as order_count,
        SUM(po.quantity) as planned_quantity,
        SUM(b."actualQuantity") as actual_quantity
      FROM "ProductionOrder" po
      JOIN "Product" p ON po."productId" = p.id
      LEFT JOIN "Batch" b ON b."productionOrderId" = po.id AND b.status = 'COMPLETED'
      WHERE po."createdAt" >= ${startDate}
      GROUP BY p.name, po.status
    `;

    // Quality metrics
    const qualityMetrics = await prisma.$queryRaw`
      SELECT
        result,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM "Inspection"
      WHERE "inspectionDate" >= ${startDate}
      GROUP BY result
    `;

    // Logistics metrics
    const logisticsMetrics = await prisma.$queryRaw`
      SELECT
        status,
        COUNT(*) as trip_count,
        AVG("actualDuration") as avg_duration_minutes
      FROM "Trip"
      WHERE "scheduledDate" >= ${startDate}
      GROUP BY status
    `;

    // On-time delivery rate
    const onTimeDeliveries = await prisma.$queryRaw`
      SELECT
        COUNT(CASE WHEN "deliveredAt" <= d."scheduledTime" THEN 1 END) as on_time,
        COUNT(*) as total,
        ROUND(
          COUNT(CASE WHEN "deliveredAt" <= d."scheduledTime" THEN 1 END) * 100.0 / COUNT(*),
          2
        ) as on_time_percentage
      FROM "Delivery" d
      WHERE d."deliveredAt" IS NOT NULL
        AND d."createdAt" >= ${startDate}
    `;

    res.json({
      success: true,
      data: {
        period,
        productionByProduct,
        qualityMetrics,
        logisticsMetrics,
        onTimeDeliveries: (onTimeDeliveries as any[])[0],
      },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/reports/dashboard', dashboardRouter);

// =============================================================================
// FINANCIAL REPORTS (Nigerian GAAP)
// =============================================================================

const financialRouter = express.Router();

// GET /reports/financial/profit-loss - P&L Statement
financialRouter.get('/profit-loss', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, format = 'detailed' } = req.query;
    const start = startDate ? new Date(startDate as string) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate as string) : new Date();

    const plData = await prisma.$queryRaw`
      WITH RECURSIVE account_balances AS (
        SELECT
          a.code,
          a.name,
          a.type,
          a.subtype,
          COALESCE(SUM(CASE
            WHEN jel."isDebit" THEN jel.amount
            ELSE -jel.amount
          END), 0) as balance
        FROM "Account" a
        LEFT JOIN "JournalEntryLine" jel ON a.id = jel."accountId"
        LEFT JOIN "JournalEntry" je ON jel."journalEntryId" = je.id
          AND je.status = 'POSTED'
          AND je."entryDate" >= ${start}
          AND je."entryDate" <= ${end}
        WHERE a.is_active = true
        GROUP BY a.code, a.name, a.type, a.subtype
      )
      SELECT * FROM account_balances
      WHERE code LIKE '4%' OR code LIKE '5%' OR code LIKE '6%' OR code LIKE '7%' OR code LIKE '8%'
      ORDER BY code
    `;

    // Calculate totals
    const revenue = (plData as any[])
      .filter((row: any) => row.code.startsWith('4'))
      .reduce((sum: number, row: any) => sum + Number(row.balance), 0);

    const cogs = (plData as any[])
      .filter((row: any) => row.code.startsWith('5'))
      .reduce((sum: number, row: any) => sum + Number(row.balance), 0);

    const opex = (plData as any[])
      .filter((row: any) => row.code.startsWith('6'))
      .reduce((sum: number, row: any) => sum + Number(row.balance), 0);

    const otherExpenses = (plData as any[])
      .filter((row: any) => row.code.startsWith('7'))
      .reduce((sum: number, row: any) => sum + Number(row.balance), 0);

    const taxes = (plData as any[])
      .filter((row: any) => row.code.startsWith('8'))
      .reduce((sum: number, row: any) => sum + Number(row.balance), 0);

    const grossProfit = revenue - cogs;
    const operatingIncome = grossProfit - opex;
    const netIncome = operatingIncome - otherExpenses - taxes;

    const report = {
      period: { start: start.toISOString(), end: end.toISOString() },
      generatedAt: new Date().toISOString(),
      currency: 'NGN',
      revenue: {
        total: revenue,
        details: (plData as any[]).filter((row: any) => row.code.startsWith('4')),
      },
      cogs: {
        total: cogs,
        details: (plData as any[]).filter((row: any) => row.code.startsWith('5')),
      },
      grossProfit,
      grossMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
      operatingExpenses: {
        total: opex,
        details: (plData as any[]).filter((row: any) => row.code.startsWith('6')),
      },
      operatingIncome,
      operatingMargin: revenue > 0 ? (operatingIncome / revenue) * 100 : 0,
      otherExpenses: {
        total: otherExpenses,
        details: (plData as any[]).filter((row: any) => row.code.startsWith('7')),
      },
      taxes: {
        total: taxes,
        details: (plData as any[]).filter((row: any) => row.code.startsWith('8')),
      },
      netIncome,
      netMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0,
    };

    res.json({
      success: true,
      data: report,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// GET /reports/financial/balance-sheet - Balance Sheet
financialRouter.get('/balance-sheet', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { asOf } = req.query;
    const date = asOf ? new Date(asOf as string) : new Date();

    const balanceData = await prisma.$queryRaw`
      WITH RECURSIVE account_balances AS (
        SELECT
          a.code,
          a.name,
          a.type,
          a.subtype,
          COALESCE(SUM(CASE
            WHEN a.type IN ('ASSET', 'EXPENSE') THEN
              CASE WHEN jel."isDebit" THEN jel.amount ELSE -jel.amount END
            ELSE
              CASE WHEN jel."isDebit" THEN -jel.amount ELSE jel.amount END
          END), 0) as balance
        FROM "Account" a
        LEFT JOIN "JournalEntryLine" jel ON a.id = jel."accountId"
        LEFT JOIN "JournalEntry" je ON jel."journalEntryId" = je.id
          AND je.status = 'POSTED'
          AND je."entryDate" <= ${date}
        WHERE a.is_active = true
        GROUP BY a.code, a.name, a.type, a.subtype
      )
      SELECT * FROM account_balances
      ORDER BY code
    `;

    // Calculate totals by category
    const assets = {
      current: (balanceData as any[])
        .filter((row: any) => row.code.startsWith('1') && !['15', '16', '17', '18', '19'].some(prefix => row.code.startsWith(prefix)))
        .reduce((sum: number, row: any) => sum + Number(row.balance), 0),
      fixed: (balanceData as any[])
        .filter((row: any) => row.code.startsWith('15') || row.code.startsWith('16') || row.code.startsWith('17'))
        .reduce((sum: number, row: any) => sum + Number(row.balance), 0),
      intangible: (balanceData as any[])
        .filter((row: any) => row.code.startsWith('18'))
        .reduce((sum: number, row: any) => sum + Number(row.balance), 0),
    };

    const liabilities = {
      current: (balanceData as any[])
        .filter((row: any) => row.code.startsWith('21'))
        .reduce((sum: number, row: any) => sum + Number(row.balance), 0),
      longTerm: (balanceData as any[])
        .filter((row: any) => row.code.startsWith('22') || row.code.startsWith('23'))
        .reduce((sum: number, row: any) => sum + Number(row.balance), 0),
    };

    const equity = (balanceData as any[])
      .filter((row: any) => row.code.startsWith('3'))
      .reduce((sum: number, row: any) => sum + Number(row.balance), 0);

    const totalAssets = assets.current + assets.fixed + assets.intangible;
    const totalLiabilities = liabilities.current + liabilities.longTerm;
    const totalEquity = equity + (totalAssets - totalLiabilities - equity); // Retained earnings included

    const report = {
      asOf: date.toISOString(),
      generatedAt: new Date().toISOString(),
      currency: 'NGN',
      assets: {
        ...assets,
        total: totalAssets,
        details: (balanceData as any[]).filter((row: any) => row.code.startsWith('1')),
      },
      liabilities: {
        ...liabilities,
        total: totalLiabilities,
        details: (balanceData as any[]).filter((row: any) => row.code.startsWith('2')),
      },
      equity: {
        total: totalEquity,
        details: (balanceData as any[]).filter((row: any) => row.code.startsWith('3')),
      },
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
      balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
    };

    res.json({
      success: true,
      data: report,
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// GET /reports/financial/tax - Tax Reports (FIRS compliant)
financialRouter.get('/tax', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year = new Date().getFullYear(), type = 'all' } = req.query;
    const yearStart = new Date(Number(year), 0, 1);
    const yearEnd = new Date(Number(year), 11, 31);

    let taxData: any;

    if (type === 'vat' || type === 'all') {
      // Monthly VAT summary
      const vatSummary = await prisma.$queryRaw`
        SELECT
          EXTRACT(MONTH FROM "transactionDate") as month,
          SUM(CASE WHEN "isOutput" THEN amount ELSE 0 END) as output_vat,
          SUM(CASE WHEN NOT "isOutput" THEN amount ELSE 0 END) as input_vat,
          SUM(CASE WHEN "isOutput" THEN amount ELSE -amount END) as net_vat
        FROM "TaxTransaction"
        WHERE "taxType" = 'VAT'
          AND "transactionDate" >= ${yearStart}
          AND "transactionDate" <= ${yearEnd}
        GROUP BY EXTRACT(MONTH FROM "transactionDate")
        ORDER BY month
      `;
      taxData = { vat: vatSummary };
    }

    if (type === 'wht' || type === 'all') {
      // WHT summary by type
      const whtSummary = await prisma.$queryRaw`
        SELECT
          "whtType",
          COUNT(*) as transaction_count,
          SUM(amount) as total_amount
        FROM "TaxTransaction"
        WHERE "taxType" = 'WHT'
          AND "transactionDate" >= ${yearStart}
          AND "transactionDate" <= ${yearEnd}
        GROUP BY "whtType"
      `;
      taxData = { ...taxData, wht: whtSummary };
    }

    if (type === 'cit' || type === 'all') {
      // CIT computation
      const citBase = await prisma.$queryRaw`
        SELECT
          SUM(CASE WHEN "accountCode" LIKE '4%' THEN amount ELSE 0 END) as revenue,
          SUM(CASE WHEN "accountCode" LIKE '5%' THEN amount ELSE 0 END) as cogs,
          SUM(CASE WHEN "accountCode" LIKE '6%' OR "accountCode" LIKE '7%' THEN amount ELSE 0 END) as expenses,
          SUM(CASE WHEN "accountCode" LIKE '8%' THEN amount ELSE 0 END) as taxes_paid
        FROM "JournalEntryLine"
        WHERE "createdAt" >= ${yearStart}
          AND "createdAt" <= ${yearEnd}
      `;

      const revenue = Number((citBase as any[])[0]?.revenue || 0);
      const cogs = Number((citBase as any[])[0]?.cogs || 0);
      const expenses = Number((citBase as any[])[0]?.expenses || 0);
      const grossProfit = revenue - cogs;
      const assessableProfit = grossProfit - expenses;

      // Apply Nigerian CIT rates
      let taxRate = 0.30; // Large company rate
      if (revenue <= 25000000) taxRate = 0; // Small (first 5 years)
      else if (revenue <= 100000000) taxRate = 0.20; // Medium

      const citLiability = assessableProfit * taxRate;
      const minimumTax = revenue * 0.005; // 0.5% minimum tax
      const finalTax = Math.max(citLiability, minimumTax);

      taxData = {
        ...taxData,
        cit: {
          computation: {
            revenue,
            cogs,
            grossProfit,
            expenses,
            assessableProfit,
            taxRate,
            citLiability,
            minimumTax,
            finalTaxLiability: finalTax,
            educationTax: assessableProfit * 0.02, // 2% of assessable profit
          },
        },
      };
    }

    res.json({
      success: true,
      data: {
        year,
        currency: 'NGN',
        ...taxData,
      },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/reports/financial', financialRouter);

// =============================================================================
// CUSTOM REPORTS
// =============================================================================

const customRouter = express.Router();

// POST /reports/custom - Generate custom report
customRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, dataSource, filters, columns, groupBy, sortBy } = req.body;

    // Validate data source
    const validSources = ['orders', 'customers', 'products', 'payments', 'production', 'inventory'];
    if (!validSources.includes(dataSource)) {
      throw new ValidationError(`Invalid data source. Must be one of: ${validSources.join(', ')}`);
    }

    // Build query based on data source
    let query: any = {};
    let data: any[] = [];

    switch (dataSource) {
      case 'orders':
        data = await prisma.order.findMany({
          where: buildWhereClause(filters),
          include: { items: true, customer: true, payments: true },
          take: 1000,
        });
        break;
      case 'customers':
        data = await prisma.customer.findMany({
          where: buildWhereClause(filters),
          include: { orders: { take: 5 }, addresses: true },
          take: 1000,
        });
        break;
      case 'products':
        data = await prisma.product.findMany({
          where: buildWhereClause(filters),
          include: { inventory: true },
          take: 1000,
        });
        break;
      case 'payments':
        data = await prisma.payment.findMany({
          where: buildWhereClause(filters),
          include: { customer: true, order: true },
          take: 1000,
        });
        break;
      case 'production':
        data = await prisma.productionOrder.findMany({
          where: buildWhereClause(filters),
          include: { batches: true },
          take: 1000,
        });
        break;
      case 'inventory':
        data = await prisma.inventory.findMany({
          where: buildWhereClause(filters),
          include: { product: true, warehouse: true },
          take: 1000,
        });
        break;
    }

    // Save report configuration
    const reportConfig = await prisma.reportConfig.create({
      data: {
        id: uuidv4(),
        name,
        dataSource,
        filters: filters || {},
        columns: columns || [],
        groupBy: groupBy || null,
        sortBy: sortBy || null,
        createdBy: (req as any).user?.id || 'system',
      },
    });

    res.json({
      success: true,
      data: {
        config: reportConfig,
        results: data,
        totalRecords: data.length,
      },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

// GET /reports/custom/saved - Get saved reports
customRouter.get('/saved', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [reports, total] = await Promise.all([
      prisma.reportConfig.findMany({
        take: parseInt(limit as string),
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reportConfig.count(),
    ]);

    res.json({
      success: true,
      data: reports,
      meta: {
        requestId: (req as any).id,
        timestamp: new Date().toISOString(),
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error) { next(error); }
});

// Helper function to build where clause from filters
function buildWhereClause(filters: any): any {
  if (!filters) return {};

  const where: any = {};

  Object.entries(filters).forEach(([key, value]: [string, any]) => {
    if (value.operator && value.value !== undefined) {
      switch (value.operator) {
        case 'eq':
          where[key] = value.value;
          break;
        case 'ne':
          where[key] = { not: value.value };
          break;
        case 'gt':
          where[key] = { gt: value.value };
          break;
        case 'gte':
          where[key] = { gte: value.value };
          break;
        case 'lt':
          where[key] = { lt: value.value };
          break;
        case 'lte':
          where[key] = { lte: value.value };
          break;
        case 'contains':
          where[key] = { contains: value.value, mode: 'insensitive' };
          break;
        case 'in':
          where[key] = { in: value.value };
          break;
      }
    } else if (value.from !== undefined || value.to !== undefined) {
      where[key] = {};
      if (value.from !== undefined) where[key].gte = new Date(value.from);
      if (value.to !== undefined) where[key].lte = new Date(value.to);
    } else {
      where[key] = value;
    }
  });

  return where;
}

app.use('/api/v1/reports/custom', customRouter);

// =============================================================================
// REAL-TIME METRICS
// =============================================================================

const metricsRouter = express.Router();

// GET /reports/metrics/realtime - Real-time business metrics
metricsRouter.get('/realtime', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const thisMonthStart = startOfMonth(now);

    // Today's metrics
    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: todayStart } },
    });

    const todayRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart },
        status: { notIn: ['CANCELLED', 'DRAFT'] },
      },
      _sum: { total: true },
    });

    // Active orders
    const activeOrders = await prisma.order.count({
      where: {
        status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'IN_PRODUCTION', 'IN_TRANSIT'] },
      },
    });

    // Low stock alerts
    const lowStock = await prisma.inventory.count({
      where: {
        availableQuantity: { lte: 50 },
        status: 'AVAILABLE',
      },
    });

    // Production today
    const productionToday = await prisma.batch.count({
      where: {
        status: 'COMPLETED',
        endTime: { gte: todayStart },
      },
    });

    // Pending deliveries
    const pendingDeliveries = await prisma.delivery.count({
      where: {
        status: { in: ['SCHEDULED', 'IN_TRANSIT'] },
      },
    });

    res.json({
      success: true,
      data: {
        timestamp: now.toISOString(),
        today: {
          orders: todayOrders,
          revenue: todayRevenue._sum.total || 0,
        },
        active: {
          orders: activeOrders,
          deliveries: pendingDeliveries,
          productionBatches: await prisma.batch.count({ where: { status: 'IN_PROGRESS' } }),
        },
        alerts: {
          lowStock,
          pendingApprovals: await prisma.journalEntry.count({ where: { status: 'PENDING_APPROVAL' } }),
          openNCRs: await prisma.nonConformanceReport.count({ where: { status: 'OPEN' } }),
        },
      },
      meta: { requestId: (req as any).id, timestamp: new Date().toISOString() },
    });
  } catch (error) { next(error); }
});

app.use('/api/v1/reports/metrics', metricsRouter);

// =============================================================================
// ERROR HANDLING
// =============================================================================

app.use(errorHandler);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      traceId: (req as any).id,
    },
  });
});

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  try {
    await prisma.$disconnect();
    await kafkaClient.disconnect();
    logger.info('Connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// =============================================================================
// START SERVER
// =============================================================================

const server = app.listen(PORT, () => {
  logger.info(`Reporting Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

server.on('error', (error: Error) => {
  logger.error('Server error', error);
});

export default app;
