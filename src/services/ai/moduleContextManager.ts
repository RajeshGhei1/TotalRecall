
import { AIContext } from '@/types/ai';
import { supabase } from '@/integrations/supabase/client';

interface ModuleTokenBudget {
  module_name: string;
  tenant_id: string | null;
  monthly_limit: number;
  current_usage: number;
  overage_policy: 'block' | 'warn' | 'charge';
  cost_per_token_overage?: number;
}

interface ModuleUsageMetrics {
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  average_tokens_per_request: number;
  success_rate: number;
}

export class ModuleContextManager {
  private budgetCache = new Map<string, ModuleTokenBudget>();

  async enhanceContextWithModule(context: AIContext): Promise<AIContext> {
    const enhancedContext = {
      ...context,
      module_metadata: await this.getModuleMetadata(context.module, context.tenant_id),
      budget_status: await this.getBudgetStatus(context.module, context.tenant_id),
      usage_history: await this.getRecentUsageMetrics(context.module, context.tenant_id)
    };

    return enhancedContext;
  }

  async checkTokenBudget(moduleName: string, tenantId: string | null, estimatedTokens: number): Promise<{
    allowed: boolean;
    reason?: string;
    overage_amount?: number;
  }> {
    const budget = await this.getModuleBudget(moduleName, tenantId);
    
    if (!budget) {
      return { allowed: true }; // No budget limits set
    }

    const projectedUsage = budget.current_usage + estimatedTokens;
    
    if (projectedUsage <= budget.monthly_limit) {
      return { allowed: true };
    }

    const overage = projectedUsage - budget.monthly_limit;
    
    switch (budget.overage_policy) {
      case 'block':
        return { 
          allowed: false, 
          reason: `Token budget exceeded. Monthly limit: ${budget.monthly_limit}, current usage: ${budget.current_usage}`,
          overage_amount: overage
        };
      
      case 'warn':
        console.warn(`Module ${moduleName} exceeding token budget by ${overage} tokens`);
        return { allowed: true, overage_amount: overage };
      
      case 'charge':
        const overageCost = overage * (budget.cost_per_token_overage || 0.001);
        console.log(`Module ${moduleName} overage will cost $${overageCost.toFixed(4)}`);
        return { allowed: true, overage_amount: overage };
      
      default:
        return { allowed: true };
    }
  }

  async recordModuleUsage(
    moduleName: string, 
    tenantId: string | null, 
    tokensUsed: number, 
    cost: number,
    success: boolean
  ): Promise<void> {
    try {
      // Update budget usage
      await this.updateBudgetUsage(moduleName, tenantId, tokensUsed);

      // Record detailed usage metrics
      await this.recordUsageMetrics(moduleName, tenantId, tokensUsed, cost, success);

    } catch (error) {
      console.error('Error recording module usage:', error);
    }
  }

  private async getModuleMetadata(moduleName: string, tenantId?: string): Promise<any> {
    try {
      const { data: moduleInfo } = await supabase
        .from('system_modules')
        .select('*')
        .eq('name', moduleName)
        .single();

      // Get subscription-based module info if applicable
      if (tenantId) {
        const { data: subscription } = await supabase
          .from('tenant_subscriptions')
          .select(`
            *,
            subscription_plans(*)
          `)
          .eq('tenant_id', tenantId)
          .eq('status', 'active')
          .single();

        if (subscription) {
          const { data: permission } = await supabase
            .from('module_permissions')
            .select('*')
            .eq('plan_id', subscription.plan_id)
            .eq('module_name', moduleName)
            .eq('is_enabled', true)
            .single();

          return {
            module_info: moduleInfo,
            subscription_info: subscription,
            permission_info: permission
          };
        }
      }

      return { module_info: moduleInfo };
    } catch (error) {
      console.error('Error fetching module metadata:', error);
      return {};
    }
  }

  private async getBudgetStatus(moduleName: string, tenantId: string | null): Promise<any> {
    const budget = await this.getModuleBudget(moduleName, tenantId);
    
    if (!budget) return null;

    const utilizationPercentage = (budget.current_usage / budget.monthly_limit) * 100;
    
    return {
      monthly_limit: budget.monthly_limit,
      current_usage: budget.current_usage,
      remaining: budget.monthly_limit - budget.current_usage,
      utilization_percentage: utilizationPercentage,
      status: utilizationPercentage > 90 ? 'critical' : 
              utilizationPercentage > 75 ? 'warning' : 'healthy'
    };
  }

  private async getRecentUsageMetrics(moduleName: string, tenantId: string | null): Promise<ModuleUsageMetrics> {
    try {
      // Get usage from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: logs } = await supabase
        .from('ai_request_logs')
        .select('input_tokens, output_tokens, total_cost, status')
        .eq('tenant_id', tenantId)
        .like('context->>module', moduleName)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!logs || logs.length === 0) {
        return {
          total_requests: 0,
          total_tokens: 0,
          total_cost: 0,
          average_tokens_per_request: 0,
          success_rate: 0
        };
      }

      const totalRequests = logs.length;
      const successfulRequests = logs.filter(log => log.status === 'completed').length;
      const totalTokens = logs.reduce((sum, log) => sum + (log.input_tokens || 0) + (log.output_tokens || 0), 0);
      const totalCost = logs.reduce((sum, log) => sum + (log.total_cost || 0), 0);

      return {
        total_requests: totalRequests,
        total_tokens: totalTokens,
        total_cost: totalCost,
        average_tokens_per_request: totalRequests > 0 ? totalTokens / totalRequests : 0,
        success_rate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
      };

    } catch (error) {
      console.error('Error fetching usage metrics:', error);
      return {
        total_requests: 0,
        total_tokens: 0,
        total_cost: 0,
        average_tokens_per_request: 0,
        success_rate: 0
      };
    }
  }

  private async getModuleBudget(moduleName: string, tenantId: string | null): Promise<ModuleTokenBudget | null> {
    const cacheKey = `${moduleName}-${tenantId || 'global'}`;
    
    if (this.budgetCache.has(cacheKey)) {
      return this.budgetCache.get(cacheKey) || null;
    }

    try {
      // For now, return mock data since we don't have the schema yet
      // TODO: Replace with actual database query when schema is implemented
      const mockBudget: ModuleTokenBudget = {
        module_name: moduleName,
        tenant_id: tenantId,
        monthly_limit: 100000, // Default 100k tokens per month
        current_usage: 0,
        overage_policy: 'warn'
      };

      this.budgetCache.set(cacheKey, mockBudget);
      return mockBudget;

    } catch (error) {
      console.error('Error fetching module budget:', error);
      return null;
    }
  }

  private async updateBudgetUsage(moduleName: string, tenantId: string | null, tokensUsed: number): Promise<void> {
    const budget = await this.getModuleBudget(moduleName, tenantId);
    if (budget) {
      budget.current_usage += tokensUsed;
      const cacheKey = `${moduleName}-${tenantId || 'global'}`;
      this.budgetCache.set(cacheKey, budget);

      // TODO: Update database when schema is implemented
    }
  }

  private async recordUsageMetrics(
    moduleName: string, 
    tenantId: string | null, 
    tokensUsed: number, 
    cost: number, 
    success: boolean
  ): Promise<void> {
    // This will be implemented when we have the proper metrics tracking tables
    console.log(`Module ${moduleName} usage: ${tokensUsed} tokens, $${cost.toFixed(6)}, success: ${success}`);
  }

  clearCache(): void {
    this.budgetCache.clear();
  }
}

export const moduleContextManager = new ModuleContextManager();
