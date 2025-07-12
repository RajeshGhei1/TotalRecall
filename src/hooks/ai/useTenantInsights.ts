
import { useQuery } from '@tanstack/react-query';
import { predictiveAnalyticsService } from '@/services/ai/predictiveAnalyticsService';
import { useTenantContext } from '@/contexts/TenantContext';

export const useTenantInsights = () => {
  const { selectedTenantId } = useTenantContext();

  const { data: tenantInsights, isLoading, error } = useQuery({
    queryKey: ['tenant-insights', selectedTenantId],
    queryFn: async () => {
      if (!selectedTenantId) return null;

      const summary = await predictiveAnalyticsService.generateInsightsSummary(selectedTenantId);
      
      // Extract actionable insights for tenant admins
      const actionableInsights = {
        criticalAlerts: summary.risks.filter(r => r.urgency === 'high'),
        growthOpportunities: summary.opportunities.filter(o => o.potential === 'high'),
        trendingMetrics: summary.trends.filter(t => t.trend === 'increasing'),
        recommendations: generateRecommendations(summary),
        overallHealth: summary.overallScore
      };

      return actionableInsights;
    },
    enabled: !!selectedTenantId,
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  return {
    tenantInsights,
    isLoading,
    error,
    tenantId: selectedTenantId
  };
};

function generateRecommendations(summary: unknown) {
  const recommendations = [];

  // Risk-based recommendations
  const highRisks = summary.risks.filter((r: unknown) => r.riskLevel === 'high' || r.riskLevel === 'critical');
  highRisks.forEach((risk: unknown) => {
    recommendations.push({
      type: 'risk-mitigation',
      priority: 'high',
      title: `Address ${risk.riskType}`,
      description: risk.description,
      actions: risk.mitigationSuggestions.slice(0, 2)
    });
  });

  // Opportunity-based recommendations
  const highOpportunities = summary.opportunities.filter((o: unknown) => o.potential === 'high');
  highOpportunities.forEach((opportunity: unknown) => {
    recommendations.push({
      type: 'growth-opportunity',
      priority: 'medium',
      title: `Leverage ${opportunity.opportunityType}`,
      description: opportunity.description,
      actions: opportunity.actionItems.slice(0, 2)
    });
  });

  // Trend-based recommendations
  const decreasingTrends = summary.trends.filter((t: unknown) => t.trend === 'decreasing');
  decreasingTrends.forEach((trend: unknown) => {
    recommendations.push({
      type: 'trend-improvement',
      priority: 'medium',
      title: `Improve ${trend.metric}`,
      description: `${trend.metric} is showing a declining trend`,
      actions: ['Analyze root causes', 'Implement improvement strategies']
    });
  });

  return recommendations.slice(0, 5); // Return top 5 recommendations
}
