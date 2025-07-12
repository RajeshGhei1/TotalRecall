
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  version: string;
  capabilities: string[];
  cost_per_token: number;
  max_tokens: number;
  supports_streaming: boolean;
  supports_vision: boolean;
  supports_function_calling: boolean;
  is_active: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useAIModels = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const modelsQuery = useQuery({
    queryKey: ['ai-models'],
    queryFn: async (): Promise<AIModel[]> => {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(model => ({
        ...model,
        configuration: (model.configuration as Record<string, any>) || {}
      }));
    }
  });

  const createModelMutation = useMutation({
    mutationFn: async (modelData: Omit<AIModel, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ai_models')
        .insert([{
          ...modelData,
          configuration: modelData.configuration as unknown
        }])
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        configuration: (data.configuration as Record<string, any>) || {}
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast({
        title: "Success",
        description: "AI model created successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI model",
        variant: "destructive"
      });
    }
  });

  const updateModelMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AIModel> }) => {
      const updateData = {
        ...updates,
        ...(updates.configuration && { configuration: updates.configuration as unknown })
      };
      
      const { data, error } = await supabase
        .from('ai_models')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        configuration: (data.configuration as Record<string, any>) || {}
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast({
        title: "Success",
        description: "AI model updated successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update AI model",
        variant: "destructive"
      });
    }
  });

  const deleteModelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_models')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast({
        title: "Success",
        description: "AI model deleted successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI model",
        variant: "destructive"
      });
    }
  });

  return {
    models: modelsQuery.data || [],
    isLoading: modelsQuery.isLoading,
    error: modelsQuery.error,
    createModel: createModelMutation,
    updateModel: updateModelMutation,
    deleteModel: deleteModelMutation
  };
};
