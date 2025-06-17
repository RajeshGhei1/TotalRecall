
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, Eye, Clock } from 'lucide-react';

interface AnalyticsPanelProps {
  title?: string;
  chartType?: 'bar' | 'line' | 'pie';
  data?: any[];
  showMetrics?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  title = 'Analytics Overview',
  chartType = 'bar',
  data,
  showMetrics = true,
  variant = 'default'
}) => {
  // Sample data if none provided
  const defaultData = [
    { name: 'Jan', value: 400, visitors: 240 },
    { name: 'Feb', value: 300, visitors: 139 },
    { name: 'Mar', value: 200, visitors: 980 },
    { name: 'Apr', value: 278, visitors: 390 },
    { name: 'May', value: 189, visitors: 480 },
    { name: 'Jun', value: 239, visitors: 380 }
  ];

  const chartData = data || defaultData;
  const isCompact = variant === 'compact';

  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  const metrics = [
    { label: 'Total Views', value: '12.4K', icon: Eye, change: '+12.5%' },
    { label: 'Active Users', value: '3.2K', icon: Activity, change: '+8.2%' },
    { label: 'Avg. Time', value: '4m 23s', icon: Clock, change: '+2.1%' },
    { label: 'Growth Rate', value: '15.3%', icon: TrendingUp, change: '+5.4%' }
  ];

  const renderChart = () => {
    const height = isCompact ? 200 : 300;

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {showMetrics && (
        <div className={`grid gap-4 ${isCompact ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {metric.change}
                      </Badge>
                    </div>
                    <IconComponent className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Module metadata for registration
(AnalyticsPanel as any).moduleMetadata = {
  id: 'analytics-panel',
  name: 'Analytics Panel',
  category: 'analytics',
  version: '1.0.0',
  description: 'A comprehensive analytics dashboard component',
  author: 'System',
  requiredPermissions: ['read'],
  props: {
    title: { type: 'string', default: 'Analytics Overview' },
    chartType: { type: 'string', options: ['bar', 'line', 'pie'], default: 'bar' },
    showMetrics: { type: 'boolean', default: true },
    variant: { type: 'string', options: ['default', 'compact', 'detailed'], default: 'default' }
  }
};

export default AnalyticsPanel;
