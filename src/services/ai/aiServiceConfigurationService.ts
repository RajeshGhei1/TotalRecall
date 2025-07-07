import { supabase } from '@/integrations/supabase/client';

export interface AIServiceConfiguration {
  id: string;
  tenant_id: string;
  service_id: string;
  enabled: boolean;
  selected_model: string;
  api_key_encrypted?: string;
  updated_at: string;
  created_at: string;
}

export interface CreateAIServiceConfigurationRequest {
  tenant_id: string;
  service_id: string;
  enabled: boolean;
  selected_model: string;
  api_key?: string;
}

export interface UpdateAIServiceConfigurationRequest {
  enabled?: boolean;
  selected_model?: string;
  api_key?: string;
}

export class AIServiceConfigurationService {
  // Get all service configurations for a tenant
  async getServiceConfigurations(tenantId: string): Promise<AIServiceConfiguration[]> {
    const { data, error } = await supabase
      .from('ai_service_configurations')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('service_id');
    if (error) throw error;
    return data || [];
  }

  // Get a specific service configuration
  async getServiceConfiguration(tenantId: string, serviceId: string): Promise<AIServiceConfiguration | null> {
    const { data, error } = await supabase
      .from('ai_service_configurations')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('service_id', serviceId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Create or update a service configuration
  async upsertServiceConfiguration(
    tenantId: string,
    serviceId: string,
    config: UpdateAIServiceConfigurationRequest
  ): Promise<AIServiceConfiguration> {
    let apiKeyEncrypted: string | undefined;
    if (config.api_key) {
      apiKeyEncrypted = btoa(config.api_key); // Simple base64 for demo; use real encryption in prod
    }
    const { data, error } = await supabase
      .from('ai_service_configurations')
      .upsert({
        tenant_id: tenantId,
        service_id: serviceId,
        enabled: config.enabled ?? false,
        selected_model: config.selected_model ?? 'gpt-4o-mini',
        api_key_encrypted: apiKeyEncrypted,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Update multiple service configurations at once
  async updateServiceConfigurations(
    tenantId: string,
    configurations: Array<{ service_id: string; config: UpdateAIServiceConfigurationRequest }>
  ): Promise<AIServiceConfiguration[]> {
    const upsertData = configurations.map(({ service_id, config }) => ({
      tenant_id: tenantId,
      service_id,
      enabled: config.enabled ?? false,
      selected_model: config.selected_model ?? 'gpt-4o-mini',
      api_key_encrypted: config.api_key ? btoa(config.api_key) : undefined,
    }));
    const { data, error } = await supabase
      .from('ai_service_configurations')
      .upsert(upsertData)
      .select();
    if (error) throw error;
    return data || [];
  }

  // Delete a service configuration
  async deleteServiceConfiguration(tenantId: string, serviceId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_service_configurations')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('service_id', serviceId);
    if (error) throw error;
  }

  // Get API key for a service (decrypted)
  async getApiKey(tenantId: string, serviceId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('ai_service_configurations')
      .select('api_key_encrypted')
      .eq('tenant_id', tenantId)
      .eq('service_id', serviceId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data?.api_key_encrypted) return null;
    return atob(data.api_key_encrypted);
  }
}

export const aiServiceConfigurationService = new AIServiceConfigurationService(); 