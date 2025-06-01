
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiModelHealthService } from '@/services/ai/aiModelHealthService';
import { aiCostTrackingService } from '@/services/ai/aiCostTrackingService';
import { Activity, DollarSign, Zap, Shield } from 'lucide-react';

export const EnhancedAIMetrics = () => {
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [costReport, setCostReport] = useState<any>(null);
  const [healthStatuses, setHealthStatuses] = useState<any[]>([]);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const health = aiModelHealthService.getHealthMetrics();
      const statuses = aiModelHealthService.getAllHealthStatuses();
      const cost = await aiCostTrackingService.generateCostReport();
      
      setHealthMetrics(health);
      setHealthStatuses(statuses);
      setCostReport(cost);
    } catch (error) {
      console.error('Error loading enhanced AI metrics:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics?.uptime || 0}%</div>
            <Progress value={healthMetrics?.uptime || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics?.averageResponseTime || 0}ms</div>
            <p className="text-xs text-muted-foreground">
              Across {healthMetrics?.totalModels || 0} models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${costReport?.totalCost?.toFixed(4) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Models</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthMetrics?.healthyModels || 0}/{healthMetrics?.totalModels || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Models operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Model Health</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Model Health Status</CardTitle>
              <CardDescription>Real-time health monitoring for all AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthStatuses.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={status.isHealthy ? "default" : "destructive"}>
                        {status.isHealthy ? "Healthy" : "Unhealthy"}
                      </Badge>
                      <div>
                        <div className="font-medium">{status.modelId}</div>
                        <div className="text-sm text-gray-600">{status.provider}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{status.responseTime}ms</div>
                      <div className="text-xs text-gray-600">
                        Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Requests:</span>
                    <span className="font-medium">{costReport?.totalRequests || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Successful:</span>
                    <span className="font-medium text-green-600">{costReport?.successfulRequests || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="font-medium text-red-600">{costReport?.failedRequests || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Cost/Request:</span>
                    <span className="font-medium">${costReport?.averageCostPerRequest?.toFixed(6) || '0.00'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost by Model</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {costReport?.costByModel && Object.entries(costReport.costByModel).map(([model, cost]: [string, any]) => (
                    <div key={model} className="flex justify-between">
                      <span className="text-sm">{model}:</span>
                      <span className="text-sm font-medium">${cost.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{healthMetrics?.totalModels || 0}</div>
                  <div className="text-sm text-gray-600">Total Models</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{healthMetrics?.healthyModels || 0}</div>
                  <div className="text-sm text-gray-600">Healthy Models</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{healthMetrics?.unhealthyModels || 0}</div>
                  <div className="text-sm text-gray-600">Unhealthy Models</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
