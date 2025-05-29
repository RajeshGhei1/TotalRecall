
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormModuleAssignment, FormModuleAssignmentInsert } from '@/types/form-builder';
import { useToast } from '@/hooks/use-toast';

export const useFormModuleAssignments = (formId?: string) => {
  return useQuery({
    queryKey: ['form-module-assignments', formId],
    queryFn: async () => {
      let query = supabase
        .from('form_module_assignments')
        .select(`
          *,
          system_modules:module_id (
            id,
            name,
            description,
            category
          )
        `)
        .order('created_at');

      if (formId) {
        query = query.eq('form_id', formId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching form module assignments:', error);
        throw error;
      }

      return data as (FormModuleAssignment & {
        system_modules: {
          id: string;
          name: string;
          description?: string;
          category: string;
        };
      })[];
    },
    enabled: !!formId,
  });
};

export const useAssignFormToModule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignment: FormModuleAssignmentInsert) => {
      const { data, error } = await supabase
        .from('form_module_assignments')
        .insert(assignment)
        .select()
        .single();

      if (error) {
        console.error('Error assigning form to module:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-module-assignments'] });
      toast({
        title: 'Success',
        description: 'Form assigned to module successfully',
      });
    },
    onError: (error) => {
      console.error('Error assigning form to module:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign form to module',
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveFormModuleAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('form_module_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        console.error('Error removing form module assignment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-module-assignments'] });
      toast({
        title: 'Success',
        description: 'Module assignment removed successfully',
      });
    },
    onError: (error) => {
      console.error('Error removing form module assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove module assignment',
        variant: 'destructive',
      });
    },
  });
};

// Hook to get available modules for assignment
export const useAvailableModules = () => {
  return useQuery({
    queryKey: ['available-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching available modules:', error);
        throw error;
      }

      return data;
    },
  });
};
