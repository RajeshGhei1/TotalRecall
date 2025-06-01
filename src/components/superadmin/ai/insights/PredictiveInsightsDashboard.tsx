
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
  DollarSign, Users, Calendar, Shield
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const PredictiveInsightsDashboard = () => {
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

  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'forecasts' | 'risks' | 'opportunities'>('overview');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-yellow-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold">Predictive Insights</h2>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2 flex-shrink-0" />
            Predictive Insights
          </h2>
          <p className="text-gray-600 text-sm md:text-base">AI-powered analytics and forecasting</p>
        </div>
        <Button onClick={refreshInsights} disabled={isRefreshing} className="w-full sm:w-auto">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Insights'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 flex-shrink-0" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold">
              {(insightsSummary.overallScore * 100).toFixed(1)}%
            </div>
            <Progress value={insightsSummary.overallScore * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
              Positive Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {trends.filter(t => t.trend === 'increasing').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Out of {trends.length} metrics</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              High Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 flex-shrink-0" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {opportunities.filter(o => o.potential === 'high').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">High potential</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="flex w-full lg:w-auto min-w-full lg:min-w-0">
            <TabsTrigger value="overview" className="flex-1 lg:flex-none text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="trends" className="flex-1 lg:flex-none text-xs sm:text-sm">Trends</TabsTrigger>
            <TabsTrigger value="forecasts" className="flex-1 lg:flex-none text-xs sm:text-sm">Forecasts</TabsTrigger>
            <TabsTrigger value="risks" className="flex-1 lg:flex-none text-xs sm:text-sm">Risks</TabsTrigger>
            <TabsTrigger value="opportunities" className="flex-1 lg:flex-none text-xs sm:text-sm">Opportunities</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                <CardTitle className="text-lg">Key Insights Summary</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  AI-generated insights based on current data analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                <div className="space-y-3">
                  {insightsSummary.keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <p className="text-sm break-words">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                <CardTitle className="text-lg">Performance Overview</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Overall system health and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
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

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {trends.map((trend, index) => (
              <Card key={index}>
                <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                  <CardTitle className="text-sm sm:text-base flex items-center">
                    {getTrendIcon(trend.trend)}
                    <span className="ml-2 truncate">{trend.metric}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Confidence: {(trend.confidence * 100).toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
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

        <TabsContent value="forecasts">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {forecasts.map((forecast, index) => (
              <Card key={index}>
                <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                  <CardTitle className="text-sm sm:text-base flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{forecast.metric}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {forecast.forecastPeriod} forecast
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current:</span>
                      <span className="font-medium">{forecast.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Predicted:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{forecast.predictedValue.toLocaleString()}</span>
                        {forecast.predictedValue > forecast.currentValue ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>{forecast.trend}</p>
                      <p className="mt-1">Confidence: {(forecast.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks">
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <Card key={index} className={`border-l-4 ${getRiskLevelColor(risk.riskLevel).replace('bg-', 'border-')}`}>
                <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <CardTitle className="text-sm sm:text-base">{risk.riskType}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={risk.riskLevel === 'critical' || risk.riskLevel === 'high' ? 'destructive' : risk.riskLevel === 'medium' ? 'default' : 'secondary'}>
                        {risk.riskLevel}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {risk.urgency} urgency
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Probability: {(risk.probability * 100).toFixed(0)}% | Impact: {(risk.impact * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                  <div className="space-y-3">
                    <p className="text-sm break-words">{risk.description}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Mitigation Suggestions:</h4>
                      <ul className="text-xs space-y-1">
                        {risk.mitigationSuggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-gray-400">•</span>
                            <span className="break-words">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities">
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <Card key={index} className="border-l-4 border-green-400">
                <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <CardTitle className="text-sm sm:text-base">{opportunity.opportunityType}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={opportunity.potential === 'high' ? 'default' : 'secondary'}>
                        {opportunity.potential} potential
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ROI: {(opportunity.estimatedROI * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Confidence: {(opportunity.confidence * 100).toFixed(0)}% | Timeline: {opportunity.timeToRealize}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
                  <div className="space-y-3">
                    <p className="text-sm break-words">{opportunity.description}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Action Items:</h4>
                      <ul className="text-xs space-y-1">
                        {opportunity.actionItems.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-gray-400">•</span>
                            <span className="break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
