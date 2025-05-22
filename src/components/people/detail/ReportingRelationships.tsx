
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePersonReportingRelationships } from '@/hooks/company-relationships/usePersonReportingRelationships';
import ManagerDisplay from './reporting/ManagerDisplay';
import DirectReportsDisplay from './reporting/DirectReportsDisplay';

interface ReportingRelationshipsProps {
  personId: string;
  companyId?: string;
}

const ReportingRelationships: React.FC<ReportingRelationshipsProps> = ({ 
  personId,
  companyId
}) => {
  const { reportingRelationships, isLoading } = usePersonReportingRelationships(personId, companyId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Reporting Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Manager</div>
              <Skeleton className="h-12 w-full" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Direct Reports</div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Reporting Relationships</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Manager section */}
          <ManagerDisplay manager={reportingRelationships?.manager || null} />
          
          {/* Direct reports section */}
          <DirectReportsDisplay directReports={reportingRelationships?.directReports || []} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingRelationships;
