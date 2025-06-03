import { AIAgent, AIContext } from '@/types/ai';
import { supabase } from '@/integrations/supabase/client';

interface AgentAssignment {
  agentId: string;
  module: string;
  priority: number;
  conditions: Record<string, any>;
  performance_score: number;
}

export class HybridAgentSelector {
  private assignments: Map<string, AgentAssignment[]> = new Map();
  private performanceHistory: Map<string, number[]> = new Map();

  async selectAgent(context: AIContext, availableAgents: AIAgent[]): Promise<string> {
    if (availableAgents.length === 0) {
      throw new Error('No available agents for selection');
    }

    // Load module-specific assignments if not cached
    if (!this.assignments.has(context.module)) {
      await this.loadModuleAssignments(context.module);
    }

    const moduleAssignments = this.assignments.get(context.module) || [];
    
    // Find agents that match module assignments
    const matchingAgents = availableAgents.filter(agent => 
      moduleAssignments.some(assignment => assignment.agentId === agent.id)
    );

    if (matchingAgents.length > 0) {
      // Select based on performance and priority
      return this.selectByPerformance(matchingAgents, moduleAssignments);
    }

    // Fallback to type-based selection
    return this.selectByType(context, availableAgents);
  }

  private selectByPerformance(agents: AIAgent[], assignments: AgentAssignment[]): string {
    let bestAgent = agents[0];
    let bestScore = 0;

    for (const agent of agents) {
      const assignment = assignments.find(a => a.agentId === agent.id);
      if (!assignment) continue;

      const performanceScore = assignment.performance_score;
      const priorityBonus = assignment.priority * 0.1;
      const totalScore = performanceScore + priorityBonus;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestAgent = agent;
      }
    }

    return bestAgent.id;
  }

  private selectByType(context: AIContext, agents: AIAgent[]): string {
    // Module-to-agent-type mapping
    const moduleTypeMapping: Record<string, string[]> = {
      'recruitment': ['cognitive', 'analysis'],
      'forms': ['automation', 'cognitive'],
      'dashboard': ['analysis', 'predictive'],
      'reports': ['analysis', 'deep_research'],
      'workflows': ['automation', 'cognitive'],
      'orchestration': ['cognitive', 'automation'],
      'default': ['cognitive']
    };

    const preferredTypes = moduleTypeMapping[context.module] || moduleTypeMapping.default;
    
    // Find agent with preferred type
    for (const type of preferredTypes) {
      const agent = agents.find(a => a.type === type);
      if (agent) return agent.id;
    }

    // Return first available agent as fallback
    return agents[0].id;
  }

  private async loadModuleAssignments(module: string): Promise<void> {
    try {
      // In a real implementation, this would load from a database table
      // For now, we'll create default assignments
      const defaultAssignments: AgentAssignment[] = [];
      
      this.assignments.set(module, defaultAssignments);
    } catch (error) {
      console.error(`Error loading assignments for module ${module}:`, error);
      this.assignments.set(module, []);
    }
  }

  async refreshAssignments(moduleName?: string): Promise<void> {
    if (moduleName) {
      this.assignments.delete(moduleName);
      await this.loadModuleAssignments(moduleName);
    } else {
      this.assignments.clear();
    }
  }

  updatePerformanceScore(agentId: string, module: string, score: number): void {
    const key = `${agentId}-${module}`;
    const history = this.performanceHistory.get(key) || [];
    history.push(score);
    
    // Keep only last 10 scores
    if (history.length > 10) {
      history.shift();
    }
    
    this.performanceHistory.set(key, history);

    // Update assignment performance score
    const assignments = this.assignments.get(module);
    if (assignments) {
      const assignment = assignments.find(a => a.agentId === agentId);
      if (assignment) {
        assignment.performance_score = history.reduce((a, b) => a + b, 0) / history.length;
      }
    }
  }

  getPerformanceMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};
    
    for (const [key, scores] of this.performanceHistory.entries()) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      metrics[key] = {
        averageScore: avgScore,
        totalScores: scores.length,
        recentTrend: scores.length > 1 ? scores[scores.length - 1] - scores[scores.length - 2] : 0
      };
    }
    
    return metrics;
  }
}

export const hybridAgentSelector = new HybridAgentSelector();
