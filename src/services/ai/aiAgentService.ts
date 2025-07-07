import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTenantContext } from '@/contexts/TenantContext';

export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  agent_type: 'cognitive' | 'predictive' | 'automation' | 'analysis' | 'deep_research' | 'custom';
  capabilities: string[];
  model_config: {
    temperature: number;
    max_tokens: number;
    model_preference: string;
    apiKey?: string;
  };
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  performance_metrics?: {
    accuracy?: number;
    response_time?: number;
    user_satisfaction?: number;
    [key: string]: any;
  };
  tenant_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAIAgentRequest {
  name: string;
  description?: string;
  agent_type: AIAgent['agent_type'];
  capabilities: string[];
  model_config: {
    temperature: number;
    max_tokens: number;
    model_preference: string;
    apiKey?: string;
  };
}

export interface UpdateAIAgentRequest extends Partial<CreateAIAgentRequest> {
  status?: AIAgent['status'];
  performance_metrics?: AIAgent['performance_metrics'];
}

export interface AIAgentActivityLog {
  id: string;
  agent_id: string;
  user_id?: string;
  tenant_id?: string;
  action: string;
  request_data: any;
  response_data: any;
  duration_ms?: number;
  tokens_used?: number;
  cost_usd?: number;
  status: 'success' | 'error' | 'timeout';
  error_message?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export class AIAgentService {
  private static instance: AIAgentService;

  public static getInstance(): AIAgentService {
    if (!AIAgentService.instance) {
      AIAgentService.instance = new AIAgentService();
    }
    return AIAgentService.instance;
  }

  // Get all agents for the current tenant
  async getAgents(tenantId?: string): Promise<AIAgent[]> {
    try {
      console.log('Fetching agents for tenantId:', tenantId);
      
      let query = supabase
        .from('ai_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (tenantId) {
        // If tenant is specified, get both global agents (tenant_id is null) and tenant-specific agents
        console.log('Fetching global and tenant-specific agents');
        query = query.or(`tenant_id.is.null,tenant_id.eq.${tenantId}`);
      } else {
        // If no tenant specified, get all global agents (tenant_id is null)
        console.log('Fetching global agents only');
        query = query.is('tenant_id', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching AI agents:', error);
        throw error;
      }

      console.log('Fetched agents:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getAgents:', error);
      throw error;
    }
  }

  // Get a specific agent by ID
  async getAgent(agentId: string): Promise<AIAgent | null> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) {
        console.error('Error fetching AI agent:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getAgent:', error);
      throw error;
    }
  }

  // Create a new agent
  async createAgent(agentData: CreateAIAgentRequest, tenantId?: string): Promise<AIAgent> {
    try {
      const { user } = await supabase.auth.getUser();
      
      const agentPayload = {
        ...agentData,
        tenant_id: tenantId || null,
        created_by: user?.user?.id || null,
        status: 'active' as const,
        performance_metrics: {
          accuracy: 0.9,
          response_time: 1000,
          user_satisfaction: 0.9
        }
      };

      const { data, error } = await supabase
        .from('ai_agents')
        .insert([agentPayload])
        .select()
        .single();

      if (error) {
        console.error('Error creating AI agent:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createAgent:', error);
      throw error;
    }
  }

  // Update an existing agent
  async updateAgent(agentId: string, updates: UpdateAIAgentRequest): Promise<AIAgent> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .update(updates)
        .eq('id', agentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating AI agent:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateAgent:', error);
      throw error;
    }
  }

  // Delete an agent
  async deleteAgent(agentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agents')
        .delete()
        .eq('id', agentId);

      if (error) {
        console.error('Error deleting AI agent:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteAgent:', error);
      throw error;
    }
  }

  // Log agent activity
  async logActivity(activityData: Omit<AIAgentActivityLog, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_agent_activity_logs')
        .insert([activityData]);

      if (error) {
        console.error('Error logging agent activity:', error);
        // Don't throw error for logging failures
      }
    } catch (error) {
      console.error('Error in logActivity:', error);
      // Don't throw error for logging failures
    }
  }

  // Get activity logs for an agent
  async getAgentActivityLogs(agentId: string, limit = 50): Promise<AIAgentActivityLog[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agent_activity_logs')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching agent activity logs:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAgentActivityLogs:', error);
      throw error;
    }
  }

  // Get agent performance metrics
  async getAgentPerformanceMetrics(agentId: string, days = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('ai_agent_activity_logs')
        .select('*')
        .eq('agent_id', agentId)
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Error fetching agent performance metrics:', error);
        throw error;
      }

      // Calculate metrics
      const logs = data || [];
      const totalRequests = logs.length;
      const successfulRequests = logs.filter(log => log.status === 'success').length;
      const totalDuration = logs.reduce((sum, log) => sum + (log.duration_ms || 0), 0);
      const totalTokens = logs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const totalCost = logs.reduce((sum, log) => sum + (log.cost_usd || 0), 0);

      return {
        totalRequests,
        successfulRequests,
        successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
        averageResponseTime: totalRequests > 0 ? totalDuration / totalRequests : 0,
        totalTokens,
        totalCost,
        averageTokensPerRequest: totalRequests > 0 ? totalTokens / totalRequests : 0,
        averageCostPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0
      };
    } catch (error) {
      console.error('Error in getAgentPerformanceMetrics:', error);
      throw error;
    }
  }

  // Execute an agent (placeholder for actual AI execution)
  async executeAgent(agentId: string, input: any, userId?: string, tenantId?: string): Promise<any> {
    try {
      const startTime = Date.now();
      
      // Get agent configuration
      const agent = await this.getAgent(agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }

      if (agent.status !== 'active') {
        throw new Error(`Agent is not active. Current status: ${agent.status}`);
      }

      // TODO: Implement actual AI execution logic here
      // This would involve calling the appropriate AI model based on agent.model_config
      
      const duration = Date.now() - startTime;
      
      // Log the activity
      await this.logActivity({
        agent_id: agentId,
        user_id: userId,
        tenant_id: tenantId,
        action: 'execute',
        request_data: input,
        response_data: { success: true, message: 'Agent execution completed' },
        duration_ms: duration,
        tokens_used: 100, // Placeholder
        cost_usd: 0.001, // Placeholder
        status: 'success',
        ip_address: '127.0.0.1', // Placeholder
        user_agent: 'AI Agent Service'
      });

      return {
        success: true,
        message: 'Agent execution completed',
        duration_ms: duration,
        agent: agent
      };
    } catch (error) {
      console.error('Error in executeAgent:', error);
      
      // Log the error
      await this.logActivity({
        agent_id: agentId,
        user_id: userId,
        tenant_id: tenantId,
        action: 'execute',
        request_data: input,
        response_data: { success: false, error: error.message },
        status: 'error',
        error_message: error.message,
        ip_address: '127.0.0.1', // Placeholder
        user_agent: 'AI Agent Service'
      });

      throw error;
    }
  }
}

// Export singleton instance
export const aiAgentService = AIAgentService.getInstance(); 