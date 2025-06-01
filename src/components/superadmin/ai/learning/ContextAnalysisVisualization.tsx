
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Target, TrendingUp, AlertTriangle } from 'lucide-react';

export const ContextAnalysisVisualization = () => {
  const { learningInsights } = useUnifiedAIOrchestration();

  // Mock data for visualization - in real implementation, this would come from the context insights
  const contextPerformanceData = [
    { name: 'Recruitment', successRate: 85, totalDecisions: 120 },
    { name: 'Workflow', successRate: 78, totalDecisions: 95 },
    { name: 'Pricing', successRate: 92, totalDecisions: 68 },
    { name: 'Analytics', successRate: 71, totalDecisions: 82 },
    { name: 'Forms', successRate: 88, totalDecisions: 105 }
  ];

  const riskDistributionData = [
    { name: 'Low Risk', value: learningInsights.context.riskDistribution.low, color: '#10B981' },
    { name: 'Medium Risk', value: learningInsights.context.riskDistribution.medium, color: '#F59E0B' },
    { name: 'High Risk', value: learningInsights.context.riskDistribution.high, color: '#EF4444' }
  ];

  const contextComplexityData = [
    { name: 'Simple', count: 45, avgConfidence: 0.89 },
    { name: 'Moderate', count: 38, avgConfidence: 0.76 },
    { name: 'Complex', count: 22, avgConfidence: 0.63 },
    { name: 'Very Complex', count: 12, avgConfidence: 0.51 }
  ];

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 85) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Overview Cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Contexts Analyzed</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{learningInsights.context.totalContextsAnalyzed}</div>
            <p className="text-xs text-gray-600 mt-1">Total contexts processed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Average Success</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className={`text-xl sm:text-2xl font-bold ${getSuccessRateColor(learningInsights.context.avgSuccessRate * 100)}`}>
              {(learningInsights.context.avgSuccessRate * 100).toFixed(1)}%
            </div>
            <Progress value={learningInsights.context.avgSuccessRate * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Top Performing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-sm sm:text-base font-bold break-words">
              {learningInsights.context.topPerformingContexts.length > 0 
                ? learningInsights.context.topPerformingContexts[0] 
                : 'N/A'}
            </div>
            <p className="text-xs text-gray-600 mt-1">Best context type</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Needs Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {learningInsights.context.problematicContexts.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Problematic contexts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - responsive layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Context Performance Chart */}
        <Card>
          <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-lg">Context Performance by Module</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Success rates across different modules</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contextPerformanceData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'successRate' ? `${value}%` : value,
                      name === 'successRate' ? 'Success Rate' : 'Total Decisions'
                    ]}
                  />
                  <Bar dataKey="successRate" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribution of decision risk levels</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    fontSize={12}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Complexity Analysis - responsive */}
      <Card>
        <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
          <CardTitle className="text-lg">Context Complexity Analysis</CardTitle>
          <CardDescription className="text-xs sm:text-sm">How AI performs across different complexity levels</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
          <div className="space-y-3 sm:space-y-4">
            {contextComplexityData.map((complexity, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-2 sm:gap-3">
                <div className="flex items-center space-x-3">
                  <Badge variant={complexity.avgConfidence > 0.8 ? "default" : 
                                 complexity.avgConfidence > 0.6 ? "secondary" : "destructive"}>
                    {complexity.name}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {complexity.count} decisions
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">
                    Avg Confidence: {(complexity.avgConfidence * 100).toFixed(0)}%
                  </span>
                  <Progress 
                    value={complexity.avgConfidence * 100} 
                    className="w-20 sm:w-24"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top and Problematic Contexts - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
              <span className="truncate">Top Performing Contexts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            {learningInsights.context.topPerformingContexts.length > 0 ? (
              <div className="space-y-2">
                {learningInsights.context.topPerformingContexts.slice(0, 5).map((context, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded gap-2">
                    <span className="text-sm font-medium break-words flex-1">{context}</span>
                    <Badge variant="default" className="bg-green-500 text-xs flex-shrink-0">
                      High Performance
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No top performing contexts identified yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" />
              <span className="truncate">Problematic Contexts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            {learningInsights.context.problematicContexts.length > 0 ? (
              <div className="space-y-2">
                {learningInsights.context.problematicContexts.slice(0, 5).map((context, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded gap-2">
                    <span className="text-sm font-medium break-words flex-1">{context}</span>
                    <Badge variant="destructive" className="text-xs flex-shrink-0">
                      Needs Improvement
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No problematic contexts identified</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
