
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";

// Sample data structure - in a real app, fetch from supabase
const mockData = [
  { name: 'Active', value: 35 },
  { name: 'Filled', value: 25 },
  { name: 'Expired', value: 15 },
  { name: 'Draft', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const JobPostingsOverview = () => {
  // In a real application, you would fetch this data from Supabase
  const { data = mockData, isLoading } = useQuery({
    queryKey: ['jobPostingsOverview'],
    queryFn: async () => {
      // This is a placeholder for actual data fetching logic
      return mockData;
    },
    enabled: true,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
  }

  return (
    <ChartContainer config={{}} className="h-full">
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ChartContainer>
  );
};

export default JobPostingsOverview;
