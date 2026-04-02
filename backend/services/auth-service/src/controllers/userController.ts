import type { Request, Response } from 'express';
import { PrismaClient, UserRole, Department, UserStatus, AuditAction } from '@prisma/client';
import { hashPassword, sanitizeUser } from '../utils/auth';
import { logAuditEvent, getClientInfo } from '../utils/audit';
import type { CreateUserRequest, UpdateUserRequest } from '../types';

const prisma = new PrismaClient();

export class UserController {
  // Get all users with pagination and filtering
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const role = req.query.role as UserRole;
      const department = req.query.department as Department;
      const status = req.query.status as UserStatus;

      const where: any = {};

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (role) where.role = role;
      if (department) where.department = department;
      if (status) where.status = status;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        status: 'success',
        data: {
          users: users.map(sanitizeUser),
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          auditLogs: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              action: true,
              resource: true,
              success: true,
              createdAt: true,
            },
          },
        },
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
      console.error('Get user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Create new user
  async createUser(req: Request, res: Response): Promise<void> {
    const { email, password, firstName, lastName, role, department } = req.body as CreateUserRequest;
    const clientInfo = getClientInfo(req);
    const currentUserId = (req as any).user?.userId;

    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        res.status(409).json({
          status: 'error',
          message: 'Email already registered',
          code: 'EMAIL_EXISTS',
        });
        return;
      }

      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash: hashedPassword,
          firstName,
          lastName,
          role: role as UserRole,
          department: department as Department,
          status: UserStatus.ACTIVE,
          createdBy: currentUserId,
        },
      });

      await logAuditEvent({
        userId: currentUserId,
        action: AuditAction.USER_CREATED,
        resource: 'user',
        resourceId: user.id,
        details: { email, role, department },
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.status(201).json({
        status: 'success',
        data: { user: sanitizeUser(user) },
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { firstName, lastName, role, department, status } = req.body as UpdateUserRequest;
    const clientInfo = getClientInfo(req);
    const currentUserId = (req as any).user?.userId;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        });
        return;
      }

      // Prevent self-demotion from admin
      if (id === currentUserId && role && role !== existingUser.role) {
        res.status(403).json({
          status: 'error',
          message: 'Cannot change your own role',
          code: 'SELF_ROLE_CHANGE_FORBIDDEN',
        });
        return;
      }

      const updateData: any = {
        updatedBy: currentUserId,
      };

      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (role !== undefined) updateData.role = role as UserRole;
      if (department !== undefined) updateData.department = department as Department;
      if (status !== undefined) updateData.status = status as UserStatus;

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      // Log role change if applicable
      if (role && role !== existingUser.role) {
        await logAuditEvent({
          userId: currentUserId,
          action: AuditAction.ROLE_CHANGED,
          resource: 'user',
          resourceId: id,
          details: { oldRole: existingUser.role, newRole: role },
          ipAddress: clientInfo.ipAddress,
          userAgent: clientInfo.userAgent,
          success: true,
        });
      }

      await logAuditEvent({
        userId: currentUserId,
        action: AuditAction.USER_UPDATED,
        resource: 'user',
        resourceId: id,
        details: updateData,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        data: { user: sanitizeUser(user) },
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Deactivate user
  async deactivateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const clientInfo = getClientInfo(req);
    const currentUserId = (req as any).user?.userId;

    try {
      if (id === currentUserId) {
        res.status(403).json({
          status: 'error',
          message: 'Cannot deactivate your own account',
          code: 'SELF_DEACTIVATION_FORBIDDEN',
        });
        return;
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          status: UserStatus.INACTIVE,
          updatedBy: currentUserId,
        },
      });

      // Revoke all sessions and tokens
      await prisma.refreshToken.updateMany({
        where: { userId: id },
        data: { revoked: true },
      });

      await prisma.session.deleteMany({
        where: { userId: id },
      });

      await logAuditEvent({
        userId: currentUserId,
        action: AuditAction.USER_DEACTIVATED,
        resource: 'user',
        resourceId: id,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        data: { user: sanitizeUser(user) },
      });
    } catch (error) {
      console.error('Deactivate user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Activate user
  async activateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const clientInfo = getClientInfo(req);
    const currentUserId = (req as any).user?.userId;

    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          status: UserStatus.ACTIVE,
          failedLoginAttempts: 0,
          lockedUntil: null,
          updatedBy: currentUserId,
        },
      });

      await logAuditEvent({
        userId: currentUserId,
        action: AuditAction.USER_ACTIVATED,
        resource: 'user',
        resourceId: id,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        data: { user: sanitizeUser(user) },
      });
    } catch (error) {
      console.error('Activate user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Delete user (soft delete - actually just deactivates)
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const clientInfo = getClientInfo(req);
    const currentUserId = (req as any).user?.userId;

    try {
      if (id === currentUserId) {
        res.status(403).json({
          status: 'error',
          message: 'Cannot delete your own account',
          code: 'SELF_DELETION_FORBIDDEN',
        });
        return;
      }

      // Soft delete by marking as inactive and anonymizing
      await prisma.user.update({
        where: { id },
        data: {
          status: UserStatus.INACTIVE,
          email: `deleted-${id}@deleted.local`,
          firstName: 'Deleted',
          lastName: 'User',
          updatedBy: currentUserId,
        },
      });

      // Revoke all sessions and tokens
      await prisma.refreshToken.updateMany({
        where: { userId: id },
        data: { revoked: true },
      });

      await prisma.session.deleteMany({
        where: { userId: id },
      });

      await logAuditEvent({
        userId: currentUserId,
        action: AuditAction.USER_DELETED,
        resource: 'user',
        resourceId: id,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Reset user password (admin function)
  async resetUserPassword(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { newPassword } = req.body;
    const clientInfo = getClientInfo(req);
    const currentUserId = (req as any).user?.userId;

    try {
      const hashedPassword = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id },
        data: {
          passwordHash: hashedPassword,
          passwordChangedAt: new Date(),
          updatedBy: currentUserId,
        },
      });

      // Revoke all refresh tokens
      await prisma.refreshToken.updateMany({
        where: { userId: id },
        data: { revoked: true },
      });

      await logAuditEvent({
        userId: currentUserId,
        action: AuditAction.PASSWORD_RESET_COMPLETE,
        resource: 'user',
        resourceId: id,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        success: true,
      });

      res.json({
        status: 'success',
        message: 'Password reset successfully',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Get user audit logs
  async getUserAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where: { userId: id },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.auditLog.count({ where: { userId: id } }),
      ]);

      res.json({
        status: 'success',
        data: {
          logs,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error('Get audit logs error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  // Get roles and departments for dropdown
  async getMetadata(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        status: 'success',
        data: {
          roles: Object.values(UserRole),
          departments: Object.values(Department),
          statuses: Object.values(UserStatus),
        },
      });
    } catch (error) {
      console.error('Get metadata error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }
}

export const userController = new UserController();
