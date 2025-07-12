
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricData, ChartData } from '@/types/common';

interface MetricCardProps {
  data: MetricData | ChartData[];
  config: {
    title: string;
    metric_type: 'count' | 'sum' | 'average' | 'percentage';
    trend_comparison?: boolean;
    format?: string;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ data, config }) => {
  const formatValue = (value: number) => {
    if (config.format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }
    
    if (config.format === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    
    return new Intl.NumberFormat().format(value);
  };

  const getValue = () => {
    if (!Array.isArray(data)) {
      // Handle MetricData
      if (config.metric_type === 'count' && typeof data?.count === 'number') {
        return data.count;
      }
      return typeof data?.value === 'number' ? data.value : 0;
    }
    
    // Handle ChartData[]
    if (data.length > 0) {
      switch (config.metric_type) {
        case 'count':
          return data.length;
        case 'sum':
          return data.reduce((sum, item) => sum + (parseFloat(String(item.value || 0))), 0);
        case 'average':
          const total = data.reduce((sum, item) => sum + (parseFloat(String(item.value || 0))), 0);
          return total / data.length;
        default:
          return data.length;
      }
    }
    
    return 0;
  };

  const value = getValue();
  const trend = !Array.isArray(data) && typeof data?.trend === 'number' ? data.trend : 0;

  return (
    <div className="space-y-2">
      <div className="text-3xl font-bold">
        {formatValue(value)}
      </div>
      
      {config.trend_comparison && trend !== undefined && (
        <div className="flex items-center space-x-1 text-sm">
          {trend > 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">+{trend.toFixed(1)}%</span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-red-600">{trend.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <Minus className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">No change</span>
            </>
          )}
          <span className="text-muted-foreground">from last period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
