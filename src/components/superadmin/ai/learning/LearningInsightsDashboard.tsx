
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';

export const LearningInsightsDashboard: React.FC = () => {
  const { learningInsights } = useUnifiedAIOrchestration();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{(learningInsights.combinedScore * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{(learningInsights.accuracy * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{(learningInsights.userSatisfaction * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
