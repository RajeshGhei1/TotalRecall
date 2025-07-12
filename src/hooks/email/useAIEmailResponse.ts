
import { useState } from 'react';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';
import { useTenantContext } from '@/contexts/TenantContext';

export interface EmailContext {
  sender: string;
  subject: string;
  body: string;
  urgency: 'low' | 'medium' | 'high';
  category?: string;
}

export interface AIEmailResponse {
  response: string;
  tone: 'professional' | 'friendly' | 'formal';
  confidence: number;
  suggestions: string[];
}

export const useAIEmailResponse = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { requestPrediction } = useUnifiedAIOrchestration();
  const { selectedTenantId } = useTenantContext();

  const generateEmailResponse = async (
    emailContext: EmailContext,
    responseInstructions?: string
  ): Promise<AIEmailResponse | null> => {
    setIsGenerating(true);
    
    try {
      const aiResponse = await requestPrediction({
        context: {
          user_id: 'current-user', // Replace with actual user ID
          tenant_id: selectedTenantId || undefined,
          module: 'email-management',
          action: 'generate_email_response',
          entity_type: 'email',
          session_data: {
            emailContext,
            responseInstructions
          }
        },
        parameters: {
          prompt: `Generate a professional email response for:
            From: ${emailContext.sender}
            Subject: ${emailContext.subject}
            Original Message: ${emailContext.body}
            
            Instructions: ${responseInstructions || 'Generate an appropriate response'}
            Urgency Level: ${emailContext.urgency}
            
            Please provide a helpful, professional response that addresses the sender's needs.`,
          task_type: 'email_response_generation',
          response_format: 'structured'
        },
        priority: emailContext.urgency === 'high' ? 'high' : 'normal'
      });

      // Handle response structure properly with null safety
      let responseText = '';
      let tone: 'professional' | 'friendly' | 'formal' = 'professional';
      let suggestions: string[] = [];

      if (aiResponse.result && typeof aiResponse.result === 'object') {
        const result = aiResponse.result as unknown;
        responseText = result.generated_response || result.response || JSON.stringify(result);
        tone = result.tone || 'professional';
        suggestions = result.suggestions || [];
      } else if (aiResponse.result) {
        responseText = String(aiResponse.result);
      }

      const emailResponse: AIEmailResponse = {
        response: responseText,
        tone: tone,
        confidence: aiResponse.confidence_score,
        suggestions: suggestions
      };

      return emailResponse;
    } catch (error) {
      console.error('Failed to generate AI email response:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const improveEmailResponse = async (
    currentResponse: string,
    improvementRequest: string
  ): Promise<string | null> => {
    try {
      const aiResponse = await requestPrediction({
        context: {
          user_id: 'current-user',
          tenant_id: selectedTenantId || undefined,
          module: 'email-management',
          action: 'improve_email_response'
        },
        parameters: {
          prompt: `Improve this email response based on the following request:
            
            Current Response: ${currentResponse}
            Improvement Request: ${improvementRequest}
            
            Please provide an improved version that incorporates the requested changes.`,
          task_type: 'email_improvement'
        },
        priority: 'normal'
      });

      // Handle response structure properly with null safety
      if (aiResponse.result && typeof aiResponse.result === 'object') {
        const result = aiResponse.result as unknown;
        return result.improved_response || result.response || JSON.stringify(result);
      } else if (aiResponse.result) {
        return String(aiResponse.result);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to improve email response:', error);
      return null;
    }
  };

  return {
    generateEmailResponse,
    improveEmailResponse,
    isGenerating
  };
};
