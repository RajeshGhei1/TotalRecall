
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

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00C49F"];

const ContactCompanyChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contactsByCompany'],
    queryFn: () => {
      // Mock data until the actual service is implemented
      return [
        { name: "Acme Corp", value: 8 },
        { name: "Globex", value: 7 },
        { name: "Initech", value: 6 },
        { name: "Umbrella Corp", value: 5 },
        { name: "Stark Industries", value: 4 },
      ];
    }
  });

  if (error) {
    console.error("Error fetching contacts by company data:", error);
  }

  return (
    <ContactMetricsCard 
      title="Top Companies" 
      description="Companies with the most contacts"
      isLoading={isLoading}
    >
      {data && data.length > 0 ? (
        <ChartContainer config={{}} className="aspect-[4/3]">
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
            />
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
          No company data available
        </div>
      ) : null}
    </ContactMetricsCard>
  );
};

export default ContactCompanyChart;
