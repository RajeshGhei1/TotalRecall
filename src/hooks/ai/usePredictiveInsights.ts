
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictiveAnalyticsService } from '@/services/ai/predictiveAnalyticsService';
import { useTenantContext } from '@/contexts/TenantContext';

export const usePredictiveInsights = () => {
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['predictive-trends', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.analyzeTrends(selectedTenantId || undefined),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const { data: forecasts, isLoading: forecastsLoading } = useQuery({
    queryKey: ['business-forecasts', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.forecastBusinessMetrics(selectedTenantId || undefined),
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
  });

  const { data: risks, isLoading: risksLoading } = useQuery({
    queryKey: ['risk-assessment', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.assessRisks(selectedTenantId || undefined),
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['opportunities', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.identifyOpportunities(selectedTenantId || undefined),
    refetchInterval: 30 * 60 * 1000, // Refresh every 30 minutes
  });

  const { data: insightsSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['insights-summary', selectedTenantId],
    queryFn: () => predictiveAnalyticsService.generateInsightsSummary(selectedTenantId || undefined),
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  const refreshInsights = useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['predictive-trends'] }),
        queryClient.invalidateQueries({ queryKey: ['business-forecasts'] }),
        queryClient.invalidateQueries({ queryKey: ['risk-assessment'] }),
        queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
        queryClient.invalidateQueries({ queryKey: ['insights-summary'] })
      ]);
    },
    onSuccess: () => {
      console.log('Predictive insights refreshed successfully');
    },
    onError: (error) => {
      console.error('Error refreshing predictive insights:', error);
    }
  });

  const isLoading = trendsLoading || forecastsLoading || risksLoading || opportunitiesLoading || summaryLoading;

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
      overallScore: 0,
      keyInsights: []
    },
    isLoading,
    refreshInsights: refreshInsights.mutateAsync,
    isRefreshing: refreshInsights.isPending,
    selectedTenantId
  };
};
