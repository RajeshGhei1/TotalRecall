
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TalentMetricsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const TalentMetricsCard = ({ 
  title, 
  description, 
  children, 
  isLoading = false 
}: TalentMetricsCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default TalentMetricsCard;
