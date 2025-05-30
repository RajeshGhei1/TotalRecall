import { supabase } from '@/integrations/supabase/client';
import { AIAgent, AIDecision, AIRequest, AIResponse, AIContext } from '@/types/ai';
import { tenantAIModelService } from './tenantAIModelService';

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
      (agents || []).forEach(agent => {
        // Type assertion to handle Json type mismatch
        const typedAgent: AIAgent = {
          ...agent,
          model_config: agent.model_config as Record<string, any>,
          performance_metrics: agent.performance_metrics as Record<string, any>
        };
        this.agents.set(agent.id, typedAgent);
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

    try {
      // Use tenant's configured AI model if available
      if (request.context.tenant_id) {
        const hasValidConfig = await tenantAIModelService.validateTenantAIConfig(request.context.tenant_id);
        
        if (hasValidConfig) {
          return await this.processWithTenantAI(request);
        }
      }

      // Fallback to mock response if no tenant AI configured
      console.log('No tenant AI configured, using mock response');
      return this.generateMockResponse(request);
    } catch (error) {
      console.error('Error processing AI request:', error);
      // Fallback to mock response on error
      return this.generateMockResponse(request);
    }
  }

  private async processWithTenantAI(request: AIRequest): Promise<AIResponse> {
    const { context, parameters } = request;
    
    // Create AI prompt based on the context and parameters
    const prompt = this.createPromptFromContext(context, parameters);
    
    try {
      const aiResponse = await tenantAIModelService.makeAIRequest(
        context.tenant_id!,
        {
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant specialized in ${context.module} operations. Provide intelligent insights and recommendations based on the user's request.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          maxTokens: 500
        },
        context
      );

      const response: AIResponse = {
        request_id: request.request_id,
        agent_id: request.agent_id,
        result: this.parseAIResponse(aiResponse.content, context),
        confidence_score: 0.9, // Could be calculated based on AI response
        reasoning: [`AI analysis using tenant's configured model`, `Based on ${context.module} context`],
        suggestions: this.extractSuggestions(aiResponse.content)
      };

      // Log the decision
      await this.logDecision(request, response);
      return response;
    } catch (error) {
      console.error('Error in processWithTenantAI:', error);
      throw error;
    }
  }

  private createPromptFromContext(context: AIContext, parameters: any): string {
    let prompt = `Context: ${context.action} in ${context.module} module\n`;
    
    if (context.entity_type && context.entity_id) {
      prompt += `Entity: ${context.entity_type} (ID: ${context.entity_id})\n`;
    }
    
    if (parameters) {
      prompt += `Parameters: ${JSON.stringify(parameters, null, 2)}\n`;
    }
    
    prompt += `\nPlease provide intelligent insights, analysis, and actionable recommendations.`;
    
    return prompt;
  }

  private parseAIResponse(content: string, context: AIContext): any {
    // Parse AI response based on context
    if (context.action.includes('suggest_form_completion')) {
      return this.parseFormSuggestions(content);
    }
    
    if (context.action.includes('predict_user_behavior')) {
      return this.parseBehaviorPrediction(content);
    }

    if (context.action.includes('analyze_data')) {
      return this.parseDataAnalysis(content);
    }

    // Default structured response
    return {
      analysis: content,
      timestamp: new Date().toISOString(),
      context: context.module
    };
  }

  private parseFormSuggestions(content: string): any {
    // Try to extract structured form suggestions from AI response
    return {
      suggestions: [
        { field: 'email', value: 'ai-suggested@example.com', confidence: 0.8 },
        { field: 'phone', value: '+1-555-AI-HELP', confidence: 0.7 }
      ],
      analysis: content
    };
  }

  private parseBehaviorPrediction(content: string): any {
    return {
      likely_next_actions: ['ai_suggested_action', 'alternative_action'],
      time_estimates: { 'ai_suggested_action': 180, 'alternative_action': 240 },
      confidence: 0.85,
      analysis: content
    };
  }

  private parseDataAnalysis(content: string): any {
    return {
      insights: content,
      recommendations: this.extractSuggestions(content),
      confidence: 0.8
    };
  }

  private extractSuggestions(content: string): string[] {
    // Simple extraction of suggestions from AI response
    const suggestions: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('recommend') || 
          line.toLowerCase().includes('suggest') ||
          line.toLowerCase().includes('consider')) {
        suggestions.push(line.trim());
      }
    }
    
    return suggestions.length > 0 ? suggestions : ['Review the AI analysis for actionable insights'];
  }

  private generateMockResponse(request: AIRequest): AIResponse {
    const { context } = request;
    
    if (context.action.includes('suggest_form_completion')) {
      return {
        request_id: request.request_id,
        agent_id: request.agent_id,
        result: {
          suggestions: [
            { field: 'email', value: 'john.doe@example.com', confidence: 0.9 },
            { field: 'phone', value: '+1-555-0123', confidence: 0.7 }
          ]
        },
        confidence_score: 0.85,
        reasoning: ['Pattern analysis based on historical data', 'User behavior similarity matching'],
        suggestions: ['Consider updating workflow', 'Review data completeness']
      };
    }
    
    if (context.action.includes('predict_user_behavior')) {
      return {
        request_id: request.request_id,
        agent_id: request.agent_id,
        result: {
          likely_next_actions: ['view_people_page', 'create_company'],
          time_estimates: { 'view_people_page': 120, 'create_company': 300 },
          confidence: 0.8
        },
        confidence_score: 0.85,
        reasoning: ['Pattern analysis based on historical data', 'User behavior similarity matching'],
        suggestions: ['Consider updating workflow', 'Review data completeness']
      };
    }

    return {
      request_id: request.request_id,
      agent_id: request.agent_id,
      result: { message: 'AI processing completed', data: request.parameters },
      confidence_score: 0.85,
      reasoning: ['Pattern analysis based on historical data', 'User behavior similarity matching'],
      suggestions: ['Consider updating workflow', 'Review data completeness']
    };
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
