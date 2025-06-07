
import { AIRequestContext, AIRequestPayload } from '@/types/aiCore';
import { aiAgentManager } from '../core/aiAgentManager';

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
  confidence: number;
  source: 'ai' | 'historical' | 'template';
}

export interface AutocompleteRequest {
  fieldType: string;
  query: string;
  context?: Record<string, any>;
  userId: string;
  tenantId?: string;
  limit?: number;
}

export class SmartAutocompleteService {
  private static instance: SmartAutocompleteService;
  private optionsCache = new Map<string, AutocompleteOption[]>();

  private constructor() {}

  static getInstance(): SmartAutocompleteService {
    if (!SmartAutocompleteService.instance) {
      SmartAutocompleteService.instance = new SmartAutocompleteService();
    }
    return SmartAutocompleteService.instance;
  }

  async getAutocompleteSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    const cacheKey = `${request.fieldType}_${request.query}`;
    
    // Check cache first
    if (this.optionsCache.has(cacheKey)) {
      return this.optionsCache.get(cacheKey)!;
    }

    const suggestions: AutocompleteOption[] = [];

    // Add template-based suggestions
    suggestions.push(...this.getTemplateSuggestions(request));
    
    // Add historical data suggestions
    suggestions.push(...this.getHistoricalSuggestions(request));
    
    // Add AI-powered suggestions
    const aiSuggestions = await this.getAISuggestions(request);
    suggestions.push(...aiSuggestions);

    // Sort by confidence and limit results
    const result = suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, request.limit || 10);

    // Cache the results
    this.optionsCache.set(cacheKey, result);

    return result;
  }

  private getTemplateSuggestions(request: AutocompleteRequest): AutocompleteOption[] {
    const templates: Record<string, string[]> = {
      'job_title': [
        'Software Engineer', 'Product Manager', 'Data Scientist',
        'Designer', 'Marketing Manager', 'Sales Representative'
      ],
      'department': [
        'Engineering', 'Product', 'Marketing', 'Sales',
        'Human Resources', 'Finance', 'Operations'
      ],
      'location': [
        'San Francisco, CA', 'New York, NY', 'Remote',
        'Seattle, WA', 'Austin, TX', 'Los Angeles, CA'
      ],
      'skills': [
        'React', 'TypeScript', 'Python', 'JavaScript',
        'Node.js', 'AWS', 'Docker', 'Kubernetes'
      ]
    };

    const templateValues = templates[request.fieldType] || [];
    
    return templateValues
      .filter(value => value.toLowerCase().includes(request.query.toLowerCase()))
      .map(value => ({
        value,
        label: value,
        confidence: 0.8,
        source: 'template' as const
      }));
  }

  private getHistoricalSuggestions(request: AutocompleteRequest): AutocompleteOption[] {
    // In a real implementation, this would query historical form data
    // For now, return mock historical suggestions
    const mockHistorical: Record<string, string[]> = {
      'company_name': ['TechCorp Inc', 'InnovateLabs', 'DataFlow Systems'],
      'industry': ['Technology', 'Healthcare', 'Finance', 'Education'],
      'experience_level': ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
    };

    const historicalValues = mockHistorical[request.fieldType] || [];
    
    return historicalValues
      .filter(value => value.toLowerCase().includes(request.query.toLowerCase()))
      .map(value => ({
        value,
        label: value,
        confidence: 0.7,
        source: 'historical' as const
      }));
  }

  private async getAISuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    try {
      const agent = aiAgentManager.selectBestAgent(['autocomplete', 'data_completion'], request.tenantId);
      if (!agent) return [];

      // For now, return mock AI suggestions
      // In a real implementation, this would call an AI service
      return this.getMockAISuggestions(request);
    } catch (error) {
      console.error('Error getting AI autocomplete suggestions:', error);
      return [];
    }
  }

  private getMockAISuggestions(request: AutocompleteRequest): AutocompleteOption[] {
    const aiSuggestions: Record<string, string[]> = {
      'job_title': ['Full Stack Developer', 'DevOps Engineer', 'UX/UI Designer'],
      'requirements': ['Bachelor\'s degree required', '3+ years experience', 'Strong communication skills'],
      'benefits': ['Health insurance', 'Flexible working hours', 'Professional development budget']
    };

    const suggestions = aiSuggestions[request.fieldType] || [];
    
    return suggestions
      .filter(value => value.toLowerCase().includes(request.query.toLowerCase()))
      .map(value => ({
        value,
        label: value,
        description: `AI-suggested based on similar forms`,
        confidence: 0.9,
        source: 'ai' as const
      }));
  }

  clearCache(): void {
    this.optionsCache.clear();
  }
}

export const smartAutocompleteService = SmartAutocompleteService.getInstance();
