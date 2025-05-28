
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface SystemModule {
  id: string;
  name: string;
  description?: string;
  category: string;
  version: string;
  is_active: boolean;
  default_limits?: Json;
  dependencies?: string[];
  created_at: string;
  updated_at: string;
}

export const useSystemModules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const modulesQuery = useQuery({
    queryKey: ['system-modules'],
    queryFn: async (): Promise<SystemModule[]> => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const createModuleMutation = useMutation({
    mutationFn: async (moduleData: Omit<SystemModule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('system_modules')
        .insert([moduleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
      toast({
        title: "Success",
        description: "Module created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create module",
        variant: "destructive"
      });
    }
  });

  const updateModuleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SystemModule> }) => {
      const { data, error } = await supabase
        .from('system_modules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
      toast({
        title: "Success",
        description: "Module updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update module",
        variant: "destructive"
      });
    }
  });

  const deleteModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('system_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-modules'] });
      toast({
        title: "Success",
        description: "Module deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete module",
        variant: "destructive"
      });
    }
  });

  return {
    data: modulesQuery.data || [],
    isLoading: modulesQuery.isLoading,
    error: modulesQuery.error,
    createModule: createModuleMutation,
    updateModule: updateModuleMutation,
    deleteModule: deleteModuleMutation
  };
};
