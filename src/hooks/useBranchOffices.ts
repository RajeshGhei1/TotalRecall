
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BranchOffice {
  id: string;
  company_id: string;
  branch_name: string;
  branch_type: string;
  gst_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  is_headquarters: boolean;
  created_at: string;
  updated_at: string;
}

export interface BranchOfficeFormData {
  branch_name: string;
  branch_type: string;
  gst_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  is_headquarters: boolean;
}

export const useBranchOffices = (companyId?: string) => {
  const queryClient = useQueryClient();

  const { data: branchOffices = [], isLoading, error } = useQuery({
    queryKey: ['branch-offices', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      // Using type assertion since table is newly created
      const { data, error } = await (supabase as unknown)
        .from('company_branch_offices')
        .select('*')
        .eq('company_id', companyId)
        .order('is_headquarters', { ascending: false })
        .order('branch_name');

      if (error) throw error;
      return (data || []) as BranchOffice[];
    },
    enabled: !!companyId,
  });

  const createBranchOffice = useMutation({
    mutationFn: async ({ companyId, data }: { companyId: string; data: BranchOfficeFormData }) => {
      const { data: result, error } = await (supabase as unknown)
        .from('company_branch_offices')
        .insert([{ ...data, company_id: companyId }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-offices', companyId] });
      toast({
        title: 'Success',
        description: 'Branch office created successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: `Failed to create branch office: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateBranchOffice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BranchOfficeFormData> }) => {
      const { data: result, error } = await (supabase as unknown)
        .from('company_branch_offices')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-offices', companyId] });
      toast({
        title: 'Success',
        description: 'Branch office updated successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: `Failed to update branch office: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteBranchOffice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as unknown)
        .from('company_branch_offices')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch-offices', companyId] });
      toast({
        title: 'Success',
        description: 'Branch office deleted successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: `Failed to delete branch office: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    branchOffices,
    isLoading,
    error,
    createBranchOffice,
    updateBranchOffice,
    deleteBranchOffice,
  };
};
