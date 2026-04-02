import { PrismaClient } from '@prisma/client';
import type { AuditAction } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditLogOptions {
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export async function logAuditEvent(options: AuditLogOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId,
        action: options.action,
        resource: options.resource,
        resourceId: options.resourceId,
        details: options.details || {},
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        success: options.success,
        errorMessage: options.errorMessage,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

export function getClientInfo(req: any): { ipAddress?: string; userAgent?: string } {
  return {
    ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
  };
}
