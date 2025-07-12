
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';

interface WorkflowPerformanceAnalyticsProps {
  tenantId?: string;
}

const WorkflowPerformanceAnalytics: React.FC<WorkflowPerformanceAnalyticsProps> = ({ tenantId }) => {
  const [performanceData, setPerformanceData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [tenantId]);

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    try {
      // Simulate fetching performance data
      const mockData = {
        totalWorkflows: 12,
        activeWorkflows: 8,
        avgExecutionTime: 45, // seconds
        successRate: 94.5,
        timeSaved: 847, // hours
        costSavings: 12450, // dollars
        weeklyTrend: [
          { day: 'Mon', executions: 45, success: 42, avgTime: 38 },
          { day: 'Tue', executions: 52, success: 50, avgTime: 41 },
          { day: 'Wed', executions: 48, success: 46, avgTime: 39 },
          { day: 'Thu', executions: 61, success: 58, avgTime: 44 },
          { day: 'Fri', executions: 55, success: 52, avgTime: 42 },
          { day: 'Sat', executions: 23, success: 22, avgTime: 35 },
          { day: 'Sun', executions: 18, success: 17, avgTime: 33 }
        ],
        topPerformers: [
          { name: 'Employee Onboarding', success: 98.7, executions: 124 },
          { name: 'Document Processing', success: 96.2, executions: 89 },
          { name: 'Candidate Screening', success: 94.8, executions: 156 },
          { name: 'Invoice Approval', success: 92.1, executions: 67 }
        ]
      };
      
      setPerformanceData(mockData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!performanceData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-muted-foreground">Unable to load performance data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{performanceData.totalWorkflows}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {performanceData.activeWorkflows} active
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{performanceData.successRate}%</p>
                <Progress value={performanceData.successRate} className="h-2 mt-2" />
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">{performanceData.timeSaved}h</p>
                <p className="text-xs text-green-600">This month</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold">${performanceData.costSavings.toLocaleString()}</p>
                <p className="text-xs text-green-600">ROI: 340%</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Execution Trends</CardTitle>
            <CardDescription>Workflow executions and success rates over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="executions" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Executions"
                />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Successful"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Workflows</CardTitle>
            <CardDescription>Workflows ranked by success rate and volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.topPerformers.map((workflow: Record<string, unknown>, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{workflow.name}</span>
                      <Badge variant="outline">{workflow.success}%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{workflow.executions} executions</span>
                      <Progress value={workflow.success} className="h-1 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Efficiency Insights</CardTitle>
          <CardDescription>AI-generated recommendations for workflow optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Parallel Processing</h4>
              <p className="text-sm text-blue-700">
                3 workflows could benefit from parallel execution, potentially reducing time by 35%
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Auto-Retry Logic</h4>
              <p className="text-sm text-green-700">
                Adding retry mechanisms could improve success rates by 8% for document processing
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Resource Optimization</h4>
              <p className="text-sm text-orange-700">
                Off-peak scheduling could reduce execution costs by 25% for non-urgent workflows
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowPerformanceAnalytics;
