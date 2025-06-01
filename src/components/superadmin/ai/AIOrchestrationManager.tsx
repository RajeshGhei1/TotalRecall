
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { AIAgentManagement } from './AIAgentManagement';
import { EnhancedAIMetrics } from './metrics/EnhancedAIMetrics';

export const AIOrchestrationManager = () => {
  const { agents, metrics, requestPrediction, refreshAgents, isRequesting } = useUnifiedAIOrchestration();
  const [testPrompt, setTestPrompt] = useState('');

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
      
      console.log('Test response:', response);
    } catch (error) {
      console.error('Test request failed:', error);
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="metrics">Enhanced Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <AIAgentManagement />
        </TabsContent>

        <TabsContent value="testing">
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
