import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ComplianceItem {
  id: string;
  framework: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  last_audit: string;
  next_review: string;
}

export const useComplianceItems = () => {
  return useQuery<ComplianceItem[]>({
    queryKey: ['compliance-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_items')
        .select('*')
        .order('framework', { ascending: true });
      if (error) throw error;
      return data as ComplianceItem[];
    },
  });
};

export const useCreateComplianceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<ComplianceItem, 'id'>) => {
      const { data, error } = await supabase
        .from('compliance_items')
        .insert([item])
        .select();
      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['compliance-items']);
    },
  });
};

export const useUpdateComplianceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: ComplianceItem) => {
      const { data, error } = await supabase
        .from('compliance_items')
        .update(item)
        .eq('id', item.id)
        .select();
      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['compliance-items']);
    },
  });
};

export const useDeleteComplianceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('compliance_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['compliance-items']);
    },
  });
}; 