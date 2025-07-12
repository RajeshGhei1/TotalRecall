
import { supabase } from '@/integrations/supabase/client';
import { tenantAIModelService } from './tenantAIModelService';

export interface ModelHealthStatus {
  modelId: string;
  provider: string;
  isHealthy: boolean;
  responseTime: number;
  lastChecked: Date;
  errorCount: number;
  errorMessage?: string;
}

export interface ModelHealthMetrics {
  totalModels: number;
  healthyModels: number;
  unhealthyModels: number;
  averageResponseTime: number;
  uptime: number;
}

export class AIModelHealthService {
  private healthChecks: Map<string, ModelHealthStatus> = new Map();
  private checkInterval: number = 5 * 60 * 1000; // 5 minutes

  async initializeHealthMonitoring(): Promise<void> {
    console.log('Initializing AI model health monitoring...');
    
    // Start periodic health checks
    setInterval(() => {
      this.performHealthChecks();
    }, this.checkInterval);

    // Perform initial health check
    await this.performHealthChecks();
  }

  async performHealthChecks(): Promise<void> {
    console.log('Performing AI model health checks...');

    try {
      // Get all configured tenant models
      const { data: tenantModels } = await supabase
        .from('tenant_ai_models')
        .select('tenant_id, model_id, api_key');

      if (!tenantModels) return;

      for (const tenantModel of tenantModels) {
        await this.checkModelHealth(tenantModel.tenant_id, tenantModel.model_id);
      }

      // Check default models
      const defaultModels = ['gpt-4o-mini', 'gpt-4o', 'claude-3-sonnet'];
      for (const modelId of defaultModels) {
        await this.checkModelHealth(null, modelId);
      }

    } catch (error) {
      console.error('Error during health checks:', error);
    }
  }

  private async checkModelHealth(tenantId: string | null, modelId: string): Promise<void> {
    const startTime = Date.now();
    let isHealthy = false;
    let errorMessage: string | undefined;

    try {
      if (tenantId) {
        // Test tenant-specific model
        const testRequest = {
          messages: [{ role: 'user' as const, content: 'Health check test' }],
          temperature: 0.1,
          maxTokens: 10
        };

        await tenantAIModelService.makeAIRequest(tenantId, testRequest);
        isHealthy = true;
      } else {
        // For default models, just check if they're in our supported list
        isHealthy = ['gpt-4o-mini', 'gpt-4o', 'claude-3-sonnet', 'claude-3-opus', 'gemini-pro'].includes(modelId);
      }
    } catch (error) {
      isHealthy = false;
      errorMessage = (error as Error).message;
    }

    const responseTime = Date.now() - startTime;
    const healthKey = `${tenantId || 'default'}-${modelId}`;

    const existingHealth = this.healthChecks.get(healthKey);
    const errorCount = isHealthy ? 0 : (existingHealth?.errorCount || 0) + 1;

    const healthStatus: ModelHealthStatus = {
      modelId,
      provider: this.getProviderFromModelId(modelId),
      isHealthy,
      responseTime,
      lastChecked: new Date(),
      errorCount,
      errorMessage
    };

    this.healthChecks.set(healthKey, healthStatus);

    // Log health status to database
    await this.logHealthStatus(tenantId, healthStatus);

    if (!isHealthy && errorCount > 3) {
      console.warn(`Model ${modelId} has failed ${errorCount} consecutive health checks`);
      await this.triggerHealthAlert(tenantId, modelId, errorMessage);
    }
  }

  private async logHealthStatus(tenantId: string | null, status: ModelHealthStatus): Promise<void> {
    try {
      await supabase
        .from('ai_request_logs')
        .insert({
          request_id: `health_check_${Date.now()}`,
          tenant_id: tenantId,
          model_id: null,
          agent_id: null,
          user_id: null,
          request_type: 'health_check',
          status: status.isHealthy ? 'completed' : 'failed',
          response_time_ms: status.responseTime,
          error_message: status.errorMessage,
          context: {
            model_id: status.modelId,
            provider: status.provider,
            error_count: status.errorCount
          } as unknown
        });
    } catch (error) {
      console.error('Error logging health status:', error);
    }
  }

  private async triggerHealthAlert(tenantId: string | null, modelId: string, errorMessage?: string): Promise<void> {
    console.error(`ALERT: Model ${modelId} is unhealthy for tenant ${tenantId}. Error: ${errorMessage}`);
    
    // In a production environment, this would trigger notifications
    // For now, we'll just log to the database
    try {
      await supabase
        .from('ai_request_logs')
        .insert({
          request_id: `alert_${Date.now()}`,
          tenant_id: tenantId,
          model_id: null,
          agent_id: null,
          user_id: null,
          request_type: 'health_alert',
          status: 'failed',
          response_time_ms: 0,
          error_message: `Model ${modelId} health alert: ${errorMessage}`,
          context: {
            alert_type: 'model_health',
            model_id: modelId,
            consecutive_failures: true
          } as unknown
        });
    } catch (error) {
      console.error('Error logging health alert:', error);
    }
  }

  private getProviderFromModelId(modelId: string): string {
    if (modelId.startsWith('gpt-')) return 'OpenAI';
    if (modelId.startsWith('claude-')) return 'Anthropic';
    if (modelId.startsWith('gemini-')) return 'Google';
    return 'Unknown';
  }

  getHealthMetrics(): ModelHealthMetrics {
    const statuses = Array.from(this.healthChecks.values());
    const healthyModels = statuses.filter(s => s.isHealthy).length;
    const totalModels = statuses.length;
    const averageResponseTime = statuses.reduce((sum, s) => sum + s.responseTime, 0) / totalModels || 0;
    const uptime = totalModels > 0 ? (healthyModels / totalModels) * 100 : 100;

    return {
      totalModels,
      healthyModels,
      unhealthyModels: totalModels - healthyModels,
      averageResponseTime: Math.round(averageResponseTime),
      uptime: Math.round(uptime * 100) / 100
    };
  }

  getModelStatus(tenantId: string | null, modelId: string): ModelHealthStatus | null {
    const healthKey = `${tenantId || 'default'}-${modelId}`;
    return this.healthChecks.get(healthKey) || null;
  }

  getAllHealthStatuses(): ModelHealthStatus[] {
    return Array.from(this.healthChecks.values());
  }
}

export const aiModelHealthService = new AIModelHealthService();
