
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { 
  TrendingUp, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare,
  BarChart3
} from 'lucide-react';

export const LearningInsightsDashboard: React.FC = () => {
  const { learningInsights } = useUnifiedAIOrchestration();

  const { learning } = learningInsights;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learning.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">
              Feedback entries collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(learning.positiveRatio * 100).toFixed(1)}%
            </div>
            <Progress 
              value={learning.positiveRatio * 100} 
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(learningInsights.combinedScore * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall learning effectiveness
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Identified</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learning.topIssues.length}</div>
            <p className="text-xs text-muted-foreground">
              Areas needing attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Top Issues
            </CardTitle>
            <CardDescription>
              Most frequently reported problems
            </CardDescription>
          </CardHeader>
          <CardContent>
            {learning.topIssues.length > 0 ? (
              <div className="space-y-2">
                {learning.topIssues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-amber-50 rounded-md">
                    <span className="text-sm font-medium">{issue}</span>
                    <Badge variant="outline" className="text-xs">
                      Issue #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">No significant issues identified</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Improvement Areas
            </CardTitle>
            <CardDescription>
              Suggested focus areas for enhancement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {learning.improvementAreas.length > 0 ? (
              <div className="space-y-2">
                {learning.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                    <span className="text-sm font-medium">{area}</span>
                    <Badge variant="outline" className="text-xs">
                      Priority {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">All areas performing well</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Recent Learning Patterns
          </CardTitle>
          <CardDescription>
            Patterns identified from recent feedback and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {learning.recentPatterns.length > 0 ? (
            <div className="space-y-4">
              {learning.recentPatterns.map((pattern, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">
                      {pattern.type.replace('_', ' ')}
                    </h4>
                    <Badge variant="secondary">{pattern.insight}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pattern detected in recent data
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No recent patterns identified</p>
              <p className="text-xs text-gray-400 mt-1">
                Patterns will appear as more data is collected
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
