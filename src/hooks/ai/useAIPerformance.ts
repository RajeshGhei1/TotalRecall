
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AIPerformanceMetrics {
  agent_id: string;
  agent_name?: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time_ms: number;
  success_rate: number;
  total_cost: number;
  accuracy_score: number;
  user_satisfaction_score: number;
}

interface AggregatedMetrics {
  totalRequests: number;
  totalSuccessfulRequests: number;
  totalFailedRequests: number;
  overallSuccessRate: number;
  averageResponseTime: number;
  totalCost: number;
  averageAccuracy: number;
  averageUserSatisfaction: number;
}

export const useAIPerformance = (tenantId?: string, dateRange?: { from: Date; to: Date }) => {
  const performanceQuery = useQuery({
    queryKey: ['ai-performance', tenantId, dateRange],
    queryFn: async (): Promise<AIPerformanceMetrics[]> => {
      let query = supabase
        .from('ai_performance_metrics')
        .select(`
          agent_id,
          total_requests,
          successful_requests,
          failed_requests,
          average_response_time_ms,
          total_cost,
          accuracy_score,
          user_satisfaction_score,
          ai_agents(name)
        `);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      if (dateRange) {
        query = query
          .gte('metric_date', dateRange.from.toISOString().split('T')[0])
          .lte('metric_date', dateRange.to.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(metric => {
        const successRate = metric.total_requests > 0 
          ? (metric.successful_requests / metric.total_requests) * 100 
          : 0;

        return {
          agent_id: metric.agent_id,
          agent_name: (metric.ai_agents as any)?.name || 'Unknown Agent',
          total_requests: metric.total_requests,
          successful_requests: metric.successful_requests,
          failed_requests: metric.failed_requests,
          average_response_time_ms: metric.average_response_time_ms,
          success_rate: Math.round(successRate * 100) / 100,
          total_cost: metric.total_cost,
          accuracy_score: metric.accuracy_score,
          user_satisfaction_score: metric.user_satisfaction_score
        };
      });
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const aggregatedMetrics: AggregatedMetrics = {
    totalRequests: performanceQuery.data?.reduce((sum, m) => sum + m.total_requests, 0) || 0,
    totalSuccessfulRequests: performanceQuery.data?.reduce((sum, m) => sum + m.successful_requests, 0) || 0,
    totalFailedRequests: performanceQuery.data?.reduce((sum, m) => sum + m.failed_requests, 0) || 0,
    overallSuccessRate: 0,
    averageResponseTime: 0,
    totalCost: performanceQuery.data?.reduce((sum, m) => sum + m.total_cost, 0) || 0,
    averageAccuracy: 0,
    averageUserSatisfaction: 0
  };

  // Calculate derived metrics
  if (aggregatedMetrics.totalRequests > 0) {
    aggregatedMetrics.overallSuccessRate = 
      (aggregatedMetrics.totalSuccessfulRequests / aggregatedMetrics.totalRequests) * 100;
  }

  if (performanceQuery.data && performanceQuery.data.length > 0) {
    aggregatedMetrics.averageResponseTime = 
      performanceQuery.data.reduce((sum, m) => sum + m.average_response_time_ms, 0) / performanceQuery.data.length;
    
    aggregatedMetrics.averageAccuracy = 
      performanceQuery.data.reduce((sum, m) => sum + m.accuracy_score, 0) / performanceQuery.data.length;
    
    aggregatedMetrics.averageUserSatisfaction = 
      performanceQuery.data.reduce((sum, m) => sum + m.user_satisfaction_score, 0) / performanceQuery.data.length;
  }

  return {
    performanceMetrics: performanceQuery.data || [],
    aggregatedMetrics,
    isLoading: performanceQuery.isLoading,
    error: performanceQuery.error,
    refetch: performanceQuery.refetch
  };
};
