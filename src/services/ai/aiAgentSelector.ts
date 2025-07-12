
import { AIAgent, AIContext } from '@/types/ai';

export class AIAgentSelector {
  selectBestAgent(context: AIContext, availableAgents: AIAgent[]): string {
    if (availableAgents.length === 0) {
      throw new Error('No available agents for this context');
    }

    // Enhanced agent selection based on capabilities and performance
    let bestAgent = availableAgents[0];
    let bestScore = 0;

    for (const agent of availableAgents) {
      let score = 0;

      // Capability matching
      const relevantCapabilities = this.getRelevantCapabilities(context.action);
      const matchingCapabilities = agent.capabilities.filter(cap => 
        relevantCapabilities.includes(cap)
      );
      score += matchingCapabilities.length * 10;

      // Performance metrics
      const performance = agent.performance_metrics as unknown;
      if (performance.accuracy) score += performance.accuracy * 5;
      if (performance.response_time < 1000) score += 5; // Bonus for fast response

      // Type-specific bonuses
      if (this.getPreferredAgentType(context.action) === agent.type) {
        score += 15;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return bestAgent.id;
  }

  private getRelevantCapabilities(action: string): string[] {
    const actionLower = action.toLowerCase();
    const capabilityMap: Record<string, string[]> = {
      predict: ['prediction', 'analytics', 'forecasting'],
      analyze: ['analysis', 'insights', 'reporting'],
      suggest: ['conversation', 'support', 'guidance'],
      automate: ['automation', 'process_optimization', 'workflow'],
      form: ['form_assistance', 'data_completion', 'validation'],
      talent: ['talent_analysis', 'recruitment', 'matching'],
      research: ['deep_research', 'multi_source_analysis', 'comprehensive_reporting', 'market_intelligence'],
      investigate: ['deep_research', 'investigation', 'data_synthesis', 'research_methodology']
    };

    for (const [key, capabilities] of Object.entries(capabilityMap)) {
      if (actionLower.includes(key)) {
        return capabilities;
      }
    }

    return ['conversation', 'support'];
  }

  private getPreferredAgentType(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('predict') || actionLower.includes('forecast')) return 'predictive';
    if (actionLower.includes('analyze') || actionLower.includes('insight')) return 'analysis';
    if (actionLower.includes('automate') || actionLower.includes('workflow')) return 'automation';
    if (actionLower.includes('research') || actionLower.includes('investigate') || actionLower.includes('comprehensive')) return 'deep_research';
    return 'cognitive';
  }
}

export const aiAgentSelector = new AIAgentSelector();
