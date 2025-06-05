
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Target, TrendingUp } from 'lucide-react';

interface BudgetTabProps {
  tokenBudget: number;
  overagePolicy: 'warn' | 'block' | 'charge';
  onTokenBudgetChange: (budget: number) => void;
  onOveragePolicyChange: (policy: 'warn' | 'block' | 'charge') => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  tokenBudget,
  overagePolicy,
  onTokenBudgetChange,
  onOveragePolicyChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="token-budget">Monthly Token Budget</Label>
        <Input
          id="token-budget"
          type="number"
          value={tokenBudget}
          onChange={(e) => onTokenBudgetChange(parseInt(e.target.value))}
          className="mt-1"
        />
        <p className="text-xs text-gray-600 mt-1">
          Maximum tokens this module can use per month
        </p>
      </div>

      <div>
        <Label htmlFor="overage-policy">Overage Policy</Label>
        <Select 
          value={overagePolicy} 
          onValueChange={onOveragePolicyChange}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="block">Block requests when budget exceeded</SelectItem>
            <SelectItem value="warn">Allow with warnings</SelectItem>
            <SelectItem value="charge">Charge for overages</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">$0.00</div>
          <div className="text-sm text-gray-600">Current Cost</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-600">Tokens Used</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">0%</div>
          <div className="text-sm text-gray-600">Budget Used</div>
        </div>
      </div>
    </div>
  );
};
