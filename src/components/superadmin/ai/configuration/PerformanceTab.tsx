
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PerformanceWeights {
  accuracy: number;
  speed: number;
  cost: number;
}

interface PerformanceTabProps {
  performanceWeights: PerformanceWeights;
  onPerformanceWeightsChange: (weights: PerformanceWeights) => void;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({
  performanceWeights,
  onPerformanceWeightsChange
}) => {
  const updateWeight = (key: keyof PerformanceWeights, value: number) => {
    onPerformanceWeightsChange({
      ...performanceWeights,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Performance Weights (for dynamic selection)</Label>
        <div className="space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Accuracy</span>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={performanceWeights.accuracy}
                onChange={(e) => updateWeight('accuracy', parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Speed</span>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={performanceWeights.speed}
                onChange={(e) => updateWeight('speed', parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Cost Efficiency</span>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={performanceWeights.cost}
                onChange={(e) => updateWeight('cost', parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
