
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  BarChart3,
  Users,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gauge
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ScalingRecommendation {
  type: 'scale_up' | 'scale_down' | 'optimize' | 'monitor';
  module: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
}

const SimplifiedModuleScaling: React.FC = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { name: 'CPU Usage', value: 45, unit: '%', status: 'good', trend: 'stable' },
    { name: 'Memory Usage', value: 78, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Response Time', value: 234, unit: 'ms', status: 'good', trend: 'down' },
    { name: 'Throughput', value: 1250, unit: 'req/min', status: 'good', trend: 'up' },
    { name: 'Error Rate', value: 0.5, unit: '%', status: 'good', trend: 'stable' },
    { name: 'Active Users', value: 342, unit: 'users', status: 'good', trend: 'up' }
  ]);

  const [scalingRecommendations] = useState<ScalingRecommendation[]>([
    {
      type: 'scale_up',
      module: 'recruitment-ats',
      priority: 'medium',
      description: 'High memory usage detected during peak hours',
      impact: 'Increase memory allocation by 25%'
    },
    {
      type: 'optimize',
      module: 'analytics-dashboard',
      priority: 'low',
      description: 'Query performance can be improved',
      impact: 'Reduce database load by 15%'
    },
    {
      type: 'monitor',
      module: 'ai-processing',
      priority: 'high',
      description: 'CPU spikes during AI model inference',
      impact: 'Monitor for potential scaling needs'
    }
  ]);

  const [autoScalingEnabled, setAutoScalingEnabled] = useState(true);
  const [scalingEvents, setScalingEvents] = useState([
    { time: '14:32', event: 'Auto-scaled recruitment-ats from 2 to 3 instances', type: 'scale_up' },
    { time: '13:45', event: 'Optimized analytics-dashboard query cache', type: 'optimize' },
    { time: '12:18', event: 'Auto-scaled ai-processing from 4 to 3 instances', type: 'scale_down' },
    { time: '11:22', event: 'Performance alert resolved for user-management', type: 'resolved' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 10)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default:
        return <Activity className="h-3 w-3 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleToggleAutoScaling = () => {
    setAutoScalingEnabled(!autoScalingEnabled);
    const newEvent = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      event: `Auto-scaling ${!autoScalingEnabled ? 'enabled' : 'disabled'}`,
      type: 'config'
    };
    setScalingEvents(prev => [newEvent, ...prev.slice(0, 9)]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Module Performance & Scaling
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor performance metrics and manage auto-scaling for your modules
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={autoScalingEnabled ? "default" : "secondary"}>
                  Auto-scaling {autoScalingEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Button size="sm" variant="outline" onClick={handleToggleAutoScaling}>
                  {autoScalingEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="scaling" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Scaling
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  {getStatusIcon(metric.status)}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {metric.value.toFixed(metric.name === 'Error Rate' ? 1 : 0)}
                      <span className="text-sm font-normal ml-1">{metric.unit}</span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  {metric.name.includes('Usage') && (
                    <Progress 
                      value={metric.value} 
                      className="mt-3"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scaling" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scaling Recommendations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-powered recommendations based on current performance
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scalingRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">{rec.module}</Badge>
                        </div>
                        <h4 className="font-medium">{rec.description}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.impact}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm">
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-scaling Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">CPU Threshold</label>
                      <div className="mt-1">
                        <input 
                          type="range" 
                          min="50" 
                          max="90" 
                          defaultValue="75" 
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>50%</span>
                          <span>90%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Memory Threshold</label>
                      <div className="mt-1">
                        <input 
                          type="range" 
                          min="60" 
                          max="95" 
                          defaultValue="80" 
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>60%</span>
                          <span>95%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Scale Up Delay</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md bg-background">
                        <option>30 seconds</option>
                        <option>1 minute</option>
                        <option>2 minutes</option>
                        <option>5 minutes</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Scale Down Delay</label>
                      <select className="w-full mt-1 px-3 py-2 border rounded-md bg-background">
                        <option>5 minutes</option>
                        <option>10 minutes</option>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Connection Pool</span>
                      <span className="text-sm">45/100</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Query Cache Hit Rate</span>
                      <span className="text-sm">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Storage Usage</span>
                      <span className="text-sm">2.3GB / 10GB</span>
                    </div>
                    <Progress value={23} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Compute Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Active Instances</span>
                      <span className="text-sm">12/20</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Load Balancer Health</span>
                      <span className="text-sm">98%</span>
                    </div>
                    <Progress value={98} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Network Bandwidth</span>
                      <span className="text-sm">156 Mbps</span>
                    </div>
                    <Progress value={65} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Module Instance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">ATS Module</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-muted-foreground">Analytics</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-muted-foreground">AI Processing</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm text-muted-foreground">User Mgmt</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Scaling Events
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest auto-scaling actions and performance events
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scalingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground font-mono">
                      {event.time}
                    </div>
                    <div className="flex-1 text-sm">
                      {event.event}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View All Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimplifiedModuleScaling;
