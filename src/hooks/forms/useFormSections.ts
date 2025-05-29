
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormSection } from '@/types/form-builder';
import { useToast } from '@/hooks/use-toast';

export const useFormSections = (formId: string) => {
  return useQuery({
    queryKey: ['form-sections', formId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_sections')
        .select('*')
        .eq('form_id', formId)
        .order('sort_order');

      if (error) {
        console.error('Error fetching form sections:', error);
        throw error;
      }

      return data as FormSection[];
    },
    enabled: !!formId,
  });
};

export const useCreateFormSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sectionData: Partial<FormSection>) => {
      const { data, error } = await supabase
        .from('form_sections')
        .insert(sectionData)
        .select()
        .single();

      if (error) {
        console.error('Error creating form section:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['form-sections', data.form_id] });
      toast({
        title: 'Success',
        description: 'Section created successfully',
      });
    },
  });
};

export const useUpdateFormSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FormSection> }) => {
      const { data, error } = await supabase
        .from('form_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating form section:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['form-sections', data.form_id] });
      toast({
        title: 'Success',
        description: 'Section updated successfully',
      });
    },
  });
};

export const useDeleteFormSection = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, formId }: { id: string; formId: string }) => {
      const { error } = await supabase
        .from('form_sections')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting form section:', error);
        throw error;
      }

      return formId;
    },
    onSuccess: (formId) => {
      queryClient.invalidateQueries({ queryKey: ['form-sections', formId] });
      toast({
        title: 'Success',
        description: 'Section deleted successfully',
      });
    },
  });
};
