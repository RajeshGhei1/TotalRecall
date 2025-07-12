
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWidgetData, WidgetDataSource } from '@/hooks/dashboard/useWidgetData';
import { DashboardWidget as WidgetType } from '@/hooks/dashboard/useDashboardConfig';
import MetricCard from './widgets/MetricCard';
import ChartWidget from './widgets/ChartWidget';
import TableWidget from './widgets/TableWidget';
import RevenueMetric from './widgets/RevenueMetric';
import { WidgetConfig } from '@/types/common';

interface DashboardWidgetProps {
  widget: WidgetType;
  dataSource: WidgetDataSource;
  config?: WidgetConfig;
  onEdit?: () => void;
  onRemove?: () => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  dataSource,
  config = {},
  onEdit,
  onRemove,
}) => {
  const { data, isLoading, error } = useWidgetData(dataSource, config);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{config.title || widget.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load widget data: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderWidget = () => {
    const mergedConfig = { ...widget.default_config, ...config };

    switch (widget.widget_type) {
      case 'metric_card':
        const metricConfig = {
          title: mergedConfig.title || 'Metric',
          metric_type: mergedConfig.metric_type || 'count',
          trend_comparison: mergedConfig.trend_comparison,
          format: mergedConfig.format
        };
        return <MetricCard data={data} config={metricConfig} />;

      case 'line_chart':
      case 'bar_chart':
      case 'pie_chart':
        const chartConfig = {
          title: mergedConfig.title || 'Chart',
          x_axis: mergedConfig.x_axis,
          y_axis: mergedConfig.y_axis,
          data_column: mergedConfig.data_column,
          label_column: mergedConfig.label_column
        };
        const chartData = Array.isArray(data) ? data : [];
        return <ChartWidget type={widget.widget_type} data={chartData} config={chartConfig} />;

      case 'revenue_metric':
        const revenueConfig = {
          title: mergedConfig.title || 'Revenue',
          metric_type: mergedConfig.metric_type || 'mrr',
          currency: mergedConfig.currency
        };
        return <RevenueMetric data={data} config={revenueConfig} />;

      case 'data_table':
        const tableConfig = {
          title: mergedConfig.title || 'Data Table',
          columns: mergedConfig.columns,
          page_size: mergedConfig.page_size
        };
        const tableData = Array.isArray(data) ? data : [];
        return <TableWidget data={tableData} config={tableConfig} />;

      default:
        return (
          <Alert>
            <AlertDescription>
              Unknown widget type: {widget.widget_type}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card className="h-full relative group">
      {(onEdit || onRemove) && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50"
              >
                Edit
              </button>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-xs bg-white border rounded px-2 py-1 hover:bg-gray-50 text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{config.title || widget.name}</CardTitle>
        {widget.description && (
          <CardDescription>{widget.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {renderWidget()}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
