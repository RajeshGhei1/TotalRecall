
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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Contexts Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningInsights.context.totalContextsAnalyzed}</div>
            <p className="text-xs text-gray-600 mt-1">Total contexts processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Average Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSuccessRateColor(learningInsights.context.avgSuccessRate * 100)}`}>
              {(learningInsights.context.avgSuccessRate * 100).toFixed(1)}%
            </div>
            <Progress value={learningInsights.context.avgSuccessRate * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Top Performing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {learningInsights.context.topPerformingContexts.length > 0 
                ? learningInsights.context.topPerformingContexts[0] 
                : 'N/A'}
            </div>
            <p className="text-xs text-gray-600 mt-1">Best context type</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-red-600">
              {learningInsights.context.problematicContexts.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Problematic contexts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Context Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Context Performance by Module</CardTitle>
            <CardDescription>Success rates across different modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contextPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'successRate' ? `${value}%` : value,
                    name === 'successRate' ? 'Success Rate' : 'Total Decisions'
                  ]}
                />
                <Bar dataKey="successRate" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Distribution of decision risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Context Complexity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Context Complexity Analysis</CardTitle>
          <CardDescription>How AI performs across different complexity levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contextComplexityData.map((complexity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
                    className="w-24"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top and Problematic Contexts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Top Performing Contexts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {learningInsights.context.topPerformingContexts.length > 0 ? (
              <div className="space-y-2">
                {learningInsights.context.topPerformingContexts.slice(0, 5).map((context, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">{context}</span>
                    <Badge variant="default" className="bg-green-500">
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
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Problematic Contexts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {learningInsights.context.problematicContexts.length > 0 ? (
              <div className="space-y-2">
                {learningInsights.context.problematicContexts.slice(0, 5).map((context, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium">{context}</span>
                    <Badge variant="destructive">
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
