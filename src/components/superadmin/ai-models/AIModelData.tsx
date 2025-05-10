
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AIModel } from './types';

// Mock AI models - in a real application, these would come from an API or database
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

// Mock function to get the current AI model for a tenant
// In a real application, this would be fetched from the database
export const getTenantModel = (tenantId: string, availableModels: AIModel[]) => {
  // This is a placeholder. In a real application, this would be fetched from the database
  return availableModels[0].id;
};

// Mock function to get the API key for a tenant's AI model
// In a real application, this would be fetched securely from the database
export const getTenantModelApiKey = (tenantId: string, modelId: string): string => {
  // This is a placeholder. In a real application, this would be fetched from a secure storage
  return '';
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
      return data;
    },
  });
};
