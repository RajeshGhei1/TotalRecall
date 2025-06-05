
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { workflowOptimizerService, bottleneckDetectorService } from '@/services/ai/workflow';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface WorkflowHealth {
  overallScore: number;
  activeWorkflows: number;
  bottlenecks: number;
  optimizationOpportunities: number;
  averageExecutionTime: number;
  successRate: number;
}

interface WorkflowHealthWidgetProps {
  tenantId?: string;
}

const WorkflowHealthWidget: React.FC<WorkflowHealthWidgetProps> = ({ tenantId }) => {
  const [healthData, setHealthData] = useState<WorkflowHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowHealth();
  }, [tenantId]);

  const fetchWorkflowHealth = async () => {
    setIsLoading(true);
    try {
      // Simulate fetching workflow health data
      const mockData: WorkflowHealth = {
        overallScore: Math.round(Math.random() * 30 + 70), // 70-100
        activeWorkflows: Math.round(Math.random() * 15 + 5), // 5-20
        bottlenecks: Math.round(Math.random() * 3), // 0-3
        optimizationOpportunities: Math.round(Math.random() * 5 + 2), // 2-7
        averageExecutionTime: Math.round(Math.random() * 120 + 30), // 30-150 seconds
        successRate: Math.round((Math.random() * 10 + 90) * 100) / 100 // 90-100%
      };
      
      setHealthData(mockData);
    } catch (error) {
      console.error('Error fetching workflow health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Attention', color: 'bg-red-100 text-red-800' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Workflow Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Workflow Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load workflow health data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthStatus = getHealthStatus(healthData.overallScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Workflow Health
          </div>
          <Badge className={healthStatus.color}>
            {healthStatus.label}
          </Badge>
        </CardTitle>
        <CardDescription>
          Real-time monitoring of your workflow performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Health Score</span>
            <span className={`text-2xl font-bold ${getHealthColor(healthData.overallScore)}`}>
              {healthData.overallScore}%
            </span>
          </div>
          <Progress value={healthData.overallScore} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Active Workflows</span>
            </div>
            <p className="text-lg font-semibold">{healthData.activeWorkflows}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Avg. Execution</span>
            </div>
            <p className="text-lg font-semibold">{healthData.averageExecutionTime}s</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">Bottlenecks</span>
            </div>
            <p className="text-lg font-semibold">{healthData.bottlenecks}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Success Rate</span>
            </div>
            <p className="text-lg font-semibold">{healthData.successRate}%</p>
          </div>
        </div>

        {healthData.optimizationOpportunities > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {healthData.optimizationOpportunities} optimization opportunities
              </span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowHealthWidget;
