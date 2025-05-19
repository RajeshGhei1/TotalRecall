
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
  Cell
} from "recharts";
import ContactMetricsCard from "./ContactMetricsCard";
import { useQuery } from "@tanstack/react-query";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

const ContactLocationChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contactsByLocation'],
    queryFn: () => {
      // Mock data until the actual service is implemented
      return [
        { name: "New York", value: 35 },
        { name: "San Francisco", value: 28 },
        { name: "Chicago", value: 22 },
        { name: "Austin", value: 15 },
        { name: "Boston", value: 12 },
      ];
    }
  });

  if (error) {
    console.error("Error fetching contact location data:", error);
  }

  return (
    <ContactMetricsCard 
      title="Contacts by Location" 
      description="Geographic distribution of contacts"
      isLoading={isLoading}
    >
      {data && data.length > 0 ? (
        <ChartContainer config={{}} className="aspect-[4/3]">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <ChartTooltip 
              content={<ChartTooltipContent />} 
            />
            <Bar dataKey="value" fill="#8884d8">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      ) : !isLoading ? (
        <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground">
          No location data available
        </div>
      ) : null}
    </ContactMetricsCard>
  );
};

export default ContactLocationChart;
