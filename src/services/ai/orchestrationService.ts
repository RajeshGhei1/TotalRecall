
import { supabase } from '@/integrations/supabase/client';
import { AIAgent, AIDecision, AIRequest, AIResponse, AIContext } from '@/types/ai';

export class AIOrchestrationService {
  private agents: Map<string, AIAgent> = new Map();

  async initialize(): Promise<void> {
    console.log('Initializing AI Orchestration Service...');
    await this.loadActiveAgents();
  }

  private async loadActiveAgents(): Promise<void> {
    try {
      const { data: agents, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'active');

      if (error) throw error;

      this.agents.clear();
      agents?.forEach(agent => {
        this.agents.set(agent.id, agent);
      });

      console.log(`Loaded ${this.agents.size} active AI agents`);
    } catch (error) {
      console.error('Error loading AI agents:', error);
    }
  }

  async requestPrediction(context: AIContext, parameters: any): Promise<AIResponse> {
    const request: AIRequest = {
      request_id: this.generateRequestId(),
      agent_id: this.selectBestAgent(context),
      context,
      parameters,
      priority: 'normal'
    };

    return this.processRequest(request);
  }

  private selectBestAgent(context: AIContext): string {
    // Simple agent selection logic - can be enhanced with ML
    const agentsByType = Array.from(this.agents.values());
    
    if (context.action.includes('predict') || context.action.includes('forecast')) {
      const predictiveAgent = agentsByType.find(a => a.type === 'predictive');
      if (predictiveAgent) return predictiveAgent.id;
    }
    
    if (context.action.includes('suggest') || context.action.includes('assist')) {
      const cognitiveAgent = agentsByType.find(a => a.type === 'cognitive');
      if (cognitiveAgent) return cognitiveAgent.id;
    }
    
    if (context.action.includes('automate') || context.action.includes('workflow')) {
      const automationAgent = agentsByType.find(a => a.type === 'automation');
      if (automationAgent) return automationAgent.id;
    }

    // Default to first available agent
    return agentsByType[0]?.id || '';
  }

  private async processRequest(request: AIRequest): Promise<AIResponse> {
    console.log('Processing AI request:', request.request_id);

    // For now, return mock responses - this will be enhanced with actual AI processing
    const mockResponse: AIResponse = {
      request_id: request.request_id,
      agent_id: request.agent_id,
      result: this.generateMockResult(request),
      confidence_score: 0.85,
      reasoning: ['Pattern analysis based on historical data', 'User behavior similarity matching'],
      suggestions: ['Consider updating workflow', 'Review data completeness']
    };

    // Log the decision
    await this.logDecision(request, mockResponse);

    return mockResponse;
  }

  private generateMockResult(request: AIRequest): any {
    const { context } = request;
    
    if (context.action.includes('suggest_form_completion')) {
      return {
        suggestions: [
          { field: 'email', value: 'john.doe@example.com', confidence: 0.9 },
          { field: 'phone', value: '+1-555-0123', confidence: 0.7 }
        ]
      };
    }
    
    if (context.action.includes('predict_user_behavior')) {
      return {
        likely_next_actions: ['view_people_page', 'create_company'],
        time_estimates: { 'view_people_page': 120, 'create_company': 300 },
        confidence: 0.8
      };
    }

    return { message: 'AI processing completed', data: request.parameters };
  }

  private async logDecision(request: AIRequest, response: AIResponse): Promise<void> {
    try {
      const decision: Omit<AIDecision, 'id' | 'created_at'> = {
        agent_id: request.agent_id,
        user_id: request.context.user_id,
        tenant_id: request.context.tenant_id,
        context: request.context,
        decision: response.result,
        confidence_score: response.confidence_score,
        reasoning: response.reasoning,
        outcome_feedback: null,
        was_accepted: null
      };

      const { error } = await supabase
        .from('ai_decisions')
        .insert(decision);

      if (error) {
        console.error('Error logging AI decision:', error);
      }
    } catch (error) {
      console.error('Error in logDecision:', error);
    }
  }

  async provideFeedback(decisionId: string, feedback: 'positive' | 'negative', details?: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_decisions')
        .update({
          was_accepted: feedback === 'positive',
          outcome_feedback: { feedback, details, timestamp: new Date().toISOString() }
        })
        .eq('id', decisionId);

      if (error) throw error;
      
      console.log(`Feedback recorded for decision ${decisionId}: ${feedback}`);
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  }

  private generateRequestId(): string {
    return `ai_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getActiveAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  async refreshAgents(): Promise<void> {
    await this.loadActiveAgents();
  }
}

export const aiOrchestrationService = new AIOrchestrationService();
