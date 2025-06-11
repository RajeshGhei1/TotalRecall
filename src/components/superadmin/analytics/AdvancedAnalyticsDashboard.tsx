
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Download, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock analytics data
  const performanceData: AnalyticsData[] = [
    { name: 'Jan', value: 4000, change: 12 },
    { name: 'Feb', value: 3000, change: -5 },
    { name: 'Mar', value: 2000, change: 8 },
    { name: 'Apr', value: 2780, change: 15 },
    { name: 'May', value: 1890, change: -3 },
    { name: 'Jun', value: 2390, change: 20 }
  ];

  const userEngagementData: AnalyticsData[] = [
    { name: 'Active Users', value: 1247, trend: 'up' },
    { name: 'New Signups', value: 89, trend: 'up' },
    { name: 'Session Duration', value: 24, trend: 'stable' },
    { name: 'Bounce Rate', value: 15, trend: 'down' }
  ];

  const moduleUsageData = [
    { name: 'AI Orchestration', value: 35, color: '#3b82f6' },
    { name: 'Talent Management', value: 25, color: '#10b981' },
    { name: 'Forms', value: 20, color: '#f59e0b' },
    { name: 'Analytics', value: 12, color: '#ef4444' },
    { name: 'Security', value: 8, color: '#8b5cf6' }
  ];

  const predictiveInsights = [
    {
      id: '1',
      title: 'User Growth Projection',
      prediction: '+23% increase expected in next quarter',
      confidence: 87,
      impact: 'high'
    },
    {
      id: '2',
      title: 'System Performance',
      prediction: 'Response time may increase by 15% during peak hours',
      confidence: 72,
      impact: 'medium'
    },
    {
      id: '3',
      title: 'Feature Adoption',
      prediction: 'AI features adoption rate to reach 65% by month end',
      confidence: 91,
      impact: 'high'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Deep insights and predictive analytics for your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {userEngagementData.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metric.value.toLocaleString()}</span>
                <span className="text-lg">{getTrendIcon(metric.trend || 'stable')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
                <CardDescription>Monthly performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Module Usage Distribution
                </CardTitle>
                <CardDescription>Usage breakdown by module</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moduleUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moduleUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Performance Trends
              </CardTitle>
              <CardDescription>Real-time performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Powered Predictions
              </CardTitle>
              <CardDescription>
                Machine learning insights and forecasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.prediction}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Confidence: {insight.confidence}%
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create custom analytics reports and dashboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Custom Report Builder</h3>
                <p className="mb-4">Build custom analytics reports tailored to your needs</p>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Create Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
