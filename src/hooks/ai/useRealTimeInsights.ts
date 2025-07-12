
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { predictiveAnalyticsService } from '@/services/ai/predictiveAnalyticsService';
import { useEffect } from 'react';

export const useRealTimeInsights = (tenantId?: string) => {
  const queryClient = useQueryClient();

  // Real-time insights that update more frequently
  const { data: realTimeMetrics, isLoading, error } = useQuery({
    queryKey: ['real-time-insights', tenantId],
    queryFn: async () => {
      const [trends, risks, opportunities] = await Promise.all([
        predictiveAnalyticsService.analyzeTrends(tenantId),
        predictiveAnalyticsService.assessRisks(tenantId),
        predictiveAnalyticsService.identifyOpportunities(tenantId)
      ]);

      // Calculate real-time health score
      const healthScore = calculateHealthScore(trends, risks, opportunities);
      
      return {
        trends,
        risks,
        opportunities,
        healthScore,
        lastUpdated: new Date().toISOString()
      };
    },
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
    refetchIntervalInBackground: true,
    staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
  });

  // Set up periodic refresh for critical insights
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['real-time-insights', tenantId] 
      });
    }, 5 * 60 * 1000); // Invalidate every 5 minutes

    return () => clearInterval(interval);
  }, [queryClient, tenantId]);

  const refreshInsights = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['real-time-insights', tenantId] 
    });
  };

  return {
    realTimeMetrics,
    isLoading,
    error,
    refreshInsights,
    lastUpdated: realTimeMetrics?.lastUpdated
  };
};

function calculateHealthScore(trends: unknown[], risks: unknown[], opportunities: unknown[]): number {
  const positiveTrends = trends.filter(t => t.trend === 'increasing').length;
  const highRisks = risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length;
  const highOpportunities = opportunities.filter(o => o.potential === 'high').length;

  // Base score calculation
  let score = 0.7; // Start with 70% base

  // Add points for positive trends
  score += (positiveTrends / Math.max(trends.length, 1)) * 0.2;

  // Subtract points for high risks
  score -= (highRisks / Math.max(risks.length, 1)) * 0.3;

  // Add points for opportunities
  score += (highOpportunities / Math.max(opportunities.length, 1)) * 0.1;

  return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
}
