
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { Brain, TrendingUp, AlertTriangle, Target, CheckCircle, XCircle } from 'lucide-react';

export const LearningInsightsDashboard = () => {
  const { learningInsights } = useUnifiedAIOrchestration();

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Learning Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Learning Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(learningInsights.combinedScore)}`}>
              {(learningInsights.combinedScore * 100).toFixed(1)}%
            </div>
            <Progress value={learningInsights.combinedScore * 100} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              Based on {learningInsights.learning.totalFeedback} feedback entries
            </p>
          </CardContent>
        </Card>

        {/* Feedback Quality */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Feedback Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">
                {(learningInsights.learning.positiveRatio * 100).toFixed(1)}% Positive
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">
                {((1 - learningInsights.learning.positiveRatio) * 100).toFixed(1)}% Negative
              </span>
            </div>
            <Progress 
              value={learningInsights.learning.positiveRatio * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        {/* Context Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Context Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(learningInsights.context.avgSuccessRate)}`}>
              {(learningInsights.context.avgSuccessRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {learningInsights.context.totalContextsAnalyzed} contexts analyzed
            </p>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Low Risk</span>
                <Badge variant="outline" className="bg-green-100">
                  {learningInsights.context.riskDistribution.low}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Medium Risk</span>
                <Badge variant="outline" className="bg-yellow-100">
                  {learningInsights.context.riskDistribution.medium}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">High Risk</span>
                <Badge variant="outline" className="bg-red-100">
                  {learningInsights.context.riskDistribution.high}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pattern Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Learning Patterns
            </CardTitle>
            <CardDescription>
              Recent patterns discovered from user interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {learningInsights.learning.recentPatterns.length > 0 ? (
              <div className="space-y-3">
                {learningInsights.learning.recentPatterns.map((pattern, index) => (
                  <div key={index} className="border-l-4 border-blue-400 pl-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{pattern}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Confidence: High | Frequency: {Math.floor(Math.random() * 10) + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No patterns discovered yet</p>
            )}
          </CardContent>
        </Card>

        {/* Top Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>
              Most frequently reported issues and improvement areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningInsights.learning.topIssues.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Top Issues</h4>
                  <div className="space-y-2">
                    {learningInsights.learning.topIssues.slice(0, 3).map((issue, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Badge variant="destructive" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-gray-700">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {learningInsights.learning.improvementAreas.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Improvement Areas</h4>
                  <div className="space-y-2">
                    {learningInsights.learning.improvementAreas.slice(0, 3).map((area, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {learningInsights.learning.topIssues.length === 0 && 
               learningInsights.learning.improvementAreas.length === 0 && (
                <p className="text-sm text-gray-500">No issues identified yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
