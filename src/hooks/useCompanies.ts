import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Company {
  id: string;
  tr_id: string;
  name: string;
  cin?: string;
  email?: string;
  website?: string;
  domain?: string;
  phone?: string;
  description?: string;
  founded?: number;
  location?: string;
  registeredofficeaddress?: string;
  registeredemailaddress?: string;
  country?: string;
  globalregion?: string;
  region?: string;
  holocation?: string;
  industry1?: string;
  industry2?: string;
  industry3?: string;
  companysector?: string;
  companytype?: string;
  entitytype?: string;
  size?: string;
  noofemployee?: string;
  segmentaspernumberofemployees?: string;
  turnover?: string;
  segmentasperturnover?: string;
  turnoveryear?: string;
  yearofestablishment?: string;
  paidupcapital?: string;
  segmentasperpaidupcapital?: string;
  companystatus?: string;
  registrationdate?: string;
  noofdirectives?: string;
  companyprofile?: string;
  areaofspecialize?: string;
  serviceline?: string;
  verticles?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  parent_company_id?: string;
  company_group_name?: string;
  hierarchy_level?: number;
  created_at: string;
  updated_at: string;
}

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const {
    data: companies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      return data as Company[];
    },
  });

  const createCompany = useMutation({
    mutationFn: async (newCompany: Omit<Company, 'id' | 'tr_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('companies')
        .insert([newCompany])
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully');
    },
    onError: (error) => {
      console.error('Error creating company:', error);
      toast.error('Failed to create company');
    },
  });

  const updateCompany = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Company> & { id: string }) => {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company updated successfully');
    },
    onError: (error) => {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    },
  });

  const refetch = () => {
    return queryClient.invalidateQueries({ queryKey: ['companies'] });
  };

  return {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch,
  };
};

// Hook to search entities by TR ID
export const useSearchByTrId = () => {
  return useMutation({
    mutationFn: async (trId: string) => {
      const { data, error } = await supabase
        .rpc('find_entity_by_tr_id', { p_tr_id: trId });

      if (error) {
        console.error('Error searching by TR ID:', error);
        throw error;
      }

      return data;
    },
  });
};
