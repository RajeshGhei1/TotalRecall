
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Users, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Person } from '@/types/person';

interface ReportingRelationshipsProps {
  personId: string;
  companyId?: string;
}

interface ReportingPerson {
  id: string;
  full_name: string;
  role: string;
  email?: string;
}

const ReportingRelationships: React.FC<ReportingRelationshipsProps> = ({ 
  personId,
  companyId
}) => {
  const [manager, setManager] = useState<ReportingPerson | null>(null);
  const [directReports, setDirectReports] = useState<ReportingPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportingRelationships = async () => {
      setIsLoading(true);
      try {
        // Fetch manager (who this person reports to)
        const { data: managerData, error: managerError } = await supabase
          .from('company_relationships')
          .select(`
            reports_to,
            role,
            manager:reports_to(
              id,
              person:people(id, full_name, email)
            )
          `)
          .eq('person_id', personId)
          .eq('is_current', true)
          .not('reports_to', 'is', null)
          .maybeSingle();
          
        if (managerError) throw managerError;
        
        // Fetch direct reports (who reports to this person)
        const { data: directReportsData, error: directReportsError } = await supabase
          .from('company_relationships')
          .select(`
            person_id,
            role,
            person:people(id, full_name, email)
          `)
          .eq('reports_to', personId)
          .eq('is_current', true);
          
        if (directReportsError) throw directReportsError;
        
        // Process manager data
        if (managerData?.manager?.person) {
          const managerPerson = managerData.manager.person;
          setManager({
            id: managerPerson.id,
            full_name: managerPerson.full_name,
            email: managerPerson.email,
            role: '' // We don't have the manager's role in this query
          });
        } else {
          setManager(null);
        }
        
        // Process direct reports data
        if (directReportsData && Array.isArray(directReportsData)) {
          const reports = directReportsData
            .filter(item => item.person !== null)
            .map(item => ({
              id: item.person.id,
              full_name: item.person.full_name,
              email: item.person.email,
              role: item.role
            }));
          setDirectReports(reports);
        } else {
          setDirectReports([]);
        }
        
      } catch (error) {
        console.error('Error fetching reporting relationships:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (personId) {
      fetchReportingRelationships();
    }
  }, [personId]);
  
  const handleViewPerson = (id: string) => {
    navigate(`/superadmin/people/${id}`);
  };

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
          <div>
            <div className="text-sm text-muted-foreground mb-2">Reports To</div>
            {manager ? (
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-blue-100">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{manager.full_name}</div>
                    {manager.email && (
                      <div className="text-xs text-muted-foreground">{manager.email}</div>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewPerson(manager.id)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            ) : (
              <div className="border rounded-md p-3 text-center text-muted-foreground">
                No manager assigned
              </div>
            )}
          </div>
          
          {/* Direct reports section */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Direct Reports ({directReports.length})</div>
            {directReports.length > 0 ? (
              <div className="space-y-2">
                {directReports.map(report => (
                  <div key={report.id} className="border rounded-md p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-blue-100">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{report.full_name}</div>
                        <div className="text-xs">{report.role}</div>
                        {report.email && (
                          <div className="text-xs text-muted-foreground">{report.email}</div>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewPerson(report.id)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-md p-3 text-center text-muted-foreground">
                No direct reports
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingRelationships;
