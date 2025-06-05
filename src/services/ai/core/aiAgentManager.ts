
import { AIAgentConfig } from '@/types/aiCore';
import { supabase } from '@/integrations/supabase/client';

export class AIAgentManager {
  private static instance: AIAgentManager;
  private agents: Map<string, AIAgentConfig> = new Map();

  private constructor() {}

  static getInstance(): AIAgentManager {
    if (!AIAgentManager.instance) {
      AIAgentManager.instance = new AIAgentManager();
    }
    return AIAgentManager.instance;
  }

  async loadAgents(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('id, name, type, capabilities, is_active, model_config, performance_metrics')
        .eq('is_active', true);

      if (error) throw error;

      this.agents.clear();
      (data || []).forEach(agent => {
        const agentConfig: AIAgentConfig = {
          id: agent.id,
          name: agent.name,
          type: agent.type,
          capabilities: Array.isArray(agent.capabilities) ? agent.capabilities : [],
          isActive: agent.is_active,
          modelConfig: (agent.model_config as Record<string, unknown>) || {},
          performanceMetrics: (agent.performance_metrics as Record<string, unknown>) || {}
        };
        this.agents.set(agent.id, agentConfig);
      });

      console.log(`Loaded ${this.agents.size} AI agents`);
    } catch (error) {
      console.error('Error loading AI agents:', error);
    }
  }

  getAgent(agentId: string): AIAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): AIAgentConfig[] {
    return Array.from(this.agents.values());
  }

  getActiveAgents(): AIAgentConfig[] {
    return Array.from(this.agents.values()).filter(agent => agent.isActive);
  }

  getAgentsByType(type: string): AIAgentConfig[] {
    return Array.from(this.agents.values()).filter(agent => agent.type === type);
  }

  getAgentsByCapability(capability: string): AIAgentConfig[] {
    return Array.from(this.agents.values()).filter(agent => 
      agent.capabilities.includes(capability)
    );
  }

  selectBestAgent(requiredCapabilities: string[], tenantId?: string): AIAgentConfig | null {
    const availableAgents = this.getActiveAgents();
    
    if (availableAgents.length === 0) {
      return null;
    }

    // Simple scoring algorithm
    let bestAgent = availableAgents[0];
    let bestScore = 0;

    for (const agent of availableAgents) {
      let score = 0;

      // Score based on capability match
      const matchingCapabilities = agent.capabilities.filter(cap => 
        requiredCapabilities.includes(cap)
      );
      score += matchingCapabilities.length * 10;

      // Prefer tenant-specific agents if available
      const agentTenantId = (agent.modelConfig as any)?.tenant_id;
      if (agentTenantId === tenantId) {
        score += 5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return bestAgent;
  }

  async refreshAgents(): Promise<void> {
    await this.loadAgents();
  }
}

export const aiAgentManager = AIAgentManager.getInstance();
