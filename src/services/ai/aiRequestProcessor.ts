
import { AIRequest, AIResponse, AIContext } from '@/types/ai';
import { tenantAIModelService } from './tenantAIModelService';
import { supabase } from '@/integrations/supabase/client';

export class AIRequestProcessor {
  async processWithTenantAI(request: AIRequest): Promise<AIResponse> {
    const { context, parameters } = request;
    
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
        confidence_score: 0.9,
        reasoning: [`AI analysis using tenant's configured model`, `Based on ${context.module} context`],
        suggestions: this.extractSuggestions(aiResponse.content)
      };

      await this.logDecision(request, response);
      return response;
    } catch (error) {
      console.error('Error in processWithTenantAI:', error);
      throw error;
    }
  }

  generateMockResponse(request: AIRequest): AIResponse {
    return {
      request_id: request.request_id,
      agent_id: request.agent_id,
      result: { message: 'Enhanced AI processing completed', data: request.parameters },
      confidence_score: 0.85,
      reasoning: ['Pattern analysis based on historical data', 'Enhanced agent selection algorithm'],
      suggestions: ['Consider updating workflow', 'Review data completeness']
    };
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
    return {
      analysis: content,
      timestamp: new Date().toISOString(),
      context: context.module
    };
  }

  private extractSuggestions(content: string): string[] {
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

  private async logDecision(request: AIRequest, response: AIResponse): Promise<void> {
    try {
      const decision = {
        agent_id: request.agent_id,
        user_id: request.context.user_id,
        tenant_id: request.context.tenant_id,
        context: request.context as any,
        decision: response.result as any,
        confidence_score: response.confidence_score,
        reasoning: response.reasoning,
        outcome_feedback: null,
        was_accepted: null
      };

      await supabase
        .from('ai_decisions')
        .insert(decision);
    } catch (error) {
      console.error('Error logging AI decision:', error);
    }
  }
}

export const aiRequestProcessor = new AIRequestProcessor();
