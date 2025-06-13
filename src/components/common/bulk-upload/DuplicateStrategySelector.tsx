
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { DuplicateStrategy, DuplicateAction, MergeOptions } from './types';

interface DuplicateStrategySelectorProps {
  strategy: DuplicateStrategy;
  mergeOptions: MergeOptions;
  onStrategyChange: (strategy: DuplicateStrategy) => void;
  onMergeOptionsChange: (options: MergeOptions) => void;
}

const DuplicateStrategySelector: React.FC<DuplicateStrategySelectorProps> = ({
  strategy,
  mergeOptions,
  onStrategyChange,
  onMergeOptionsChange
}) => {
  const actionOptions: { value: DuplicateAction; label: string; description: string }[] = [
    { value: 'skip', label: 'Skip Duplicates', description: 'Do not import duplicate entries' },
    { value: 'update', label: 'Update Existing', description: 'Replace existing data with new data' },
    { value: 'merge', label: 'Smart Merge', description: 'Intelligently combine old and new data' },
    { value: 'create_anyway', label: 'Create Anyway', description: 'Import as new record despite duplicates' },
    { value: 'review', label: 'Manual Review', description: 'Flag for manual review before processing' }
  ];

  const updateStrategy = (field: keyof DuplicateStrategy, value: any) => {
    onStrategyChange({ ...strategy, [field]: value });
  };

  const updateMergeOptions = (field: keyof MergeOptions, value: boolean) => {
    onMergeOptionsChange({ ...mergeOptions, [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Duplicate Detection Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-action">Default Action</Label>
              <Select 
                value={strategy.primaryAction} 
                onValueChange={(value: DuplicateAction) => updateStrategy('primaryAction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
              <div className="space-y-2">
                <Slider
                  value={[strategy.confidenceThreshold]}
                  onValueChange={([value]) => updateStrategy('confidenceThreshold', value)}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground text-center">
                  {Math.round(strategy.confidenceThreshold * 100)}% confidence required
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email Matches</Label>
              <Select 
                value={strategy.emailMatches} 
                onValueChange={(value: DuplicateAction) => updateStrategy('emailMatches', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Phone Matches</Label>
              <Select 
                value={strategy.phoneMatches} 
                onValueChange={(value: DuplicateAction) => updateStrategy('phoneMatches', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name Matches</Label>
              <Select 
                value={strategy.nameMatches} 
                onValueChange={(value: DuplicateAction) => updateStrategy('nameMatches', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>LinkedIn Matches</Label>
              <Select 
                value={strategy.linkedinMatches} 
                onValueChange={(value: DuplicateAction) => updateStrategy('linkedinMatches', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {(strategy.primaryAction === 'merge' || 
        strategy.emailMatches === 'merge' || 
        strategy.phoneMatches === 'merge' || 
        strategy.nameMatches === 'merge' || 
        strategy.linkedinMatches === 'merge') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Merge Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overwrite-empty"
                  checked={mergeOptions.overwriteEmpty}
                  onCheckedChange={(checked) => updateMergeOptions('overwriteEmpty', checked as boolean)}
                />
                <Label htmlFor="overwrite-empty">Fill empty fields with new data</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="merge-arrays"
                  checked={mergeOptions.mergeArrays}
                  onCheckedChange={(checked) => updateMergeOptions('mergeArrays', checked as boolean)}
                />
                <Label htmlFor="merge-arrays">Merge skills and tags</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="keep-recent"
                  checked={mergeOptions.keepMostRecent}
                  onCheckedChange={(checked) => updateMergeOptions('keepMostRecent', checked as boolean)}
                />
                <Label htmlFor="keep-recent">Keep most recent dates</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preserve-existing"
                  checked={mergeOptions.preserveExisting}
                  onCheckedChange={(checked) => updateMergeOptions('preserveExisting', checked as boolean)}
                />
                <Label htmlFor="preserve-existing">Preserve existing non-empty data</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DuplicateStrategySelector;
