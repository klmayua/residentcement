import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import type { JWTPayload, AuthTokens, MFASecret } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
}

export function generateTokens(userId: string, email: string, role: string, department: string | null): AuthTokens {
  const accessPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId,
    email,
    role,
    department,
  };

  const accessToken = generateAccessToken(accessPayload);
  const refreshToken = generateRefreshToken({ userId });

  // Calculate expiry in seconds
  const decoded = jwt.decode(accessToken) as { exp: number };
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

export function generateMFASecret(email: string): speakeasy.GeneratedSecret {
  return speakeasy.generateSecret({
    name: `ResidentCement:${email}`,
    length: 32,
  });
}

export async function generateQRCode(secret: speakeasy.GeneratedSecret): Promise<string> {
  return QRCode.toDataURL(secret.otpauth_url || '');
}

export function verifyMFAToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 steps (1 minute) time drift
  });
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

export function hashBackupCodes(codes: string[]): string[] {
  return codes.map(code => bcrypt.hashSync(code, SALT_ROUNDS));
}

export async function verifyBackupCode(code: string, hashedCodes: string[]): Promise<boolean> {
  for (const hashedCode of hashedCodes) {
    if (await bcrypt.compare(code, hashedCode)) {
      return true;
    }
  }
  return false;
}

export function generatePasswordResetToken(): string {
  return randomBytes(32).toString('hex');
}

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

export function sanitizeUser(user: any) {
  const { passwordHash, mfaSecret, mfaBackupCodes, ...sanitized } = user;
  return sanitized;
}
