import type { Request, Response } from 'express';
import { PrismaClient, UserRole, Department, UserStatus, AuditAction } from '@prisma/client';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  generateMFASecret,
  generateQRCode,
  verifyMFAToken,
  generateBackupCodes,
  hashBackupCodes,
  verifyBackupCode,
  generatePasswordResetToken,
  isTokenExpired,
  sanitizeUser,
} from '../utils/auth';
import { logAuditEvent, getClientInfo } from '../utils/audit';
import type {
  LoginRequest,
  RegisterRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from '../types';

const prisma = new PrismaClient();
const PASSWORD_RESET_EXPIRY_HOURS = 24;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

export class AuthController {
  // Login
  async login(req: Request, res: Response): Promise<void> {
    const { email, password, rememberMe, mfaCode } = req.body as LoginRequest;
    const clientInfo = getClientInfo(req);

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        await logAuditEvent({
          action: AuditAction.LOGIN_FAILED,
          resource: 'auth',
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          success: false,
          errorMessage: 'User not found',
        });

        res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        });
        return;
      }

      // Check if user is locked
      if (user.lockedUntil && new Date() < user.lockedUntil) {
        const minutesRemaining = Math.ceil(
          (user.lockedUntil.getTime() - new Date().getTime()) / (1000 * 60)
        );

        res.status(403).json({
          status: 'error',
          message: `Account locked. Try again in ${minutesRemaining} minutes.`,
          code: 'ACCOUNT_LOCKED',
        });
        return;
      }

      // Check if user is active
      if (user.status !== UserStatus.ACTIVE) {
        res.status(403).json({
          status: 'error',
          message: 'Account is not active',
          code: 'ACCOUNT_INACTIVE',
        });
        return;
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.passwordHash);

      if (!isValidPassword) {
        // Increment failed attempts
        const failedAttempts = user.failedLoginAttempts + 1;
        const updateData: any = { failedLoginAttempts: failedAttempts };

        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
          updateData.lockedUntil = new Date(
            Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
          );
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });

        await logAuditEvent({
          userId: user.id,
          action: AuditAction.LOGIN_FAILED,
          resource: 'auth',
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          success: false,
          errorMessage: 'Invalid password',
        });

        res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        });
        return;
      }

      // Check MFA if enabled
      if (user.mfaEnabled) {
        if (!mfaCode) {
          res.status(403).json({
            status: 'mfa_required',
            message: 'MFA code required',
            code: 'MFA_REQUIRED',
          });
          return;
        }

        const isValidMFA = verifyMFAToken(user.mfaSecret!, mfaCode);

        if (!isValidMFA) {
          // Try backup codes
          const isValidBackup = await verifyBackupCode(mfaCode, user.mfaBackupCodes);

          if (!isValidBackup) {
            await logAuditEvent({
              userId: user.id,
              action: AuditAction.LOGIN_FAILED,
              resource: 'auth',
              ipAddress: clientInfo.ipAddress,
              userAgent: clientInfo.userAgent,
              success: false,
              errorMessage: 'Invalid MFA code',
            });

            res.status(401).json({
              status: 'error',
              message: 'Invalid MFA code',
              code: 'INVALID_MFA',
            });
            return;
          }
        }

        await logAuditEvent({
          userId: user.id,
          action: AuditAction.MFA_VERIFIED,
          resource: 'auth',
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          success: true,
        });
      }

      // Reset failed attempts and update last login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
        },
      });

      // Generate tokens
      const tokens = generateTokens(
        user.id,
        user.email,
        user.role,
        user.department
      );

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
        },
      });

      // Store session if remember me
      if (rememberMe) {
        await prisma.session.create({
          data: {
            userId: user.id,
            token: tokens.accessToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            ipAddress: clientInfo.ipAddress,
            userAgent: clientInfo.userAgent,
          },
        });
      }

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.LOGIN,
        resource: 'auth',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        data: {
          user: sanitizeUser(user),
          tokens,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Logout
  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const userId = (req as any).user?.userId;
    const clientInfo = getClientInfo(req);

    try {
      // Revoke refresh token
      if (refreshToken) {
        await prisma.refreshToken.updateMany({
          where: { token: refreshToken },
          data: { revoked: true },
        });
      }

      // Delete session if exists
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader && authHeader.split(' ')[1];

      if (accessToken) {
        await prisma.session.deleteMany({
          where: { token: accessToken },
        });
      }

      if (userId) {
        await logAuditEvent({
          userId,
          action: AuditAction.LOGOUT,
          resource: 'auth',
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          success: true,
        });
      }

      res.json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    try {
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.revoked || isTokenExpired(storedToken.expiresAt)) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
        });
        return;
      }

      // Generate new tokens
      const tokens = generateTokens(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role,
        storedToken.user.department
      );

      // Revoke old token
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true, replacedByToken: tokens.refreshToken },
      });

      // Store new refresh token
      const clientInfo = getClientInfo(req);
      await prisma.refreshToken.create({
        data: {
          userId: storedToken.user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
        },
      });

      await logAuditEvent({
        userId: storedToken.user.id,
        action: AuditAction.TOKEN_REFRESHED,
        resource: 'auth',
        success: true,
      });

      res.json({
        status: 'success',
        data: { tokens },
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Get current user
  async getMe(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        });
        return;
      }

      res.json({
        status: 'success',
        data: { user: sanitizeUser(user) },
      });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Request password reset
  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    const { email } = req.body as PasswordResetRequest;
    const clientInfo = getClientInfo(req);

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        // Don't reveal if user exists
        res.json({
          status: 'success',
          message: 'If an account exists, a password reset email has been sent.',
        });
        return;
      }

      const token = generatePasswordResetToken();

      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000),
        },
      });

      // TODO: Send email with reset link
      console.log(`Password reset token for ${email}: ${token}`);

      await logAuditEvent({
        userId: user.id,
        action: AuditAction.PASSWORD_RESET_REQUEST,
        resource: 'auth',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        message: 'If an account exists, a password reset email has been sent.',
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Confirm password reset
  async confirmPasswordReset(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body as PasswordResetConfirm;
    const clientInfo = getClientInfo(req);

    try {
      const resetRecord = await prisma.passwordReset.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!resetRecord || resetRecord.used || isTokenExpired(resetRecord.expiresAt)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN',
        });
        return;
      }

      const hashedPassword = await hashPassword(newPassword);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: resetRecord.userId },
          data: {
            passwordHash: hashedPassword,
            passwordChangedAt: new Date(),
          },
        }),
        prisma.passwordReset.update({
          where: { id: resetRecord.id },
          data: { used: true, usedAt: new Date() },
        }),
      ]);

      await logAuditEvent({
        userId: resetRecord.userId,
        action: AuditAction.PASSWORD_RESET_COMPLETE,
        resource: 'auth',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        message: 'Password reset successful',
      });
    } catch (error) {
      console.error('Password reset confirm error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Change password
  async changePassword(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const { currentPassword, newPassword } = req.body as ChangePasswordRequest;
    const clientInfo = getClientInfo(req);

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        });
        return;
      }

      const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);

      if (!isValidPassword) {
        res.status(401).json({
          status: 'error',
          message: 'Current password is incorrect',
          code: 'INVALID_PASSWORD',
        });
        return;
      }

      const hashedPassword = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: hashedPassword,
          passwordChangedAt: new Date(),
        },
      });

      // Revoke all refresh tokens
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true },
      });

      await logAuditEvent({
        userId,
        action: AuditAction.PASSWORD_CHANGE,
        resource: 'auth',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        message: 'Password changed successfully. Please log in again.',
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Setup MFA
  async setupMFA(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        });
        return;
      }

      const secret = generateMFASecret(user.email);
      const qrCode = await generateQRCode(secret);
      const backupCodes = generateBackupCodes();

      await prisma.user.update({
        where: { id: userId },
        data: {
          mfaSecret: secret.base32,
          mfaBackupCodes: hashBackupCodes(backupCodes),
          mfaEnabled: false, // Will be enabled after verification
        },
      });

      res.json({
        status: 'success',
        data: {
          secret: secret.base32,
          qrCode,
          backupCodes,
        },
      });
    } catch (error) {
      console.error('Setup MFA error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Verify and enable MFA
  async verifyAndEnableMFA(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const { code } = req.body;
    const clientInfo = getClientInfo(req);

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.mfaSecret) {
        res.status(400).json({
          status: 'error',
          message: 'MFA not set up',
          code: 'MFA_NOT_SETUP',
        });
        return;
      }

      const isValid = verifyMFAToken(user.mfaSecret, code);

      if (!isValid) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid verification code',
          code: 'INVALID_MFA_CODE',
        });
        return;
      }

      await prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true },
      });

      await logAuditEvent({
        userId,
        action: AuditAction.MFA_ENABLED,
        resource: 'auth',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        message: 'MFA enabled successfully',
      });
    } catch (error) {
      console.error('Verify MFA error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Disable MFA
  async disableMFA(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const { code } = req.body;
    const clientInfo = getClientInfo(req);

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.mfaEnabled) {
        res.status(400).json({
          status: 'error',
          message: 'MFA not enabled',
          code: 'MFA_NOT_ENABLED',
        });
        return;
      }

      const isValid = verifyMFAToken(user.mfaSecret!, code);

      if (!isValid) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid verification code',
          code: 'INVALID_MFA_CODE',
        });
        return;
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          mfaEnabled: false,
          mfaSecret: null,
          mfaBackupCodes: [],
        },
      });

      await logAuditEvent({
        userId,
        action: AuditAction.MFA_DISABLED,
        resource: 'auth',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        message: 'MFA disabled successfully',
      });
    } catch (error) {
      console.error('Disable MFA error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }
}

export const authController = new AuthController();
