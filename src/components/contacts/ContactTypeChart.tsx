
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
  Legend,
} from "recharts";
import ContactMetricsCard from "./ContactMetricsCard";
import { useQuery } from "@tanstack/react-query";
import { fetchContactsByType } from "@/services/contactService";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ContactTypeChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contactsByType'],
    queryFn: () => {
      // Mock data until the actual service is implemented
      return [
        { name: "Client", value: 40 },
        { name: "Prospect", value: 30 },
        { name: "Vendor", value: 20 },
        { name: "Partner", value: 10 },
      ];
    }
  });

  if (error) {
    console.error("Error fetching contact type data:", error);
  }

  return (
    <ContactMetricsCard 
      title="Contacts by Type" 
      description="Distribution of contact types"
      isLoading={isLoading}
    >
      {data && data.length > 0 ? (
        <ChartContainer config={{}} className="aspect-[4/3]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      ) : !isLoading ? (
        <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground">
          No contact type data available
        </div>
      ) : null}
    </ContactMetricsCard>
  );
};

export default ContactTypeChart;
