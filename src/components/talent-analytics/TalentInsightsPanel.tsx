
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useTalentInsights } from '@/hooks/talent-analytics/useTalentInsights';

const TalentInsightsPanel: React.FC = () => {
  const { data: insights, isLoading } = useTalentInsights();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'negative': return TrendingDown;
      case 'trending': return TrendingUp;
      default: return Sparkles;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'trending': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Generated Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights?.map((insight) => {
          const IconComponent = getInsightIcon(insight.type);
          return (
            <Card key={insight.id} className={`border-2 ${getInsightColor(insight.type)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {insight.generatedAt}
                  </div>
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skills Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Skills Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              AI has identified critical skill gaps in your talent pool:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h4 className="font-medium text-red-600 mb-2">High Priority</h4>
                <ul className="text-sm space-y-1">
                  <li>• Machine Learning</li>
                  <li>• Cloud Architecture</li>
                  <li>• Data Science</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium text-yellow-600 mb-2">Medium Priority</h4>
                <ul className="text-sm space-y-1">
                  <li>• DevOps</li>
                  <li>• Product Management</li>
                  <li>• UX Design</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium text-green-600 mb-2">Low Priority</h4>
                <ul className="text-sm space-y-1">
                  <li>• Project Management</li>
                  <li>• Marketing</li>
                  <li>• Sales</li>
                </ul>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talent Retention Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Retention Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">High Risk Employees</h4>
              <div className="space-y-2">
                {[
                  { name: 'Sarah Johnson', risk: 85, role: 'Senior Developer' },
                  { name: 'Mike Chen', risk: 78, role: 'Data Scientist' },
                  { name: 'Alex Rodriguez', risk: 72, role: 'Product Manager' }
                ].map((employee, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium text-sm">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.role}</div>
                    </div>
                    <Badge variant="destructive">{employee.risk}% risk</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-sm">Schedule 1:1 Meetings</div>
                  <div className="text-xs text-muted-foreground">With high-risk employees</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-sm">Offer Professional Development</div>
                  <div className="text-xs text-muted-foreground">Skills training opportunities</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="font-medium text-sm">Review Compensation</div>
                  <div className="text-xs text-muted-foreground">Market analysis recommended</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentInsightsPanel;
