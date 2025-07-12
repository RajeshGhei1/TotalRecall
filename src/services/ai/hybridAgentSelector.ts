
import { AIAgent, AIContext, ModuleAIAssignment } from '@/types/ai';

// Mock data for development until the database table is created
const mockModuleAssignments: ModuleAIAssignment[] = [
  {
    id: '1',
    module_id: 'hr-module',
    agent_id: 'cognitive-agent-1',
    tenant_id: null,
    assignment_type: 'direct',
    priority: 0,
    is_active: true,
    performance_weights: { accuracy: 0.4, speed: 0.3, cost: 0.3 },
    token_budget_override: 10000,
    assigned_by: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    module_id: 'hr-module',
    agent_id: 'predictive-agent-1',
    tenant_id: null,
    assignment_type: 'preferred',
    priority: 1,
    is_active: true,
    performance_weights: { accuracy: 0.5, speed: 0.2, cost: 0.3 },
    assigned_by: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class HybridAgentSelector {
  private assignmentCache = new Map<string, ModuleAIAssignment[]>();

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
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check cache first
      const cacheKey = `${moduleName}-${tenantId || 'global'}-direct`;
      if (this.assignmentCache.has(cacheKey)) {
        const cached = this.assignmentCache.get(cacheKey);
        return cached?.[0] || null;
      }

      // Filter mock data for direct assignment
      const directAssignment = mockModuleAssignments.find(assignment => 
        assignment.module_id === moduleName &&
        assignment.assignment_type === 'direct' &&
        assignment.is_active &&
        assignment.tenant_id === (tenantId || null)
      );

      // Cache the result
      this.assignmentCache.set(cacheKey, directAssignment ? [directAssignment] : []);
      
      return directAssignment || null;
    } catch (error) {
      console.error('Error in getDirectAssignment:', error);
      return null;
    }
  }

  private async getPreferredAgent(moduleName: string, tenantId: string | undefined, availableAgents: AIAgent[]): Promise<string | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check cache first
      const cacheKey = `${moduleName}-${tenantId || 'global'}-preferred`;
      if (!this.assignmentCache.has(cacheKey)) {
        // Filter mock data for preferred assignments
        const preferredAssignments = mockModuleAssignments
          .filter(assignment => 
            assignment.module_id === moduleName &&
            assignment.assignment_type === 'preferred' &&
            assignment.is_active &&
            assignment.tenant_id === (tenantId || null)
          )
          .sort((a, b) => b.priority - a.priority);

        this.assignmentCache.set(cacheKey, preferredAssignments);
      }

      const assignments = this.assignmentCache.get(cacheKey) || [];
      
      // Find the first available preferred agent
      for (const assignment of assignments) {
        if (this.isAgentAvailable(assignment.agent_id, availableAgents)) {
          return assignment.agent_id;
        }
      }

      return null;
    } catch (error) {
      console.error('Error in getPreferredAgent:', error);
      return null;
    }
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
      const performance = agent.performance_metrics as unknown;
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
  }

  async refreshAssignments(moduleName?: string): Promise<void> {
    if (moduleName) {
      // Clear specific module cache
      for (const key of this.assignmentCache.keys()) {
        if (key.includes(moduleName)) {
          this.assignmentCache.delete(key);
        }
      }
    } else {
      this.clearCache();
    }
  }

  // New method to get assignment statistics
  async getAssignmentStats(tenantId?: string): Promise<{
    totalAssignments: number;
    directAssignments: number;
    preferredAssignments: number;
    modulesWithAssignments: number;
  }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Filter mock data by tenant
      const filteredAssignments = mockModuleAssignments.filter(assignment =>
        assignment.is_active && assignment.tenant_id === (tenantId || null)
      );

      const directAssignments = filteredAssignments.filter(a => a.assignment_type === 'direct').length;
      const preferredAssignments = filteredAssignments.filter(a => a.assignment_type === 'preferred').length;
      const modulesWithAssignments = new Set(filteredAssignments.map(a => a.module_id)).size;

      return {
        totalAssignments: filteredAssignments.length,
        directAssignments,
        preferredAssignments,
        modulesWithAssignments,
      };
    } catch (error) {
      console.error('Error getting assignment stats:', error);
      return {
        totalAssignments: 0,
        directAssignments: 0,
        preferredAssignments: 0,
        modulesWithAssignments: 0,
      };
    }
  }
}

export const hybridAgentSelector = new HybridAgentSelector();
