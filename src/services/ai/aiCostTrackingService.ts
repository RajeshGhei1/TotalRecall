
import { supabase } from '@/integrations/supabase/client';

export interface CostCalculation {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export interface TenantCostSummary {
  tenantId: string;
  totalCost: number;
  totalRequests: number;
  averageCostPerRequest: number;
  costByModel: Record<string, number>;
  costByDate: Record<string, number>;
}

export class AICostTrackingService {
  // Cost per 1K tokens (input/output) for different models
  private modelCosts = {
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'gemini-pro': { input: 0.00025, output: 0.0005 }
  };

  calculateCost(modelId: string, inputTokens: number, outputTokens: number): CostCalculation {
    const costs = this.modelCosts[modelId as keyof typeof this.modelCosts] || 
                  { input: 0.001, output: 0.002 }; // Default fallback

    const inputCost = (inputTokens / 1000) * costs.input;
    const outputCost = (outputTokens / 1000) * costs.output;
    const totalCost = inputCost + outputCost;

    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      inputCost,
      outputCost,
      totalCost
    };
  }

  async trackRequestCost(
    requestId: string,
    tenantId: string | null,
    modelId: string,
    inputTokens: number,
    outputTokens: number,
    agentId?: string
  ): Promise<CostCalculation> {
    const costCalc = this.calculateCost(modelId, inputTokens, outputTokens);

    try {
      // Update the request log with cost information
      await supabase
        .from('ai_request_logs')
        .update({
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_cost: costCalc.totalCost
        })
        .eq('request_id', requestId);

      // Update performance metrics with cost
      const today = new Date().toISOString().split('T')[0];
      
      if (agentId) {
        const { data: existing } = await supabase
          .from('ai_performance_metrics')
          .select('total_cost, total_requests')
          .eq('agent_id', agentId)
          .eq('tenant_id', tenantId || null)
          .eq('metric_date', today)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('ai_performance_metrics')
            .update({
              total_cost: existing.total_cost + costCalc.totalCost
            })
            .eq('agent_id', agentId)
            .eq('tenant_id', tenantId || null)
            .eq('metric_date', today);
        }
      }

      console.log(`Cost tracked: $${costCalc.totalCost.toFixed(6)} for ${costCalc.totalTokens} tokens`);

    } catch (error) {
      console.error('Error tracking request cost:', error);
    }

    return costCalc;
  }

  async getTenantCostSummary(tenantId: string, days: number = 30): Promise<TenantCostSummary> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const { data: logs } = await supabase
        .from('ai_request_logs')
        .select('total_cost, created_at, context')
        .eq('tenant_id', tenantId)
        .gte('created_at', startDate.toISOString())
        .not('total_cost', 'is', null);

      if (!logs) {
        return {
          tenantId,
          totalCost: 0,
          totalRequests: 0,
          averageCostPerRequest: 0,
          costByModel: {},
          costByDate: {}
        };
      }

      const totalCost = logs.reduce((sum, log) => sum + (log.total_cost || 0), 0);
      const totalRequests = logs.length;
      const averageCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0;

      // Group by model
      const costByModel: Record<string, number> = {};
      logs.forEach(log => {
        const modelId = (log.context as any)?.model_id || 'unknown';
        costByModel[modelId] = (costByModel[modelId] || 0) + (log.total_cost || 0);
      });

      // Group by date
      const costByDate: Record<string, number> = {};
      logs.forEach(log => {
        const date = log.created_at.split('T')[0];
        costByDate[date] = (costByDate[date] || 0) + (log.total_cost || 0);
      });

      return {
        tenantId,
        totalCost,
        totalRequests,
        averageCostPerRequest,
        costByModel,
        costByDate
      };

    } catch (error) {
      console.error('Error getting tenant cost summary:', error);
      throw error;
    }
  }

  async checkBudgetLimits(tenantId: string): Promise<{
    isWithinBudget: boolean;
    currentSpend: number;
    budgetLimit?: number;
    utilizationPercentage: number;
  }> {
    // For now, we'll use a default budget limit
    // In production, this would come from tenant settings
    const defaultBudgetLimit = 100; // $100 per month

    const costSummary = await this.getTenantCostSummary(tenantId, 30);
    const utilizationPercentage = (costSummary.totalCost / defaultBudgetLimit) * 100;

    return {
      isWithinBudget: costSummary.totalCost <= defaultBudgetLimit,
      currentSpend: costSummary.totalCost,
      budgetLimit: defaultBudgetLimit,
      utilizationPercentage: Math.min(utilizationPercentage, 100)
    };
  }

  getModelCosts() {
    return this.modelCosts;
  }

  async generateCostReport(tenantId?: string): Promise<unknown> {
    let query = supabase
      .from('ai_request_logs')
      .select('tenant_id, total_cost, created_at, context, status')
      .not('total_cost', 'is', null)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data: logs } = await query;

    if (!logs) return null;

    const report = {
      totalCost: logs.reduce((sum, log) => sum + (log.total_cost || 0), 0),
      totalRequests: logs.length,
      successfulRequests: logs.filter(log => log.status === 'completed').length,
      failedRequests: logs.filter(log => log.status === 'failed').length,
      averageCostPerRequest: 0,
      costByTenant: {} as Record<string, number>,
      costByModel: {} as Record<string, number>,
      costTrend: {} as Record<string, number>
    };

    report.averageCostPerRequest = report.totalRequests > 0 ? 
      report.totalCost / report.totalRequests : 0;

    // Group by tenant
    logs.forEach(log => {
      const tenant = log.tenant_id || 'system';
      report.costByTenant[tenant] = (report.costByTenant[tenant] || 0) + (log.total_cost || 0);
    });

    // Group by model
    logs.forEach(log => {
      const modelId = (log.context as any)?.model_id || 'unknown';
      report.costByModel[modelId] = (report.costByModel[modelId] || 0) + (log.total_cost || 0);
    });

    // Daily cost trend
    logs.forEach(log => {
      const date = log.created_at.split('T')[0];
      report.costTrend[date] = (report.costTrend[date] || 0) + (log.total_cost || 0);
    });

    return report;
  }
}

export const aiCostTrackingService = new AICostTrackingService();
