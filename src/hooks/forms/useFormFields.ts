
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormField, FormFieldInsert } from '@/types/form-builder';
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

      // Transform the data to match our FormField interface
      return data.map(field => ({
        ...field,
        options: typeof field.options === 'string' ? JSON.parse(field.options) : field.options,
        applicable_forms: Array.isArray(field.applicable_forms) ? field.applicable_forms : 
          typeof field.applicable_forms === 'string' ? JSON.parse(field.applicable_forms) : []
      })) as FormField[];
    },
    enabled: !!(formId || sectionId),
  });
};

export const useCreateFormField = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fieldData: Omit<FormFieldInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('custom_fields')
        .insert({
          ...fieldData,
          options: fieldData.options || null,
          applicable_forms: fieldData.applicable_forms || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating form field:', error);
        throw error;
      }

      // Transform the response to match our FormField interface
      return {
        ...data,
        options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options,
        applicable_forms: Array.isArray(data.applicable_forms) ? data.applicable_forms : 
          typeof data.applicable_forms === 'string' ? JSON.parse(data.applicable_forms) : []
      } as FormField;
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
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormFieldInsert> }) => {
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

      // Transform the response to match our FormField interface
      return {
        ...data,
        options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options,
        applicable_forms: Array.isArray(data.applicable_forms) ? data.applicable_forms : 
          typeof data.applicable_forms === 'string' ? JSON.parse(data.applicable_forms) : []
      } as FormField;
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
