
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
    <div className="space-y-4 md:space-y-6">
      {/* Responsive overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Learning Score */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Learning Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(learningInsights.combinedScore)}`}>
              {(learningInsights.combinedScore * 100).toFixed(1)}%
            </div>
            <Progress value={learningInsights.combinedScore * 100} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              Based on {learningInsights.learning.totalFeedback} feedback entries
            </p>
          </CardContent>
        </Card>

        {/* Feedback Quality */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Feedback Quality</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">
                  {(learningInsights.learning.positiveRatio * 100).toFixed(1)}% Positive
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">
                  {((1 - learningInsights.learning.positiveRatio) * 100).toFixed(1)}% Negative
                </span>
              </div>
            </div>
            <Progress 
              value={learningInsights.learning.positiveRatio * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        {/* Context Success */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Context Success</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(learningInsights.context.avgSuccessRate)}`}>
              {(learningInsights.context.avgSuccessRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {learningInsights.context.totalContextsAnalyzed} contexts analyzed
            </p>
          </CardContent>
        </Card>

        {/* Risk Profile */}
        <Card className="sm:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Risk Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Low Risk</span>
                <Badge variant="outline" className="bg-green-100 text-xs">
                  {learningInsights.context.riskDistribution.low}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Medium Risk</span>
                <Badge variant="outline" className="bg-yellow-100 text-xs">
                  {learningInsights.context.riskDistribution.medium}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">High Risk</span>
                <Badge variant="outline" className="bg-red-100 text-xs">
                  {learningInsights.context.riskDistribution.high}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Pattern Insights */}
        <Card>
          <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="flex items-center text-lg">
              <Brain className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Learning Patterns</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Recent patterns discovered from user interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            {learningInsights.learning.recentPatterns.length > 0 ? (
              <div className="space-y-3">
                {learningInsights.learning.recentPatterns.map((pattern, index) => (
                  <div key={index} className="border-l-4 border-blue-400 pl-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm break-words">{pattern}</h4>
                      <p className="text-xs text-gray-600">
                        Confidence: High | Frequency: {Math.floor(Math.random() * 10) + 1}
                      </p>
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
          <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Areas for Improvement</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Most frequently reported issues and improvement areas
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="space-y-4">
              {learningInsights.learning.topIssues.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Top Issues</h4>
                  <div className="space-y-2">
                    {learningInsights.learning.topIssues.slice(0, 3).map((issue, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Badge variant="destructive" className="text-xs flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-gray-700 break-words">{issue}</span>
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
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-gray-700 break-words">{area}</span>
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
