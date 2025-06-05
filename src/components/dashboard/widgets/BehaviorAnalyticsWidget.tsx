
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Activity, Brain } from 'lucide-react';
import { useBehavioralAnalytics } from '@/hooks/ai/useBehavioralAnalytics';

interface BehaviorAnalyticsWidgetProps {
  userId?: string;
  className?: string;
}

export const BehaviorAnalyticsWidget: React.FC<BehaviorAnalyticsWidgetProps> = ({
  userId = 'demo-user',
  className = ''
}) => {
  const { behaviorAnalysis, isAIEnhanced, analysisLoading } = useBehavioralAnalytics();

  if (analysisLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Behavior Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const efficiencyScore = Math.round(Math.random() * 40 + 60); // Mock efficiency score
  const engagementScore = Math.round(Math.random() * 30 + 70); // Mock engagement score

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Behavior Analytics
        </CardTitle>
        <CardDescription>
          AI-powered insights into user behavior patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">AI Status</span>
          <Badge variant={isAIEnhanced ? "default" : "secondary"}>
            {isAIEnhanced ? "Enhanced" : "Basic"}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Total Interactions</span>
            </div>
            <span className="font-semibold">{behaviorAnalysis?.totalInteractions || 0}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Efficiency Score</span>
              <span className="text-sm font-medium">{efficiencyScore}%</span>
            </div>
            <Progress value={efficiencyScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Engagement Score</span>
              <span className="text-sm font-medium">{engagementScore}%</span>
            </div>
            <Progress value={engagementScore} className="h-2" />
          </div>
        </div>

        {/* Recent Insights */}
        {behaviorAnalysis?.insights && behaviorAnalysis.insights.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Latest Insight</h4>
            <p className="text-xs text-muted-foreground">
              {behaviorAnalysis.insights[0]}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t pt-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs text-muted-foreground">
              {behaviorAnalysis?.recommendations?.length || 0} recommendations available
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
