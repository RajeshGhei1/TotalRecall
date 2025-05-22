
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PersonDetailSkeleton: React.FC = () => {
  // Create a placeholder person object for the breadcrumb
  const placeholderPerson = { 
    id: '', 
    full_name: 'Loading...', 
    email: '', 
    type: 'talent',
    created_at: '',
    updated_at: ''
  };
  
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-[250px] mb-8" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-[150px] mb-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <div className="border-b p-4">
            <div className="flex justify-start space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-[80px]" />
              ))}
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonDetailSkeleton;
