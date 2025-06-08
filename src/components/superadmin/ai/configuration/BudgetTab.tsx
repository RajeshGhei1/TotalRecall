
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BudgetTabProps {
  tokenBudget: number;
  overagePolicy: string;
  onTokenBudgetChange: (budget: number) => void;
  onOveragePolicyChange: (policy: string) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  tokenBudget,
  overagePolicy,
  onTokenBudgetChange,
  onOveragePolicyChange
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Token Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="token-budget">Monthly Token Budget</Label>
            <Input
              id="token-budget"
              type="number"
              value={tokenBudget}
              onChange={(e) => onTokenBudgetChange(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overage Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={overagePolicy} onValueChange={onOveragePolicyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block">Block requests</SelectItem>
              <SelectItem value="allow">Allow overage</SelectItem>
              <SelectItem value="notify">Notify and allow</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};
