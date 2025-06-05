
import { AIRequestContext, AIRequestPayload, AIResponseData } from '@/types/aiCore';
import { aiAgentManager } from '../core/aiAgentManager';
import { aiDecisionRecorder } from '../core/aiDecisionRecorder';

export interface FormSuggestion {
  fieldName: string;
  suggestedValue: string;
  confidence: number;
  reasoning: string;
  source: 'pattern' | 'context' | 'history' | 'ai';
}

export interface FormContext {
  formType: string;
  currentValues: Record<string, any>;
  userHistory: Record<string, any>[];
  tenantId?: string;
  userId: string;
}

export class FormSuggestionEngine {
  private static instance: FormSuggestionEngine;
  private patternCache = new Map<string, FormSuggestion[]>();
  private userPatterns = new Map<string, Record<string, any>>();

  private constructor() {}

  static getInstance(): FormSuggestionEngine {
    if (!FormSuggestionEngine.instance) {
      FormSuggestionEngine.instance = new FormSuggestionEngine();
    }
    return FormSuggestionEngine.instance;
  }

  async generateSuggestions(context: FormContext): Promise<FormSuggestion[]> {
    const suggestions: FormSuggestion[] = [];

    // Add pattern-based suggestions
    suggestions.push(...this.getPatternBasedSuggestions(context));
    
    // Add context-based suggestions
    suggestions.push(...this.getContextBasedSuggestions(context));
    
    // Add AI-powered suggestions
    const aiSuggestions = await this.getAISuggestions(context);
    suggestions.push(...aiSuggestions);

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  private getPatternBasedSuggestions(context: FormContext): FormSuggestion[] {
    const suggestions: FormSuggestion[] = [];
    const userPatterns = this.userPatterns.get(context.userId) || {};

    // Check for common patterns in user's form submissions
    for (const [fieldName, value] of Object.entries(userPatterns)) {
      if (!context.currentValues[fieldName] && value) {
        suggestions.push({
          fieldName,
          suggestedValue: value,
          confidence: 0.7,
          reasoning: 'Based on your previous entries',
          source: 'pattern'
        });
      }
    }

    return suggestions;
  }

  private getContextBasedSuggestions(context: FormContext): FormSuggestion[] {
    const suggestions: FormSuggestion[] = [];

    // Company form context suggestions
    if (context.formType === 'company_creation') {
      if (context.currentValues.website && !context.currentValues.email) {
        const domain = this.extractDomain(context.currentValues.website);
        suggestions.push({
          fieldName: 'email',
          suggestedValue: `contact@${domain}`,
          confidence: 0.8,
          reasoning: 'Email derived from website domain',
          source: 'context'
        });
      }

      if (context.currentValues.name && !context.currentValues.linkedin) {
        const companySlug = context.currentValues.name.toLowerCase().replace(/\s+/g, '-');
        suggestions.push({
          fieldName: 'linkedin',
          suggestedValue: `https://linkedin.com/company/${companySlug}`,
          confidence: 0.6,
          reasoning: 'LinkedIn URL based on company name',
          source: 'context'
        });
      }
    }

    // Person form context suggestions
    if (context.formType === 'talent_form' || context.formType === 'contact_form') {
      if (context.currentValues.email && !context.currentValues.linkedin) {
        const emailPrefix = context.currentValues.email.split('@')[0];
        suggestions.push({
          fieldName: 'linkedin',
          suggestedValue: `https://linkedin.com/in/${emailPrefix}`,
          confidence: 0.5,
          reasoning: 'LinkedIn URL based on email',
          source: 'context'
        });
      }
    }

    return suggestions;
  }

  private async getAISuggestions(context: FormContext): Promise<FormSuggestion[]> {
    try {
      const agent = aiAgentManager.selectBestAgent(['form_assistance', 'data_completion'], context.tenantId);
      if (!agent) return [];

      const requestContext: AIRequestContext = {
        userId: context.userId,
        tenantId: context.tenantId,
        module: 'smart_forms',
        action: 'generate_suggestions',
        timestamp: Date.now()
      };

      const aiRequest: AIRequestPayload = {
        context: requestContext,
        parameters: {
          formType: context.formType,
          currentValues: context.currentValues,
          userHistory: context.userHistory.slice(-5) // Last 5 entries for context
        },
        priority: 'normal'
      };

      // For now, return mock AI suggestions
      // In a real implementation, this would call an AI service
      return this.getMockAISuggestions(context);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return [];
    }
  }

  private getMockAISuggestions(context: FormContext): FormSuggestion[] {
    const suggestions: FormSuggestion[] = [];

    if (context.formType === 'company_creation') {
      if (context.currentValues.industry === 'Technology' && !context.currentValues.size) {
        suggestions.push({
          fieldName: 'size',
          suggestedValue: 'Startup',
          confidence: 0.75,
          reasoning: 'Most technology companies start as startups',
          source: 'ai'
        });
      }
    }

    return suggestions;
  }

  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }
  }

  recordUserPattern(userId: string, fieldName: string, value: any): void {
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, {});
    }
    
    const patterns = this.userPatterns.get(userId)!;
    patterns[fieldName] = value;
  }

  async recordSuggestionFeedback(
    suggestionId: string, 
    accepted: boolean, 
    context: FormContext
  ): Promise<void> {
    try {
      await aiDecisionRecorder.recordDecision({
        agentId: 'form-suggestion-engine',
        userId: context.userId,
        tenantId: context.tenantId,
        decision: {
          suggestionId,
          accepted,
          formType: context.formType,
          timestamp: new Date().toISOString()
        },
        confidence: accepted ? 1.0 : 0.0
      });
    } catch (error) {
      console.error('Error recording suggestion feedback:', error);
    }
  }
}

export const formSuggestionEngine = FormSuggestionEngine.getInstance();
