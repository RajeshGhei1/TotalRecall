
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReportingIndicatorProps {
  personId: string;
  showDetails?: boolean;
}

const ReportingIndicator: React.FC<ReportingIndicatorProps> = ({ 
  personId, 
  showDetails = false 
}) => {
  const { data: reportingData, isLoading, error } = useQuery({
    queryKey: ['reporting-indicator', personId],
    queryFn: async () => {
      // Get current relationship for this person
      const { data: currentRelationship } = await supabase
        .from('company_relationships')
        .select(`
          reports_to,
          role,
          company_id,
          companies (
            id,
            name
          ),
          company_branch_offices (
            id,
            branch_name,
            city
          ),
          manager:people!company_relationships_reports_to_fkey (
            id,
            full_name
          )
        `)
        .eq('person_id', personId)
        .eq('is_current', true)
        .maybeSingle();

      // Get direct reports count within the same company
      const { count: directReportsCount } = await supabase
        .from('company_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('reports_to', personId)
        .eq('is_current', true);

      const result = {
        hasManager: !!currentRelationship?.reports_to,
        managerName: currentRelationship?.manager?.full_name || null,
        directReportsCount: directReportsCount || 0,
        companyName: currentRelationship?.companies?.name || null,
        branchName: currentRelationship?.company_branch_offices?.branch_name || null,
        branchCity: currentRelationship?.company_branch_offices?.city || null,
        role: currentRelationship?.role || null,
        hasCompanyLink: !!currentRelationship?.company_id,
      };

      return result;
    },
    enabled: !!personId,
  });

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !reportingData) {
    return null;
  }

  const { 
    hasManager, 
    managerName, 
    directReportsCount, 
    companyName, 
    branchName, 
    branchCity, 
    role,
    hasCompanyLink 
  } = reportingData;

  if (!hasCompanyLink) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-600 mb-1">Company Status</div>
        <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-500">
          Not linked to company
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-600 mb-1">Company & Reporting</div>
      
      {/* Company Information */}
      {companyName && (
        <div className="flex items-center gap-1 mb-2">
          <Building className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">{companyName}</span>
          {branchName && (
            <span className="text-xs text-gray-500">
              • {branchName}{branchCity && ` (${branchCity})`}
            </span>
          )}
        </div>
      )}
      
      {/* Role */}
      {role && (
        <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700 mb-2">
          {role}
        </Badge>
      )}
      
      {/* Reporting Structure */}
      <div className="flex gap-2 flex-wrap">
        {hasManager ? (
          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
            <ArrowUp className="w-3 h-3 mr-1" />
            {showDetails && managerName ? `Reports to ${managerName}` : 'Has Manager'}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-500">
            No Manager
          </Badge>
        )}
        
        {directReportsCount > 0 ? (
          <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
            <ArrowDown className="w-3 h-3 mr-1" />
            {directReportsCount} Direct Report{directReportsCount !== 1 ? 's' : ''}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-500">
            No Reports
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ReportingIndicator;
