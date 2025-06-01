import { supabase } from '@/integrations/supabase/client';
import { AIAgent, AIRequest, AIResponse, AIContext } from '@/types/ai';
import { tenantAIModelService } from './tenantAIModelService';
import { aiCacheService } from './aiCacheService';
import { aiMetricsService } from './aiMetricsService';
import { aiAgentSelector } from './aiAgentSelector';
import { aiRequestProcessor } from './aiRequestProcessor';
import { aiModelHealthService } from './aiModelHealthService';
import { aiCostTrackingService } from './aiCostTrackingService';

export class EnhancedAIOrchestrationService {
  private agents: Map<string, AIAgent> = new Map();
  private requestQueue: AIRequest[] = [];
  private isProcessingQueue = false;

  async initialize(): Promise<void> {
    console.log('Initializing Enhanced AI Orchestration Service...');
    await this.loadActiveAgents();
    this.startQueueProcessor();

    // Initialize health monitoring if not already done
    try {
      await aiModelHealthService.initializeHealthMonitoring();
    } catch (error) {
      console.log('Health monitoring already initialized or failed:', error);
    }
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

    // Check model health before processing
    if (context.tenant_id) {
      const modelConfig = await tenantAIModelService.getTenantAIConfig(context.tenant_id);
      if (modelConfig) {
        const healthStatus = aiModelHealthService.getModelStatus(context.tenant_id, modelConfig.modelId);
        if (healthStatus && !healthStatus.isHealthy) {
          console.warn(`Model ${modelConfig.modelId} for tenant ${context.tenant_id} is unhealthy, using fallback`);
        }
      }
    }

    // For high/urgent priority, process immediately
    if (priority === 'high' || priority === 'urgent') {
      return this.processRequest(request);
    }

    // Add to queue for normal/low priority
    this.addToQueue(request);
    return this.waitForQueueProcessing(request);
  }

  private addToQueue(request: AIRequest): void {
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
    }, 100);
  }

  private async waitForQueueProcessing(request: AIRequest): Promise<AIResponse> {
    return new Promise((resolve) => {
      const checkProcessed = setInterval(() => {
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

      await aiMetricsService.logRequest(request, 'completed', startTime, endTime, responseTime);
      await aiCacheService.cacheResponse(request, response);
      await aiMetricsService.updatePerformanceMetrics(request.agent_id, request.context.tenant_id, responseTime, true);

      return response;
    } catch (error) {
      console.error('Error processing AI request:', error);
      
      await aiMetricsService.logRequest(request, 'failed', startTime, Date.now(), 0, error as Error);
      await aiMetricsService.updatePerformanceMetrics(request.agent_id, request.context.tenant_id, 0, false);
      
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

  getMetrics() {
    const cacheMetrics = aiCacheService.getCacheMetrics();
    const healthMetrics = aiModelHealthService.getHealthMetrics();
    
    return {
      totalRequests: cacheMetrics.totalRequests,
      cacheHits: cacheMetrics.cacheHits,
      cacheHitRate: cacheMetrics.cacheHitRate,
      queueSize: this.requestQueue.length,
      activeAgents: this.agents.size,
      modelHealth: healthMetrics
    };
  }

  async getSystemStatus() {
    const healthMetrics = aiModelHealthService.getHealthMetrics();
    const cacheMetrics = aiCacheService.getCacheMetrics();
    
    return {
      orchestrationStatus: 'active',
      agentCount: this.agents.size,
      queueSize: this.requestQueue.length,
      healthMetrics,
      cacheMetrics,
      uptime: healthMetrics.uptime
    };
  }
}

export const enhancedAIOrchestrationService = new EnhancedAIOrchestrationService();
