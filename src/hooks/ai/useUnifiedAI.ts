
import { useState } from 'react';
import { unifiedAIService, UnifiedAIRequest, UnifiedAIResponse } from '@/services/ai/unifiedAIService';

export const useUnifiedAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRequest = async (request: UnifiedAIRequest): Promise<UnifiedAIResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await unifiedAIService.processRequest(request);
      
      if (!response.success) {
        setError(response.error || 'Request failed');
        return null;
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmailResponse = async (
    emailContent: string,
    responseType: string,
    options: {
      tone?: string;
      length?: string;
      userId: string;
      tenantId?: string;
      module: string;
    }
  ) => {
    return processRequest({
      module: options.module,
      service: 'email-response-generator',
      action: 'generate_response',
      context: {
        userId: options.userId,
        tenantId: options.tenantId,
        entityType: 'email'
      },
      parameters: {
        emailContent,
        responseType,
        tone: options.tone || 'professional',
        length: options.length || 'medium'
      }
    });
  };

  const getFormSuggestions = async (
    formType: string,
    fieldName: string,
    currentValue: string,
    options: {
      userId: string;
      tenantId?: string;
      module: string;
      userHistory?: any[];
      contextData?: Record<string, any>;
    }
  ) => {
    return processRequest({
      module: options.module,
      service: 'smart-form-suggestions',
      action: 'suggest_values',
      context: {
        userId: options.userId,
        tenantId: options.tenantId,
        entityType: 'form'
      },
      parameters: {
        formType,
        fieldName,
        currentValue,
        userHistory: options.userHistory || [],
        contextData: options.contextData || {}
      }
    });
  };

  const analyzeContent = async (
    content: string,
    options: {
      analysisType?: string;
      userId: string;
      tenantId?: string;
      module: string;
    }
  ) => {
    return processRequest({
      module: options.module,
      service: 'content-analysis',
      action: 'analyze_sentiment',
      context: {
        userId: options.userId,
        tenantId: options.tenantId,
        entityType: 'content'
      },
      parameters: {
        content,
        analysisType: options.analysisType || 'comprehensive'
      }
    });
  };

  const predictOutcome = async (
    dataType: string,
    historicalData: any[],
    options: {
      predictionHorizon?: string;
      userId: string;
      tenantId?: string;
      module: string;
    }
  ) => {
    return processRequest({
      module: options.module,
      service: 'smart-predictions',
      action: 'predict_outcome',
      context: {
        userId: options.userId,
        tenantId: options.tenantId,
        entityType: 'prediction'
      },
      parameters: {
        dataType,
        historicalData,
        predictionHorizon: options.predictionHorizon || '30days'
      }
    });
  };

  const getAvailableServices = () => {
    return unifiedAIService.getRegisteredServices();
  };

  return {
    processRequest,
    generateEmailResponse,
    getFormSuggestions,
    analyzeContent,
    predictOutcome,
    getAvailableServices,
    isLoading,
    error
  };
};
