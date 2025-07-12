
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig } from '@/types/common';

interface RevenueConfigProps {
  config: WidgetConfig;
  updateConfig: (key: string, value: unknown) => void;
}

const RevenueConfig: React.FC<RevenueConfigProps> = ({ config, updateConfig }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="metric_type">Revenue Metric Type</Label>
        <Select value={String(config.metric_type || 'mrr')} onValueChange={(value) => updateConfig('metric_type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select metric type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mrr">Monthly Recurring Revenue</SelectItem>
            <SelectItem value="arr">Annual Recurring Revenue</SelectItem>
            <SelectItem value="churn_rate">Churn Rate</SelectItem>
            <SelectItem value="ltv">Lifetime Value</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="currency">Currency</Label>
        <Select value={String(config.currency || 'USD')} onValueChange={(value) => updateConfig('currency', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="JPY">JPY</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RevenueConfig;
