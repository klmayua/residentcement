/**
 * ResidentCement Accounting Service
 *
 * Nigerian GAAP-compliant accounting microservice
 * Handles: Chart of Accounts, Journal Entries, General Ledger, Tax, Fixed Assets
 * Port: 3011
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';
import {
  createLogger,
  requestIdMiddleware,
  requestLoggingMiddleware,
  errorHandler,
  createHealthCheckService,
  checkMemory,
  NotFoundError,
  ValidationError,
  BusinessRuleError,
  formatNGN,
  calculateVATExclusive,
  calculateWHT,
  determineCITCategory,
  calculateCIT,
  VAT_RATE,
  roundTo,
  formatJournalEntryNumber,
  validateJournalEntryBalance,
  generateDepreciationSchedule,
  calculateStraightLineDepreciation,
} from '@resident-cement/kernel';

config();

const logger = createLogger({
  service: 'accounting-service',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
});

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3011', 10);
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const healthService = createHealthCheckService('accounting-service', '1.0.0');
healthService.addCheck('database', async () => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: 'database', status: 'pass', responseTime: Date.now() - start };
  } catch {
    return { name: 'database', status: 'fail', responseTime: Date.now() - start };
  }
});
healthService.addCheck('memory', () => checkMemory(0.9));

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(requestIdMiddleware());
app.use(requestLoggingMiddleware({ skipPaths: ['/health'] }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// =============================================================================
// Health Routes
// =============================================================================

const healthRouter = express.Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  const h = await healthService.getHealthStatus();
  res.json({ status: h.status, service: h.service, uptime: h.uptime });
});

healthRouter.get('/ready', async (req: Request, res: Response) => {
  const h = await healthService.getHealthStatus();
  if (h.status === 'unhealthy') return res.status(503).json({ ready: false });
  res.json({ ready: true });
});

healthRouter.get('/live', async (req: Request, res: Response) => {
  res.json({ alive: true, uptime: process.uptime() });
});

app.use('/health', healthRouter);

// =============================================================================
// Chart of Accounts Routes
// =============================================================================

const accountsRouter = express.Router();

// Initialize Nigerian Standard Chart of Accounts
const initializeNigerianCOA = async () => {
  const defaultAccounts = [
    // Assets (1xxx)
    { code: '1000', name: 'ASSETS', type: 'ASSET', subtype: 'CURRENT_ASSET' },
    { code: '1100', name: 'Current Assets', type: 'ASSET', subtype: 'CURRENT_ASSET', parentCode: '1000' },
    { code: '1101', name: 'Cash and Bank', type: 'ASSET', subtype: 'CURRENT_ASSET', parentCode: '1100', isBankAccount: true },
    { code: '1102', name: 'Accounts Receivable', type: 'ASSET', subtype: 'CURRENT_ASSET', parentCode: '1100', isControlAccount: true },
    { code: '1103', name: 'Inventory', type: 'ASSET', subtype: 'CURRENT_ASSET', parentCode: '1100' },
    { code: '1104', name: 'Prepayments', type: 'ASSET', subtype: 'CURRENT_ASSET', parentCode: '1100' },
    { code: '1105', name: 'VAT Input (Recoverable)', type: 'ASSET', subtype: 'CURRENT_ASSET', parentCode: '1100' },
    { code: '1200', name: 'Fixed Assets', type: 'ASSET', subtype: 'FIXED_ASSET', parentCode: '1000' },
    { code: '1201', name: 'Land', type: 'ASSET', subtype: 'FIXED_ASSET', parentCode: '1200' },
    { code: '1202', name: 'Buildings', type: 'ASSET', subtype: 'FIXED_ASSET', parentCode: '1200' },
    { code: '1203', name: 'Plant & Machinery', type: 'ASSET', subtype: 'FIXED_ASSET', parentCode: '1200' },
    { code: '1204', name: 'Vehicles', type: 'ASSET', subtype: 'FIXED_ASSET', parentCode: '1200' },
    { code: '1205', name: 'Furniture & Fittings', type: 'ASSET', subtype: 'FIXED_ASSET', parentCode: '1200' },
    { code: '1290', name: 'Accumulated Depreciation', type: 'ASSET', subtype: 'FIXED_ASSET', parentCode: '1200' },

    // Liabilities (2xxx)
    { code: '2000', name: 'LIABILITIES', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY' },
    { code: '2100', name: 'Current Liabilities', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY', parentCode: '2000' },
    { code: '2101', name: 'Accounts Payable', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY', parentCode: '2100', isControlAccount: true },
    { code: '2102', name: 'VAT Payable', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY', parentCode: '2100' },
    { code: '2103', name: 'WHT Payable', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY', parentCode: '2100' },
    { code: '2104', name: 'PAYE Payable', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY', parentCode: '2100' },
    { code: '2105', name: 'Accrued Expenses', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY', parentCode: '2100' },
    { code: '2106', name: 'Short-term Loans', type: 'LIABILITY', subtype: 'CURRENT_LIABILITY', parentCode: '2100' },
    { code: '2200', name: 'Long-term Liabilities', type: 'LIABILITY', subtype: 'LONG_TERM_LIABILITY', parentCode: '2000' },
    { code: '2201', name: 'Long-term Loans', type: 'LIABILITY', subtype: 'LONG_TERM_LIABILITY', parentCode: '2200' },
    { code: '2202', name: 'Bonds', type: 'LIABILITY', subtype: 'LONG_TERM_LIABILITY', parentCode: '2200' },
    { code: '2203', name: 'Deferred Tax', type: 'LIABILITY', subtype: 'LONG_TERM_LIABILITY', parentCode: '2200' },

    // Equity (3xxx)
    { code: '3000', name: 'EQUITY', type: 'EQUITY', subtype: 'EQUITY' },
    { code: '3101', name: 'Share Capital', type: 'EQUITY', subtype: 'EQUITY', parentCode: '3000' },
    { code: '3102', name: 'Share Premium', type: 'EQUITY', subtype: 'EQUITY', parentCode: '3000' },
    { code: '3103', name: 'Retained Earnings', type: 'EQUITY', subtype: 'EQUITY', parentCode: '3000' },
    { code: '3104', name: 'General Reserve', type: 'EQUITY', subtype: 'EQUITY', parentCode: '3000' },

    // Revenue (4xxx)
    { code: '4000', name: 'REVENUE', type: 'REVENUE', subtype: 'OPERATING_REVENUE' },
    { code: '4101', name: 'Cement Sales - 42.5R', type: 'REVENUE', subtype: 'OPERATING_REVENUE', parentCode: '4000' },
    { code: '4102', name: 'Cement Sales - 32.5R', type: 'REVENUE', subtype: 'OPERATING_REVENUE', parentCode: '4000' },
    { code: '4103', name: 'Cement Sales - 52.5R', type: 'REVENUE', subtype: 'OPERATING_REVENUE', parentCode: '4000' },
    { code: '4104', name: 'Cement Sales - Pozzolana', type: 'REVENUE', subtype: 'OPERATING_REVENUE', parentCode: '4000' },
    { code: '4105', name: 'Bulk Cement Sales', type: 'REVENUE', subtype: 'OPERATING_REVENUE', parentCode: '4000' },
    { code: '4201', name: 'Transport Revenue', type: 'REVENUE', subtype: 'OPERATING_REVENUE', parentCode: '4000' },
    { code: '4301', name: 'Other Income', type: 'REVENUE', subtype: 'OTHER_REVENUE', parentCode: '4000' },
    { code: '4302', name: 'Interest Income', type: 'REVENUE', subtype: 'OTHER_REVENUE', parentCode: '4000' },

    // Cost of Sales (5xxx)
    { code: '5000', name: 'COST OF SALES', type: 'EXPENSE', subtype: 'COST_OF_SALES' },
    { code: '5101', name: 'Raw Materials', type: 'EXPENSE', subtype: 'COST_OF_SALES', parentCode: '5000' },
    { code: '5102', name: 'Direct Labour', type: 'EXPENSE', subtype: 'COST_OF_SALES', parentCode: '5000' },
    { code: '5103', name: 'Manufacturing Overhead', type: 'EXPENSE', subtype: 'COST_OF_SALES', parentCode: '5000' },
    { code: '5201', name: 'Freight Out', type: 'EXPENSE', subtype: 'COST_OF_SALES', parentCode: '5000' },

    // Operating Expenses (6xxx)
    { code: '6000', name: 'OPERATING EXPENSES', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE' },
    { code: '6101', name: 'Salaries and Wages', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6102', name: 'Employee Benefits', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6201', name: 'Rent and Rates', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6202', name: 'Utilities', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6203', name: 'Repairs and Maintenance', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6301', name: 'Marketing and Advertising', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6302', name: 'Distribution Costs', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6401', name: 'Administrative Expenses', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6402', name: 'Professional Fees', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6403', name: 'Audit Fees', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6404', name: 'Legal Fees', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6405', name: 'Insurance', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6406', name: 'Fuel and Lubricants', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6407', name: 'Vehicle Running Expenses', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },
    { code: '6501', name: 'Depreciation Expense', type: 'EXPENSE', subtype: 'OPERATING_EXPENSE', parentCode: '6000' },

    // Other Expenses (7xxx)
    { code: '7000', name: 'OTHER EXPENSES', type: 'EXPENSE', subtype: 'OTHER_EXPENSE' },
    { code: '7101', name: 'Interest Expense', type: 'EXPENSE', subtype: 'OTHER_EXPENSE', parentCode: '7000' },
    { code: '7102', name: 'Bank Charges', type: 'EXPENSE', subtype: 'OTHER_EXPENSE', parentCode: '7000' },
    { code: '7103', name: 'Exchange Loss', type: 'EXPENSE', subtype: 'OTHER_EXPENSE', parentCode: '7000' },

    // Taxation (8xxx)
    { code: '8000', name: 'TAXATION', type: 'EXPENSE', subtype: 'OTHER_EXPENSE' },
    { code: '8101', name: 'Company Income Tax', type: 'EXPENSE', subtype: 'OTHER_EXPENSE', parentCode: '8000' },
    { code: '8102', name: 'Education Tax', type: 'EXPENSE', subtype: 'OTHER_EXPENSE', parentCode: '8000' },
    { code: '8103', name: 'National Information Technology Development Fund', type: 'EXPENSE', subtype: 'OTHER_EXPENSE', parentCode: '8000' },
  ];

  const codeToId: Record<string, string> = {};

  for (const account of defaultAccounts) {
    const existing = await prisma.account.findFirst({ where: { code: account.code } });
    if (!existing) {
      const parentId = account.parentCode ? codeToId[account.parentCode] : null;
      const created = await prisma.account.create({
        data: {
          code: account.code,
          name: account.name,
          type: account.type as any,
          subtype: account.subtype as any,
          parentId,
          isBankAccount: account.isBankAccount || false,
          isControlAccount: account.isControlAccount || false,
        },
      });
      codeToId[account.code] = created.id;
    } else {
      codeToId[account.code] = existing.id;
    }
  }

  logger.info('Nigerian Chart of Accounts initialized');
};

// GET /accounts - List all accounts
accountsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, subtype, search, includeInactive } = req.query;

    const where: Prisma.AccountWhereInput = {};

    if (type) where.type = type as string;
    if (subtype) where.subtype = subtype as string;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { code: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    const accounts = await prisma.account.findMany({
      where,
      include: { parent: true, children: true },
      orderBy: { code: 'asc' },
    });

    res.json({ success: true, data: accounts });
  } catch (error) {
    next(error);
  }
});

// GET /accounts/:id - Get account details with balance
accountsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        journalLines: {
          take: 50,
          orderBy: { journalEntry: { entryDate: 'desc' } },
          include: { journalEntry: { select: { entryDate: true, entryNumber: true, description: true } } },
        },
      },
    });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    // Calculate running balance
    const balance = await calculateAccountBalance(id);

    res.json({
      success: true,
      data: { ...account, calculatedBalance: balance },
    });
  } catch (error) {
    next(error);
  }
});

// POST /accounts - Create new account
accountsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, name, type, subtype, parentId, openingBalance = 0 } = req.body;

    // Validate code format (4 digits)
    if (!/^\d{4}$/.test(code)) {
      throw new ValidationError('Account code must be 4 digits');
    }

    // Check for duplicate code
    const existing = await prisma.account.findFirst({ where: { code } });
    if (existing) {
      throw new ValidationError(`Account code ${code} already exists`);
    }

    const account = await prisma.account.create({
      data: {
        code,
        name,
        type,
        subtype,
        parentId,
        openingBalance: new Prisma.Decimal(openingBalance),
        currentBalance: new Prisma.Decimal(openingBalance),
      },
    });

    logger.info({ accountId: account.id }, 'Account created');
    res.status(201).json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
});

// Helper: Calculate account balance
async function calculateAccountBalance(accountId: string): Promise<number> {
  const lines = await prisma.journalEntryLine.findMany({
    where: {
      accountId,
      journalEntry: { status: 'POSTED' },
    },
  });

  const debits = lines.reduce((sum, line) => sum + Number(line.debitAmount), 0);
  const credits = lines.reduce((sum, line) => sum + Number(line.creditAmount), 0);

  // Determine balance based on account type
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) return 0;

  const isDebitBalance = ['ASSET', 'EXPENSE'].includes(account.type);
  return isDebitBalance ? debits - credits : credits - debits;
}

app.use('/accounts', accountsRouter);

// =============================================================================
// Journal Entries Routes
// =============================================================================

const journalRouter = express.Router();

// GET /journal-entries - List journal entries
journalRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, periodId, startDate, endDate, search } = req.query;

    const where: Prisma.JournalEntryWhereInput = {};

    if (status) where.status = status as string;
    if (periodId) where.periodId = periodId as string;
    if (startDate || endDate) {
      where.entryDate = {};
      if (startDate) where.entryDate.gte = new Date(startDate as string);
      if (endDate) where.entryDate.lte = new Date(endDate as string);
    }
    if (search) {
      where.OR = [
        { entryNumber: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { reference: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const entries = await prisma.journalEntry.findMany({
      where,
      include: {
        lines: { include: { account: { select: { code: true, name: true, type: true } } } },
        period: true,
        postedBy: { select: { name: true, email: true } },
      },
      orderBy: { entryDate: 'desc' },
    });

    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
});

// GET /journal-entries/:id - Get journal entry details
journalRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: {
        lines: {
          include: { account: true },
          orderBy: { lineOrder: 'asc' },
        },
        period: true,
        postedBy: { select: { name: true, email: true } },
        createdBy: { select: { name: true, email: true } },
      },
    });

    if (!entry) {
      throw new NotFoundError('Journal entry not found');
    }

    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
});

// POST /journal-entries - Create journal entry
journalRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entryDate, reference, description, lines, createdById } = req.body;

    // Validate lines balance
    const validation = validateJournalEntryBalance(lines);
    if (!validation.isBalanced) {
      throw new ValidationError(
        `Journal entry does not balance. Difference: ${formatNGN(validation.difference)}`
      );
    }

    // Get or create period
    const date = new Date(entryDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let period = await prisma.accountingPeriod.findFirst({
      where: { year, month },
    });

    if (!period) {
      // Create fiscal year if needed
      let fiscalYear = await prisma.fiscalYear.findUnique({ where: { year } });
      if (!fiscalYear) {
        fiscalYear = await prisma.fiscalYear.create({
          data: {
            year,
            startDate: new Date(year, 0, 1),
            endDate: new Date(year, 11, 31),
          },
        });
      }

      period = await prisma.accountingPeriod.create({
        data: {
          fiscalYearId: fiscalYear.id,
          year,
          month,
          periodStart: new Date(year, month - 1, 1),
          periodEnd: new Date(year, month, 0),
        },
      });
    }

    // Generate entry number
    const sequence = await prisma.journalEntry.count({ where: { periodId: period.id } });
    const entryNumber = `JE-${year}-${String(sequence + 1).padStart(6, '0')}`;

    // Create journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        entryNumber,
        entryDate: new Date(entryDate),
        periodId: period.id,
        reference,
        description,
        totalDebit: new Prisma.Decimal(validation.totalDebits),
        totalCredit: new Prisma.Decimal(validation.totalCredits),
        status: 'DRAFT',
        createdById,
        lines: {
          create: lines.map((line: any, index: number) => ({
            accountId: line.accountId,
            description: line.description,
            debitAmount: new Prisma.Decimal(line.debitAmount || 0),
            creditAmount: new Prisma.Decimal(line.creditAmount || 0),
            costCenter: line.costCenter,
            projectCode: line.projectCode,
            lineOrder: index,
          })),
        },
      },
      include: { lines: { include: { account: true } } },
    });

    logger.info({ entryId: entry.id, entryNumber }, 'Journal entry created');
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
});

// POST /journal-entries/:id/post - Post journal entry
journalRouter.post('/:id/post', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { postedById } = req.body;

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: { lines: true, period: true },
    });

    if (!entry) {
      throw new NotFoundError('Journal entry not found');
    }

    if (entry.status !== 'DRAFT') {
      throw new BusinessRuleError('Only draft journal entries can be posted');
    }

    if (entry.period.isClosed) {
      throw new BusinessRuleError('Cannot post to a closed period');
    }

    // Post the entry
    const updated = await prisma.journalEntry.update({
      where: { id },
      data: {
        status: 'POSTED',
        postedAt: new Date(),
        postedById,
      },
      include: { lines: { include: { account: true } } },
    });

    // Update account balances
    for (const line of entry.lines) {
      const balance = await calculateAccountBalance(line.accountId);
      await prisma.account.update({
        where: { id: line.accountId },
        data: { currentBalance: new Prisma.Decimal(balance) },
      });
    }

    logger.info({ entryId: id }, 'Journal entry posted');
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

app.use('/journal-entries', journalRouter);

// =============================================================================
// Trial Balance & Financial Reports
// =============================================================================

const reportsRouter = express.Router();

// GET /reports/trial-balance - Generate trial balance
reportsRouter.get('/trial-balance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { asOfDate = new Date().toISOString() } = req.query;

    const accounts = await prisma.account.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });

    const trialBalance = await Promise.all(
      accounts.map(async (account) => {
        const lines = await prisma.journalEntryLine.findMany({
          where: {
            accountId: account.id,
            journalEntry: {
              status: 'POSTED',
              entryDate: { lte: new Date(asOfDate as string) },
            },
          },
        });

        const debits = lines.reduce((sum, line) => sum + Number(line.debitAmount), 0);
        const credits = lines.reduce((sum, line) => sum + Number(line.creditAmount), 0);

        const isDebitBalance = ['ASSET', 'EXPENSE'].includes(account.type);
        const balance = isDebitBalance ? debits - credits : credits - debits;

        return {
          code: account.code,
          name: account.name,
          type: account.type,
          debits: roundTo(debits),
          credits: roundTo(credits),
          balance: roundTo(balance),
          isDebitBalance,
        };
      })
    );

    const totalDebits = trialBalance.reduce((sum, acc) => sum + (acc.isDebitBalance ? acc.balance : 0), 0);
    const totalCredits = trialBalance.reduce((sum, acc) => sum + (!acc.isDebitBalance ? acc.balance : 0), 0);

    res.json({
      success: true,
      data: {
        asOfDate,
        accounts: trialBalance,
        totalDebits: roundTo(totalDebits),
        totalCredits: roundTo(totalCredits),
        isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /reports/profit-loss - P&L Statement
reportsRouter.get('/profit-loss', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    const revenueAccounts = await prisma.account.findMany({
      where: { type: 'REVENUE', isActive: true },
      orderBy: { code: 'asc' },
    });

    const expenseAccounts = await prisma.account.findMany({
      where: { type: 'EXPENSE', isActive: true },
      orderBy: { code: 'asc' },
    });

    const calculateAccountAmount = async (accountId: string) => {
      const lines = await prisma.journalEntryLine.findMany({
        where: {
          accountId,
          journalEntry: {
            status: 'POSTED',
            entryDate: {
              gte: startDate ? new Date(startDate as string) : undefined,
              lte: endDate ? new Date(endDate as string) : undefined,
            },
          },
        },
      });

      const debits = lines.reduce((sum, line) => sum + Number(line.debitAmount), 0);
      const credits = lines.reduce((sum, line) => sum + Number(line.creditAmount), 0);
      return credits - debits; // Revenue/Expense: credits increase, debits decrease
    };

    const revenue = await Promise.all(
      revenueAccounts.map(async (acc) => ({
        code: acc.code,
        name: acc.name,
        amount: roundTo(await calculateAccountAmount(acc.id)),
      }))
    );

    const expenses = await Promise.all(
      expenseAccounts.map(async (acc) => ({
        code: acc.code,
        name: acc.name,
        amount: roundTo(await calculateAccountAmount(acc.id)),
      }))
    );

    const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        revenue,
        totalRevenue: roundTo(totalRevenue),
        expenses,
        totalExpenses: roundTo(totalExpenses),
        netProfit: roundTo(netProfit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /reports/balance-sheet - Balance Sheet
reportsRouter.get('/balance-sheet', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { asOfDate = new Date().toISOString() } = req.query;

    const assetAccounts = await prisma.account.findMany({
      where: { type: 'ASSET', isActive: true },
      orderBy: { code: 'asc' },
    });

    const liabilityAccounts = await prisma.account.findMany({
      where: { type: 'LIABILITY', isActive: true },
      orderBy: { code: 'asc' },
    });

    const equityAccounts = await prisma.account.findMany({
      where: { type: 'EQUITY', isActive: true },
      orderBy: { code: 'asc' },
    });

    const calculateBalance = async (accountId: string) => {
      const lines = await prisma.journalEntryLine.findMany({
        where: {
          accountId,
          journalEntry: {
            status: 'POSTED',
            entryDate: { lte: new Date(asOfDate as string) },
          },
        },
      });

      const debits = lines.reduce((sum, line) => sum + Number(line.debitAmount), 0);
      const credits = lines.reduce((sum, line) => sum + Number(line.creditAmount), 0);
      return debits - credits;
    };

    const assets = await Promise.all(
      assetAccounts.map(async (acc) => ({
        code: acc.code,
        name: acc.name,
        amount: roundTo(await calculateBalance(acc.id)),
      }))
    );

    const liabilities = await Promise.all(
      liabilityAccounts.map(async (acc) => ({
        code: acc.code,
        name: acc.name,
        amount: roundTo(-await calculateBalance(acc.id)), // Liabilities: credit balance
      }))
    );

    const equity = await Promise.all(
      equityAccounts.map(async (acc) => ({
        code: acc.code,
        name: acc.name,
        amount: roundTo(-await calculateBalance(acc.id)), // Equity: credit balance
      }))
    );

    const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
    const totalEquity = equity.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      data: {
        asOfDate,
        assets: assets.filter((a) => a.amount !== 0),
        totalAssets: roundTo(totalAssets),
        liabilities: liabilities.filter((l) => l.amount !== 0),
        totalLiabilities: roundTo(totalLiabilities),
        equity: equity.filter((e) => e.amount !== 0),
        totalEquity: roundTo(totalEquity),
        totalLiabilitiesAndEquity: roundTo(totalLiabilities + totalEquity),
        isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use('/reports', reportsRouter);

// =============================================================================
// Tax Routes (Nigerian Tax Compliance)
// =============================================================================

const taxRouter = express.Router();

// GET /tax/vat-summary - VAT Return Summary
 taxRouter.get('/vat-summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period } = req.query;

    if (!period) {
      throw new ValidationError('Period is required (YYYY-MM format)');
    }

    const [year, month] = (period as string).split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Output VAT (from sales)
    const outputVATLines = await prisma.journalEntryLine.findMany({
      where: {
        account: { code: '2102' }, // VAT Payable
        journalEntry: {
          status: 'POSTED',
          entryDate: { gte: startDate, lte: endDate },
        },
        creditAmount: { gt: 0 },
      },
    });

    // Input VAT (from purchases)
    const inputVATLines = await prisma.journalEntryLine.findMany({
      where: {
        account: { code: '1105' }, // VAT Input
        journalEntry: {
          status: 'POSTED',
          entryDate: { gte: startDate, lte: endDate },
        },
        debitAmount: { gt: 0 },
      },
    });

    const outputVAT = outputVATLines.reduce((sum, line) => sum + Number(line.creditAmount), 0);
    const inputVAT = inputVATLines.reduce((sum, line) => sum + Number(line.debitAmount), 0);
    const netVATPayable = outputVAT - inputVAT;

    res.json({
      success: true,
      data: {
        period,
        outputVAT: roundTo(outputVAT),
        inputVAT: roundTo(inputVAT),
        netVATPayable: roundTo(netVATPayable),
        filingDeadline: `${year}-${month}-21`, // 21st of following month
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /tax/calculate-vat - Calculate VAT on amount
 taxRouter.post('/calculate-vat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, isInclusive = false } = req.body;

    const result = isInclusive
      ? calculateVATInclusive(amount)
      : calculateVATExclusive(amount);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /tax/calculate-wht - Calculate Withholding Tax
 taxRouter.post('/calculate-wht', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, whtType } = req.body;

    const whtAmount = calculateWHT(amount, whtType);
    const netAmount = amount - whtAmount;

    res.json({
      success: true,
      data: {
        grossAmount: roundTo(amount),
        whtType,
        whtAmount: roundTo(whtAmount),
        netAmount: roundTo(netAmount),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /tax/calculate-cit - Calculate Company Income Tax
 taxRouter.post('/calculate-cit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessableProfit, turnover } = req.body;

    const result = calculateCIT(assessableProfit, turnover);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

app.use('/tax', taxRouter);

// =============================================================================
// Fixed Assets Routes
// =============================================================================

const fixedAssetsRouter = express.Router();

// GET /fixed-assets - List fixed assets
 fixedAssetsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, status } = req.query;

    const where: Prisma.FixedAssetWhereInput = {};
    if (category) where.category = category as string;
    if (status) where.status = status as string;

    const assets = await prisma.fixedAsset.findMany({
      where,
      include: { depreciationEntries: true },
      orderBy: { assetCode: 'asc' },
    });

    res.json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
});

// POST /fixed-assets - Create fixed asset
 fixedAssetsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      assetCode,
      assetName,
      description,
      category,
      acquisitionDate,
      acquisitionCost,
      residualValue = 0,
      usefulLifeYears,
      depreciationMethod = 'STRATEGHT_LINE',
      location,
      custodian,
      assetAccountId,
      depreciationAccountId,
    } = req.body;

    const annualDepreciation = calculateStraightLineDepreciation(
      acquisitionCost,
      residualValue,
      usefulLifeYears
    );

    const netBookValue = acquisitionCost - annualDepreciation;

    const asset = await prisma.fixedAsset.create({
      data: {
        assetCode,
        assetName,
        description,
        category,
        acquisitionDate: new Date(acquisitionDate),
        acquisitionCost: new Prisma.Decimal(acquisitionCost),
        residualValue: new Prisma.Decimal(residualValue),
        usefulLifeYears,
        depreciationMethod: depreciationMethod as any,
        accumulatedDepreciation: new Prisma.Decimal(0),
        netBookValue: new Prisma.Decimal(netBookValue),
        location,
        custodian,
        assetAccountId,
        depreciationAccountId,
      },
    });

    logger.info({ assetId: asset.id }, 'Fixed asset created');
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
});

// POST /fixed-assets/:id/depreciate - Run depreciation
 fixedAssetsRouter.post('/:id/depreciate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { year, period } = req.body;

    const asset = await prisma.fixedAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundError('Fixed asset not found');
    }

    const annualDepreciation = calculateStraightLineDepreciation(
      Number(asset.acquisitionCost),
      Number(asset.residualValue),
      asset.usefulLifeYears
    );

    const monthlyDepreciation = annualDepreciation / 12;

    // Create depreciation entry
    await prisma.fixedAssetDepreciation.create({
      data: {
        assetId: id,
        year,
        period,
        openingValue: asset.netBookValue,
        depreciationAmount: new Prisma.Decimal(monthlyDepreciation),
        closingValue: new Prisma.Decimal(Number(asset.netBookValue) - monthlyDepreciation),
        postedAt: new Date(),
      },
    });

    // Update asset
    await prisma.fixedAsset.update({
      where: { id },
      data: {
        accumulatedDepreciation: new Prisma.Decimal(
          Number(asset.accumulatedDepreciation) + monthlyDepreciation
        ),
        netBookValue: new Prisma.Decimal(Number(asset.netBookValue) - monthlyDepreciation),
      },
    });

    res.json({ success: true, message: 'Depreciation recorded' });
  } catch (error) {
    next(error);
  }
});

app.use('/fixed-assets', fixedAssetsRouter);

// =============================================================================
// Error Handling & Server Start
// =============================================================================

app.use(errorHandler);

app.listen(PORT, async () => {
  logger.info(`Accounting Service running on port ${PORT}`);

  // Initialize Chart of Accounts
  try {
    await initializeNigerianCOA();
  } catch (error) {
    logger.error('Failed to initialize Chart of Accounts', error);
  }
});

export default app;
