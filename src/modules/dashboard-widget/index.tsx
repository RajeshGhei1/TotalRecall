
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

interface DashboardWidgetProps {
  title?: string;
  metric?: string;
  value?: string | number;
  change?: string;
  icon?: 'chart' | 'trending' | 'users' | 'dollar';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title = 'Sample Metric',
  metric = 'Total Value',
  value = '1,234',
  change = '+12.5%',
  icon = 'chart',
  variant = 'default'
}) => {
  const iconMap = {
    chart: BarChart3,
    trending: TrendingUp,
    users: Users,
    dollar: DollarSign
  };

  const variantStyles = {
    default: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50'
  };

  const IconComponent = iconMap[icon];

  return (
    <Card className={`${variantStyles[variant]} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <IconComponent className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {value}
          </div>
          <div className="flex items-center text-xs">
            <span className="text-gray-600">{metric}</span>
            {change && (
              <span className="ml-2 text-green-600 font-medium">
                {change}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Module metadata for registration
(DashboardWidget as unknown).moduleMetadata = {
  id: 'dashboard-widget',
  name: 'Dashboard Widget',
  category: 'core',
  version: '1.0.0',
  description: 'A customizable dashboard widget for displaying metrics',
  author: 'System',
  requiredPermissions: ['read'],
  props: {
    title: { type: 'string', default: 'Sample Metric' },
    metric: { type: 'string', default: 'Total Value' },
    value: { type: 'string|number', default: '1,234' },
    change: { type: 'string', default: '+12.5%' },
    icon: { type: 'string', options: ['chart', 'trending', 'users', 'dollar'], default: 'chart' },
    variant: { type: 'string', options: ['default', 'success', 'warning', 'danger'], default: 'default' }
  }
};

export default DashboardWidget;
