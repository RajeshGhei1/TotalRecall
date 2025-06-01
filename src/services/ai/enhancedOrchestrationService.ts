
import { supabase } from '@/integrations/supabase/client';
import { AIAgent, AIRequest, AIResponse, AIContext } from '@/types/ai';
import { tenantAIModelService } from './tenantAIModelService';
import { aiCacheService } from './aiCacheService';
import { aiMetricsService } from './aiMetricsService';
import { aiAgentSelector } from './aiAgentSelector';
import { aiRequestProcessor } from './aiRequestProcessor';

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
          model_config: (agent.model_config as Record<string, any>) || {},
          performance_metrics: (agent.performance_metrics as Record<string, any>) || {}
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
    const cachedResponse = await aiCacheService.checkCache(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    aiCacheService.incrementTotalRequests();

    // Add to queue based on priority
    this.addToQueue(request);
    
    // For high/urgent priority, process immediately
    if (priority === 'high' || priority === 'urgent') {
      return this.processRequest(request);
    }

    // For normal/low priority, let queue processor handle it
    return this.waitForQueueProcessing(request);
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
          resolve(aiRequestProcessor.generateMockResponse(request));
        }
      }, 500);
    });
  }

  private async selectBestAgent(context: AIContext): Promise<string> {
    const availableAgents = Array.from(this.agents.values()).filter(agent => 
      agent.tenant_id === null || agent.tenant_id === context.tenant_id
    );

    return aiAgentSelector.selectBestAgent(context, availableAgents);
  }

  private async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      let response: AIResponse;

      // Log request start
      await aiMetricsService.logRequest(request, 'pending', startTime);

      if (request.context.tenant_id) {
        const hasValidConfig = await tenantAIModelService.validateTenantAIConfig(request.context.tenant_id);
        
        if (hasValidConfig) {
          response = await aiRequestProcessor.processWithTenantAI(request);
        } else {
          response = aiRequestProcessor.generateMockResponse(request);
        }
      } else {
        response = aiRequestProcessor.generateMockResponse(request);
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Log successful completion
      await aiMetricsService.logRequest(request, 'completed', startTime, endTime, responseTime);

      // Cache the response
      await aiCacheService.cacheResponse(request, response);

      // Update performance metrics
      await aiMetricsService.updatePerformanceMetrics(request.agent_id, request.context.tenant_id, responseTime, true);

      return response;
    } catch (error) {
      console.error('Error processing AI request:', error);
      
      // Log error
      await aiMetricsService.logRequest(request, 'failed', startTime, Date.now(), 0, error as Error);
      
      // Update performance metrics
      await aiMetricsService.updatePerformanceMetrics(request.agent_id, request.context.tenant_id, 0, false);
      
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
    const cacheMetrics = aiCacheService.getCacheMetrics();
    return {
      totalRequests: cacheMetrics.totalRequests,
      cacheHits: cacheMetrics.cacheHits,
      cacheHitRate: cacheMetrics.cacheHitRate,
      queueSize: this.requestQueue.length,
      activeAgents: this.agents.size
    };
  }
}

export const enhancedAIOrchestrationService = new EnhancedAIOrchestrationService();
