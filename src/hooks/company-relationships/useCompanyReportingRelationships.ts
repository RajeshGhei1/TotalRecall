
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReportingPerson, CompanyReportingResult } from '@/types/company-relationship-types';
import { 
  CompanyRelationshipWithPersonQueryResult, 
  CompanyRelationshipWithManagerQueryResult 
} from '@/types/supabase-query-types';

export const useCompanyReportingRelationships = (
  companyId: string,
  searchQuery = '',
  reportingType: 'manager' | 'direct-report' = 'manager'
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['company-reporting-relationships', companyId, searchQuery, reportingType],
    queryFn: async (): Promise<CompanyReportingResult> => {
      if (!companyId) {
        return { managers: [], directReports: [] };
      }

      try {
        let managers: ReportingPerson[] = [];
        let directReports: ReportingPerson[] = [];
        
        if (reportingType === 'manager' || reportingType === 'direct-report') {
          // Get all people in this company who have direct reports
          const { data: managerData, error: managerError } = await supabase
            .from('company_relationships')
            .select(`
              person_id,
              role,
              reports_to,
              person:people!company_relationships_person_id_fkey(
                id,
                full_name,
                email,
                type
              )
            `)
            .eq('company_id', companyId)
            .eq('is_current', true);
            
          if (managerError) {
            console.error('Error fetching managers:', managerError);
            throw managerError;
          }
          
          // Find unique managers by looking at the reports_to field
          if (managerData && Array.isArray(managerData)) {
            const typedManagerData = managerData as CompanyRelationshipWithPersonQueryResult[];
            
            // Get unique manager IDs from reports_to field
            const reportsToValues = typedManagerData
              .filter(item => item.reports_to !== null && item.reports_to !== undefined)
              .map(item => item.reports_to);
              
            const managerIds = [...new Set(reportsToValues)];
            
            // For each manager ID, get the person details
            for (const managerId of managerIds) {
              if (managerId) {
                const { data: manager } = await supabase
                  .from('company_relationships')
                  .select(`
                    role,
                    person:people!company_relationships_person_id_fkey(
                      id,
                      full_name,
                      email,
                      type
                    )
                  `)
                  .eq('company_id', companyId)
                  .eq('person_id', managerId)
                  .eq('is_current', true)
                  .maybeSingle();
                  
                if (manager && manager.person) {
                  const typedManager = manager as CompanyRelationshipWithManagerQueryResult;
                  const personData = typedManager.person;
                  
                  if (personData && personData.id) {
                    // Apply search filter if provided
                    const fullName = personData.full_name || '';
                    const email = personData.email || '';
                    
                    if (!searchQuery || 
                        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        email.toLowerCase().includes(searchQuery.toLowerCase())) {
                      managers.push({
                        id: personData.id,
                        full_name: fullName,
                        email: email,
                        type: personData.type,
                        role: typedManager.role
                      });
                    }
                  }
                }
              }
            }
          }
          
          // Get direct reports (people who have a reports_to field)
          const { data: reportData, error: reportError } = await supabase
            .from('company_relationships')
            .select(`
              reports_to,
              role,
              person:people!company_relationships_person_id_fkey(
                id,
                full_name,
                email,
                type
              )
            `)
            .eq('company_id', companyId)
            .eq('is_current', true)
            .not('reports_to', 'is', null)
            .order('role');
            
          if (reportError) {
            console.error('Error fetching direct reports:', reportError);
            throw reportError;
          }
          
          if (reportData && Array.isArray(reportData)) {
            const typedReportData = reportData as CompanyRelationshipWithPersonQueryResult[];
            
            for (const item of typedReportData) {
              if (item.person) {
                const personData = item.person;
                
                if (personData && personData.id) {
                  // Apply search filter if provided
                  const fullName = personData.full_name || '';
                  const email = personData.email || '';
                  
                  if (!searchQuery || 
                      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      email.toLowerCase().includes(searchQuery.toLowerCase())) {
                    directReports.push({
                      id: personData.id,
                      full_name: fullName,
                      email: email,
                      type: personData.type,
                      role: item.role
                    });
                  }
                }
              }
            }
          }
        }
        
        return {
          managers,
          directReports
        };
      } catch (error) {
        console.error('Error fetching company reporting relationships:', error);
        return { managers: [], directReports: [] };
      }
    },
    enabled: !!companyId
  });

  return {
    data: data || { managers: [], directReports: [] },
    isLoading,
    error
  };
};
