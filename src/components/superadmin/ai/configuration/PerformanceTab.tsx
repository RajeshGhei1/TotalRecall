
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface PerformanceTabProps {
  performanceWeights?: {
    accuracy: number;
    speed: number;
    cost: number;
  };
  onPerformanceWeightsChange?: (weights: { accuracy: number; speed: number; cost: number }) => void;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  performanceWeights = { accuracy: 0.5, speed: 0.3, cost: 0.2 },
  onPerformanceWeightsChange
}) => {
  const handleWeightChange = (key: keyof typeof performanceWeights, value: number) => {
    if (onPerformanceWeightsChange) {
      onPerformanceWeightsChange({
        ...performanceWeights,
        [key]: value / 100
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Weights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Accuracy Weight: {(performanceWeights.accuracy * 100).toFixed(0)}%</Label>
            <Slider
              value={[performanceWeights.accuracy * 100]}
              onValueChange={([value]) => handleWeightChange('accuracy', value)}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Speed Weight: {(performanceWeights.speed * 100).toFixed(0)}%</Label>
            <Slider
              value={[performanceWeights.speed * 100]}
              onValueChange={([value]) => handleWeightChange('speed', value)}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Cost Weight: {(performanceWeights.cost * 100).toFixed(0)}%</Label>
            <Slider
              value={[performanceWeights.cost * 100]}
              onValueChange={([value]) => handleWeightChange('cost', value)}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
