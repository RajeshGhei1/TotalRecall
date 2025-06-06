
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleUsage {
  id: string;
  tenant_id: string;
  module_name: string;
  usage_type: string;
  usage_count: number;
  period_start: string;
  period_end: string;
  metadata: Record<string, any>;
}

export const useModuleUsageTracking = (tenantId?: string, moduleName?: string) => {
  const queryClient = useQueryClient();

  const { data: usageData, isLoading } = useQuery({
    queryKey: ['module-usage', tenantId, moduleName],
    queryFn: async (): Promise<ModuleUsage[]> => {
      if (!tenantId) return [];

      let query = supabase
        .from('module_usage_tracking')
        .select('*')
        .eq('tenant_id', tenantId);

      if (moduleName) {
        query = query.eq('module_name', moduleName);
      }

      const { data, error } = await query
        .order('period_start', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    enabled: !!tenantId
  });

  const trackUsageMutation = useMutation({
    mutationFn: async (usage: {
      module_name: string;
      usage_type: string;
      usage_count?: number;
      metadata?: Record<string, any>;
    }) => {
      if (!tenantId) throw new Error('Tenant ID required');

      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Try to update existing record first
      const { data: existing, error: selectError } = await supabase
        .from('module_usage_tracking')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('module_name', usage.module_name)
        .eq('usage_type', usage.usage_type)
        .eq('period_start', periodStart.toISOString())
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('module_usage_tracking')
          .update({
            usage_count: existing.usage_count + (usage.usage_count || 1),
            metadata: { ...existing.metadata, ...usage.metadata }
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('module_usage_tracking')
          .insert([{
            tenant_id: tenantId,
            module_name: usage.module_name,
            usage_type: usage.usage_type,
            usage_count: usage.usage_count || 1,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString(),
            metadata: usage.metadata || {}
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-usage', tenantId] });
    }
  });

  const getCurrentPeriodUsage = (moduleName: string, usageType: string): number => {
    if (!usageData) return 0;

    const now = new Date();
    const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const usage = usageData.find(u => 
      u.module_name === moduleName && 
      u.usage_type === usageType &&
      new Date(u.period_start) >= currentPeriodStart
    );

    return usage?.usage_count || 0;
  };

  const checkUsageLimit = (moduleName: string, usageType: string, limit: number): boolean => {
    const currentUsage = getCurrentPeriodUsage(moduleName, usageType);
    return currentUsage < limit;
  };

  return {
    usageData: usageData || [],
    isLoading,
    trackUsage: trackUsageMutation.mutateAsync,
    getCurrentPeriodUsage,
    checkUsageLimit,
    isTracking: trackUsageMutation.isPending
  };
};
