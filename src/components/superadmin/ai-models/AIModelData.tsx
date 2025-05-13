
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AIModel } from './types';
import { toast } from '@/hooks/use-toast';

// Available AI models - hardcoded for now as these are system-defined
export const useAvailableModels = (): AIModel[] => {
  return [
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      description: 'Latest multimodal GPT model with vision capabilities',
      isDefault: true,
      requiresApiKey: true,
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      description: 'Smaller, faster version of GPT-4o',
      isDefault: false,
      requiresApiKey: true,
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Most powerful Claude model for complex reasoning',
      isDefault: false,
      requiresApiKey: true,
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Balanced Claude model for most use cases',
      isDefault: false,
      requiresApiKey: true,
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Google\'s Gemini Pro model for general purpose tasks',
      isDefault: false,
      requiresApiKey: true,
    },
  ];
};

// Hook to fetch the current AI model for a tenant
export const useTenantModel = (tenantId: string | null) => {
  return useQuery({
    queryKey: ['tenant-ai-model', tenantId],
    queryFn: async () => {
      if (!tenantId) return null;
      
      // We can directly query the database now that the table exists
      const { data, error } = await supabase
        .from('tenant_ai_models')
        .select('model_id, api_key')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tenant model:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!tenantId,
  });
};

// Function to get a model by ID from the available models
export const getModelById = (modelId: string, availableModels: AIModel[]): AIModel | undefined => {
  return availableModels.find(model => model.id === modelId);
};

// Hook to fetch tenants
export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants-ai-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};

// Hook to save a tenant's AI model assignment
export const useAssignModelToTenant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      tenantId, 
      modelId, 
      apiKey 
    }: { 
      tenantId: string; 
      modelId: string; 
      apiKey?: string;
    }) => {
      // We can use the database directly now that the table exists
      // First check if a record already exists
      const { data: existing } = await supabase
        .from('tenant_ai_models')
        .select('id')
        .eq('tenant_id', tenantId)
        .maybeSingle();
      
      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('tenant_ai_models')
          .update({ 
            model_id: modelId,
            api_key: apiKey,
            updated_at: new Date().toISOString()
          })
          .eq('tenant_id', tenantId);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('tenant_ai_models')
          .insert({
            tenant_id: tenantId,
            model_id: modelId,
            api_key: apiKey || null
          });
          
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-ai-model', variables.tenantId] });
      toast({
        title: "AI Model Updated",
        description: `Successfully assigned AI model to tenant`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to assign AI model: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// Helper function for backwards compatibility
export const getTenantModel = (tenantId: string, availableModels: AIModel[]) => {
  // This should return a default model ID until the real data is loaded
  return availableModels[0].id;
};
