/**
 * Utility Functions for ResidentCement
 */

import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

// -----------------------------------------------------------------------------
// ID Generation
// -----------------------------------------------------------------------------

export function generateId(): string {
  return uuidv4();
}

export function generateShortId(): string {
  return uuidv4().split('-')[0];
}

export function isValidId(id: string): boolean {
  return uuidValidate(id);
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function generateQuoteNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QT-${timestamp}-${random}`;
}

export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `PAY-${timestamp}-${random}`;
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${year}${month}-${random}`;
}

// -----------------------------------------------------------------------------
// String Utilities
// -----------------------------------------------------------------------------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => capitalize(txt));
}

export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername =
    username.charAt(0) +
    '*'.repeat(Math.max(0, username.length - 2)) +
    username.charAt(username.length - 1);
  
  return `${maskedUsername}@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  
  const lastFour = digits.slice(-4);
  return '*'.repeat(digits.length - 4) + lastFour;
}

// -----------------------------------------------------------------------------
// Number Utilities
// -----------------------------------------------------------------------------

export function formatCurrency(
  amount: number,
  currency: string = 'NGN',
  locale: string = 'en-NG'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(num: number, locale: string = 'en-NG'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function roundTo(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function calculatePercentage(
  value: number,
  percentage: number,
  round: boolean = true
): number {
  const result = (value * percentage) / 100;
  return round ? roundTo(result) : result;
}

export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  return calculatePercentage(originalPrice, discountPercent);
}

export function calculateTax(
  amount: number,
  taxRate: number,
  includeInPrice: boolean = false
): number {
  if (includeInPrice) {
    return amount - amount / (1 + taxRate / 100);
  }
  return calculatePercentage(amount, taxRate);
}

// -----------------------------------------------------------------------------
// Date Utilities
// -----------------------------------------------------------------------------

export function formatDate(
  date: Date | string,
  format: string = 'YYYY-MM-DD',
  locale: string = 'en-NG'
): string {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function formatDateTime(
  date: Date | string,
  locale: string = 'en-NG'
): string {
  return new Date(date).toLocaleString(locale);
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(date: Date | string): boolean {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

export function addDays(date: Date | string, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date | string, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date | string, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function getDaysDifference(
  date1: Date | string,
  date2: Date | string
): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isDateExpired(expiryDate: Date | string): boolean {
  return new Date(expiryDate) < new Date();
}

export function getStartOfDay(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfDay(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// -----------------------------------------------------------------------------
// Object Utilities
// -----------------------------------------------------------------------------

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

export function isNullOrEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

export function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

// -----------------------------------------------------------------------------
// Array Utilities
// -----------------------------------------------------------------------------

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function groupBy<T, K extends keyof any>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const key = keyFn(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    },
    {} as Record<K, T[]>
  );
}

// -----------------------------------------------------------------------------
// Promise Utilities
// -----------------------------------------------------------------------------

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { retries = 3, delay: initialDelay = 1000, backoff = 2 } = options;
  
  let lastError: Error;
  let currentDelay = initialDelay;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await delay(currentDelay);
        currentDelay *= backoff;
      }
    }
  }
  
  throw lastError!;
}

export function promiseTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutError = new Error('Promise timed out')
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(timeoutError), ms)
    ),
  ]);
}

// -----------------------------------------------------------------------------
// Crypto Utilities
// -----------------------------------------------------------------------------

export function generateRandomString(length: number = 32): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateOTP(length: number = 6): string {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// -----------------------------------------------------------------------------
// Environment Utilities
// -----------------------------------------------------------------------------

export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value !== undefined ? value : defaultValue!;
}

export function getEnvVarAsInt(
  name: string,
  defaultValue?: number
): number {
  const value = getEnvVar(name, defaultValue?.toString());
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid integer`);
  }
  return parsed;
}

export function getEnvVarAsBoolean(
  name: string,
  defaultValue?: boolean
): boolean {
  const value = getEnvVar(name, defaultValue?.toString());
  return value.toLowerCase() === 'true' || value === '1';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// -----------------------------------------------------------------------------
// Nigerian Financial Utilities
// -----------------------------------------------------------------------------

// VAT Calculation (Nigeria: 7.5% standard rate)
export const VAT_RATE = 0.075;

export interface VATBreakdown {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

/**
 * Calculate VAT on an amount (exclusive)
 * @param netAmount - Amount before VAT
 * @returns VATBreakdown with net, VAT, and gross amounts
 */
export function calculateVATExclusive(netAmount: number): VATBreakdown {
  const vatAmount = roundTo(netAmount * VAT_RATE);
  const grossAmount = roundTo(netAmount + vatAmount);
  return {
    netAmount: roundTo(netAmount),
    vatAmount,
    grossAmount,
  };
}

/**
 * Calculate VAT from gross amount (inclusive)
 * @param grossAmount - Amount including VAT
 * @returns VATBreakdown with net, VAT, and gross amounts
 */
export function calculateVATInclusive(grossAmount: number): VATBreakdown {
  const netAmount = roundTo(grossAmount / (1 + VAT_RATE));
  const vatAmount = roundTo(grossAmount - netAmount);
  return {
    netAmount,
    vatAmount,
    grossAmount: roundTo(grossAmount),
  };
}

// Withholding Tax Rates (Nigeria)
export const WHT_RATES_UTILS = {
  DIVIDEND: 0.10,
  INTEREST: 0.10,
  ROYALTY: 0.10,
  DIRECTORS_FEES: 0.10,
  CONTRACTS: 0.05,
  RENT: 0.10,
  CONSULTANCY: 0.10,
  AGENCY: 0.10,
} as const;

export type WHTTypeUtils = keyof typeof WHT_RATES_UTILS;

/**
 * Calculate Withholding Tax
 * @param amount - Gross payment amount
 * @param whtType - Type of payment
 * @returns Withholding tax amount
 */
export function calculateWHT(amount: number, whtType: WHTTypeUtils): number {
  const rate = WHT_RATES_UTILS[whtType];
  if (!rate) {
    throw new Error(`Unknown WHT type: ${whtType}`);
  }
  return roundTo(amount * rate);
}

/**
 * Calculate net payment after WHT
 * @param grossAmount - Gross payment amount
 * @param whtType - Type of payment
 * @returns Object with gross, WHT, and net amounts
 */
export function calculateNetPayment(
  grossAmount: number,
  whtType: WHTTypeUtils
): { grossAmount: number; whtAmount: number; netAmount: number } {
  const whtAmount = calculateWHT(grossAmount, whtType);
  const netAmount = roundTo(grossAmount - whtAmount);
  return {
    grossAmount: roundTo(grossAmount),
    whtAmount,
    netAmount,
  };
}

// Company Income Tax (Nigeria)
export interface CITCalculation {
  category: 'SMALL' | 'MEDIUM' | 'LARGE';
  rate: number;
  turnoverThreshold: { min: number; max: number | null };
}

export const CIT_RATES_UTILS: CITCalculation[] = [
  {
    category: 'SMALL',
    rate: 0,
    turnoverThreshold: { min: 0, max: 25000000 },
  },
  {
    category: 'MEDIUM',
    rate: 0.20,
    turnoverThreshold: { min: 25000000, max: 100000000 },
  },
  {
    category: 'LARGE',
    rate: 0.30,
    turnoverThreshold: { min: 100000000, max: null },
  },
];

export const MINIMUM_TAX_RATE_UTILS = 0.005; // 0.5% of gross profit
export const EDUCATION_TAX_RATE = 0.02; // 2% of assessable profit

/**
 * Determine company category based on turnover
 * @param turnover - Annual turnover in NGN
 * @returns CITCalculation for the company
 */
export function determineCITCategory(turnover: number): CITCalculation {
  for (const rate of CIT_RATES_UTILS) {
    const { min, max } = rate.turnoverThreshold;
    if (turnover >= min && (max === null || turnover < max)) {
      return rate;
    }
  }
  return CIT_RATES_UTILS[CIT_RATES_UTILS.length - 1];
}

/**
 * Calculate Company Income Tax
 * @param assessableProfit - Profit before tax
 * @param turnover - Annual turnover
 * @returns CIT calculation result
 */
export function calculateCIT(
  assessableProfit: number,
  turnover: number
): {
  assessableProfit: number;
  capitalAllowance: number;
  totalProfit: number;
  taxRate: number;
  taxPayable: number;
  minimumTax: number;
  educationTax: number;
  netTaxLiability: number;
  category: string;
} {
  const category = determineCITCategory(turnover);
  const capitalAllowance = 0; // Calculated separately based on asset schedule
  const totalProfit = Math.max(0, assessableProfit - capitalAllowance);
  const taxPayable = roundTo(totalProfit * category.rate);
  const minimumTax = roundTo(assessableProfit * MINIMUM_TAX_RATE_UTILS);
  const educationTax = roundTo(assessableProfit * EDUCATION_TAX_RATE);
  const netTaxLiability = roundTo(Math.max(taxPayable, minimumTax) + educationTax);

  return {
    assessableProfit: roundTo(assessableProfit),
    capitalAllowance,
    totalProfit: roundTo(totalProfit),
    taxRate: category.rate,
    taxPayable,
    minimumTax,
    educationTax,
    netTaxLiability,
    category: category.category,
  };
}

// Nigerian Naira Formatting
export function formatNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNGNWords(amount: number): string {
  // Simplified implementation
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = [
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion'];

  if (amount === 0) return 'Zero Naira';

  function convertToWords(num: number): string {
    if (num === 0) return '';
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
    }
    if (num < 1000) {
      return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + convertToWords(num % 100) : '');
    }
    return '';
  }

  let result = '';
  let scaleIndex = 0;
  let remaining = amount;

  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk !== 0) {
      const chunkWords = convertToWords(chunk);
      result = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + result;
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex++;
  }

  const naira = Math.floor(amount);
  const kobo = Math.round((amount - naira) * 100);

  let output = result.trim() + ' Naira';
  if (kobo > 0) {
    output += ' and ' + convertToWords(kobo) + ' Kobo';
  }

  return output;
}

// Exchange Rate Utilities
export function convertCurrency(
  amount: number,
  fromRate: number,
  toRate: number
): number {
  // Convert from source currency to base, then to target
  const baseAmount = amount / fromRate;
  return roundTo(baseAmount * toRate);
}

export function formatExchangeRate(rate: number): string {
  return rate.toFixed(4);
}

// Depreciation Calculations
export interface DepreciationSchedule {
  year: number;
  openingValue: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  closingValue: number;
}

/**
 * Calculate straight-line depreciation
 * @param cost - Asset cost
 * @param residualValue - Residual/scrap value
 * @param usefulLifeYears - Useful life in years
 * @returns Annual depreciation amount
 */
export function calculateStraightLineDepreciation(
  cost: number,
  residualValue: number,
  usefulLifeYears: number
): number {
  if (usefulLifeYears <= 0) return 0;
  return roundTo((cost - residualValue) / usefulLifeYears);
}

/**
 * Generate depreciation schedule (straight-line method)
 * @param cost - Asset cost
 * @param residualValue - Residual/scrap value
 * @param usefulLifeYears - Useful life in years
 * @returns Array of yearly depreciation details
 */
export function generateDepreciationSchedule(
  cost: number,
  residualValue: number,
  usefulLifeYears: number
): DepreciationSchedule[] {
  const annualDepreciation = calculateStraightLineDepreciation(cost, residualValue, usefulLifeYears);
  const schedule: DepreciationSchedule[] = [];
  let accumulatedDepreciation = 0;
  let openingValue = cost;

  for (let year = 1; year <= usefulLifeYears; year++) {
    accumulatedDepreciation += annualDepreciation;
    const closingValue = Math.max(residualValue, cost - accumulatedDepreciation);

    schedule.push({
      year,
      openingValue: roundTo(openingValue),
      depreciationAmount: roundTo(annualDepreciation),
      accumulatedDepreciation: roundTo(accumulatedDepreciation),
      closingValue: roundTo(closingValue),
    });

    openingValue = closingValue;
  }

  return schedule;
}

// Financial Ratios
export function calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {
  if (currentLiabilities === 0) return 0;
  return roundTo(currentAssets / currentLiabilities, 2);
}

export function calculateQuickRatio(
  currentAssets: number,
  inventory: number,
  currentLiabilities: number
): number {
  if (currentLiabilities === 0) return 0;
  return roundTo((currentAssets - inventory) / currentLiabilities, 2);
}

export function calculateGrossProfitMargin(revenue: number, cogs: number): number {
  if (revenue === 0) return 0;
  const grossProfit = revenue - cogs;
  return roundTo((grossProfit / revenue) * 100, 2);
}

export function calculateNetProfitMargin(netProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return roundTo((netProfit / revenue) * 100, 2);
}

export function calculateReturnOnAssets(netProfit: number, totalAssets: number): number {
  if (totalAssets === 0) return 0;
  return roundTo((netProfit / totalAssets) * 100, 2);
}

export function calculateReturnOnEquity(netProfit: number, shareholdersEquity: number): number {
  if (shareholdersEquity === 0) return 0;
  return roundTo((netProfit / shareholdersEquity) * 100, 2);
}

export function calculateDebtToEquity(totalLiabilities: number, shareholdersEquity: number): number {
  if (shareholdersEquity === 0) return 0;
  return roundTo(totalLiabilities / shareholdersEquity, 2);
}

export function calculateInventoryTurnover(cogs: number, averageInventory: number): number {
  if (averageInventory === 0) return 0;
  return roundTo(cogs / averageInventory, 2);
}

export function calculateDaysSalesOutstanding(
  accountsReceivable: number,
  annualRevenue: number
): number {
  if (annualRevenue === 0) return 0;
  return roundTo((accountsReceivable / annualRevenue) * 365, 0);
}

// Nigerian Fiscal Calendar (January - December)
export function getCurrentFiscalYear(): number {
  return new Date().getFullYear();
}

export function getFiscalYearStart(year: number): Date {
  return new Date(year, 0, 1); // January 1st
}

export function getFiscalYearEnd(year: number): Date {
  return new Date(year, 11, 31); // December 31st
}

export function isInCurrentFiscalYear(date: Date): boolean {
  const currentYear = getCurrentFiscalYear();
  return date.getFullYear() === currentYear;
}

// Journal Entry Utilities
export function validateJournalEntryBalance(
  lines: Array<{ debitAmount: number; creditAmount: number }>
): { isBalanced: boolean; totalDebits: number; totalCredits: number; difference: number } {
  const totalDebits = lines.reduce((sum, line) => sum + (line.debitAmount || 0), 0);
  const totalCredits = lines.reduce((sum, line) => sum + (line.creditAmount || 0), 0);
  const difference = Math.abs(totalDebits - totalCredits);
  const isBalanced = difference < 0.01; // Allow for rounding

  return {
    isBalanced,
    totalDebits: roundTo(totalDebits),
    totalCredits: roundTo(totalCredits),
    difference: roundTo(difference),
  };
}

// Bank Account Validation (Nigerian)
export function validateNigerianAccountNumber(accountNumber: string): boolean {
  return /^\d{10}$/.test(accountNumber);
}

export function validateNigerianBankCode(bankCode: string): boolean {
  return /^\d{6}$/.test(bankCode);
}

export function formatNigerianAccountNumber(accountNumber: string): string {
  const cleaned = accountNumber.replace(/\D/g, '');
  if (cleaned.length !== 10) return accountNumber;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

// Payment Terms Calculation
export function calculateDueDate(
  invoiceDate: Date,
  paymentTerm: 'CASH_ON_DELIVERY' | 'NET_7' | 'NET_14' | 'NET_30' | 'NET_45' | 'NET_60' | 'PREPAID'
): Date {
  const daysMap: Record<string, number> = {
    CASH_ON_DELIVERY: 0,
    NET_7: 7,
    NET_14: 14,
    NET_30: 30,
    NET_45: 45,
    NET_60: 60,
    PREPAID: -1,
  };

  const days = daysMap[paymentTerm] ?? 0;
  if (days === -1) return invoiceDate; // Prepaid - same day

  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

export function isPaymentOverdue(dueDate: Date): boolean {
  return new Date() > dueDate;
}

export function calculateOverdueDays(dueDate: Date): number {
  const today = new Date();
  if (today <= dueDate) return 0;
  return getDaysDifference(dueDate, today);
}

// Document Number Generation (Nigerian format)
export function generateJournalEntryNumber(sequence: number, year: number = getCurrentFiscalYear()): string {
  return `JE-${year}-${String(sequence).padStart(6, '0')}`;
}

export function generateReceiptNumber(sequence: number): string {
  return `RCP-${Date.now()}-${String(sequence).padStart(4, '0')}`;
}

export function generateVoucherNumber(sequence: number, year: number = getCurrentFiscalYear()): string {
  return `PV-${year}-${String(sequence).padStart(6, '0')}`;
}

// Tax Period Utilities
export function getTaxPeriod(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getTaxYear(date: Date = new Date()): number {
  return date.getFullYear();
}

export function getPreviousTaxPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number);
  if (month === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(month - 1).padStart(2, '0')}`;
}

export function getNextTaxPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number);
  if (month === 12) {
    return `${year + 1}-01`;
  }
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

// VAT Return Summary Generation
export interface VATSummaryInput {
  period: string;
  sales: Array<{ amount: number; vatRate: number; isExempt: boolean }>;
  purchases: Array<{ amount: number; vatRate: number }>;
}

export function generateVATSummary(input: VATSummaryInput): {
  period: string;
  outputVAT: number;
  inputVAT: number;
  netVATPayable: number;
  totalSalesExclVAT: number;
  totalPurchasesExclVAT: number;
  exemptSupplies: number;
  zeroRatedSupplies: number;
} {
  let outputVAT = 0;
  let totalSalesExclVAT = 0;
  let exemptSupplies = 0;
  let zeroRatedSupplies = 0;

  for (const sale of input.sales) {
    if (sale.isExempt) {
      exemptSupplies += sale.amount;
    } else if (sale.vatRate === 0) {
      zeroRatedSupplies += sale.amount;
      totalSalesExclVAT += sale.amount;
    } else {
      totalSalesExclVAT += sale.amount;
      outputVAT += roundTo(sale.amount * sale.vatRate);
    }
  }

  let inputVAT = 0;
  let totalPurchasesExclVAT = 0;

  for (const purchase of input.purchases) {
    totalPurchasesExclVAT += purchase.amount;
    inputVAT += roundTo(purchase.amount * purchase.vatRate);
  }

  const netVATPayable = outputVAT - inputVAT;

  return {
    period: input.period,
    outputVAT: roundTo(outputVAT),
    inputVAT: roundTo(inputVAT),
    netVATPayable: roundTo(netVATPayable),
    totalSalesExclVAT: roundTo(totalSalesExclVAT),
    totalPurchasesExclVAT: roundTo(totalPurchasesExclVAT),
    exemptSupplies: roundTo(exemptSupplies),
    zeroRatedSupplies: roundTo(zeroRatedSupplies),
  };
}
