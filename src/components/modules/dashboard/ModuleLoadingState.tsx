
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ModuleLoadingState: React.FC = () => {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardContent className="p-8">
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading modules...</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-2 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded-full animate-pulse w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleLoadingState;
