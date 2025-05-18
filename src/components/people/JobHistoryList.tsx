
import React from 'react';
import { CompanyRelationship } from '@/types/company-relationship';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Building } from 'lucide-react';

interface JobHistoryListProps {
  history: CompanyRelationship[];
  isLoading?: boolean;
}

const JobHistoryList: React.FC<JobHistoryListProps> = ({ history, isLoading }) => {
  if (isLoading) {
    return <p>Loading job history...</p>;
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No job history found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {history.map((job) => (
            <li key={job.id} className="border-l-2 pl-4 pb-4 relative">
              {job.is_current && (
                <Badge className="absolute -left-2 top-0">Current</Badge>
              )}
              <div className="flex items-center mb-2">
                <Building className="h-4 w-4 mr-2" />
                <h3 className="font-medium">{job.role}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {format(new Date(job.start_date), 'MMM yyyy')} - 
                {job.end_date ? format(new Date(job.end_date), ' MMM yyyy') : ' Present'}
              </p>
              <p className="text-sm">{job.relationship_type === 'employment' ? 'Employee' : 'Business Contact'}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default JobHistoryList;
