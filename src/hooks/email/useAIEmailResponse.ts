
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

      const emailResponse: AIEmailResponse = {
        response: aiResponse.result.generated_response || aiResponse.result,
        tone: aiResponse.result.tone || 'professional',
        confidence: aiResponse.confidence_score,
        suggestions: aiResponse.suggestions || []
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

      return aiResponse.result.improved_response || aiResponse.result;
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
