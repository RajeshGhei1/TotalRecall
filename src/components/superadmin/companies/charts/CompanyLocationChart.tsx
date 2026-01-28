
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface CompanyLocationChartProps {
  data: Array<{ name: string; count: number }>;
  isLoading?: boolean;
}

const CompanyLocationChart: React.FC<CompanyLocationChartProps> = ({ data, isLoading }) => {
  const isMobile = useIsMobile();
  const chartData = data.map((entry) => ({ name: entry.name, value: entry.count }));

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
        <h3 className="text-base md:text-lg font-medium mb-4">Companies by Location</h3>
        
        {chartData.length > 0 ? (
          <div className="h-[200px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobile}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={isMobile ? undefined : ({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} companies`, 'Count']}
                  contentStyle={{ fontSize: isMobile ? '10px' : '12px' }}
                />
                <Legend 
                  layout={isMobile ? "horizontal" : "vertical"}
                  align={isMobile ? "center" : "right"}
                  verticalAlign={isMobile ? "bottom" : "middle"}
                  wrapperStyle={{
                    fontSize: isMobile ? '10px' : '12px',
                    paddingTop: isMobile ? '10px' : '0',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[200px] md:h-[300px]">
            <p className="text-sm text-muted-foreground">No location data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyLocationChart;
