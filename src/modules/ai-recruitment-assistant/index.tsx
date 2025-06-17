
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Search,
  Zap,
  Brain,
  Target
} from 'lucide-react';

interface AIRecruitmentAssistantProps {
  mode?: 'full' | 'assistant' | 'insights' | 'automation';
  showAnalytics?: boolean;
  enableAutomation?: boolean;
}

const AIRecruitmentAssistant: React.FC<AIRecruitmentAssistantProps> = ({
  mode = 'full',
  showAnalytics = true,
  enableAutomation = true
}) => {
  const [activeTab, setActiveTab] = useState('assistant');
  const [query, setQuery] = useState('');

  const aiInsights = [
    {
      type: 'candidate_match',
      title: 'High-Quality Match Found',
      description: 'Sarah Johnson has 95% compatibility with Senior Developer role',
      confidence: 95,
      action: 'Schedule Interview'
    },
    {
      type: 'market_trend',
      title: 'Salary Trend Alert',
      description: 'React Developer salaries increased 8% in your region',
      confidence: 88,
      action: 'Adjust Job Posting'
    },
    {
      type: 'talent_shortage',
      title: 'Talent Shortage Detected',
      description: 'Limited Python developers available in current market',
      confidence: 92,
      action: 'Expand Search'
    }
  ];

  const automationRules = [
    {
      id: '1',
      name: 'Auto-Screen Candidates',
      description: 'Automatically screen candidates based on minimum requirements',
      status: 'active',
      triggered: 45
    },
    {
      id: '2',
      name: 'Send Interview Invites',
      description: 'Auto-send interview invitations to qualified candidates',
      status: 'active',
      triggered: 23
    },
    {
      id: '3',
      name: 'Update Job Posting',
      description: 'Automatically update job postings based on market trends',
      status: 'paused',
      triggered: 12
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab);
  };

  const renderAssistant = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Recruitment Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Ask me anything about recruitment, candidates, or market trends..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Ask AI
              </Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">💡 Suggested Questions:</h4>
              <div className="space-y-1 text-sm">
                <div className="cursor-pointer hover:text-blue-600">• "Show me the best candidates for the React Developer position"</div>
                <div className="cursor-pointer hover:text-blue-600">• "What's the market rate for Product Managers in San Francisco?"</div>
                <div className="cursor-pointer hover:text-blue-600">• "Help me write a job description for a UX Designer"</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.slice(0, 3).map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge className={getConfidenceColor(insight.confidence)}>
                      {insight.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  <Button size="sm" variant="outline">
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Candidate Match Accuracy</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Time Saved This Week</span>
                <span className="font-medium">12.5 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Successful Placements</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cost Reduction</span>
                <span className="font-medium text-green-600">35%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Insights Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actions Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+45%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">{insight.title}</h4>
                  </div>
                  <Badge className={getConfidenceColor(insight.confidence)}>
                    {insight.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex gap-2">
                  <Button size="sm">{insight.action}</Button>
                  <Button size="sm" variant="outline">Learn More</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Automation Rules</h3>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="space-y-4">
        {automationRules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{rule.name}</h3>
                    <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                      {rule.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{rule.description}</p>
                  <div className="text-sm text-muted-foreground">
                    Triggered {rule.triggered} times this month
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button 
                    variant={rule.status === 'active' ? 'secondary' : 'default'} 
                    size="sm"
                  >
                    {rule.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (mode === 'assistant') {
    return renderAssistant();
  }

  if (mode === 'insights') {
    return renderInsights();
  }

  if (mode === 'automation') {
    return renderAutomation();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Recruitment Assistant</h1>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Configure AI
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="assistant">Assistant</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          {enableAutomation && (
            <TabsTrigger value="automation">Automation</TabsTrigger>
          )}
          {showAnalytics && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="assistant" className="mt-6">
          {renderAssistant()}
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          {renderInsights()}
        </TabsContent>

        {enableAutomation && (
          <TabsContent value="automation" className="mt-6">
            {renderAutomation()}
          </TabsContent>
        )}

        {showAnalytics && (
          <TabsContent value="analytics" className="mt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">AI Analytics</h3>
              <p className="text-muted-foreground">Advanced AI performance analytics coming soon</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Module metadata for registration
(AIRecruitmentAssistant as any).moduleMetadata = {
  id: 'ai-recruitment-assistant',
  name: 'AI Recruitment Assistant',
  category: 'recruitment',
  version: '1.0.0',
  description: 'AI-powered recruitment assistant with insights, automation, and candidate matching',
  author: 'System',
  requiredPermissions: ['read', 'write', 'ai_access'],
  dependencies: ['ats-core'],
  props: {
    mode: { type: 'string', options: ['full', 'assistant', 'insights', 'automation'], default: 'full' },
    showAnalytics: { type: 'boolean', default: true },
    enableAutomation: { type: 'boolean', default: true }
  }
};

export default AIRecruitmentAssistant;
