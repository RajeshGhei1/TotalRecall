
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CompanyLocationChart: React.FC = () => {
  const { companies = [], isLoading } = useCompanies();

  // Process data for the chart
  const getLocationData = () => {
    // Group companies by location
    const locationGroups = companies.reduce<Record<string, number>>((acc, company) => {
      const location = company.location || 'Unknown';
      
      if (!acc[location]) {
        acc[location] = 0;
      }
      acc[location] += 1;
      return acc;
    }, {});

    // Convert to array format for chart
    return Object.entries(locationGroups)
      .map(([name, value]) => ({ name, value }))
      // Get the top 5 locations and group the rest as "Others"
      .sort((a, b) => b.value - a.value)
      .reduce<Array<{ name: string; value: number }>>((acc, curr, index) => {
        if (index < 5) {
          acc.push(curr);
        } else {
          const othersIndex = acc.findIndex(item => item.name === 'Others');
          if (othersIndex === -1) {
            acc.push({ name: 'Others', value: curr.value });
          } else {
            acc[othersIndex].value = acc[othersIndex].value + curr.value;
          }
        }
        return acc;
      }, []);
  };

  const data = getLocationData();

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
        <h3 className="text-lg font-medium mb-4">Companies by Location</h3>
        
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[300px]">
            <p className="text-muted-foreground">No location data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyLocationChart;
