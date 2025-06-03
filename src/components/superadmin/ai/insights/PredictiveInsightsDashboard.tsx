
import React from 'react';
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import {
  BarChart,
  Brain,
  Calendar,
  Eye,
  Zap,
  ThumbsUp,
} from 'lucide-react';

export const PredictiveInsightsDashboard: React.FC = () => {
  const { learningInsights } = useUnifiedAIOrchestration();
  
  // This is placeholder data - in a real implementation, we would get actual insights
  const placeholderInsights = [
    {
      id: 'insight-1',
      title: 'Increased Support Requests',
      description: 'Predicted 15% increase in support tickets over the next week',
      confidence: 0.87,
      type: 'trend',
      module: 'support',
      timestamp: '2025-06-01T10:30:00Z'
    },
    {
      id: 'insight-2',
      title: 'User Engagement Pattern',
      description: 'Users most active on Tuesdays and Thursdays between 2-4pm',
      confidence: 0.92,
      type: 'pattern',
      module: 'analytics',
      timestamp: '2025-06-02T15:45:00Z'
    },
    {
      id: 'insight-3',
      title: 'Content Performance',
      description: 'Video content generating 3x more engagement than text',
      confidence: 0.84,
      type: 'analysis',
      module: 'content',
      timestamp: '2025-06-02T09:15:00Z'
    }
  ];

  // Context insights that could be used in a real implementation
  const { context } = learningInsights;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold">Predictive Insights</h2>
          <p className="text-sm text-gray-600">
            AI-generated insights and predictions to enhance decision-making
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Generate New Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Insights</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{placeholderInsights.length}</div>
            <p className="text-xs text-muted-foreground">
              Active predictive insights
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(placeholderInsights.reduce((sum, i) => sum + i.confidence, 0) / placeholderInsights.length * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Prediction confidence level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules Covered</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(placeholderInsights.map(i => i.module)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Business areas with insights
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Latest Predictive Insights</CardTitle>
          <CardDescription>
            AI-generated insights to help optimize operations and decision-making
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {placeholderInsights.map((insight) => (
              <div key={insight.id} className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      {insight.type === 'trend' ? (
                        <BarChart className="h-4 w-4 text-blue-600" />
                      ) : insight.type === 'pattern' ? (
                        <Brain className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Zap className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <h3 className="font-medium">{insight.title}</h3>
                  </div>
                  <Badge variant="outline">
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <div className="p-4">
                  <p className="text-sm mb-3">{insight.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="capitalize">{insight.module}</span>
                    <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="bg-gray-50 border-t px-4 py-2 flex justify-between">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trending Patterns</CardTitle>
            <CardDescription>
              Recently identified patterns and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-md">
                <div className="flex-grow">
                  <h4 className="font-medium">Weekly Usage Pattern</h4>
                  <p className="text-sm text-gray-600">
                    Usage peaks on Wednesday afternoons
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  88% confidence
                </Badge>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-md">
                <div className="flex-grow">
                  <h4 className="font-medium">Resource Optimization</h4>
                  <p className="text-sm text-gray-600">
                    25% potential efficiency increase identified
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  74% confidence
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Actions</CardTitle>
            <CardDescription>
              AI-suggested actions based on insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-amber-50 rounded-md">
                <div className="p-2 bg-amber-100 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">Prepare Support Team</h4>
                  <p className="text-sm text-gray-600">
                    Increase support staff for predicted ticket surge
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Schedule
                </Button>
              </div>
              
              <div className="flex items-center p-3 bg-purple-50 rounded-md">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">Optimize Email Schedule</h4>
                  <p className="text-sm text-gray-600">
                    Send emails during peak engagement times
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Implement
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
