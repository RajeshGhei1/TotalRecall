
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Clock, 
  Target,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Activity
} from 'lucide-react';
import { enhancedBehavioralService } from '@/services/ai/behavioralService/enhancedBehavioralService';
import { useBehavioralAnalytics } from '@/hooks/ai/useBehavioralAnalytics';

interface BehaviorMetrics {
  totalInteractions: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  topActions: Array<{ action: string; count: number }>;
  conversionRate: number;
  anomalies: Array<{ type: string; severity: string; description: string }>;
}

interface UserJourney {
  userId: string;
  steps: Array<{
    module: string;
    action: string;
    timestamp: number;
    duration: number;
  }>;
  outcome: string;
  efficiency: number;
}

export const BehaviorAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics | null>(null);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { behaviorAnalysis } = useBehavioralAnalytics();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBehaviorMetrics({
        totalInteractions: 15420,
        uniqueUsers: 1230,
        avgSessionDuration: 18.5,
        topActions: [
          { action: 'form_interaction', count: 3450 },
          { action: 'navigation', count: 2890 },
          { action: 'click', count: 2340 },
          { action: 'search', count: 1890 },
          { action: 'scroll', count: 1650 }
        ],
        conversionRate: 0.68,
        anomalies: [
          {
            type: 'performance',
            severity: 'medium',
            description: '15% increase in page load time for mobile users'
          },
          {
            type: 'behavior',
            severity: 'low',
            description: 'Unusual spike in form abandonment rate'
          }
        ]
      });

      // Mock user journeys
      setUserJourneys([
        {
          userId: 'user_1',
          steps: [
            { module: 'dashboard', action: 'view', timestamp: Date.now() - 3600000, duration: 120 },
            { module: 'companies', action: 'list', timestamp: Date.now() - 3480000, duration: 200 },
            { module: 'companies', action: 'create', timestamp: Date.now() - 3280000, duration: 450 }
          ],
          outcome: 'completed',
          efficiency: 0.85
        }
      ]);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{behaviorMetrics?.totalInteractions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +12.5% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{behaviorMetrics?.uniqueUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +8.2% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{behaviorMetrics?.avgSessionDuration}m</div>
          <p className="text-xs text-muted-foreground">
            +5.1% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round((behaviorMetrics?.conversionRate || 0) * 100)}%</div>
          <p className="text-xs text-muted-foreground">
            +3.2% from last period
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderPatternsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top User Actions
          </CardTitle>
          <CardDescription>Most frequent user interactions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {behaviorMetrics?.topActions.map((action, index) => (
              <div key={action.action} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium capitalize">{action.action.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-500">{action.count.toLocaleString()} interactions</div>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(action.count / (behaviorMetrics?.topActions[0]?.count || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Detected Patterns
          </CardTitle>
          <CardDescription>Behavioral patterns identified by our AI system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Badge variant="secondary" className="bg-green-100 text-green-800">High Confidence</Badge>
              <span className="text-sm">Users who complete onboarding are 3x more likely to return</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pattern</Badge>
              <span className="text-sm">Mobile users prefer simplified navigation flows</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Trend</Badge>
              <span className="text-sm">Peak activity occurs between 10-11 AM and 2-3 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderJourneysTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            User Journey Analysis
          </CardTitle>
          <CardDescription>Common paths users take through the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userJourneys.map((journey, index) => (
              <div key={journey.userId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Journey #{index + 1}</span>
                    <Badge 
                      variant={journey.outcome === 'completed' ? 'default' : 'secondary'}
                      className={journey.outcome === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {journey.outcome}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Efficiency: {Math.round(journey.efficiency * 100)}%
                  </div>
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {journey.steps.map((step, stepIndex) => (
                    <React.Fragment key={stepIndex}>
                      <div className="flex flex-col items-center min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium mb-1">
                          {stepIndex + 1}
                        </div>
                        <div className="text-xs text-center">
                          <div className="font-medium">{step.module}</div>
                          <div className="text-gray-500">{step.action}</div>
                          <div className="text-gray-400">{step.duration}s</div>
                        </div>
                      </div>
                      {stepIndex < journey.steps.length - 1 && (
                        <div className="w-6 h-0.5 bg-gray-300 mt-4" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnomaliesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Behavioral Anomalies
          </CardTitle>
          <CardDescription>Unusual patterns and potential issues detected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {behaviorMetrics?.anomalies.map((anomaly, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  anomaly.severity === 'high' ? 'bg-red-500' :
                  anomaly.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="capitalize">
                      {anomaly.type}
                    </Badge>
                    <Badge 
                      variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}
                      className={
                        anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''
                      }
                    >
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{anomaly.description}</p>
                </div>
                <Button size="sm" variant="outline">
                  Investigate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Suggested improvements based on behavior analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-sm mb-1">Optimize Mobile Experience</div>
              <div className="text-sm text-gray-600">
                Consider implementing touch-friendly navigation for mobile users who show 23% higher bounce rates
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-sm mb-1">Streamline Onboarding</div>
              <div className="text-sm text-gray-600">
                Users who complete guided onboarding have 40% higher engagement. Consider mandatory tutorials
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-sm mb-1">Personalize Dashboard</div>
              <div className="text-sm text-gray-600">
                Users spend 60% more time on personalized dashboards. Implement user preference tracking
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading behavior analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Behavior Analytics Dashboard</h1>
          <p className="text-gray-600">AI-powered insights into user behavior and patterns</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={loadAnalyticsData} variant="outline">
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          {renderPatternsTab()}
        </TabsContent>

        <TabsContent value="journeys" className="mt-6">
          {renderJourneysTab()}
        </TabsContent>

        <TabsContent value="anomalies" className="mt-6">
          {renderAnomaliesTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
