
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

const ModuleLoadingState: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-center">
          <Zap className="h-6 w-6 animate-spin mr-2" />
          Loading modules...
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleLoadingState;
