
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
  Tooltip
} from "recharts";
import ContactMetricsCard from "./ContactMetricsCard";
import { useQuery } from "@tanstack/react-query";

const ContactEngagementChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contactEngagement'],
    queryFn: () => {
      // Mock data until the actual service is implemented
      return [
        { month: "Jan", emails: 45, calls: 23, meetings: 12 },
        { month: "Feb", emails: 52, calls: 28, meetings: 15 },
        { month: "Mar", emails: 48, calls: 25, meetings: 18 },
        { month: "Apr", emails: 61, calls: 32, meetings: 21 },
        { month: "May", emails: 55, calls: 29, meetings: 17 },
        { month: "Jun", emails: 67, calls: 36, meetings: 24 },
      ];
    }
  });

  if (error) {
    console.error("Error fetching contact engagement data:", error);
  }

  return (
    <ContactMetricsCard 
      title="Contact Engagement" 
      description="Communication activity with contacts over time"
      isLoading={isLoading}
    >
      {data && data.length > 0 ? (
        <ChartContainer config={{}} className="aspect-[4/3]">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="emails" stroke="#8884d8" activeDot={{ r: 8 }} name="Emails" />
            <Line type="monotone" dataKey="calls" stroke="#82ca9d" name="Calls" />
            <Line type="monotone" dataKey="meetings" stroke="#ffc658" name="Meetings" />
          </LineChart>
        </ChartContainer>
      ) : !isLoading ? (
        <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground">
          No engagement data available
        </div>
      ) : null}
    </ContactMetricsCard>
  );
};

export default ContactEngagementChart;
