
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface JobHistoryItem {
  id: string;
  company: {
    id: string;
    name: string;
  };
  role: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
}

export interface JobHistoryListProps {
  history: JobHistoryItem[];
  showAllHistory?: boolean;
}

const JobHistoryList = ({ history, showAllHistory = true }: JobHistoryListProps) => {
  // If showAllHistory is false, only show current positions
  const displayHistory = showAllHistory 
    ? history 
    : history.filter(job => job.is_current);

  if (displayHistory.length === 0) {
    return (
      <div className="rounded-md bg-muted p-4 text-center">
        <p>No company associations found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayHistory.map((job) => (
        <div key={job.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{job.company.name}</h4>
              <p className="text-sm text-muted-foreground">{job.role}</p>
            </div>
            {job.is_current && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Current
              </Badge>
            )}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {format(new Date(job.start_date), 'MMM yyyy')} - {job.end_date ? format(new Date(job.end_date), 'MMM yyyy') : 'Present'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobHistoryList;
