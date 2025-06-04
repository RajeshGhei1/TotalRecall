
import { AIAgent, AIContext } from '@/types/ai';
import { supabase } from '@/integrations/supabase/client';

interface ModuleAIAssignment {
  id: string;
  module_name: string;
  agent_id: string;
  assignment_type: 'direct' | 'preferred';
  priority: number;
  is_active: boolean;
}

interface ModuleAIConfiguration {
  agent_preferences: string[];
  fallback_enabled: boolean;
  performance_weights: Record<string, number>;
}

export class HybridAgentSelector {
  private assignmentCache = new Map<string, ModuleAIAssignment[]>();
  private configCache = new Map<string, ModuleAIConfiguration>();

  async selectAgent(context: AIContext, availableAgents: AIAgent[]): Promise<string> {
    if (availableAgents.length === 0) {
      throw new Error('No available agents for this context');
    }

    // Step 1: Check for direct module-agent assignments
    const directAssignment = await this.getDirectAssignment(context.module, context.tenant_id);
    if (directAssignment && this.isAgentAvailable(directAssignment.agent_id, availableAgents)) {
      console.log(`Using direct assignment: ${directAssignment.agent_id} for module ${context.module}`);
      return directAssignment.agent_id;
    }

    // Step 2: Check for preferred agents for this module
    const preferredAgent = await this.getPreferredAgent(context.module, context.tenant_id, availableAgents);
    if (preferredAgent) {
      console.log(`Using preferred agent: ${preferredAgent} for module ${context.module}`);
      return preferredAgent;
    }

    // Step 3: Fall back to dynamic selection
    console.log(`Using dynamic selection for module ${context.module}`);
    return this.performDynamicSelection(context, availableAgents);
  }

  private async getDirectAssignment(moduleName: string, tenantId?: string): Promise<ModuleAIAssignment | null> {
    const cacheKey = `${moduleName}-${tenantId || 'global'}`;
    
    if (!this.assignmentCache.has(cacheKey)) {
      await this.loadAssignments(moduleName, tenantId);
    }

    const assignments = this.assignmentCache.get(cacheKey) || [];
    return assignments.find(a => a.assignment_type === 'direct' && a.is_active) || null;
  }

  private async getPreferredAgent(moduleName: string, tenantId: string | undefined, availableAgents: AIAgent[]): Promise<string | null> {
    const cacheKey = `${moduleName}-${tenantId || 'global'}`;
    
    if (!this.assignmentCache.has(cacheKey)) {
      await this.loadAssignments(moduleName, tenantId);
    }

    const assignments = this.assignmentCache.get(cacheKey) || [];
    const preferredAssignments = assignments
      .filter(a => a.assignment_type === 'preferred' && a.is_active)
      .sort((a, b) => b.priority - a.priority);

    for (const assignment of preferredAssignments) {
      if (this.isAgentAvailable(assignment.agent_id, availableAgents)) {
        return assignment.agent_id;
      }
    }

    return null;
  }

  private performDynamicSelection(context: AIContext, availableAgents: AIAgent[]): string {
    // Enhanced dynamic selection with module context awareness
    let bestAgent = availableAgents[0];
    let bestScore = 0;

    for (const agent of availableAgents) {
      let score = 0;

      // Module-specific capability matching
      const relevantCapabilities = this.getModuleRelevantCapabilities(context.module, context.action);
      const matchingCapabilities = agent.capabilities.filter(cap => 
        relevantCapabilities.includes(cap)
      );
      score += matchingCapabilities.length * 15;

      // Performance metrics
      const performance = agent.performance_metrics as any;
      if (performance.accuracy) score += performance.accuracy * 10;
      if (performance.response_time < 1000) score += 5;

      // Module-specific type preferences
      if (this.getPreferredAgentTypeForModule(context.module) === agent.type) {
        score += 20;
      }

      // Tenant-specific bonuses
      if (agent.tenant_id === context.tenant_id) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return bestAgent.id;
  }

  private async loadAssignments(moduleName: string, tenantId?: string): Promise<void> {
    try {
      // For now, we'll implement a basic structure since the table doesn't exist yet
      // This will be replaced when we add the proper database schema
      const mockAssignments: ModuleAIAssignment[] = [];
      
      // TODO: Replace with actual database query when schema is implemented
      // const { data } = await supabase
      //   .from('module_ai_assignments')
      //   .select('*')
      //   .eq('module_name', moduleName)
      //   .eq('tenant_id', tenantId || null)
      //   .eq('is_active', true);

      const cacheKey = `${moduleName}-${tenantId || 'global'}`;
      this.assignmentCache.set(cacheKey, mockAssignments);
    } catch (error) {
      console.error('Error loading module AI assignments:', error);
      this.assignmentCache.set(`${moduleName}-${tenantId || 'global'}`, []);
    }
  }

  private isAgentAvailable(agentId: string, availableAgents: AIAgent[]): boolean {
    return availableAgents.some(agent => agent.id === agentId);
  }

  private getModuleRelevantCapabilities(module: string, action: string): string[] {
    const moduleCapabilityMap: Record<string, string[]> = {
      'email-management': ['conversation', 'content_generation', 'language_processing'],
      'ats': ['talent_analysis', 'matching', 'assessment'],
      'recruitment': ['talent_analysis', 'sourcing', 'screening'],
      'forms': ['form_assistance', 'data_validation', 'completion'],
      'analytics': ['analysis', 'reporting', 'insights'],
      'dashboard': ['visualization', 'metrics', 'reporting']
    };

    const actionCapabilityMap: Record<string, string[]> = {
      'generate_email_response': ['conversation', 'content_generation'],
      'analyze_candidate': ['talent_analysis', 'assessment'],
      'predict_performance': ['prediction', 'analytics'],
      'automate_workflow': ['automation', 'process_optimization']
    };

    const moduleCapabilities = moduleCapabilityMap[module] || [];
    const actionCapabilities = actionCapabilityMap[action] || [];
    
    return [...new Set([...moduleCapabilities, ...actionCapabilities])];
  }

  private getPreferredAgentTypeForModule(module: string): string {
    const moduleTypeMap: Record<string, string> = {
      'email-management': 'cognitive',
      'ats': 'analysis',
      'recruitment': 'analysis',
      'forms': 'automation',
      'analytics': 'predictive',
      'dashboard': 'analysis'
    };

    return moduleTypeMap[module] || 'cognitive';
  }

  clearCache(): void {
    this.assignmentCache.clear();
    this.configCache.clear();
  }

  async refreshAssignments(moduleName?: string): Promise<void> {
    if (moduleName) {
      // Clear specific module cache
      for (const key of this.assignmentCache.keys()) {
        if (key.startsWith(`${moduleName}-`)) {
          this.assignmentCache.delete(key);
        }
      }
    } else {
      this.clearCache();
    }
  }
}

export const hybridAgentSelector = new HybridAgentSelector();
