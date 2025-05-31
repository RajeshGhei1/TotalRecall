import { supabase } from '@/integrations/supabase/client';
import { AIAgent, AIDecision, AIRequest, AIResponse, AIContext } from '@/types/ai';
import { tenantAIModelService } from './tenantAIModelService';

export interface AIRequestMetrics {
  startTime: number;
  endTime?: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  cacheHit: boolean;
}

export class EnhancedAIOrchestrationService {
  private agents: Map<string, AIAgent> = new Map();
  private requestQueue: AIRequest[] = [];
  private isProcessingQueue = false;
  private cacheHits = 0;
  private totalRequests = 0;

  async initialize(): Promise<void> {
    console.log('Initializing Enhanced AI Orchestration Service...');
    await this.loadActiveAgents();
    this.startQueueProcessor();
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

  async requestPrediction(context: AIContext, parameters: any, priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'): Promise<AIResponse> {
    const request: AIRequest = {
      request_id: this.generateRequestId(),
      agent_id: await this.selectBestAgent(context),
      context,
      parameters,
      priority
    };

    // Check cache first
    const cachedResponse = await this.checkCache(request);
    if (cachedResponse) {
      this.cacheHits++;
      return cachedResponse;
    }

    // Add to queue based on priority
    this.addToQueue(request);
    
    // For high/urgent priority, process immediately
    if (priority === 'high' || priority === 'urgent') {
      return this.processRequest(request);
    }

    // For normal/low priority, let queue processor handle it
    return this.waitForQueueProcessing(request);
  }

  private async checkCache(request: AIRequest): Promise<AIResponse | null> {
    try {
      const contextHash = this.generateContextHash(request.context, request.parameters);
      
      const { data, error } = await supabase
        .from('ai_context_cache')
        .select('cached_response, hit_count')
        .eq('context_hash', contextHash)
        .eq('agent_id', request.agent_id)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error || !data) return null;

      // Update hit count
      await supabase
        .from('ai_context_cache')
        .update({ 
          hit_count: data.hit_count + 1,
          last_accessed_at: new Date().toISOString()
        })
        .eq('context_hash', contextHash);

      return data.cached_response as AIResponse;
    } catch (error) {
      console.error('Error checking cache:', error);
      return null;
    }
  }

  private async cacheResponse(request: AIRequest, response: AIResponse): Promise<void> {
    try {
      const contextHash = this.generateContextHash(request.context, request.parameters);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Cache for 1 hour

      await supabase
        .from('ai_context_cache')
        .upsert({
          cache_key: `${request.agent_id}_${contextHash}`,
          agent_id: request.agent_id,
          tenant_id: request.context.tenant_id,
          context_hash: contextHash,
          cached_response: response,
          expires_at: expiresAt.toISOString(),
          hit_count: 0
        });
    } catch (error) {
      console.error('Error caching response:', error);
    }
  }

  private generateContextHash(context: AIContext, parameters: any): string {
    const content = JSON.stringify({ context, parameters });
    return btoa(content).slice(0, 32); // Simple hash for demo
  }

  private addToQueue(request: AIRequest): void {
    // Insert based on priority
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const insertIndex = this.requestQueue.findIndex(
      r => priorityOrder[r.priority] > priorityOrder[request.priority]
    );
    
    if (insertIndex === -1) {
      this.requestQueue.push(request);
    } else {
      this.requestQueue.splice(insertIndex, 0, request);
    }
  }

  private startQueueProcessor(): void {
    setInterval(async () => {
      if (!this.isProcessingQueue && this.requestQueue.length > 0) {
        this.isProcessingQueue = true;
        const request = this.requestQueue.shift();
        if (request) {
          try {
            await this.processRequest(request);
          } catch (error) {
            console.error('Error processing queued request:', error);
          }
        }
        this.isProcessingQueue = false;
      }
    }, 100); // Process every 100ms
  }

  private async waitForQueueProcessing(request: AIRequest): Promise<AIResponse> {
    // In a real implementation, this would use WebSockets or SSE
    // For now, we'll simulate with a promise that resolves when processed
    return new Promise((resolve) => {
      const checkProcessed = setInterval(() => {
        // This is a simplified implementation
        // In practice, you'd track request status in the database
        if (!this.requestQueue.find(r => r.request_id === request.request_id)) {
          clearInterval(checkProcessed);
          resolve(this.generateMockResponse(request));
        }
      }, 500);
    });
  }

  private async selectBestAgent(context: AIContext): Promise<string> {
    const availableAgents = Array.from(this.agents.values()).filter(agent => 
      agent.tenant_id === null || agent.tenant_id === context.tenant_id
    );

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
      const performance = agent.performance_metrics as any;
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
      talent: ['talent_analysis', 'recruitment', 'matching']
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
    return 'cognitive';
  }

  private async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    this.totalRequests++;

    try {
      let response: AIResponse;

      // Log request start
      await this.logRequest(request, 'pending', startTime);

      if (request.context.tenant_id) {
        const hasValidConfig = await tenantAIModelService.validateTenantAIConfig(request.context.tenant_id);
        
        if (hasValidConfig) {
          response = await this.processWithTenantAI(request);
        } else {
          response = this.generateMockResponse(request);
        }
      } else {
        response = this.generateMockResponse(request);
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Log successful completion
      await this.logRequest(request, 'completed', startTime, endTime, responseTime);

      // Cache the response
      await this.cacheResponse(request, response);

      // Update performance metrics
      await this.updatePerformanceMetrics(request.agent_id, request.context.tenant_id, responseTime, true);

      return response;
    } catch (error) {
      console.error('Error processing AI request:', error);
      
      // Log error
      await this.logRequest(request, 'failed', startTime, Date.now(), 0, error as Error);
      
      // Update performance metrics
      await this.updatePerformanceMetrics(request.agent_id, request.context.tenant_id, 0, false);
      
      // Return error response
      return {
        request_id: request.request_id,
        agent_id: request.agent_id,
        result: { error: 'Processing failed', message: (error as Error).message },
        confidence_score: 0,
        reasoning: ['Error occurred during processing'],
        suggestions: ['Please try again or contact support'],
        error: (error as Error).message
      };
    }
  }

  private async logRequest(
    request: AIRequest, 
    status: string, 
    startTime: number, 
    endTime?: number,
    responseTime?: number,
    error?: Error
  ): Promise<void> {
    try {
      await supabase
        .from('ai_request_logs')
        .insert({
          request_id: request.request_id,
          agent_id: request.agent_id,
          tenant_id: request.context.tenant_id,
          user_id: request.context.user_id,
          request_type: request.context.action,
          status,
          response_time_ms: responseTime || 0,
          error_message: error?.message,
          context: request.context
        });
    } catch (logError) {
      console.error('Error logging request:', logError);
    }
  }

  private async updatePerformanceMetrics(
    agentId: string, 
    tenantId: string | undefined, 
    responseTime: number, 
    success: boolean
  ): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current metrics or create new ones
      const { data: existing } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .eq('tenant_id', tenantId || null)
        .eq('metric_date', today)
        .maybeSingle();

      if (existing) {
        // Update existing metrics
        const totalRequests = existing.total_requests + 1;
        const successfulRequests = existing.successful_requests + (success ? 1 : 0);
        const failedRequests = existing.failed_requests + (success ? 0 : 1);
        const avgResponseTime = success 
          ? ((existing.average_response_time_ms * existing.total_requests) + responseTime) / totalRequests
          : existing.average_response_time_ms;

        await supabase
          .from('ai_performance_metrics')
          .update({
            total_requests: totalRequests,
            successful_requests: successfulRequests,
            failed_requests: failedRequests,
            average_response_time_ms: Math.round(avgResponseTime)
          })
          .eq('id', existing.id);
      } else {
        // Create new metrics
        await supabase
          .from('ai_performance_metrics')
          .insert({
            agent_id: agentId,
            tenant_id: tenantId || null,
            metric_date: today,
            total_requests: 1,
            successful_requests: success ? 1 : 0,
            failed_requests: success ? 0 : 1,
            average_response_time_ms: success ? responseTime : 0
          });
      }
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  }

  private async processWithTenantAI(request: AIRequest): Promise<AIResponse> {
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

  private generateMockResponse(request: AIRequest): AIResponse {
    return {
      request_id: request.request_id,
      agent_id: request.agent_id,
      result: { message: 'Enhanced AI processing completed', data: request.parameters },
      confidence_score: 0.85,
      reasoning: ['Pattern analysis based on historical data', 'Enhanced agent selection algorithm'],
      suggestions: ['Consider updating workflow', 'Review data completeness']
    };
  }

  private async logDecision(request: AIRequest, response: AIResponse): Promise<void> {
    try {
      const decision = {
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

      await supabase
        .from('ai_decisions')
        .insert(decision);
    } catch (error) {
      console.error('Error logging AI decision:', error);
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

  getMetrics() {
    return {
      totalRequests: this.totalRequests,
      cacheHits: this.cacheHits,
      cacheHitRate: this.totalRequests > 0 ? (this.cacheHits / this.totalRequests) * 100 : 0,
      queueSize: this.requestQueue.length,
      activeAgents: this.agents.size
    };
  }
}

export const enhancedAIOrchestrationService = new EnhancedAIOrchestrationService();
