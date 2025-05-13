
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  rows?: number;
}

const LoadingState = ({ rows = 3 }: LoadingStateProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className={`h-${index === 0 ? 8 : 16} bg-gray-200 rounded animate-pulse`} />
      ))}
    </div>
  );
};

export default LoadingState;
