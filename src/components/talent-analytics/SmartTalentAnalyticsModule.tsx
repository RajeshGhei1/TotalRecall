
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Brain,
  Zap,
  Eye,
  Calendar
} from 'lucide-react';

const SmartTalentAnalyticsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const analyticsMetrics = [
    { label: 'Talent Pool Size', value: '1,247', change: '+8.2%', icon: Users },
    { label: 'AI Match Score Avg', value: '87.3', change: '+5.1%', icon: Brain },
    { label: 'Hiring Velocity', value: '12 days', change: '-2.3 days', icon: Zap },
    { label: 'Success Rate', value: '94.2%', change: '+3.8%', icon: Target }
  ];

  const talentInsights = [
    {
      title: 'High-Potential Candidates',
      count: 23,
      description: 'Candidates with 90+ AI match scores',
      trend: 'up',
      change: '+15%'
    },
    {
      title: 'Skills Gap Analysis',
      count: 7,
      description: 'Critical skills missing in current pipeline',
      trend: 'down',
      change: '-3'
    },
    {
      title: 'Market Opportunities',
      count: 12,
      description: 'Emerging talent pools to explore',
      trend: 'up',
      change: '+4'
    }
  ];

  const predictivePatterns = [
    {
      pattern: 'Remote Work Preference',
      probability: '78%',
      impact: 'High',
      candidates: 234
    },
    {
      pattern: 'Career Growth Seekers',
      probability: '65%', 
      impact: 'Medium',
      candidates: 156
    },
    {
      pattern: 'Technology Early Adopters',
      probability: '82%',
      impact: 'High', 
      candidates: 89
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{metric.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Talent Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {talentInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{insight.count} items</Badge>
                      <span className={`text-sm ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {insight.change}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictivePatterns.map((pattern, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{pattern.pattern}</span>
                    <Badge className={pattern.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {pattern.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{pattern.candidates} candidates</span>
                    <span className="font-medium text-blue-600">{pattern.probability}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: pattern.probability }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Advanced AI Insights</h3>
            <p>Deep talent analytics and predictive insights coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPatterns = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Pattern Analysis</h3>
            <p>Talent behavior patterns and trends analysis coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Predictive Models</h3>
            <p>AI-powered talent predictions and forecasting coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="insights">AI Insights</TabsTrigger>
        <TabsTrigger value="patterns">Patterns</TabsTrigger>
        <TabsTrigger value="predictions">Predictions</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-6">
        {renderDashboard()}
      </TabsContent>

      <TabsContent value="insights" className="mt-6">
        {renderInsights()}
      </TabsContent>

      <TabsContent value="patterns" className="mt-6">
        {renderPatterns()}
      </TabsContent>

      <TabsContent value="predictions" className="mt-6">
        {renderPredictions()}
      </TabsContent>
    </Tabs>
  );
};

export default SmartTalentAnalyticsModule;
