
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Briefcase } from 'lucide-react';

interface Application {
  id: string;
  candidate_name?: string;
  job_title?: string;
  status?: 'new' | 'reviewing' | 'interviewing' | 'hired' | 'rejected';
  stage?: string;
  created_at?: string;
}

interface ATSApplicationsTabProps {
  applications: Application[];
  loading: boolean;
}

const ATSApplicationsTab = ({ applications, loading }: ATSApplicationsTabProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Applications</h3>
          <p className="text-sm text-muted-foreground">
            Track and manage job applications through the hiring pipeline
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                Applications will appear here once candidates start applying to your job postings.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {application.candidate_name || 'Unknown Candidate'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {application.job_title || 'Unknown Position'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'recently'}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={
                    application.status === 'hired' ? 'default' :
                    application.status === 'rejected' ? 'destructive' :
                    application.status === 'interviewing' ? 'secondary' : 'outline'
                  }>
                    {application.status || 'New'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Stage: {application.stage || 'Initial Review'}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Review Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSApplicationsTab;
