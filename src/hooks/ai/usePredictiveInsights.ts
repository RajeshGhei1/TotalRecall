
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictiveAnalyticsService } from '@/services/ai/predictiveAnalyticsService';
import { useTenantContext } from '@/contexts/TenantContext';
import { useRealTimeInsights } from './useRealTimeInsights';

export const usePredictiveInsights = () => {
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  // Use real-time insights for critical metrics
  const { realTimeMetrics, isLoading: realTimeLoading } = useRealTimeInsights(selectedTenantId);

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['predictive-trends', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.analyzeTrends(selectedTenantId),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    initialData: realTimeMetrics?.trends || [],
  });

  const { data: forecasts, isLoading: forecastsLoading } = useQuery({
    queryKey: ['business-forecasts', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.forecastBusinessMetrics(selectedTenantId),
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
  });

  const { data: risks, isLoading: risksLoading } = useQuery({
    queryKey: ['risk-assessment', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.assessRisks(selectedTenantId),
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
    initialData: realTimeMetrics?.risks || [],
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['opportunities', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.identifyOpportunities(selectedTenantId),
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
    initialData: realTimeMetrics?.opportunities || [],
  });

  const { data: insightsSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['insights-summary', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.generateInsightsSummary(selectedTenantId),
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  const refreshInsights = useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['predictive-trends'] }),
        queryClient.invalidateQueries({ queryKey: ['business-forecasts'] }),
        queryClient.invalidateQueries({ queryKey: ['risk-assessment'] }),
        queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
        queryClient.invalidateQueries({ queryKey: ['insights-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['real-time-insights'] })
      ]);
    },
    onSuccess: () => {
      console.log('Predictive insights refreshed successfully');
    },
    onError: (error) => {
      console.error('Error refreshing predictive insights:', error);
    }
  });

  const isLoading = trendsLoading || forecastsLoading || risksLoading || opportunitiesLoading || summaryLoading || realTimeLoading;

  return {
    trends: trends || [],
    forecasts: forecasts || [],
    risks: risks || [],
    opportunities: opportunities || [],
    insightsSummary: insightsSummary || {
      trends: [],
      forecasts: [],
      risks: [],
      opportunities: [],
      overallScore: realTimeMetrics?.healthScore || 0,
      keyInsights: []
    },
    realTimeMetrics,
    isLoading,
    refreshInsights: refreshInsights.mutateAsync,
    isRefreshing: refreshInsights.isPending,
    selectedTenantId,
    lastUpdated: realTimeMetrics?.lastUpdated
  };
};
