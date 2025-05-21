
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";

// Sample data structure - in a real app, fetch from supabase
const mockData = [
  { month: 'Jan', hires: 20, applications: 120, interviews: 40 },
  { month: 'Feb', hires: 25, applications: 145, interviews: 50 },
  { month: 'Mar', hires: 30, applications: 190, interviews: 65 },
  { month: 'Apr', hires: 27, applications: 170, interviews: 55 },
  { month: 'May', hires: 32, applications: 210, interviews: 70 },
  { month: 'Jun', hires: 38, applications: 250, interviews: 85 },
];

// Chart color configuration
const chartConfig = {
  hires: {
    label: "Hires",
    theme: {
      light: "#8884d8",
      dark: "#8884d8"
    }
  },
  applications: {
    label: "Applications",
    theme: {
      light: "#82ca9d",
      dark: "#82ca9d"
    }
  },
  interviews: {
    label: "Interviews",
    theme: {
      light: "#ffc658",
      dark: "#ffc658"
    }
  }
};

const TalentHiringTrends = () => {
  // In a real application, you would fetch this data from Supabase
  const { data = mockData, isLoading } = useQuery({
    queryKey: ['hiringTrends'],
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
    <ChartContainer config={chartConfig} className="h-full">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="hires" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="applications" 
          stroke="#82ca9d" 
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="interviews" 
          stroke="#ffc658" 
        />
      </LineChart>
    </ChartContainer>
  );
};

export default TalentHiringTrends;
