
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
  ResponsiveContainer
} from "recharts";
import TalentMetricsCard from "./TalentMetricsCard";
import { useQuery } from "@tanstack/react-query";
import { fetchTalentsByLocation } from "@/services/talentService";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#48C9B0', '#F4D03F', '#EC7063', '#CACFD2'];

const TalentLocationChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['talentsByLocation'],
    queryFn: fetchTalentsByLocation
  });

  if (error) {
    console.error("Error fetching talent location data:", error);
  }

  return (
    <TalentMetricsCard 
      title="Talent by Location" 
      description="Geographic distribution of talents"
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
          No location data available
        </div>
      ) : null}
    </TalentMetricsCard>
  );
};

export default TalentLocationChart;
