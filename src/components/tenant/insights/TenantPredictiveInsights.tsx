
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePredictiveInsights } from '@/hooks/ai/usePredictiveInsights';
import { 
  TrendingUp, TrendingDown, Minus, BarChart3, AlertTriangle, 
  Target, RefreshCw, Brain, ArrowUpRight, ArrowDownRight,
  DollarSign, Users, Calendar, Shield, Lightbulb
} from 'lucide-react';

interface TenantPredictiveInsightsProps {
  tenantId?: string;
  simplified?: boolean;
}

export const TenantPredictiveInsights: React.FC<TenantPredictiveInsightsProps> = ({ 
  tenantId, 
  simplified = false 
}) => {
  const { 
    trends, 
    forecasts, 
    risks, 
    opportunities, 
    insightsSummary, 
    isLoading, 
    refreshInsights, 
    isRefreshing 
  } = usePredictiveInsights();

  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'recommendations'>('overview');

  const handleRefreshInsights = async () => {
    try {
      await refreshInsights();
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-yellow-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Predictive Insights</h3>
          <Button disabled size="sm">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const priorityItems = getHighPriorityItems();

  if (simplified) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center text-lg">
                <Brain className="h-5 w-5 mr-2" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Key insights and recommendations for your business
              </CardDescription>
            </div>
            <Button 
              onClick={handleRefreshInsights} 
              disabled={isRefreshing} 
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* High Priority Alerts */}
          {priorityItems.risks.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                High Priority Risks
              </h4>
              {priorityItems.risks.map((risk, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-red-900">{risk.riskType}</span>
                    <Badge variant="destructive" className="text-xs">{risk.riskLevel}</Badge>
                  </div>
                  <p className="text-xs text-red-700">{risk.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* High Value Opportunities */}
          {priorityItems.opportunities.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-500" />
                High-Value Opportunities
              </h4>
              {priorityItems.opportunities.map((opportunity, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-green-900">{opportunity.opportunityType}</span>
                    <Badge variant="outline" className="text-xs">
                      ROI: {(opportunity.estimatedROI * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-green-700">{opportunity.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Key Insights Summary */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
              Key Insights
            </h4>
            <div className="space-y-1">
              {insightsSummary.keyInsights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Badge variant="outline" className="text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </Badge>
                  <p className="text-xs text-gray-600">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Score */}
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Health Score</span>
              <span className="text-sm font-bold">
                {(insightsSummary.overallScore * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={insightsSummary.overallScore * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            Predictive Insights
          </h2>
          <p className="text-gray-600 text-sm">AI-powered analytics for your tenant</p>
        </div>
        <Button onClick={handleRefreshInsights} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Insights'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(insightsSummary.overallScore * 100).toFixed(1)}%
            </div>
            <Progress value={insightsSummary.overallScore * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Positive Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {trends.filter(t => t.trend === 'increasing').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Out of {trends.length} metrics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              High Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {opportunities.filter(o => o.potential === 'high').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">High potential</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends & Forecasts</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights Summary</CardTitle>
                <CardDescription>
                  AI-generated insights based on your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insightsSummary.keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Overall system health indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prediction Accuracy</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Completeness</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Insight Confidence</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-20" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trends.slice(0, 4).map((trend, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    {getTrendIcon(trend.trend)}
                    <span className="ml-2">{trend.metric}</span>
                  </CardTitle>
                  <CardDescription>
                    Confidence: {(trend.confidence * 100).toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Trend:</span>
                      <Badge variant={trend.trend === 'increasing' ? 'default' : trend.trend === 'decreasing' ? 'destructive' : 'secondary'}>
                        {trend.trend}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Next prediction: {trend.prediction[0]?.predictedValue.toFixed(1)} ({trend.prediction[0]?.confidence.toFixed(0)}% confidence)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {/* High Priority Risks */}
          {priorityItems.risks.length > 0 && (
            <Card className="border-l-4 border-red-400">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Priority Actions Required
                </CardTitle>
                <CardDescription>
                  High-priority risks that need immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {priorityItems.risks.map((risk, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-red-900">{risk.riskType}</h4>
                      <Badge variant="destructive">{risk.riskLevel}</Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-3">{risk.description}</p>
                    <div>
                      <h5 className="text-sm font-medium text-red-900 mb-1">Recommended Actions:</h5>
                      <ul className="text-xs space-y-1">
                        {risk.mitigationSuggestions.slice(0, 2).map((suggestion, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-red-400">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* High Value Opportunities */}
          {priorityItems.opportunities.length > 0 && (
            <Card className="border-l-4 border-green-400">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-500" />
                  Growth Opportunities
                </CardTitle>
                <CardDescription>
                  High-potential opportunities for business growth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {priorityItems.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-green-900">{opportunity.opportunityType}</h4>
                      <Badge variant="outline">ROI: {(opportunity.estimatedROI * 100).toFixed(0)}%</Badge>
                    </div>
                    <p className="text-sm text-green-700 mb-3">{opportunity.description}</p>
                    <div>
                      <h5 className="text-sm font-medium text-green-900 mb-1">Next Steps:</h5>
                      <ul className="text-xs space-y-1">
                        {opportunity.actionItems.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-green-400">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantPredictiveInsights;
