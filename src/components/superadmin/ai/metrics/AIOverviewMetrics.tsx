
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Activity, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AIAgent } from '@/types/ai';

interface AIOverviewMetricsProps {
  agents: AIAgent[];
  aggregatedMetrics: {
    totalRequests: number;
    totalSuccessfulRequests: number;
    totalFailedRequests: number;
    overallSuccessRate: number;
    averageResponseTime: number;
    totalCost: number;
    averageAccuracy: number;
    averageUserSatisfaction: number;
  };
}

export const AIOverviewMetrics: React.FC<AIOverviewMetricsProps> = ({
  agents,
  aggregatedMetrics
}) => {
  const activeAgents = agents.filter(agent => agent.is_active).length;
  const agentsByType = agents.reduce((acc, agent) => {
    acc[agent.type] = (acc[agent.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(cost);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Agent Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAgents} active, {agents.length - activeAgents} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aggregatedMetrics.overallSuccessRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(aggregatedMetrics.totalSuccessfulRequests)} successful requests
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
              Across all agents
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
              {formatCost(aggregatedMetrics.totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(aggregatedMetrics.totalRequests)} total requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agent Distribution by Type</CardTitle>
          <CardDescription>
            Overview of different agent types in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(agentsByType).map(([type, count]) => (
              <Badge key={type} variant="outline" className="flex items-center gap-1">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                  {count}
                </span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(aggregatedMetrics.averageAccuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(aggregatedMetrics.averageUserSatisfaction * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on user feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(aggregatedMetrics.totalFailedRequests)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((aggregatedMetrics.totalFailedRequests / aggregatedMetrics.totalRequests) * 100).toFixed(1)}% failure rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
