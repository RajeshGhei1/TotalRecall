
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { usePredictiveInsights } from '@/hooks/ai/usePredictiveInsights';
import { 
  Brain, TrendingUp, AlertTriangle, Target, 
  ArrowRight, RefreshCw, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PredictiveInsightsWidgetProps {
  tenantId?: string;
  showFullInsights?: boolean;
}

const PredictiveInsightsWidget: React.FC<PredictiveInsightsWidgetProps> = ({ 
  tenantId, 
  showFullInsights = false 
}) => {
  const navigate = useNavigate();
  const { 
    trends, 
    risks, 
    opportunities, 
    insightsSummary, 
    isLoading, 
    refreshInsights, 
    isRefreshing 
  } = usePredictiveInsights();

  const handleRefreshInsights = async () => {
    try {
      await refreshInsights();
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    }
  };

  const getHighPriorityItems = () => {
    const highRisks = risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical');
    const highOpportunities = opportunities.filter(o => o.potential === 'high');
    const positiveTrends = trends.filter(t => t.trend === 'increasing');
    
    return {
      risks: highRisks.slice(0, 2),
      opportunities: highOpportunities.slice(0, 2),
      trends: positiveTrends.slice(0, 2)
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Predictive Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const priorityItems = getHighPriorityItems();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Predictive Insights
            </CardTitle>
            <CardDescription>
              AI-powered business intelligence and forecasting
            </CardDescription>
          </div>
          <Button 
            onClick={handleRefreshInsights} 
            disabled={isRefreshing} 
            size="sm"
            variant="ghost"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Business Health Score</span>
            <span className="text-sm font-bold">
              {(insightsSummary.overallScore * 100).toFixed(1)}%
            </span>
          </div>
          <Progress value={insightsSummary.overallScore * 100} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {trends.filter(t => t.trend === 'increasing').length}
            </div>
            <div className="text-xs text-gray-600">Positive Trends</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length}
            </div>
            <div className="text-xs text-gray-600">High Risks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {opportunities.filter(o => o.potential === 'high').length}
            </div>
            <div className="text-xs text-gray-600">Opportunities</div>
          </div>
        </div>

        {/* High Priority Alerts */}
        {priorityItems.risks.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Priority Alerts
            </h4>
            {priorityItems.risks.map((risk, index) => (
              <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-red-900">{risk.riskType}</span>
                  <Badge variant="destructive" className="text-xs">{risk.riskLevel}</Badge>
                </div>
                <p className="text-red-700 truncate">{risk.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* High Value Opportunities */}
        {priorityItems.opportunities.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center">
              <Target className="h-4 w-4 mr-2 text-green-500" />
              Growth Opportunities
            </h4>
            {priorityItems.opportunities.map((opportunity, index) => (
              <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-green-900">{opportunity.opportunityType}</span>
                  <Badge variant="outline" className="text-xs">
                    ROI: {(opportunity.estimatedROI * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-green-700 truncate">{opportunity.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Key Insights */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
            Key Insights
          </h4>
          <div className="space-y-1">
            {insightsSummary.keyInsights.slice(0, 2).map((insight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Badge variant="outline" className="text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </Badge>
                <p className="text-xs text-gray-600 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* View Full Insights Button */}
        <div className="pt-3 border-t">
          <Button
            onClick={() => navigate('/tenant-admin/predictive-insights')}
            className="w-full"
            size="sm"
          >
            View Full Insights
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsightsWidget;
