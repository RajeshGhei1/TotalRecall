
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { useAIPerformance } from '@/hooks/ai/useAIPerformance';
import {
  BarChart,
  Clock, 
  Brain,
  DollarSign,
  AreaChart,
  Database,
  Workflow,
  Activity,
  LineChart
} from 'lucide-react';

export const EnhancedAIMetrics: React.FC = () => {
  const { metrics } = useUnifiedAIOrchestration();
  const { performanceMetrics, aggregatedMetrics } = useAIPerformance();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">AI Performance Metrics</h2>
        <p className="text-sm text-gray-600">
          Comprehensive metrics tracking AI system performance, usage, and efficiency
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalRequests)}</div>
            <p className="text-xs text-muted-foreground">
              Processed AI requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(metrics.cacheHits)} cache hits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(aggregatedMetrics.averageResponseTime)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Average processing time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${aggregatedMetrics.totalCost.toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated API costs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="caching">Caching</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={() => setTimeframe('day')}
            className={`text-xs px-3 py-1 rounded-md ${
              timeframe === 'day' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`text-xs px-3 py-1 rounded-md ${
              timeframe === 'week' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`text-xs px-3 py-1 rounded-md ${
              timeframe === 'month' ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
            }`}
          >
            Month
          </button>
        </div>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LineChart className="h-5 w-5 text-blue-500" />
                  Response Time Metrics
                </CardTitle>
                <CardDescription>
                  Average response times across agents and operations
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* This would be a chart in a real implementation */}
                <div className="h-full flex items-center justify-center border rounded-md bg-slate-50">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Response Time Chart</p>
                    <p className="text-xs text-gray-400 mt-1">Response time trending data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Success Rates
                </CardTitle>
                <CardDescription>
                  Request success and completion metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* This would be a chart in a real implementation */}
                <div className="h-full flex items-center justify-center border rounded-md bg-slate-50">
                  <div className="text-center">
                    <Activity className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Success Rate Chart</p>
                    <p className="text-xs text-gray-400 mt-1">Success vs. failure trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart className="h-5 w-5 text-green-500" />
                Performance by Agent Type
              </CardTitle>
              <CardDescription>
                Comparative performance across different agent categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Cognitive Agents</h4>
                  <div className="flex justify-between text-xs">
                    <span>Response Time:</span>
                    <span className="font-medium">475ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Success Rate:</span>
                    <span className="font-medium">93.5%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Avg Cost:</span>
                    <span className="font-medium">$0.0012 / request</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Predictive Agents</h4>
                  <div className="flex justify-between text-xs">
                    <span>Response Time:</span>
                    <span className="font-medium">720ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Success Rate:</span>
                    <span className="font-medium">91.2%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Avg Cost:</span>
                    <span className="font-medium">$0.0018 / request</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Automation Agents</h4>
                  <div className="flex justify-between text-xs">
                    <span>Response Time:</span>
                    <span className="font-medium">390ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Success Rate:</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Avg Cost:</span>
                    <span className="font-medium">$0.0008 / request</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AreaChart className="h-5 w-5 text-blue-500" />
                Request Volume
              </CardTitle>
              <CardDescription>
                AI request volume trends over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* This would be a chart in a real implementation */}
              <div className="h-full flex items-center justify-center border rounded-md bg-slate-50">
                <div className="text-center">
                  <AreaChart className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Request Volume Chart</p>
                  <p className="text-xs text-gray-400 mt-1">Request volume by time period</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Workflow className="h-5 w-5 text-purple-500" />
                  Usage by Module
                </CardTitle>
                <CardDescription>
                  AI usage distribution across system modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Dashboard Module</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Recruitment</span>
                      <span className="font-medium">27%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '27%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Forms</span>
                      <span className="font-medium">21%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '21%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Workflows</span>
                      <span className="font-medium">14%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Other</span>
                      <span className="font-medium">6%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-gray-500 h-full rounded-full" style={{ width: '6%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-amber-500" />
                  Agent Utilization
                </CardTitle>
                <CardDescription>
                  Usage distribution across AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Cognitive Assistant</span>
                      <span className="font-medium">41%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '41%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Predictive Analytics</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Workflow Automation</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Data Analysis</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Deep Research</span>
                      <span className="font-medium">6%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '6%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Cost Analysis
                </CardTitle>
                <CardDescription>
                  AI cost metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* This would be a chart in a real implementation */}
                <div className="h-full flex items-center justify-center border rounded-md bg-slate-50">
                  <div className="text-center">
                    <BarChart className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Cost Analysis Chart</p>
                    <p className="text-xs text-gray-400 mt-1">Cost trends by time period</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5 text-blue-500" />
                  Token Usage
                </CardTitle>
                <CardDescription>
                  Token consumption and efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Total Tokens Used</span>
                      <span className="text-sm">1.28M</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-600">
                      <span>Monthly Budget: 3M tokens</span>
                      <span>42% used</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Input Tokens</span>
                        <span className="font-medium">720k</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '56%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Output Tokens</span>
                        <span className="font-medium">560k</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '44%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Token Efficiency by Model</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>GPT-4o-mini</span>
                        <span>$0.0012 / request</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>GPT-4o</span>
                        <span>$0.0087 / request</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Claude Sonnet</span>
                        <span>$0.0062 / request</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="caching">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5 text-purple-500" />
                  Cache Performance
                </CardTitle>
                <CardDescription>
                  AI request caching metrics and efficiency
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* This would be a chart in a real implementation */}
                <div className="h-full flex items-center justify-center border rounded-md bg-slate-50">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Cache Hit Rate Chart</p>
                    <p className="text-xs text-gray-400 mt-1">Cache performance over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-green-500" />
                  Cache Metrics
                </CardTitle>
                <CardDescription>
                  Detailed caching statistics and savings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium">Cache Size</h4>
                      <div className="text-xl font-bold">{metrics.cacheHits}</div>
                      <p className="text-xs text-gray-600">Cached responses</p>
                    </div>

                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium">Hit Rate</h4>
                      <div className="text-xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
                      <p className="text-xs text-gray-600">Average cache hit rate</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Estimated Cost Savings</h4>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xl font-bold">$14.82</div>
                        <p className="text-xs text-gray-600">This month</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold">$365.20</div>
                        <p className="text-xs text-gray-600">Projected annual</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Cache Hit Rate by Module</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Dashboard</span>
                        <span>62.3%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Recruitment</span>
                        <span>48.7%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Forms</span>
                        <span>75.2%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Workflows</span>
                        <span>33.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
