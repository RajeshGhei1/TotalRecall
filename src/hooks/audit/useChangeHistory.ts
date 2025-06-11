
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormChangeHistory, ReportChangeHistory } from '@/types/form-change-history';
import { useSecureQueryKey } from '@/hooks/security/useSecureQueryKey';

export const useFormChangeHistory = (formId?: string) => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('form-change-history', [formId]),
    queryFn: async () => {
      let query = supabase
        .from('form_change_history')
        .select(`
          *,
          profiles:changed_by (
            id,
            email,
            full_name
          )
        `)
        .order('changed_at', { ascending: false });

      if (formId) {
        query = query.eq('form_id', formId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as FormChangeHistory[];
    },
    enabled: !!formId,
  });
};

export const useReportChangeHistory = (reportId?: string) => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('report-change-history', [reportId]),
    queryFn: async () => {
      let query = supabase
        .from('report_change_history')
        .select(`
          *,
          profiles:changed_by (
            id,
            email,
            full_name
          )
        `)
        .order('changed_at', { ascending: false });

      if (reportId) {
        query = query.eq('report_id', reportId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as ReportChangeHistory[];
    },
    enabled: !!reportId,
  });
};

export const useAllChangeHistory = () => {
  const { createSecureKey } = useSecureQueryKey();
  
  return useQuery({
    queryKey: createSecureKey('all-change-history'),
    queryFn: async () => {
      // Get form changes
      const { data: formChanges, error: formError } = await supabase
        .from('form_change_history')
        .select(`
          *,
          profiles:changed_by (
            id,
            email,
            full_name
          )
        `)
        .order('changed_at', { ascending: false })
        .limit(100);

      if (formError) throw formError;

      // Get report changes
      const { data: reportChanges, error: reportError } = await supabase
        .from('report_change_history')
        .select(`
          *,
          profiles:changed_by (
            id,
            email,
            full_name
          )
        `)
        .order('changed_at', { ascending: false })
        .limit(100);

      if (reportError) throw reportError;

      // Combine and sort by date
      const allChanges = [
        ...(formChanges || []).map(change => ({ ...change, entity_type: 'form' })),
        ...(reportChanges || []).map(change => ({ ...change, entity_type: 'report' }))
      ].sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

      return allChanges;
    },
  });
};
