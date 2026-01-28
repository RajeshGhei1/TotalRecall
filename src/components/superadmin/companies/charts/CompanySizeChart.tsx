
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompanySizeChartProps {
  data: Array<{ name: string; count: number }>;
  isLoading?: boolean;
}

const CompanySizeChart: React.FC<CompanySizeChartProps> = ({ data, isLoading }) => {
  const isMobile = useIsMobile();

  const chartData = data.map((entry) => ({
    size: entry.name,
    count: entry.count
  }));

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4 md:p-6">
          <Skeleton className="h-[200px] md:h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-base md:text-lg font-medium mb-4">Companies by Size</h3>
        
        {chartData.some(item => item.count > 0) ? (
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={isMobile ? 
                { top: 20, right: 10, left: 0, bottom: 60 } : 
                { top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="size" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickMargin={isMobile ? 15 : 10}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip formatter={(value) => [`${value} companies`, 'Count']} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar dataKey="count" name="Companies" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[200px] md:h-[300px]">
            <p className="text-sm text-muted-foreground">No company size data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySizeChart;
