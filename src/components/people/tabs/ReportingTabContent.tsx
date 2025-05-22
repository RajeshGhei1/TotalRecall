
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanyReportingRelationships } from '@/hooks/company-relationships/useCompanyReportingRelationships';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReportingPerson } from '@/types/company-relationship-types';

interface ReportingTabContentProps {
  companyId: string;
  reportingType: 'manager' | 'direct-report';
  searchQuery?: string;
}

const ReportingTabContent: React.FC<ReportingTabContentProps> = ({ 
  companyId, 
  reportingType,
  searchQuery = ''
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data, isLoading } = useCompanyReportingRelationships(companyId, searchQuery, reportingType);
  
  const people = reportingType === 'manager' ? data.managers : data.directReports;
  
  const handleViewProfile = (personId: string) => {
    navigate(`/superadmin/people/${personId}`);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (people.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          {reportingType === 'manager' ? (
            <>
              <Building className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Managers Found</h3>
              <p className="text-muted-foreground">
                There are no people in this company with team management responsibilities.
              </p>
            </>
          ) : (
            <>
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Direct Reports Found</h3>
              <p className="text-muted-foreground">
                There are no people in this company with reporting relationships.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {reportingType === 'manager' ? 'Managers' : 'Direct Reports'} in Company
        </CardTitle>
        <CardDescription>
          {reportingType === 'manager' 
            ? 'People who have team management responsibilities' 
            : 'People who report to managers'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="space-y-4 divide-y">
            {people.map((person) => (
              <div key={person.id} className="pt-4 first:pt-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {person.full_name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{person.full_name}</div>
                      <div className="text-sm text-muted-foreground">{person.email}</div>
                      {person.role && <div className="text-xs mt-1">Role: {person.role}</div>}
                    </div>
                  </div>
                  <div>
                    <Badge variant={person.type === 'talent' ? 'default' : 'secondary'}>
                      {person.type === 'talent' ? 'Talent' : 'Contact'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewProfile(person.id)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.full_name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>
                    <Badge variant={person.type === 'talent' ? 'default' : 'secondary'}>
                      {person.type === 'talent' ? 'Talent' : 'Contact'}
                    </Badge>
                  </TableCell>
                  <TableCell>{person.role}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewProfile(person.id)}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportingTabContent;
