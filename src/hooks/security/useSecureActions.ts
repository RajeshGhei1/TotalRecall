
import { useCallback } from 'react';
import { useConfirmation } from '@/hooks/common/useConfirmation';
import { useAuditLogger } from '@/hooks/audit/useAuditLogger';
import { usePermissionCheck } from './useSecurityContext';
import { AuditableAction } from '@/types/security';
import { toast } from 'sonner';

interface SecureActionOptions {
  requireConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
  severity?: 'info' | 'warning' | 'danger';
  requiredPermission?: {
    resource: string;
    action: string;
  };
  auditAction?: AuditableAction;
}

export const useSecureActions = () => {
  const { confirm } = useConfirmation();
  const { logEvent } = useAuditLogger();
  const { hasPermission, requirePermission } = usePermissionCheck();

  const executeSecureAction = useCallback(async <T>(
    action: () => Promise<T> | T,
    options: SecureActionOptions = {}
  ): Promise<T | null> => {
    try {
      // Check permissions
      if (options.requiredPermission) {
        const { resource, action: permAction } = options.requiredPermission;
        if (!hasPermission(resource, permAction)) {
          toast.error('Permission denied', {
            description: `You don't have permission to ${permAction} ${resource}`,
          });
          return null;
        }
      }

      // Require confirmation for destructive actions
      if (options.requireConfirmation) {
        const confirmed = await confirm({
          title: options.confirmationTitle || 'Confirm Action',
          description: options.confirmationDescription || 'Are you sure you want to proceed?',
          severity: options.severity || 'warning',
          confirmText: 'Proceed',
          cancelText: 'Cancel',
        });

        if (!confirmed) {
          return null;
        }
      }

      // Execute the action
      const result = await action();

      // Log the action for audit
      if (options.auditAction) {
        logEvent(
          options.auditAction.action,
          options.auditAction.entity,
          {
            entity_id: options.auditAction.entityId,
            severity: options.auditAction.severity,
            additional_context: options.auditAction.metadata,
          }
        );
      }

      return result;
    } catch (error) {
      console.error('Secure action failed:', error);
      toast.error('Action failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
      
      // Log the failure
      if (options.auditAction) {
        logEvent(
          `${options.auditAction.action}_FAILED`,
          options.auditAction.entity,
          {
            entity_id: options.auditAction.entityId,
            severity: 'high',
            additional_context: {
              error: error instanceof Error ? error.message : 'Unknown error',
              ...options.auditAction.metadata,
            },
          }
        );
      }

      return null;
    }
  }, [confirm, logEvent, hasPermission]);

  return { executeSecureAction };
};
