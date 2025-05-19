
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const CompanySizeChart: React.FC = () => {
  const { companies = [], isLoading } = useCompanies();
  const isMobile = useIsMobile();

  // Process data for the chart
  const getSizeData = () => {
    // Define size ranges for better chart representation
    const sizeRanges = {
      '1-10': '1-10',
      '11-50': '11-50',
      '51-200': '51-200',
      '201-500': '201-500',
      '501-1000': '501-1000',
      '1001-5000': '1001-5000',
      '5001+': '5001+'
    };

    // Initialize counts
    const counts = Object.keys(sizeRanges).reduce<Record<string, number>>((acc, size) => {
      acc[size] = 0;
      return acc;
    }, {});

    // Count companies by size
    companies.forEach(company => {
      const size = company.size || 'Unknown';
      if (counts[size] !== undefined) {
        counts[size] += 1;
      }
    });

    // Convert to array format for chart
    return Object.entries(counts).map(([size, count]) => ({
      size,
      count
    }));
  };

  const data = getSizeData();

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
        
        {data.some(item => item.count > 0) ? (
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={isMobile ? 
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
