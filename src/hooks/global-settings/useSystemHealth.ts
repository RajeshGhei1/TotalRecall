
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemHealthMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  metric_type: string;
  threshold_warning?: number;
  threshold_critical?: number;
  recorded_at: string;
  metadata: Record<string, any>;
}

export const useSystemHealthMetrics = (timeRange: 'hour' | 'day' | 'week' = 'hour') => {
  return useQuery({
    queryKey: ['system-health-metrics', timeRange],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case 'hour':
          startDate.setHours(now.getHours() - 1);
          break;
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
      }

      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data as SystemHealthMetric[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useRecordSystemMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metric: Omit<SystemHealthMetric, 'id' | 'recorded_at'>) => {
      const { data, error } = await supabase
        .from('system_health_metrics')
        .insert(metric)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-health-metrics'] });
    },
  });
};

export const useSystemHealthSummary = () => {
  return useQuery({
    queryKey: ['system-health-summary'],
    queryFn: async () => {
      // Get latest metrics for each metric type
      const { data, error } = await supabase
        .from('system_health_metrics')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order('recorded_at', { ascending: false });

      if (error) throw error;

      // Group by metric_name and get the latest value
      const latestMetrics = data.reduce((acc, metric) => {
        if (!acc[metric.metric_name] || new Date(metric.recorded_at) > new Date(acc[metric.metric_name].recorded_at)) {
          acc[metric.metric_name] = metric;
        }
        return acc;
      }, {} as Record<string, SystemHealthMetric>);

      return Object.values(latestMetrics);
    },
    refetchInterval: 30000,
  });
};
