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
