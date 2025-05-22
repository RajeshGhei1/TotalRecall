
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportingPerson, ReportingRelationshipsResult } from '@/types/company-relationship-types';

export const usePersonReportingRelationships = (
  personId?: string,
  companyId?: string
) => {
  const { data: reportingRelationships = { manager: null, directReports: [] }, isLoading, isError, error } = useQuery({
    queryKey: ['person-reporting-relationships', personId, companyId],
    queryFn: async (): Promise<ReportingRelationshipsResult> => {
      if (!personId || !companyId) {
        return { manager: null, directReports: [] };
      }

      try {
        // First, check if this person reports to someone
        const { data: personData, error: personError } = await supabase
          .from('company_relationships')
          .select(`
            reports_to,
            manager:people!company_relationships_reports_to_fkey(
              id,
              full_name,
              email,
              type
            )
          `)
          .eq('person_id', personId)
          .eq('company_id', companyId)
          .eq('is_current', true)
          .maybeSingle();

        if (personError) {
          console.error('Error fetching manager relationship:', personError);
          throw personError;
        }

        // Then get all people who report to this person
        const { data: reportsData, error: reportsError } = await supabase
          .from('company_relationships')
          .select(`
            person:people!company_relationships_person_id_fkey(
              id, 
              full_name,
              email,
              type
            ),
            role
          `)
          .eq('reports_to', personId)
          .eq('company_id', companyId)
          .eq('is_current', true);

        if (reportsError) {
          console.error('Error fetching direct reports:', reportsError);
          throw reportsError;
        }

        // Format data for the response
        let managerPerson: ReportingPerson | null = null;
        
        if (personData && personData.reports_to && personData.manager) {
          const managerData = personData.manager;
          
          if (managerData && typeof managerData === 'object' && 'id' in managerData) {
            managerPerson = {
              id: managerData.id || '',
              full_name: managerData.full_name || '',
              email: managerData.email || null,
              type: managerData.type || '',
              role: undefined // We don't have the role in this query
            };
          }
        }

        const directReports: ReportingPerson[] = [];
        
        if (reportsData && Array.isArray(reportsData)) {
          for (const item of reportsData) {
            if (item && item.person && typeof item.person === 'object' && 'id' in item.person) {
              const personObj = item.person;
              
              if (personObj) {
                directReports.push({
                  id: personObj.id || '',
                  full_name: personObj.full_name || '',
                  email: personObj.email || null,
                  type: personObj.type || '',
                  role: item.role
                });
              }
            }
          }
        }

        return {
          manager: managerPerson,
          directReports
        };
      } catch (error) {
        console.error('Error fetching reporting relationships:', error);
        return { manager: null, directReports: [] };
      }
    },
    enabled: !!personId && !!companyId,
  });

  return {
    reportingRelationships,
    isLoading,
    isError,
    error
  };
};
