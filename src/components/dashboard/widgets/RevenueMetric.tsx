
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { RevenueData } from '@/types/common';

interface RevenueMetricProps {
  data: RevenueData;
  config: {
    title: string;
    metric_type: 'mrr' | 'arr' | 'churn_rate' | 'ltv';
    currency?: string;
  };
}

const RevenueMetric: React.FC<RevenueMetricProps> = ({ data, config }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getValue = () => {
    return data?.value || 0;
  };

  const getChange = () => {
    return data?.change || 0;
  };

  const value = getValue();
  const change = getChange();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <DollarSign className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-muted-foreground">
          {config.metric_type.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold">
          {config.metric_type === 'churn_rate' ? `${value.toFixed(1)}%` : formatCurrency(value)}
        </div>
        
        {change !== 0 && (
          <div className="flex items-center space-x-1 text-sm">
            {change > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+{change.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-red-600">{change.toFixed(1)}%</span>
              </>
            )}
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueMetric;
