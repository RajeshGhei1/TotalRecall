
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  RefreshCw,
  BarChart3,
  Lightbulb,
  Clock
} from 'lucide-react';
import { advancedPatternRecognitionService, PatternRecognitionResult, WorkflowInefficiency, PredictiveInsight } from '@/services/ai/patternRecognition/advancedPatternRecognitionService';

interface PatternRecognitionDashboardProps {
  userId: string;
  tenantId?: string;
  className?: string;
}

export const PatternRecognitionDashboard: React.FC<PatternRecognitionDashboardProps> = ({
  userId,
  tenantId,
  className = ''
}) => {
  const [patterns, setPatterns] = useState<PatternRecognitionResult[]>([]);
  const [inefficiencies, setInefficiencies] = useState<WorkflowInefficiency[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patterns');

  useEffect(() => {
    if (userId) {
      loadPatternData();
    }
  }, [userId, tenantId]);

  const loadPatternData = async () => {
    setIsLoading(true);
    try {
      const [patternsData, inefficienciesData, insightsData] = await Promise.all([
        advancedPatternRecognitionService.recognizePatterns(userId, tenantId),
        advancedPatternRecognitionService.detectWorkflowInefficiencies(userId, tenantId),
        advancedPatternRecognitionService.generatePredictiveInsights(userId, tenantId)
      ]);

      setPatterns(patternsData);
      setInefficiencies(inefficienciesData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading pattern data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Pattern Recognition Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-sm text-gray-500">Analyzing patterns...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Advanced Pattern Recognition
              </CardTitle>
              <CardDescription>
                AI-powered analysis of user behavior, workflow efficiency, and predictive insights
              </CardDescription>
            </div>
            <Button 
              onClick={loadPatternData} 
              disabled={isLoading}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Patterns Found</p>
                <p className="text-2xl font-bold">{patterns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Inefficiencies</p>
                <p className="text-2xl font-bold">{inefficiencies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Insights</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">High Priority</p>
                <p className="text-2xl font-bold">
                  {patterns.filter(p => p.severity === 'high' || p.severity === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patterns">Recognized Patterns</TabsTrigger>
          <TabsTrigger value="inefficiencies">Workflow Issues</TabsTrigger>
          <TabsTrigger value="insights">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          {patterns.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No patterns detected yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Continue using the platform to enable pattern recognition.
                </p>
              </CardContent>
            </Card>
          ) : (
            patterns.map((pattern) => (
              <Card key={pattern.patternId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{pattern.description}</CardTitle>
                      <Badge className={getSeverityColor(pattern.severity)}>
                        {pattern.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getConfidenceColor(pattern.confidence)}`}>
                        {Math.round(pattern.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <CardDescription>Type: {pattern.patternType}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {pattern.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {pattern.metadata && Object.keys(pattern.metadata).length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Details:</h4>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          {JSON.stringify(pattern.metadata, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="inefficiencies" className="space-y-4">
          {inefficiencies.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No workflow inefficiencies detected.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Your workflows appear to be running efficiently.
                </p>
              </CardContent>
            </Card>
          ) : (
            inefficiencies.map((inefficiency) => (
              <Card key={inefficiency.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{inefficiency.description}</CardTitle>
                    <Badge variant="outline">{inefficiency.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Impact Score:</span>
                        <span className="ml-2">{inefficiency.impact.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span>
                        <span className="ml-2">{inefficiency.frequency}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Suggested Optimizations:</h4>
                      <ul className="space-y-1">
                        {inefficiency.suggestedOptimizations.map((opt, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" />
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {inefficiency.affectedModules.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Affected Modules:</h4>
                        <div className="flex flex-wrap gap-1">
                          {inefficiency.affectedModules.map((module, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No predictive insights available yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  More data is needed to generate reliable predictions.
                </p>
              </CardContent>
            </Card>
          ) : (
            insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{insight.insight}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{insight.category}</Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Timeframe: {insight.timeframe}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {insight.actionable && insight.recommendedActions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Recommended Actions:</h4>
                      <ul className="space-y-1">
                        {insight.recommendedActions.map((action, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
