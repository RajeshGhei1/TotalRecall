
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface CompanyPeopleChartProps {
  data: Array<{ id: string; name: string; count: number }>;
  isLoading?: boolean;
}

const CompanyPeopleChart: React.FC<CompanyPeopleChartProps> = ({ data, isLoading }) => {
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies by People Count</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Companies by People Count</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex justify-center items-center text-muted-foreground">
          No relationship data available yet
        </CardContent>
      </Card>
    );
  }
  
  // Format data for the chart
  const chartData = data.map(company => ({
    name: company.name.length > 15 ? company.name.substring(0, 15) + '...' : company.name,
    count: company.count,
    fullName: company.name // For tooltip
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Companies by People Count</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'People']}
              labelFormatter={(label) => {
                // Find the corresponding chart data item
                const dataItem = chartData.find(item => item.name === label);
                // Return the full name if found, otherwise return the label
                return dataItem ? dataItem.fullName : label;
              }}
            />
            <Bar dataKey="count" fill="#8884d8" name="People" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CompanyPeopleChart;
