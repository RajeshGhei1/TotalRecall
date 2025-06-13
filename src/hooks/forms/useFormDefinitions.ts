
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FormDefinition {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tenant_id?: string;
  is_active: boolean;
  access_level: string;
  visibility_scope?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  settings?: any;
  required_modules?: string[];
}

export interface FormDefinitionInsert {
  name: string;
  slug: string;
  description?: string;
  tenant_id?: string;
  is_active?: boolean;
  access_level?: string;
  visibility_scope?: string;
  created_by?: string;
  settings?: any;
  required_modules?: string[];
}

export const useFormDefinitions = (tenantId?: string) => {
  return useQuery({
    queryKey: ['form-definitions', tenantId],
    queryFn: async () => {
      let query = supabase
        .from('form_definitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FormDefinition[];
    },
    enabled: !!tenantId,
  });
};

export const useCreateFormDefinition = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormDefinitionInsert) => {
      const { data, error } = await supabase
        .from('form_definitions')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-definitions'] });
      toast({
        title: "Success",
        description: "Form created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create form",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateFormDefinition = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormDefinitionInsert> }) => {
      const { data, error } = await supabase
        .from('form_definitions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-definitions'] });
      toast({
        title: "Success",
        description: "Form updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update form",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteFormDefinition = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_definitions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-definitions'] });
      toast({
        title: "Success",
        description: "Form deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete form",
        variant: "destructive"
      });
    }
  });
};
