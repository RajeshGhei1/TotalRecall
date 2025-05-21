
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";

// Sample data structure - in a real app, fetch from supabase
const mockData = [
  { name: 'Tech Co', revenue: 4000, profit: 2400 },
  { name: 'Acme Inc', revenue: 3000, profit: 1398 },
  { name: 'Global Ltd', revenue: 2000, profit: 980 },
  { name: 'Bright Solutions', revenue: 2780, profit: 1908 },
  { name: 'Nexus Group', revenue: 1890, profit: 800 },
  { name: 'Vertex Systems', revenue: 2390, profit: 1300 },
];

// Chart color configuration
const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "#8884d8",
      dark: "#8884d8"
    }
  },
  profit: {
    label: "Profit",
    theme: {
      light: "#82ca9d",
      dark: "#82ca9d"
    }
  }
};

const CompanyRevenueChart = () => {
  // In a real application, you would fetch this data from Supabase
  const { data = mockData, isLoading } = useQuery({
    queryKey: ['companyRevenue'],
    queryFn: async () => {
      // This is a placeholder for actual data fetching logic
      // For demonstration, we're using mock data
      return mockData;
    },
    enabled: true,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar dataKey="revenue" fill="#8884d8" />
        <Bar dataKey="profit" fill="#82ca9d" />
      </BarChart>
    </ChartContainer>
  );
};

export default CompanyRevenueChart;
