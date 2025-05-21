
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';

// Sample data structure - in a real app, fetch from supabase
const mockData = [
  { month: 'Jan', companies: 10, talents: 20, contacts: 15 },
  { month: 'Feb', companies: 15, talents: 25, contacts: 22 },
  { month: 'Mar', companies: 17, talents: 32, contacts: 28 },
  { month: 'Apr', companies: 20, talents: 38, contacts: 30 },
  { month: 'May', companies: 24, talents: 42, contacts: 34 },
  { month: 'Jun', companies: 28, talents: 48, contacts: 42 },
];

// Chart color configuration
const chartConfig = {
  companies: {
    label: "Companies",
    theme: {
      light: "#8884d8",
      dark: "#8884d8"
    }
  },
  talents: {
    label: "Talents",
    theme: {
      light: "#82ca9d",
      dark: "#82ca9d"
    }
  },
  contacts: {
    label: "Contacts",
    theme: {
      light: "#ffc658",
      dark: "#ffc658"
    }
  }
};

const CompanyGrowthChart = () => {
  // In a real application, you would fetch this data from Supabase
  // using useQuery hook to get real data based on created_at timestamps
  const { data = mockData, isLoading } = useQuery({
    queryKey: ['entityGrowth'],
    queryFn: async () => {
      // This is a placeholder for actual data fetching logic
      // For demonstration, we're using mock data
      
      // For a real implementation, you'd query the database
      // and group by month/timeframe
      
      return mockData;
    },
    enabled: true,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="companies" 
          stackId="1"
          stroke="#8884d8" 
          fill="#8884d8" 
        />
        <Area 
          type="monotone" 
          dataKey="talents" 
          stackId="1"
          stroke="#82ca9d" 
          fill="#82ca9d" 
        />
        <Area 
          type="monotone" 
          dataKey="contacts" 
          stackId="1"
          stroke="#ffc658" 
          fill="#ffc658" 
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default CompanyGrowthChart;
