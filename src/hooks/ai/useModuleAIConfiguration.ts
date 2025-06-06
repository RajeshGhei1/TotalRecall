
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ModuleAIConfig {
  direct_assignment: string | null;
  preferred_agents: string[];
  token_budget: number;
  overage_policy: 'block' | 'allow' | 'notify';
  performance_weights: {
    speed: number;
    accuracy: number;
    cost: number;
  };
}

const defaultConfig: ModuleAIConfig = {
  direct_assignment: null,
  preferred_agents: [],
  token_budget: 10000,
  overage_policy: 'notify',
  performance_weights: {
    speed: 0.3,
    accuracy: 0.5,
    cost: 0.2
  }
};

export const useModuleAIConfiguration = (moduleId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentConfig, isLoading } = useQuery({
    queryKey: ['module-ai-config', moduleId],
    queryFn: async (): Promise<ModuleAIConfig> => {
      if (!moduleId) return defaultConfig;

      // For now, return default config as we build out the AI configuration system
      // This will be expanded to store/retrieve actual configurations
      return defaultConfig;
    },
    enabled: !!moduleId
  });

  const updateModuleConfig = (moduleId: string, updates: Partial<ModuleAIConfig>) => {
    queryClient.setQueryData(['module-ai-config', moduleId], (old: ModuleAIConfig) => ({
      ...old,
      ...updates
    }));
  };

  const saveConfigurationMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const config = queryClient.getQueryData(['module-ai-config', moduleId]) as ModuleAIConfig;
      
      // Here we would save to the database - for now we just log
      console.log('Saving AI configuration for module:', moduleId, config);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return config;
    },
    onSuccess: () => {
      toast({
        title: "Configuration Saved",
        description: "AI module configuration has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive"
      });
    }
  });

  const saveConfiguration = async (moduleId: string) => {
    await saveConfigurationMutation.mutateAsync(moduleId);
  };

  return {
    currentConfig: currentConfig || defaultConfig,
    updateModuleConfig,
    saveConfiguration,
    isSaving: saveConfigurationMutation.isPending,
    isLoading
  };
};
