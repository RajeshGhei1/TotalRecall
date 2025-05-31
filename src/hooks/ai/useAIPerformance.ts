
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenantContext } from '@/contexts/TenantContext';

export interface AIPerformanceMetric {
  id: string;
  agent_id: string;
  tenant_id?: string;
  metric_date: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time_ms: number;
  total_cost: number;
  accuracy_score: number;
  user_satisfaction_score: number;
  created_at: string;
  updated_at: string;
}

export const useAIPerformance = (agentId?: string, days: number = 30) => {
  const { selectedTenantId } = useTenantContext();

  const performanceQuery = useQuery({
    queryKey: ['ai-performance', agentId, selectedTenantId, days],
    queryFn: async (): Promise<AIPerformanceMetric[]> => {
      let query = supabase
        .from('ai_performance_metrics')
        .select('*')
        .gte('metric_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('metric_date', { ascending: false });

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      if (selectedTenantId) {
        query = query.eq('tenant_id', selectedTenantId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const aggregatedMetrics = performanceQuery.data?.reduce((acc, metric) => {
    return {
      totalRequests: acc.totalRequests + metric.total_requests,
      successfulRequests: acc.successfulRequests + metric.successful_requests,
      failedRequests: acc.failedRequests + metric.failed_requests,
      totalCost: acc.totalCost + metric.total_cost,
      avgResponseTime: acc.totalRequests > 0 
        ? (acc.avgResponseTime * acc.totalRequests + metric.average_response_time_ms * metric.total_requests) / (acc.totalRequests + metric.total_requests)
        : metric.average_response_time_ms,
      avgAccuracy: acc.totalRequests > 0
        ? (acc.avgAccuracy * acc.totalRequests + metric.accuracy_score * metric.total_requests) / (acc.totalRequests + metric.total_requests)
        : metric.accuracy_score,
      avgSatisfaction: acc.totalRequests > 0
        ? (acc.avgSatisfaction * acc.totalRequests + metric.user_satisfaction_score * metric.total_requests) / (acc.totalRequests + metric.total_requests)
        : metric.user_satisfaction_score,
    };
  }, {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalCost: 0,
    avgResponseTime: 0,
    avgAccuracy: 0,
    avgSatisfaction: 0,
  });

  return {
    metrics: performanceQuery.data || [],
    aggregatedMetrics,
    isLoading: performanceQuery.isLoading,
    error: performanceQuery.error,
    successRate: aggregatedMetrics && aggregatedMetrics.totalRequests > 0 
      ? (aggregatedMetrics.successfulRequests / aggregatedMetrics.totalRequests) * 100 
      : 0
  };
};
