
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';
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
  const { data: reportingData } = useQuery({
    queryKey: ['reporting-indicator', personId],
    queryFn: async () => {
      // Get manager info
      const { data: personRelationship } = await supabase
        .from('company_relationships')
        .select('reports_to')
        .eq('person_id', personId)
        .eq('is_current', true)
        .maybeSingle();

      // Get direct reports count
      const { count: directReportsCount } = await supabase
        .from('company_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('reports_to', personId)
        .eq('is_current', true);

      // Get manager name if exists
      let managerName = null;
      if (personRelationship?.reports_to) {
        const { data: manager } = await supabase
          .from('people')
          .select('full_name')
          .eq('id', personRelationship.reports_to)
          .single();
        managerName = manager?.full_name;
      }

      return {
        hasManager: !!personRelationship?.reports_to,
        managerName,
        directReportsCount: directReportsCount || 0,
      };
    },
    enabled: !!personId,
  });

  if (!reportingData) return null;

  const { hasManager, managerName, directReportsCount } = reportingData;

  if (!hasManager && directReportsCount === 0) return null;

  return (
    <div className="flex gap-1 flex-wrap">
      {hasManager && (
        <Badge variant="outline" className="text-xs">
          <User className="w-3 h-3 mr-1" />
          {showDetails && managerName ? `Reports to ${managerName}` : 'Has Manager'}
        </Badge>
      )}
      {directReportsCount > 0 && (
        <Badge variant="outline" className="text-xs">
          <Users className="w-3 h-3 mr-1" />
          {directReportsCount} Report{directReportsCount !== 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
};

export default ReportingIndicator;
