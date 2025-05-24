
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
            reports_to
          `)
          .eq('person_id', personId)
          .eq('company_id', companyId)
          .eq('is_current', true)
          .maybeSingle();

        if (personError) {
          console.error('Error fetching person relationship:', personError);
          throw personError;
        }

        let managerPerson: ReportingPerson | null = null;
        
        // If person has a manager, fetch manager details
        if (personData && personData.reports_to) {
          const { data: managerData, error: managerError } = await supabase
            .from('people')
            .select(`
              id,
              full_name,
              email,
              type
            `)
            .eq('id', personData.reports_to)
            .single();

          if (managerError) {
            console.error('Error fetching manager:', managerError);
          } else if (managerData) {
            managerPerson = {
              id: managerData.id,
              full_name: managerData.full_name,
              email: managerData.email,
              type: managerData.type,
              role: undefined // We don't have the role in this query
            };
          }
        }

        // Then get all people who report to this person
        const { data: reportsData, error: reportsError } = await supabase
          .from('company_relationships')
          .select(`
            role,
            person_id
          `)
          .eq('reports_to', personId)
          .eq('company_id', companyId)
          .eq('is_current', true);

        if (reportsError) {
          console.error('Error fetching direct reports:', reportsError);
          throw reportsError;
        }

        const directReports: ReportingPerson[] = [];
        
        if (reportsData && Array.isArray(reportsData)) {
          // Fetch person details for each direct report
          for (const report of reportsData) {
            if (report.person_id) {
              const { data: personData, error: personError } = await supabase
                .from('people')
                .select(`
                  id,
                  full_name,
                  email,
                  type
                `)
                .eq('id', report.person_id)
                .single();

              if (!personError && personData) {
                directReports.push({
                  id: personData.id,
                  full_name: personData.full_name,
                  email: personData.email,
                  type: personData.type,
                  role: report.role
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
