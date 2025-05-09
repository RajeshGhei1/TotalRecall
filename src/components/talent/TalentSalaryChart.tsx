
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
import TalentMetricsCard from "./TalentMetricsCard";
import { useQuery } from "@tanstack/react-query";
import { fetchTalentsBySalary } from "@/services/talentService";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00C49F"];

const TalentSalaryChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['talentsBySalary'],
    queryFn: fetchTalentsBySalary
  });

  if (error) {
    console.error("Error fetching talent salary data:", error);
  }

  return (
    <TalentMetricsCard 
      title="Talent by Salary Band" 
      description="Distribution of talents based on current salary"
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
          No salary data available
        </div>
      ) : null}
    </TalentMetricsCard>
  );
};

export default TalentSalaryChart;
