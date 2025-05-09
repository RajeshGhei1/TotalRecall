
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
import { fetchTalentsBySkill } from "@/services/talentService";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe", "#00C49F", "#FFBB28", "#FF8042"];

const TalentSkillsChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['talentsBySkill'],
    queryFn: fetchTalentsBySkill
  });

  if (error) {
    console.error("Error fetching talent skills data:", error);
  }

  return (
    <TalentMetricsCard 
      title="Popular Skills" 
      description="Most common skills among talents"
      isLoading={isLoading}
    >
      {data && data.length > 0 ? (
        <ChartContainer config={{}} className="aspect-[4/3]">
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
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
          No skills data available
        </div>
      ) : null}
    </TalentMetricsCard>
  );
};

export default TalentSkillsChart;
