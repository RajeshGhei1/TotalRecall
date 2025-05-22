
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Person } from '@/types/person';

// Creating a dummy person object for the skeleton state
const dummyPerson: Person = {
  id: '',
  full_name: 'Loading...',
  email: '',
  type: 'talent',
  created_at: '',
  updated_at: ''
};

const PersonDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <Skeleton className="h-6 w-40 mb-1" />
      </div>
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
