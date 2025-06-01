
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIPerformance } from '@/hooks/ai/useAIPerformance';
import { aiModelHealthService } from '@/services/ai/aiModelHealthService';
import { aiCacheService } from '@/services/ai/aiCacheService';
import { aiCostTrackingService } from '@/services/ai/aiCostTrackingService';
import { Activity, DollarSign, Zap, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const EnhancedAIMetrics = () => {
  const { aggregatedMetrics } = useAIPerformance();
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [cacheMetrics, setCacheMetrics] = useState<any>(null);
  const [costReport, setCostReport] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = () => {
      const health = aiModelHealthService.getHealthMetrics();
      const cache = aiCacheService.getCacheMetrics();
      
      setHealthMetrics(health);
      setCacheMetrics(cache);
      setLastUpdate(new Date());
      
      // Fetch cost report
      aiCostTrackingService.generateCostReport().then(report => {
        setCostReport(report);
      }).catch(error => {
        console.error('Error fetching cost report:', error);
      });
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefreshMetrics = () => {
    const health = aiModelHealthService.getHealthMetrics();
    const cache = aiCacheService.getCacheMetrics();
    
    setHealthMetrics(health);
    setCacheMetrics(cache);
    setLastUpdate(new Date());
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the AI cache? This will affect response times temporarily.')) {
      aiCacheService.clearCache();
      setCacheMetrics(aiCacheService.getCacheMetrics());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced AI Metrics</h2>
          <p className="text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshMetrics} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleClearCache} variant="outline">
            Clear Cache
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="health">Model Health</TabsTrigger>
          <TabsTrigger value="cache">Cache Analytics</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthMetrics?.uptime || 0}%
                </div>
                <Badge variant={healthMetrics?.uptime >= 95 ? "default" : "destructive"}>
                  {healthMetrics?.uptime >= 95 ? "Healthy" : "Degraded"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Cache Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {cacheMetrics?.cacheHitRate || 0}%
                </div>
                <div className="text-sm text-gray-600">
                  {cacheMetrics?.cacheHits || 0} hits / {cacheMetrics?.totalRequests || 0} requests
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Total Cost (30d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${costReport?.totalCost?.toFixed(4) || '0.0000'}
                </div>
                <div className="text-sm text-gray-600">
                  {costReport?.totalRequests || 0} requests
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Avg Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {aggregatedMetrics?.avgResponseTime?.toFixed(0) || 0}ms
                </div>
                <Badge variant={aggregatedMetrics?.avgResponseTime < 1000 ? "default" : "secondary"}>
                  {aggregatedMetrics?.avgResponseTime < 1000 ? "Fast" : "Moderate"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Performance</CardTitle>
                <CardDescription>AI request statistics and success rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Requests:</span>
                  <Badge variant="outline">{aggregatedMetrics?.totalRequests || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Successful Requests:</span>
                  <Badge variant="default">{aggregatedMetrics?.successfulRequests || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Failed Requests:</span>
                  <Badge variant="destructive">{aggregatedMetrics?.failedRequests || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <Badge variant={
                    aggregatedMetrics?.totalRequests > 0 && 
                    (aggregatedMetrics.successfulRequests / aggregatedMetrics.totalRequests) > 0.95 
                      ? "default" : "secondary"
                  }>
                    {aggregatedMetrics?.totalRequests > 0 
                      ? ((aggregatedMetrics.successfulRequests / aggregatedMetrics.totalRequests) * 100).toFixed(1)
                      : 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>AI response quality and user satisfaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Average Accuracy:</span>
                  <Badge variant="outline">{(aggregatedMetrics?.avgAccuracy || 0).toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>User Satisfaction:</span>
                  <Badge variant="outline">{(aggregatedMetrics?.avgSatisfaction || 0).toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <Badge variant="outline">${(aggregatedMetrics?.totalCost || 0).toFixed(4)}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Model Health Status</CardTitle>
              <CardDescription>Real-time health monitoring of AI models</CardDescription>
            </CardHeader>
            <CardContent>
              {healthMetrics ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {healthMetrics.healthyModels}
                    </div>
                    <div className="text-sm text-gray-600">Healthy Models</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {healthMetrics.unhealthyModels}
                    </div>
                    <div className="text-sm text-gray-600">Unhealthy Models</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {healthMetrics.averageResponseTime}ms
                    </div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Loading health metrics...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache">
          <Card>
            <CardHeader>
              <CardTitle>Cache Analytics</CardTitle>
              <CardDescription>AI response caching performance and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {cacheMetrics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{cacheMetrics.cacheSize}</div>
                      <div className="text-sm text-gray-600">Cached Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{cacheMetrics.cacheHits}</div>
                      <div className="text-sm text-gray-600">Cache Hits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{cacheMetrics.totalRequests}</div>
                      <div className="text-sm text-gray-600">Total Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{cacheMetrics.cacheHitRate}%</div>
                      <div className="text-sm text-gray-600">Hit Rate</div>
                    </div>
                  </div>
                  
                  {cacheMetrics.oldestCacheEntry && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Oldest cache entry: {new Date(cacheMetrics.oldestCacheEntry).toLocaleString()}</p>
                      <p>Newest cache entry: {new Date(cacheMetrics.newestCacheEntry).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">Loading cache metrics...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>AI usage costs and spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {costReport ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">${costReport.totalCost.toFixed(4)}</div>
                      <div className="text-sm text-gray-600">Total Cost (30d)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{costReport.totalRequests}</div>
                      <div className="text-sm text-gray-600">Total Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">${costReport.averageCostPerRequest.toFixed(6)}</div>
                      <div className="text-sm text-gray-600">Avg Cost/Request</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{costReport.successfulRequests}</div>
                      <div className="text-sm text-gray-600">Successful Requests</div>
                    </div>
                  </div>

                  {Object.keys(costReport.costByModel).length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Cost by Model</h4>
                      <div className="space-y-2">
                        {Object.entries(costReport.costByModel).map(([model, cost]) => (
                          <div key={model} className="flex justify-between">
                            <span>{model}</span>
                            <span>${(cost as number).toFixed(6)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">Loading cost metrics...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
