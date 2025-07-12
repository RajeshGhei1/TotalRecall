
import { useLogAuditEvent } from './useAuditLogs';
import { useAuth } from '@/contexts/AuthContext';

export const useAuditLogger = () => {
  const { user } = useAuth();
  const logAuditEvent = useLogAuditEvent();

  const logEvent = (
    action: string,
    entity_type: string,
    options?: {
      entity_id?: string;
      old_values?: Record<string, unknown>;
      new_values?: Record<string, unknown>;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      module_name?: string;
      additional_context?: Record<string, unknown>;
    }
  ) => {
    if (!user) {
      console.warn('Cannot log audit event: user not authenticated');
      return;
    }

    logAuditEvent.mutate({
      action,
      entity_type,
      ...options
    });
  };

  return {
    logEvent,
    isLogging: logAuditEvent.isPending
  };
};

// Helper functions for common audit events
export const createAuditLogger = (module_name: string) => {
  const { logEvent } = useAuditLogger();

  return {
    logCreate: (entity_type: string, entity_id: string, data: Record<string, unknown>) => {
      logEvent('CREATE', entity_type, {
        entity_id,
        new_values: data,
        severity: 'medium',
        module_name
      });
    },

    logUpdate: (entity_type: string, entity_id: string, oldData: Record<string, unknown>, newData: Record<string, unknown>) => {
      logEvent('UPDATE', entity_type, {
        entity_id,
        old_values: oldData,
        new_values: newData,
        severity: 'medium',
        module_name
      });
    },

    logDelete: (entity_type: string, entity_id: string, data: Record<string, unknown>) => {
      logEvent('DELETE', entity_type, {
        entity_id,
        old_values: data,
        severity: 'high',
        module_name
      });
    },

    logView: (entity_type: string, entity_id?: string) => {
      logEvent('VIEW', entity_type, {
        entity_id,
        severity: 'low',
        module_name
      });
    },

    logExport: (entity_type: string, count: number) => {
      logEvent('EXPORT', entity_type, {
        severity: 'medium',
        module_name,
        additional_context: { exported_count: count }
      });
    },

    logLogin: () => {
      logEvent('LOGIN', 'user_session', {
        severity: 'low',
        module_name: 'auth'
      });
    },

    logLogout: () => {
      logEvent('LOGOUT', 'user_session', {
        severity: 'low',
        module_name: 'auth'
      });
    }
  };
};
