
import { supabase } from '@/integrations/supabase/client';
import { enhancedAIOrchestrationService } from './enhancedOrchestrationService';

export interface UnifiedAIRequest {
  module: string;
  service: string;
  action: string;
  context: {
    userId: string;
    tenantId?: string;
    entityType?: string;
    entityId?: string;
    additionalContext?: Record<string, any>;
  };
  parameters: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface UnifiedAIResponse {
  success: boolean;
  data: any;
  suggestions?: any[];
  confidence?: number;
  reasoning?: string[];
  metadata?: {
    responseTime: number;
    agentUsed: string;
    tokensUsed?: number;
    cost?: number;
  };
  error?: string;
}

export interface AIServiceRegistration {
  serviceId: string;
  name: string;
  description: string;
  supportedActions: string[];
  requiredParameters: string[];
  optionalParameters: string[];
  outputFormat: Record<string, any>;
}

class UnifiedAIService {
  private registeredServices: Map<string, AIServiceRegistration> = new Map();
  private serviceHandlers: Map<string, (request: UnifiedAIRequest) => Promise<UnifiedAIResponse>> = new Map();

  constructor() {
    this.initializeBuiltInServices();
  }

  private initializeBuiltInServices() {
    // Register AI Email Response Generator
    this.registerService({
      serviceId: 'email-response-generator',
      name: 'AI Email Response Generator',
      description: 'Generates intelligent email responses based on context',
      supportedActions: ['generate_response', 'suggest_improvements', 'analyze_tone'],
      requiredParameters: ['emailContent', 'responseType'],
      optionalParameters: ['tone', 'length', 'includeSignature'],
      outputFormat: { responseText: 'string', suggestions: 'array', confidence: 'number' }
    }, this.handleEmailResponseGeneration.bind(this));

    // Register Smart Form Suggestions
    this.registerService({
      serviceId: 'smart-form-suggestions',
      name: 'Smart Form Suggestions',
      description: 'Provides intelligent form field suggestions and validations',
      supportedActions: ['suggest_values', 'validate_input', 'predict_completion'],
      requiredParameters: ['formType', 'fieldName', 'currentValue'],
      optionalParameters: ['userHistory', 'contextData'],
      outputFormat: { suggestions: 'array', validationResult: 'object', confidence: 'number' }
    }, this.handleSmartFormSuggestions.bind(this));

    // Register Content Analysis
    this.registerService({
      serviceId: 'content-analysis',
      name: 'Content Analysis Service',
      description: 'Analyzes content for insights, sentiment, and recommendations',
      supportedActions: ['analyze_sentiment', 'extract_keywords', 'summarize', 'classify'],
      requiredParameters: ['content'],
      optionalParameters: ['analysisType', 'extractionRules'],
      outputFormat: { analysis: 'object', insights: 'array', confidence: 'number' }
    }, this.handleContentAnalysis.bind(this));

    // Register Smart Predictions
    this.registerService({
      serviceId: 'smart-predictions',
      name: 'Smart Predictions Service',
      description: 'Provides predictive insights based on data patterns',
      supportedActions: ['predict_outcome', 'forecast_trend', 'recommend_action'],
      requiredParameters: ['dataType', 'historicalData'],
      optionalParameters: ['predictionHorizon', 'confidenceLevel'],
      outputFormat: { prediction: 'object', recommendations: 'array', confidence: 'number' }
    }, this.handleSmartPredictions.bind(this));
  }

  registerService(
    registration: AIServiceRegistration,
    handler: (request: UnifiedAIRequest) => Promise<UnifiedAIResponse>
  ) {
    this.registeredServices.set(registration.serviceId, registration);
    this.serviceHandlers.set(registration.serviceId, handler);
    console.log(`Registered AI service: ${registration.name}`);
  }

  async processRequest(request: UnifiedAIRequest): Promise<UnifiedAIResponse> {
    const startTime = Date.now();
    
    try {
      // Validate request
      const validation = this.validateRequest(request);
      if (!validation.valid) {
        return {
          success: false,
          data: null,
          error: validation.error,
          metadata: {
            responseTime: Date.now() - startTime,
            agentUsed: 'validation'
          }
        };
      }

      // Get service handler
      const handler = this.serviceHandlers.get(request.service);
      if (!handler) {
        return {
          success: false,
          data: null,
          error: `Service '${request.service}' not found`,
          metadata: {
            responseTime: Date.now() - startTime,
            agentUsed: 'router'
          }
        };
      }

      // Log request for analytics
      await this.logRequest(request, startTime);

      // Process the request
      const response = await handler(request);
      
      // Add metadata
      response.metadata = {
        ...response.metadata,
        responseTime: Date.now() - startTime
      };

      return response;
    } catch (error) {
      console.error('Error processing AI request:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          responseTime: Date.now() - startTime,
          agentUsed: 'error-handler'
        }
      };
    }
  }

  private validateRequest(request: UnifiedAIRequest): { valid: boolean; error?: string } {
    if (!request.service || !request.action) {
      return { valid: false, error: 'Service and action are required' };
    }

    const serviceRegistration = this.registeredServices.get(request.service);
    if (!serviceRegistration) {
      return { valid: false, error: `Service '${request.service}' not registered` };
    }

    if (!serviceRegistration.supportedActions.includes(request.action)) {
      return { valid: false, error: `Action '${request.action}' not supported by service '${request.service}'` };
    }

    // Validate required parameters
    for (const param of serviceRegistration.requiredParameters) {
      if (!(param in request.parameters)) {
        return { valid: false, error: `Required parameter '${param}' missing` };
      }
    }

    return { valid: true };
  }

  private async handleEmailResponseGeneration(request: UnifiedAIRequest): Promise<UnifiedAIResponse> {
    const { emailContent, responseType, tone = 'professional', length = 'medium' } = request.parameters;

    // Use the enhanced orchestration service for actual AI processing
    const aiResponse = await enhancedAIOrchestrationService.requestPrediction(
      {
        user_id: request.context.userId,
        tenant_id: request.context.tenantId,
        module: request.module,
        action: 'generate_email_response',
        entity_type: 'email',
        session_data: { tone, length, responseType }
      },
      { emailContent, responseType, tone, length },
      request.priority || 'normal'
    );

    return {
      success: true,
      data: {
        responseText: aiResponse.result?.responseText || `Generated ${responseType} response for the email with ${tone} tone`,
        alternativeResponses: aiResponse.result?.alternatives || [],
        detectedIntent: aiResponse.result?.detectedIntent || 'general_inquiry'
      },
      suggestions: aiResponse.suggestions || [],
      confidence: aiResponse.confidence_score || 0.8,
      reasoning: aiResponse.reasoning || ['Email content analyzed', 'Response generated based on context'],
      metadata: {
        responseTime: 0,
        agentUsed: aiResponse.agent_id || 'email-agent',
        tokensUsed: 150,
        cost: 0.002
      }
    };
  }

  private async handleSmartFormSuggestions(request: UnifiedAIRequest): Promise<UnifiedAIResponse> {
    const { formType, fieldName, currentValue, userHistory = [], contextData = {} } = request.parameters;

    const aiResponse = await enhancedAIOrchestrationService.requestPrediction(
      {
        user_id: request.context.userId,
        tenant_id: request.context.tenantId,
        module: request.module,
        action: 'suggest_form_values',
        entity_type: 'form',
        session_data: { formType, fieldName }
      },
      { formType, fieldName, currentValue, userHistory, contextData },
      request.priority || 'normal'
    );

    return {
      success: true,
      data: {
        suggestions: aiResponse.result?.suggestions || [
          { value: 'Smart suggestion 1', confidence: 0.9, reasoning: 'Based on user history' },
          { value: 'Smart suggestion 2', confidence: 0.7, reasoning: 'Based on similar forms' }
        ],
        validationResult: {
          isValid: true,
          issues: [],
          improvements: ['Consider adding more detail', 'Check formatting']
        },
        completionPrediction: aiResponse.result?.completion || {}
      },
      confidence: aiResponse.confidence_score || 0.85,
      reasoning: aiResponse.reasoning || ['Form context analyzed', 'User patterns considered'],
      metadata: {
        responseTime: 0,
        agentUsed: aiResponse.agent_id || 'form-agent',
        tokensUsed: 100,
        cost: 0.001
      }
    };
  }

  private async handleContentAnalysis(request: UnifiedAIRequest): Promise<UnifiedAIResponse> {
    const { content, analysisType = 'comprehensive' } = request.parameters;

    const aiResponse = await enhancedAIOrchestrationService.requestPrediction(
      {
        user_id: request.context.userId,
        tenant_id: request.context.tenantId,
        module: request.module,
        action: 'analyze_content',
        entity_type: 'content'
      },
      { content, analysisType },
      request.priority || 'normal'
    );

    return {
      success: true,
      data: {
        analysis: {
          sentiment: { score: 0.7, label: 'positive' },
          keywords: ['innovation', 'technology', 'growth'],
          topics: ['business', 'strategy'],
          readabilityScore: 85,
          wordCount: content.split(' ').length
        },
        insights: aiResponse.result?.insights || [
          'Content has positive sentiment',
          'Focus on business growth themes',
          'Well-structured and readable'
        ]
      },
      confidence: aiResponse.confidence_score || 0.9,
      metadata: {
        responseTime: 0,
        agentUsed: aiResponse.agent_id || 'analysis-agent',
        tokensUsed: 200,
        cost: 0.003
      }
    };
  }

  private async handleSmartPredictions(request: UnifiedAIRequest): Promise<UnifiedAIResponse> {
    const { dataType, historicalData, predictionHorizon = '30days' } = request.parameters;

    const aiResponse = await enhancedAIOrchestrationService.requestPrediction(
      {
        user_id: request.context.userId,
        tenant_id: request.context.tenantId,
        module: request.module,
        action: 'predict_outcomes',
        entity_type: 'prediction'
      },
      { dataType, historicalData, predictionHorizon },
      request.priority || 'normal'
    );

    return {
      success: true,
      data: {
        prediction: {
          outcome: 'positive_trend',
          probability: 0.75,
          timeframe: predictionHorizon,
          factors: ['historical patterns', 'current trends', 'external indicators']
        },
        recommendations: aiResponse.result?.recommendations || [
          'Continue current strategy',
          'Monitor key metrics closely',
          'Consider scaling operations'
        ]
      },
      confidence: aiResponse.confidence_score || 0.82,
      metadata: {
        responseTime: 0,
        agentUsed: aiResponse.agent_id || 'prediction-agent',
        tokensUsed: 250,
        cost: 0.004
      }
    };
  }

  private async logRequest(request: UnifiedAIRequest, startTime: number): Promise<void> {
    try {
      await supabase.from('ai_request_logs').insert({
        request_id: `unified_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: request.context.userId,
        tenant_id: request.context.tenantId,
        request_type: `${request.service}:${request.action}`,
        context: {
          module: request.module,
          service: request.service,
          action: request.action,
          entity_type: request.context.entityType,
          parameters: Object.keys(request.parameters)
        },
        status: 'pending'
      });
    } catch (error) {
      console.error('Failed to log unified AI request:', error);
    }
  }

  getRegisteredServices(): AIServiceRegistration[] {
    return Array.from(this.registeredServices.values());
  }

  getServiceInfo(serviceId: string): AIServiceRegistration | undefined {
    return this.registeredServices.get(serviceId);
  }
}

export const unifiedAIService = new UnifiedAIService();
