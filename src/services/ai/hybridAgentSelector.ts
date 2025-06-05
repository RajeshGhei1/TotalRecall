
import { AIAgent, AIContext, ModuleAIAssignment } from '@/types/ai';
import { supabase } from '@/integrations/supabase/client';

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
      // Get the module ID first
      const { data: moduleData } = await supabase
        .from('system_modules')
        .select('id')
        .eq('name', moduleName)
        .single();

      if (!moduleData) return null;

      // Check cache first
      const cacheKey = `${moduleData.id}-${tenantId || 'global'}-direct`;
      if (this.assignmentCache.has(cacheKey)) {
        const cached = this.assignmentCache.get(cacheKey);
        return cached?.[0] || null;
      }

      // Query for direct assignment
      let query = supabase
        .from('module_ai_assignments')
        .select('*')
        .eq('module_id', moduleData.id)
        .eq('assignment_type', 'direct')
        .eq('is_active', true);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else {
        query = query.is('tenant_id', null);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching direct assignment:', error);
        return null;
      }

      // Cache the result
      this.assignmentCache.set(cacheKey, data ? [data] : []);
      
      return data;
    } catch (error) {
      console.error('Error in getDirectAssignment:', error);
      return null;
    }
  }

  private async getPreferredAgent(moduleName: string, tenantId: string | undefined, availableAgents: AIAgent[]): Promise<string | null> {
    try {
      // Get the module ID first
      const { data: moduleData } = await supabase
        .from('system_modules')
        .select('id')
        .eq('name', moduleName)
        .single();

      if (!moduleData) return null;

      // Check cache first
      const cacheKey = `${moduleData.id}-${tenantId || 'global'}-preferred`;
      if (!this.assignmentCache.has(cacheKey)) {
        // Query for preferred assignments
        let query = supabase
          .from('module_ai_assignments')
          .select('*')
          .eq('module_id', moduleData.id)
          .eq('assignment_type', 'preferred')
          .eq('is_active', true)
          .order('priority', { ascending: false });

        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        } else {
          query = query.is('tenant_id', null);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching preferred assignments:', error);
          this.assignmentCache.set(cacheKey, []);
        } else {
          this.assignmentCache.set(cacheKey, data || []);
        }
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
      let query = supabase
        .from('module_ai_assignments')
        .select('assignment_type, module_id')
        .eq('is_active', true);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else {
        query = query.is('tenant_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      const directAssignments = data?.filter(a => a.assignment_type === 'direct').length || 0;
      const preferredAssignments = data?.filter(a => a.assignment_type === 'preferred').length || 0;
      const modulesWithAssignments = new Set(data?.map(a => a.module_id)).size;

      return {
        totalAssignments: data?.length || 0,
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
