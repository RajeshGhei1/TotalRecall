import { supabase } from '@/integrations/supabase/client';
import { AIAgent, AIRequest, AIResponse, AIContext } from '@/types/ai';
import { tenantAIModelService } from './tenantAIModelService';
import { aiCacheService } from './aiCacheService';
import { aiMetricsService } from './aiMetricsService';
import { hybridAgentSelector } from './hybridAgentSelector';
import { moduleContextManager } from './moduleContextManager';
import { aiRequestProcessor } from './aiRequestProcessor';
import { aiModelHealthService } from './aiModelHealthService';
import { aiCostTrackingService } from './aiCostTrackingService';
import { aiLearningDataService } from './aiLearningDataService';
import { decisionContextManager } from './decisionContextManager';

export class EnhancedAIOrchestrationService {
  private agents: Map<string, AIAgent> = new Map();
  private requestQueue: AIRequest[] = [];
  private isProcessingQueue = false;

  async initialize(): Promise<void> {
    console.log('Initializing Enhanced AI Orchestration Service with Hybrid Selection...');
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
    // Enhance context with module information
    const enhancedContext = await moduleContextManager.enhanceContextWithModule(context);
    
    // Estimate token usage for budget checking
    const estimatedTokens = this.estimateTokenUsage(parameters);
    
    // Check module token budget
    const budgetCheck = await moduleContextManager.checkTokenBudget(
      context.module, 
      context.tenant_id, 
      estimatedTokens
    );
    
    if (!budgetCheck.allowed) {
      throw new Error(`Token budget exceeded: ${budgetCheck.reason}`);
    }

    if (budgetCheck.overage_amount && budgetCheck.overage_amount > 0) {
      console.warn(`Module ${context.module} will exceed budget by ${budgetCheck.overage_amount} tokens`);
    }

    const request: AIRequest = {
      request_id: this.generateRequestId(),
      agent_id: await this.selectBestAgent(enhancedContext),
      context: enhancedContext,
      parameters,
      priority
    };

    // Check cache first
    const cachedResponse = await aiCacheService.checkCache(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    aiCacheService.incrementTotalRequests();

    // Analyze context for intelligent decision making
    const contextAnalysis = await decisionContextManager.analyzeContext(enhancedContext);
    console.log(`Context analysis completed: complexity=${contextAnalysis.contextComplexity}, risk=${contextAnalysis.riskLevel}`);

    // Apply contextual recommendations to agent selection and confidence adjustments
    if (contextAnalysis.contextualRecommendations.length > 0) {
      const bestRecommendation = contextAnalysis.contextualRecommendations[0];
      if (bestRecommendation.recommended_agent && bestRecommendation.context_similarity > 0.8) {
        request.agent_id = bestRecommendation.recommended_agent;
        console.log(`Using recommended agent ${bestRecommendation.recommended_agent} based on historical context`);
      }
    }

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
      return this.processRequest(request, contextAnalysis);
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
            // Analyze context for queued requests too
            const contextAnalysis = await decisionContextManager.analyzeContext(request.context);
            await this.processRequest(request, contextAnalysis);
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

    // Use hybrid agent selector instead of basic selection
    return hybridAgentSelector.selectAgent(context, availableAgents);
  }

  private async processRequest(request: AIRequest, contextAnalysis?: any): Promise<AIResponse> {
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

      // Apply confidence adjustments based on context analysis
      if (contextAnalysis?.contextualRecommendations.length > 0) {
        const bestRecommendation = contextAnalysis.contextualRecommendations[0];
        if (bestRecommendation.confidence_adjustment !== 0) {
          response.confidence_score = Math.max(0, Math.min(1, 
            response.confidence_score + bestRecommendation.confidence_adjustment
          ));
          response.reasoning = response.reasoning || [];
          response.reasoning.push(`Confidence adjusted by ${bestRecommendation.confidence_adjustment.toFixed(2)} based on historical context`);
        }
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Record module usage for token tracking and billing
      const tokensUsed = this.calculateTokensUsed(request, response);
      const cost = await this.calculateCost(request, response, tokensUsed);
      
      await moduleContextManager.recordModuleUsage(
        request.context.module,
        request.context.tenant_id,
        tokensUsed,
        cost,
        true
      );

      await aiMetricsService.logRequest(request, 'completed', startTime, endTime, responseTime);
      await aiCacheService.cacheResponse(request, response);
      await aiMetricsService.updatePerformanceMetrics(request.agent_id, request.context.tenant_id, responseTime, true);

      return response;
    } catch (error) {
      console.error('Error processing AI request:', error);
      
      // Record failed usage
      await moduleContextManager.recordModuleUsage(
        request.context.module,
        request.context.tenant_id || null,
        0,
        0,
        false
      );
      
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

  private estimateTokenUsage(parameters: any): number {
    // Basic token estimation based on prompt length
    const promptText = JSON.stringify(parameters);
    // Rough estimate: 1 token ≈ 4 characters for English text
    return Math.ceil(promptText.length / 4) * 1.5; // Include response estimation
  }

  private calculateTokensUsed(request: AIRequest, response: AIResponse): number {
    // For now, use estimation. In production, this would come from the actual AI service response
    const inputTokens = this.estimateTokenUsage(request.parameters);
    const outputTokens = JSON.stringify(response.result).length / 4;
    return Math.ceil(inputTokens + outputTokens);
  }

  private async calculateCost(request: AIRequest, response: AIResponse, tokensUsed: number): Promise<number> {
    // Use the cost tracking service for accurate cost calculation
    const modelId = 'gpt-4o-mini'; // Default model, would be determined from agent config
    const inputTokens = Math.ceil(tokensUsed * 0.6); // Rough split
    const outputTokens = Math.ceil(tokensUsed * 0.4);
    
    const costCalc = aiCostTrackingService.calculateCost(modelId, inputTokens, outputTokens);
    return costCalc.totalCost;
  }

  async provideFeedback(decisionId: string, feedback: 'positive' | 'negative', details?: any): Promise<void> {
    try {
      // Update the decision record
      const { error } = await supabase
        .from('ai_decisions')
        .update({
          was_accepted: feedback === 'positive',
          outcome_feedback: { feedback, details, timestamp: new Date().toISOString() }
        })
        .eq('id', decisionId);

      if (error) throw error;

      // Get decision details for learning
      const { data: decision } = await supabase
        .from('ai_decisions')
        .select('*')
        .eq('id', decisionId)
        .single();

      if (decision) {
        // Record learning data
        await aiLearningDataService.recordFeedback(
          decisionId,
          decision.user_id || 'system',
          decision.tenant_id,
          feedback,
          {
            original_decision: decision.decision,
            satisfaction_score: feedback === 'positive' ? 1.0 : 0.0,
            feedback_details: details,
            context_relevance: decision.confidence_score || 0.5
          },
          feedback === 'negative' ? 1.2 : 0.8 // Weight negative feedback higher for learning
        );
      }
      
      console.log(`Feedback recorded for decision ${decisionId}: ${feedback}`);
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  }

  async recordDecisionOutcome(decisionId: string, outcome: 'success' | 'failure' | 'partial_success', outcomeData?: any): Promise<void> {
    try {
      await aiLearningDataService.recordDecisionOutcome(decisionId, outcome, outcomeData);
      console.log(`Decision outcome recorded: ${outcome} for decision ${decisionId}`);
    } catch (error) {
      console.error('Error recording decision outcome:', error);
    }
  }

  async getLearningInsights(tenantId?: string): Promise<unknown> {
    try {
      const learningInsights = await aiLearningDataService.getLearningInsights(tenantId);
      const contextInsights = await decisionContextManager.getContextInsights(tenantId);
      
      return {
        learning: learningInsights,
        context: contextInsights,
        combinedScore: (learningInsights.positiveRatio + contextInsights.avgSuccessRate) / 2
      };
    } catch (error) {
      console.error('Error getting learning insights:', error);
      return {
        learning: {
          totalFeedback: 0,
          positiveRatio: 0,
          topIssues: [],
          improvementAreas: [],
          recentPatterns: []
        },
        context: {
          totalContextsAnalyzed: 0,
          avgSuccessRate: 0,
          riskDistribution: { low: 0, medium: 0, high: 0 },
          topPerformingContexts: [],
          problematicContexts: []
        },
        combinedScore: 0
      };
    }
  }

  async refreshModuleAssignments(moduleName?: string): Promise<void> {
    await hybridAgentSelector.refreshAssignments(moduleName);
    moduleContextManager.clearCache();
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
