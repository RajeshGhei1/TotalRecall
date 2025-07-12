import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTenantContext } from '@/contexts/TenantContext';
import { aiServiceConfigurationService } from '@/services/ai/aiServiceConfigurationService';

export interface AIService {
  id: string;
  name: string;
  description: string;
  service_type: string;
  category: string;
  is_active: boolean;
  configuration: {
    model_preference?: string;
    api_key?: string;
    endpoint_url?: string;
    rate_limit?: number;
    timeout?: number;
    retry_attempts?: number;
  };
  performance_metrics?: {
    total_requests: number;
    success_rate: number;
    average_response_time: number;
    last_used?: string;
  };
  modules: string[];
  capabilities: string[];
  created_at: string;
  updated_at: string;
  tenant_id?: string;
}

export interface CreateAIServiceRequest {
  name: string;
  description: string;
  service_type: string;
  category: string;
  configuration?: AIService['configuration'];
  modules: string[];
  capabilities: string[];
}

export interface UpdateAIServiceRequest {
  name?: string;
  description?: string;
  service_type?: string;
  category?: string;
  is_active?: boolean;
  configuration?: AIService['configuration'];
  modules?: string[];
  capabilities?: string[];
}

export const useAIServices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedTenantId } = useTenantContext();

  // Get all AI services
  const servicesQuery = useQuery({
    queryKey: ['ai-services', selectedTenantId],
    queryFn: async (): Promise<AIService[]> => {
      const { data, error } = await supabase
        .from('ai_services')
        .select('*')
        .eq('tenant_id', selectedTenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(service => ({
        ...service,
        configuration: (service.configuration as AIService['configuration']) || {},
        performance_metrics: (service.performance_metrics as AIService['performance_metrics']) || {},
        modules: service.modules || [],
        capabilities: service.capabilities || []
      }));
    },
    enabled: !!selectedTenantId
  });

  // Create AI service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: CreateAIServiceRequest) => {
      const { data, error } = await supabase
        .from('ai_services')
        .insert([{
          ...serviceData,
          tenant_id: selectedTenantId,
          is_active: true,
          configuration: serviceData.configuration || {},
          performance_metrics: {
            total_requests: 0,
            success_rate: 0,
            average_response_time: 0
          }
        }])
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        configuration: (data.configuration as AIService['configuration']) || {},
        performance_metrics: (data.performance_metrics as AIService['performance_metrics']) || {},
        modules: data.modules || [],
        capabilities: data.capabilities || []
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-services', selectedTenantId] });
      toast({
        title: "Success",
        description: "AI service created successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create AI service",
        variant: "destructive"
      });
    }
  });

  // Update AI service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ serviceId, updates }: { serviceId: string; updates: UpdateAIServiceRequest }) => {
      const updateData = {
        ...updates,
        ...(updates.configuration && { configuration: updates.configuration as any })
      };
      
      const { data, error } = await supabase
        .from('ai_services')
        .update(updateData)
        .eq('id', serviceId)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        configuration: (data.configuration as AIService['configuration']) || {},
        performance_metrics: (data.performance_metrics as AIService['performance_metrics']) || {},
        modules: data.modules || [],
        capabilities: data.capabilities || []
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-services', selectedTenantId] });
      toast({
        title: "Success",
        description: "AI service updated successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update AI service",
        variant: "destructive"
      });
    }
  });

  // Delete AI service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const { error } = await supabase
        .from('ai_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-services', selectedTenantId] });
      toast({
        title: "Success",
        description: "AI service deleted successfully"
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI service",
        variant: "destructive"
      });
    }
  });

  // Add these methods for service config persistence
  const saveServiceConfigs = async (configs, tenantId) => {
    // Map UI configs to backend format
    const upserts = configs.map(cfg => ({
      service_id: cfg.id,
      enabled: cfg.enabled,
      selected_model: cfg.selectedModel,
      api_key: cfg.apiKey,
    }));
    return aiServiceConfigurationService.updateServiceConfigurations(tenantId, upserts.map(u => ({ service_id: u.service_id, config: u })));
  };

  const fetchServiceConfigs = async (tenantId) => {
    return aiServiceConfigurationService.getServiceConfigurations(tenantId);
  };

  return {
    // Data
    services: servicesQuery.data || [],
    isLoading: servicesQuery.isLoading,
    error: servicesQuery.error,
    
    // Mutations
    createService: createServiceMutation,
    updateService: updateServiceMutation,
    deleteService: deleteServiceMutation,
    
    // Utilities
    refetch: servicesQuery.refetch,
    saveServiceConfigs,
    fetchServiceConfigs
  };
}; 