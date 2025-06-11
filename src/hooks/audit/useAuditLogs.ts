
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuditLog, AuditLogFilters } from '@/types/audit';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';
import { useCacheInvalidation } from '@/hooks/security/useCacheInvalidation';

export const useAuditLogs = (filters: AuditLogFilters = {}, page = 1, pageSize = 50) => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('audit-logs', [filters, page, pageSize]),
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name
          ),
          tenants:tenant_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.tenant_id) {
        query = query.eq('tenant_id', filters.tenant_id);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.module_name) {
        query = query.eq('module_name', filters.module_name);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.search) {
        query = query.or(`action.ilike.%${filters.search}%,entity_type.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        data: data as AuditLog[],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page
      };
    },
  });
};

export const useAuditLogStats = (tenantId?: string) => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('audit-log-stats', [tenantId]),
    queryFn: async () => {
      // Get stats for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      let query = supabase
        .from('audit_logs')
        .select('action, severity, created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      // Apply tenant filter if provided
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate stats
      const totalLogs = data.length;
      const criticalLogs = data.filter(log => log.severity === 'critical').length;
      const highLogs = data.filter(log => log.severity === 'high').length;
      const mediumLogs = data.filter(log => log.severity === 'medium').length;
      const lowLogs = data.filter(log => log.severity === 'low').length;

      // Get activity by day
      const activityByDay = data.reduce((acc, log) => {
        const date = new Date(log.created_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get top actions
      const actionCounts = data.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topActions = Object.entries(actionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([action, count]) => ({ action, count }));

      return {
        totalLogs,
        criticalLogs,
        highLogs,
        mediumLogs,
        lowLogs,
        activityByDay,
        topActions
      };
    },
  });
};

export const useLogAuditEvent = () => {
  const queryClient = useQueryClient();
  const { createSecureKey } = useSecureQueryKey();
  const { clearSecurityCaches } = useCacheInvalidation();

  return useMutation({
    mutationFn: async (logData: {
      action: string;
      entity_type: string;
      entity_id?: string;
      old_values?: Record<string, any>;
      new_values?: Record<string, any>;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      module_name?: string;
      additional_context?: Record<string, any>;
    }) => {
      const { data, error } = await supabase.functions.invoke('log-audit-event', {
        body: logData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all audit-related caches
      queryClient.invalidateQueries({ queryKey: createSecureKey('audit-logs') });
      queryClient.invalidateQueries({ queryKey: createSecureKey('audit-log-stats') });
      clearSecurityCaches();
    },
    onError: (error) => {
      console.error('Failed to log audit event:', error);
      toast({
        title: 'Logging Error',
        description: 'Failed to log audit event',
        variant: 'destructive',
      });
    },
  });
};
