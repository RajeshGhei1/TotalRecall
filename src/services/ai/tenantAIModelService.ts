
import { supabase } from '@/integrations/supabase/client';
import { AIContext } from '@/types/ai';

export interface TenantAIModelConfig {
  modelId: string;
  apiKey?: string;
  provider: string;
}

export interface AIModelRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
}

export interface AIModelResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class TenantAIModelService {
  private modelConfigs: Map<string, TenantAIModelConfig> = new Map();

  async getTenantAIConfig(tenantId: string): Promise<TenantAIModelConfig | null> {
    // Check cache first
    if (this.modelConfigs.has(tenantId)) {
      return this.modelConfigs.get(tenantId)!;
    }

    try {
      const { data, error } = await supabase
        .from('tenant_ai_models')
        .select('model_id, api_key')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching tenant AI model:', error);
        return null;
      }

      if (!data) {
        console.log(`No AI model configured for tenant: ${tenantId}`);
        return null;
      }

      const config: TenantAIModelConfig = {
        modelId: data.model_id,
        apiKey: data.api_key,
        provider: this.getProviderFromModelId(data.model_id)
      };

      // Cache the config
      this.modelConfigs.set(tenantId, config);
      return config;
    } catch (error) {
      console.error('Error in getTenantAIConfig:', error);
      return null;
    }
  }

  private getProviderFromModelId(modelId: string): string {
    if (modelId.startsWith('gpt-')) return 'OpenAI';
    if (modelId.startsWith('claude-')) return 'Anthropic';
    if (modelId.startsWith('gemini-')) return 'Google';
    return 'Unknown';
  }

  async makeAIRequest(
    tenantId: string, 
    request: AIModelRequest, 
    context?: AIContext
  ): Promise<AIModelResponse> {
    const config = await this.getTenantAIConfig(tenantId);
    
    if (!config) {
      throw new Error(`No AI model configured for tenant: ${tenantId}`);
    }

    if (!config.apiKey) {
      throw new Error(`No API key configured for tenant AI model: ${config.modelId}`);
    }

    console.log(`Making AI request for tenant ${tenantId} using model ${config.modelId}`);

    switch (config.provider) {
      case 'OpenAI':
        return this.makeOpenAIRequest(config, request);
      case 'Anthropic':
        return this.makeAnthropicRequest(config, request);
      case 'Google':
        return this.makeGoogleRequest(config, request);
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }

  private async makeOpenAIRequest(
    config: TenantAIModelConfig, 
    request: AIModelRequest
  ): Promise<AIModelResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.modelId,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      }
    };
  }

  private async makeAnthropicRequest(
    config: TenantAIModelConfig, 
    request: AIModelRequest
  ): Promise<AIModelResponse> {
    // Convert OpenAI format to Anthropic format
    const systemMessage = request.messages.find(m => m.role === 'system');
    const userMessages = request.messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.modelId,
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
        system: systemMessage?.content || '',
        messages: userMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      }
    };
  }

  private async makeGoogleRequest(
    config: TenantAIModelConfig, 
    request: AIModelRequest
  ): Promise<AIModelResponse> {
    // Placeholder for Google Gemini API integration
    // This would need to be implemented based on Google's API format
    throw new Error('Google Gemini integration not yet implemented');
  }

  clearCache(tenantId?: string): void {
    if (tenantId) {
      this.modelConfigs.delete(tenantId);
    } else {
      this.modelConfigs.clear();
    }
  }

  async validateTenantAIConfig(tenantId: string): Promise<boolean> {
    const config = await this.getTenantAIConfig(tenantId);
    return !!(config && config.apiKey);
  }
}

export const tenantAIModelService = new TenantAIModelService();
