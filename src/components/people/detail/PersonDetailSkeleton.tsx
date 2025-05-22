
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import PersonDetailBreadcrumb from './PersonDetailBreadcrumb';

const PersonDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <PersonDetailBreadcrumb />
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-6 w-1/4" />
      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px] md:col-span-2" />
      </div>
    </div>
  );
};

export default PersonDetailSkeleton;
