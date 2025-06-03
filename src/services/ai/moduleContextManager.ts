import { supabase } from '@/integrations/supabase/client';
import { AIContext } from '@/types/ai';

interface ModuleUsage {
  module: string;
  tenant_id: string | null;
  tokens_used: number;
  cost: number;
  success: boolean;
  timestamp: Date;
}

interface ModuleBudget {
  module: string;
  tenant_id: string | null;
  monthly_token_limit: number;
  monthly_cost_limit: number;
  current_tokens: number;
  current_cost: number;
  reset_date: Date;
}

interface ModuleContextData {
  config: Record<string, any>;
  permissions: Record<string, any>;
  limits: Record<string, any>;
}

export class ModuleContextManager {
  private contextCache: Map<string, ModuleContextData> = new Map();
  private budgetCache: Map<string, ModuleBudget> = new Map();

  async enhanceContextWithModule(context: AIContext): Promise<AIContext> {
    const cacheKey = `${context.module}-${context.tenant_id || 'global'}`;
    
    if (!this.contextCache.has(cacheKey)) {
      const moduleContext = await this.loadModuleContext(context.module, context.tenant_id);
      this.contextCache.set(cacheKey, moduleContext);
    }

    const moduleData = this.contextCache.get(cacheKey)!;
    
    return {
      ...context,
      session_data: {
        ...context.session_data,
        module_config: moduleData.config,
        module_permissions: moduleData.permissions,
        usage_limits: moduleData.limits
      }
    };
  }

  private async loadModuleContext(module: string, tenantId?: string): Promise<ModuleContextData> {
    try {
      // Load module configuration
      const { data: moduleConfig } = await supabase
        .from('system_modules')
        .select('*')
        .eq('name', module)
        .maybeSingle();

      // Load tenant-specific module permissions if tenant_id exists
      let permissions = null;
      if (tenantId) {
        const { data: tenantPermissions } = await supabase
          .from('tenant_module_assignments')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('module_name', module)
          .maybeSingle();
        
        permissions = tenantPermissions;
      }

      // Safely convert Supabase Json types to our expected types
      const safeConfig = moduleConfig ? this.convertJsonToRecord(moduleConfig.default_limits) : {};
      const safePermissions = permissions ? this.convertJsonToRecord(permissions) : {};
      const safeLimits = moduleConfig?.default_limits ? this.convertJsonToRecord(moduleConfig.default_limits) : {};

      return {
        config: safeConfig,
        permissions: safePermissions,
        limits: safeLimits
      };
    } catch (error) {
      console.error(`Error loading context for module ${module}:`, error);
      return { config: {}, permissions: {}, limits: {} };
    }
  }

  // Helper method to safely convert Supabase Json type to Record<string, any>
  private convertJsonToRecord(jsonData: any): Record<string, any> {
    if (jsonData === null || jsonData === undefined) {
      return {};
    }
    
    if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
      return jsonData as Record<string, any>;
    }
    
    return {};
  }

  async checkTokenBudget(
    module: string, 
    tenantId: string | undefined, 
    estimatedTokens: number
  ): Promise<{
    allowed: boolean;
    reason?: string;
    overage_amount?: number;
  }> {
    const budgetKey = `${module}-${tenantId || 'global'}`;
    
    if (!this.budgetCache.has(budgetKey)) {
      await this.loadModuleBudget(module, tenantId);
    }

    const budget = this.budgetCache.get(budgetKey);
    if (!budget) {
      return { allowed: true }; // No budget limits configured
    }

    const projectedTokens = budget.current_tokens + estimatedTokens;
    
    if (projectedTokens > budget.monthly_token_limit) {
      const overage = projectedTokens - budget.monthly_token_limit;
      return {
        allowed: false,
        reason: `Module ${module} would exceed monthly token limit by ${overage} tokens`,
        overage_amount: overage
      };
    }

    // Check if we're approaching the limit (90% threshold)
    if (projectedTokens > budget.monthly_token_limit * 0.9) {
      const overage = projectedTokens - (budget.monthly_token_limit * 0.9);
      return {
        allowed: true,
        reason: `Module ${module} approaching token limit`,
        overage_amount: overage
      };
    }

    return { allowed: true };
  }

  private async loadModuleBudget(module: string, tenantId?: string): Promise<void> {
    try {
      // This would load from a module_budgets table in a real implementation
      // For now, we'll create default budgets
      const defaultBudget: ModuleBudget = {
        module,
        tenant_id: tenantId || null,
        monthly_token_limit: 100000, // 100k tokens per month
        monthly_cost_limit: 50, // $50 per month
        current_tokens: 0,
        current_cost: 0,
        reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      };

      const budgetKey = `${module}-${tenantId || 'global'}`;
      this.budgetCache.set(budgetKey, defaultBudget);
    } catch (error) {
      console.error(`Error loading budget for module ${module}:`, error);
    }
  }

  async recordModuleUsage(
    module: string,
    tenantId: string | null,
    tokensUsed: number,
    cost: number,
    success: boolean
  ): Promise<void> {
    try {
      // Update budget cache
      const budgetKey = `${module}-${tenantId || 'global'}`;
      const budget = this.budgetCache.get(budgetKey);
      
      if (budget) {
        budget.current_tokens += tokensUsed;
        budget.current_cost += cost;
      }

      // Log usage to database (would be implemented with a module_usage table)
      console.log(`Module usage recorded: ${module}, tokens: ${tokensUsed}, cost: ${cost}, success: ${success}`);
    } catch (error) {
      console.error('Error recording module usage:', error);
    }
  }

  async getModuleUsageStats(module: string, tenantId?: string): Promise<{
    totalTokens: number;
    totalCost: number;
    successRate: number;
    usageThisMonth: number;
  }> {
    // This would query the module_usage table in a real implementation
    const budgetKey = `${module}-${tenantId || 'global'}`;
    const budget = this.budgetCache.get(budgetKey);
    
    return {
      totalTokens: budget?.current_tokens || 0,
      totalCost: budget?.current_cost || 0,
      successRate: 0.95, // Placeholder
      usageThisMonth: budget?.current_tokens || 0
    };
  }

  clearCache(): void {
    this.contextCache.clear();
  }

  async refreshModuleBudgets(): Promise<void> {
    this.budgetCache.clear();
    // Would reload all budgets from database
  }
}

export const moduleContextManager = new ModuleContextManager();
