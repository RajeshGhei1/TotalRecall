
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressUpdate } from '@/hooks/useModuleProgress';

interface ProgressUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModule: string | null;
  onUpdate: (update: ProgressUpdate) => Promise<void>;
}

const ProgressUpdateDialog: React.FC<ProgressUpdateDialogProps> = ({
  open,
  onOpenChange,
  selectedModule,
  onUpdate
}) => {
  const [metricType, setMetricType] = useState<'code' | 'test' | 'feature' | 'documentation' | 'quality'>('code');
  const [increment, setIncrement] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return;

    setIsSubmitting(true);
    try {
      await onUpdate({
        module_id: selectedModule,
        metric_type: metricType,
        increment_value: increment,
        metadata: {
          notes,
          timestamp: new Date().toISOString(),
          source: 'manual_update'
        }
      });
      
      // Reset form
      setIncrement(5);
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Module Progress</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedModule && (
            <Card>
              <CardContent className="p-3">
                <Label className="text-sm font-medium">Module</Label>
                <p className="text-sm text-muted-foreground">{selectedModule}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="metric-type">Metric Type</Label>
            <Select value={metricType} onValueChange={(value: any) => setMetricType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code">Code Implementation</SelectItem>
                <SelectItem value="test">Test Coverage</SelectItem>
                <SelectItem value="feature">Feature Completion</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="quality">Quality/Bug Fixes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="increment">Progress Increment (%)</Label>
            <Input
              id="increment"
              type="number"
              value={increment}
              onChange={(e) => setIncrement(Number(e.target.value))}
              min={-100}
              max={100}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Use negative values to decrease progress
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what was completed or changed..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Progress'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressUpdateDialog;
