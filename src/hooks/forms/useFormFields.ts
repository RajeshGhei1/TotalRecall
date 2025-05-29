
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormField } from '@/types/form-builder';
import { useToast } from '@/hooks/use-toast';

export const useFormFields = (formId?: string, sectionId?: string) => {
  return useQuery({
    queryKey: ['form-fields', formId, sectionId],
    queryFn: async () => {
      let query = supabase
        .from('custom_fields')
        .select('*')
        .order('sort_order');

      if (formId) {
        query = query.eq('form_id', formId);
      }

      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching form fields:', error);
        throw error;
      }

      return data as FormField[];
    },
    enabled: !!(formId || sectionId),
  });
};

export const useCreateFormField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fieldData: Partial<FormField>) => {
      const { data, error } = await supabase
        .from('custom_fields')
        .insert(fieldData)
        .select()
        .single();

      if (error) {
        console.error('Error creating form field:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast({
        title: 'Success',
        description: 'Field created successfully',
      });
    },
  });
};

export const useUpdateFormField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormField> }) => {
      const { data, error } = await supabase
        .from('custom_fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating form field:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-fields'] });
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast({
        title: 'Success',
        description: 'Field updated successfully',
      });
    },
  });
};
