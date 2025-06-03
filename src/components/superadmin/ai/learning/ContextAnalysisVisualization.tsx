
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { 
  BarChart, 
  Brain, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

export const ContextAnalysisVisualization: React.FC = () => {
  const { learningInsights } = useUnifiedAIOrchestration();

  const { context } = learningInsights;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contexts Analyzed</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{context.totalContextsAnalyzed}</div>
            <p className="text-xs text-muted-foreground">
              Total context analyses performed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(context.avgSuccessRate * 100).toFixed(1)}%
            </div>
            <Progress 
              value={context.avgSuccessRate * 100} 
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Low Risk</span>
                <span>{context.riskDistribution.low}%</span>
              </div>
              <Progress value={context.riskDistribution.low} className="h-1" />
              
              <div className="flex justify-between text-xs">
                <span>Medium Risk</span>
                <span>{context.riskDistribution.medium}%</span>
              </div>
              <Progress value={context.riskDistribution.medium} className="h-1" />
              
              <div className="flex justify-between text-xs">
                <span>High Risk</span>
                <span>{context.riskDistribution.high}%</span>
              </div>
              <Progress value={context.riskDistribution.high} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Context Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {context.avgSuccessRate > 0.8 ? (
                <span className="text-green-600">Healthy</span>
              ) : context.avgSuccessRate > 0.6 ? (
                <span className="text-yellow-600">Fair</span>
              ) : (
                <span className="text-red-600">Poor</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall context performance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Performing Contexts
            </CardTitle>
            <CardDescription>
              Context types with highest success rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {context.topPerformingContexts.length > 0 ? (
              <div className="space-y-3">
                {context.topPerformingContexts.map((contextItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                    <div>
                      <h4 className="font-medium">{contextItem.name}</h4>
                      <p className="text-sm text-gray-600">{contextItem.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100">
                      {(contextItem.successRate * 100).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No performance data available</p>
                <p className="text-xs text-gray-400 mt-1">
                  Data will appear as contexts are analyzed
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Problematic Contexts
            </CardTitle>
            <CardDescription>
              Context types requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {context.problematicContexts.length > 0 ? (
              <div className="space-y-3">
                {context.problematicContexts.map((contextItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-md">
                    <div>
                      <h4 className="font-medium">{contextItem.name}</h4>
                      <p className="text-sm text-gray-600">{contextItem.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-100">
                      {(contextItem.failureRate * 100).toFixed(1)}% failures
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
                <p className="text-sm">No problematic contexts identified</p>
                <p className="text-xs text-gray-400 mt-1">
                  All contexts performing within acceptable ranges
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            Context Risk Analysis
          </CardTitle>
          <CardDescription>
            Distribution of risk levels across different contexts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {context.riskDistribution.low}%
                </div>
                <div className="text-sm text-gray-600">Low Risk</div>
                <div className="mt-2 h-2 bg-green-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${context.riskDistribution.low}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {context.riskDistribution.medium}%
                </div>
                <div className="text-sm text-gray-600">Medium Risk</div>
                <div className="mt-2 h-2 bg-yellow-200 rounded-full">
                  <div 
                    className="h-2 bg-yellow-500 rounded-full" 
                    style={{ width: `${context.riskDistribution.medium}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {context.riskDistribution.high}%
                </div>
                <div className="text-sm text-gray-600">High Risk</div>
                <div className="mt-2 h-2 bg-red-200 rounded-full">
                  <div 
                    className="h-2 bg-red-500 rounded-full" 
                    style={{ width: `${context.riskDistribution.high}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">Risk Assessment Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Low Risk:</strong> Standard contexts with high success rates</li>
                <li>• <strong>Medium Risk:</strong> Contexts requiring careful monitoring</li>
                <li>• <strong>High Risk:</strong> Complex contexts needing special attention</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
