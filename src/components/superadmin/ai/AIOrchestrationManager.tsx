
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { AIAgentManagement } from './AIAgentManagement';
import { EnhancedAIMetrics } from './metrics/EnhancedAIMetrics';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';

export const AIOrchestrationManager = () => {
  const { 
    agents, 
    metrics, 
    learningInsights,
    requestPrediction, 
    provideFeedback,
    recordOutcome,
    refreshAgents, 
    isRequesting 
  } = useUnifiedAIOrchestration();
  const [testPrompt, setTestPrompt] = useState('');
  const [lastTestResponse, setLastTestResponse] = useState<any>(null);

  const handleTestRequest = async () => {
    if (!testPrompt.trim()) return;

    try {
      const response = await requestPrediction({
        context: {
          user_id: 'test-user',
          tenant_id: undefined,
          module: 'orchestration',
          action: 'test_ai_request'
        },
        parameters: { prompt: testPrompt },
        priority: 'high'
      });
      
      setLastTestResponse(response);
      console.log('Test response:', response);
    } catch (error) {
      console.error('Test request failed:', error);
    }
  };

  const handleProvideFeedback = async (feedback: 'positive' | 'negative') => {
    if (!lastTestResponse) return;

    try {
      // For testing, we'll create a mock decision ID
      const mockDecisionId = `test_${Date.now()}`;
      await provideFeedback({
        decisionId: mockDecisionId,
        feedback,
        details: { testFeedback: true, prompt: testPrompt }
      });
      console.log(`Feedback provided: ${feedback}`);
    } catch (error) {
      console.error('Failed to provide feedback:', error);
    }
  };

  const handleRefreshAgents = async () => {
    try {
      await refreshAgents();
    } catch (error) {
      console.error('Failed to refresh agents:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Orchestration</h1>
          <p className="text-gray-600">Manage and monitor your AI agents and orchestration</p>
        </div>
        <Button onClick={handleRefreshAgents}>
          Refresh Agents
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeAgents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              Learning Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(learningInsights.combinedScore * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.queueSize}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agent Management</TabsTrigger>
          <TabsTrigger value="testing">Testing & Feedback</TabsTrigger>
          <TabsTrigger value="learning">Learning Insights</TabsTrigger>
          <TabsTrigger value="metrics">Enhanced Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <AIAgentManagement />
        </TabsContent>

        <TabsContent value="testing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test AI Request</CardTitle>
                <CardDescription>
                  Test the AI orchestration system with a sample request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <textarea
                    className="w-full h-32 p-3 border rounded-md"
                    placeholder="Enter a test prompt..."
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleTestRequest} 
                  disabled={isRequesting || !testPrompt.trim()}
                >
                  {isRequesting ? 'Processing...' : 'Send Test Request'}
                </Button>
              </CardContent>
            </Card>

            {lastTestResponse && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Response</CardTitle>
                  <CardDescription>
                    Provide feedback to improve AI learning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium">Response:</p>
                    <p className="text-sm mt-1">{JSON.stringify(lastTestResponse.result, null, 2)}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Confidence: {(lastTestResponse.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleProvideFeedback('positive')}
                      variant="outline"
                      size="sm"
                    >
                      👍 Positive
                    </Button>
                    <Button 
                      onClick={() => handleProvideFeedback('negative')}
                      variant="outline"
                      size="sm"
                    >
                      👎 Negative
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="learning">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Learning Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Feedback:</span>
                  <Badge variant="outline">{learningInsights.learning.totalFeedback}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Positive Rate:</span>
                  <Badge variant="default">
                    {(learningInsights.learning.positiveRatio * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Patterns Found:</span>
                  <Badge variant="outline">{learningInsights.learning.recentPatterns.length}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Context Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Contexts Analyzed:</span>
                  <Badge variant="outline">{learningInsights.context.totalContextsAnalyzed}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Success Rate:</span>
                  <Badge variant="default">
                    {(learningInsights.context.avgSuccessRate * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risk Distribution:</span>
                  <div className="flex gap-1">
                    <Badge variant="default" className="text-xs">
                      L:{learningInsights.context.riskDistribution.low}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      M:{learningInsights.context.riskDistribution.medium}
                    </Badge>
                    <Badge variant="destructive" className="text-xs">
                      H:{learningInsights.context.riskDistribution.high}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {learningInsights.learning.topIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Top Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {learningInsights.learning.topIssues.slice(0, 3).map((issue, index) => (
                      <li key={index} className="text-xs text-gray-600 border-l-2 border-red-200 pl-2">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <EnhancedAIMetrics />
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Requests:</span>
                  <Badge variant="outline">{metrics.totalRequests}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hits:</span>
                  <Badge variant="outline">{metrics.cacheHits}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit Rate:</span>
                  <Badge variant="outline">{metrics.cacheHitRate.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Active Agents:</span>
                  <Badge variant="default">{metrics.activeAgents}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Queue Size:</span>
                  <Badge variant={metrics.queueSize > 10 ? "destructive" : "outline"}>
                    {metrics.queueSize}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>System Status:</span>
                  <Badge variant="default">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
