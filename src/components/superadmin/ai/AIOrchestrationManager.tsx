
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { AIAgentManagement } from './AIAgentManagement';
import { EnhancedAIMetrics } from './metrics/EnhancedAIMetrics';
import { LearningInsightsDashboard, DecisionFeedbackInterface, ContextAnalysisVisualization } from './learning';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">AI Orchestration</h1>
          <p className="text-gray-600 text-sm md:text-base">Manage and monitor your AI agents and orchestration</p>
        </div>
        <Button onClick={handleRefreshAgents} className="w-full sm:w-auto">
          Refresh Agents
        </Button>
      </div>

      {/* Responsive metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{metrics.activeAgents}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{metrics.totalRequests}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              Learning Score
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold">
              {(learningInsights.combinedScore * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3 xl:col-span-1 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 md:px-6 md:pt-6">
            <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 md:px-6 md:pb-6">
            <div className="text-xl sm:text-2xl font-bold">{metrics.queueSize}</div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="flex w-full lg:w-auto min-w-full lg:min-w-0">
            <TabsTrigger value="agents" className="flex-1 lg:flex-none text-xs sm:text-sm">Agents</TabsTrigger>
            <TabsTrigger value="testing" className="flex-1 lg:flex-none text-xs sm:text-sm">Testing</TabsTrigger>
            <TabsTrigger value="learning-dashboard" className="flex-1 lg:flex-none text-xs sm:text-sm">Learning</TabsTrigger>
            <TabsTrigger value="feedback-interface" className="flex-1 lg:flex-none text-xs sm:text-sm">Feedback</TabsTrigger>
            <TabsTrigger value="context-analysis" className="flex-1 lg:flex-none text-xs sm:text-sm">Context</TabsTrigger>
            <TabsTrigger value="metrics" className="flex-1 lg:flex-none text-xs sm:text-sm">Metrics</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1 lg:flex-none text-xs sm:text-sm">Performance</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="agents">
          <AIAgentManagement />
        </TabsContent>

        <TabsContent value="testing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Test AI Request</CardTitle>
                <CardDescription>
                  Test the AI orchestration system with a sample request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <textarea
                    className="w-full h-24 sm:h-32 p-3 border rounded-md text-sm"
                    placeholder="Enter a test prompt..."
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleTestRequest} 
                  disabled={isRequesting || !testPrompt.trim()}
                  className="w-full sm:w-auto"
                >
                  {isRequesting ? 'Processing...' : 'Send Test Request'}
                </Button>
              </CardContent>
            </Card>

            {lastTestResponse && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Test Response</CardTitle>
                  <CardDescription>
                    Provide feedback to improve AI learning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-32 w-full rounded border">
                    <div className="bg-gray-50 p-3 text-sm">
                      <p className="font-medium mb-1">Response:</p>
                      <p className="break-words">{JSON.stringify(lastTestResponse.result, null, 2)}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        Confidence: {(lastTestResponse.confidence_score * 100).toFixed(1)}%
                      </p>
                    </div>
                  </ScrollArea>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => handleProvideFeedback('positive')}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      👍 Positive
                    </Button>
                    <Button 
                      onClick={() => handleProvideFeedback('negative')}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      👎 Negative
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="learning-dashboard">
          <LearningInsightsDashboard />
        </TabsContent>

        <TabsContent value="feedback-interface">
          <DecisionFeedbackInterface />
        </TabsContent>

        <TabsContent value="context-analysis">
          <ContextAnalysisVisualization />
        </TabsContent>

        <TabsContent value="metrics">
          <EnhancedAIMetrics />
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Requests:</span>
                  <Badge variant="outline">{metrics.totalRequests}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cache Hits:</span>
                  <Badge variant="outline">{metrics.cacheHits}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cache Hit Rate:</span>
                  <Badge variant="outline">{metrics.cacheHitRate.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Agents:</span>
                  <Badge variant="default">{metrics.activeAgents}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Queue Size:</span>
                  <Badge variant={metrics.queueSize > 10 ? "destructive" : "outline"}>
                    {metrics.queueSize}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">System Status:</span>
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
