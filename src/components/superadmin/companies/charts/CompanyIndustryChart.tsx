
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CompanyIndustryChart: React.FC = () => {
  const { companies = [], isLoading } = useCompanies();

  // Process data for the chart
  const getIndustryData = () => {
    // Group companies by primary industry (industry1)
    const industryGroups = companies.reduce((acc, company) => {
      const industry = company.industry1 || 'Undefined';
      
      if (!acc[industry]) {
        acc[industry] = 0;
      }
      acc[industry] += 1;
      return acc;
    }, {});

    // Convert to array format for chart
    return Object.entries(industryGroups).map(([name, value]) => ({
      name,
      value
    }));
  };

  const data = getIndustryData();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Companies by Primary Industry</h3>
        
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} companies`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No industry data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyIndustryChart;
