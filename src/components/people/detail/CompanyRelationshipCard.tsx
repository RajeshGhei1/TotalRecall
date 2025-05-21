
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JobHistoryItem } from '@/components/people/JobHistoryList';

interface CompanyRelationshipCardProps {
  jobHistory: JobHistoryItem[];
}

const CompanyRelationshipCard: React.FC<CompanyRelationshipCardProps> = ({ jobHistory }) => {
  const navigate = useNavigate();
  
  if (!jobHistory || jobHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Associated Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No company associations found</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleNavigateToCompany = (companyId: string) => {
    navigate(`/superadmin/companies/${companyId}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Associated Companies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobHistory.map((job) => (
          <div key={job.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{job.company?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {job.role} • {job.is_current ? 'Current' : `${new Date(job.start_date).toLocaleDateString()} - ${job.end_date ? new Date(job.end_date).toLocaleDateString() : 'N/A'}`}
                </div>
              </div>
            </div>
            {job.company?.id && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigateToCompany(job.company?.id || '')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CompanyRelationshipCard;
