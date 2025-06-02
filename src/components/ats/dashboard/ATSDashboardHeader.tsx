
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface ATSDashboardHeaderProps {
  onCreateJob: () => void;
}

const ATSDashboardHeader = ({ onCreateJob }: ATSDashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applicant Tracking System</h1>
        <p className="text-muted-foreground">
          Complete talent and recruitment management with AI-powered insights
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={onCreateJob}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>
    </div>
  );
};

export default ATSDashboardHeader;
