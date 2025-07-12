import React, { useState, useEffect, Suspense } from 'react';

interface LazyChartProps {
  chartType: 'bar' | 'line' | 'pie' | 'area';
  data: any[];
  width?: number | string;
  height?: number | string;
  className?: string;
  children?: React.ReactNode;
}

// Loading component for charts
const ChartLoading = () => (
  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading chart...</p>
    </div>
  </div>
);

// Dynamic chart component that loads only when needed
const DynamicChart: React.FC<LazyChartProps> = ({ chartType, data, width, height, className, children }) => {
  const [ChartComponent, setChartComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChart = async () => {
      try {
        const recharts = await import('recharts');
        
        let component: React.ComponentType<any>;
        switch (chartType) {
          case 'bar':
            component = recharts.BarChart;
            break;
          case 'line':
            component = recharts.LineChart;
            break;
          case 'pie':
            component = recharts.PieChart;
            break;
          case 'area':
            component = recharts.AreaChart;
            break;
          default:
            component = recharts.BarChart;
        }
        
        setChartComponent(() => component);
      } catch (error) {
        console.error('Failed to load chart component:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChart();
  }, [chartType]);

  if (isLoading) {
    return <ChartLoading />;
  }

  if (!ChartComponent) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <p className="text-red-600">Failed to load chart</p>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <ChartComponent data={data} width={width} height={height}>
        {children}
      </ChartComponent>
    </div>
  );
};

// Main LazyChart component
const LazyChart: React.FC<LazyChartProps> = (props) => {
  return (
    <Suspense fallback={<ChartLoading />}>
      <DynamicChart {...props} />
    </Suspense>
  );
};

export default LazyChart;