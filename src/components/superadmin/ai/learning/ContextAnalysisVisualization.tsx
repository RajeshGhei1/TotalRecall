
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';

export const ContextAnalysisVisualization: React.FC = () => {
  const { learningInsights } = useUnifiedAIOrchestration();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Context Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Improvement Areas</h4>
              <div className="space-y-2">
                {learningInsights.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{area}</span>
                    <span className="text-sm text-muted-foreground">Priority</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
