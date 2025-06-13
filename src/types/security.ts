
import { z } from 'zod';

// Enhanced security types
export interface SecurityContext {
  userId: string;
  sessionId: string;
  tenantId: string;
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface AuditableAction {
  action: string;
  entity: string;
  entityId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface PermissionCheck {
  resource: string;
  action: string;
  context?: Record<string, any>;
}

// Validation schemas
export const securityContextSchema = z.object({
  userId: z.string().uuid(),
  sessionId: z.string().min(1),
  tenantId: z.string().uuid(),
  permissions: z.array(z.string()),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.date(),
});

export const auditableActionSchema = z.object({
  action: z.string().min(1),
  entity: z.string().min(1),
  entityId: z.string().uuid().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  metadata: z.record(z.any()).optional(),
});

export const permissionCheckSchema = z.object({
  resource: z.string().min(1),
  action: z.string().min(1),
  context: z.record(z.any()).optional(),
});
