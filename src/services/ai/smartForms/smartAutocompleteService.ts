
import { supabase } from '@/integrations/supabase/client';

export interface AutocompleteOption {
  value: string;
  label: string;
  frequency: number;
  context?: string;
  source: 'database' | 'history' | 'external';
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
  private cache = new Map<string, AutocompleteOption[]>();
  private cacheExpiry = new Map<string, number>();

  private constructor() {}

  static getInstance(): SmartAutocompleteService {
    if (!SmartAutocompleteService.instance) {
      SmartAutocompleteService.instance = new SmartAutocompleteService();
    }
    return SmartAutocompleteService.instance;
  }

  async getAutocompleteSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    const cacheKey = this.getCacheKey(request);
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) return this.filterAndSort(cached, request.query, request.limit);
    }

    // Get fresh suggestions
    const suggestions = await this.fetchSuggestions(request);
    
    // Cache the results
    this.cache.set(cacheKey, suggestions);
    this.cacheExpiry.set(cacheKey, Date.now() + 300000); // 5 minutes

    return this.filterAndSort(suggestions, request.query, request.limit);
  }

  private async fetchSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    const suggestions: AutocompleteOption[] = [];

    switch (request.fieldType) {
      case 'company_name':
        suggestions.push(...await this.getCompanyNameSuggestions(request));
        break;
      case 'person_name':
        suggestions.push(...await this.getPersonNameSuggestions(request));
        break;
      case 'email':
        suggestions.push(...await this.getEmailSuggestions(request));
        break;
      case 'role':
        suggestions.push(...await this.getRoleSuggestions(request));
        break;
      case 'industry':
        suggestions.push(...await this.getIndustrySuggestions(request));
        break;
      case 'location':
        suggestions.push(...await this.getLocationSuggestions(request));
        break;
      default:
        suggestions.push(...await this.getGenericSuggestions(request));
    }

    return suggestions;
  }

  private async getCompanyNameSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('name')
        .ilike('name', `%${request.query}%`)
        .limit(request.limit || 10);

      if (error) throw error;

      return (data || []).map(company => ({
        value: company.name,
        label: company.name,
        frequency: 1,
        source: 'database' as const
      }));
    } catch (error) {
      console.error('Error fetching company suggestions:', error);
      return [];
    }
  }

  private async getPersonNameSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('full_name')
        .ilike('full_name', `%${request.query}%`)
        .limit(request.limit || 10);

      if (error) throw error;

      return (data || []).map(person => ({
        value: person.full_name,
        label: person.full_name,
        frequency: 1,
        source: 'database' as const
      }));
    } catch (error) {
      console.error('Error fetching person suggestions:', error);
      return [];
    }
  }

  private async getEmailSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    const suggestions: AutocompleteOption[] = [];

    // If we have company context, suggest company domain emails
    if (request.context?.companyName) {
      const domain = this.inferDomainFromCompany(request.context.companyName);
      suggestions.push({
        value: `${request.query}@${domain}`,
        label: `${request.query}@${domain}`,
        frequency: 1,
        context: 'Based on company name',
        source: 'external'
      });
    }

    return suggestions;
  }

  private async getRoleSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    const commonRoles = [
      'Software Engineer', 'Product Manager', 'Data Scientist', 'Designer',
      'Marketing Manager', 'Sales Representative', 'HR Manager', 'Accountant',
      'Business Analyst', 'Project Manager', 'DevOps Engineer', 'QA Engineer'
    ];

    return commonRoles
      .filter(role => role.toLowerCase().includes(request.query.toLowerCase()))
      .map(role => ({
        value: role,
        label: role,
        frequency: 1,
        source: 'external' as const
      }));
  }

  private async getIndustrySuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    const commonIndustries = [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
      'Retail', 'Construction', 'Transportation', 'Media', 'Real Estate',
      'Consulting', 'Non-profit', 'Government', 'Energy', 'Agriculture'
    ];

    return commonIndustries
      .filter(industry => industry.toLowerCase().includes(request.query.toLowerCase()))
      .map(industry => ({
        value: industry,
        label: industry,
        frequency: 1,
        source: 'external' as const
      }));
  }

  private async getLocationSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    const commonLocations = [
      'New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL',
      'Boston, MA', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Atlanta, GA',
      'Miami, FL', 'London, UK', 'Toronto, Canada', 'Remote', 'Hybrid'
    ];

    return commonLocations
      .filter(location => location.toLowerCase().includes(request.query.toLowerCase()))
      .map(location => ({
        value: location,
        label: location,
        frequency: 1,
        source: 'external' as const
      }));
  }

  private async getGenericSuggestions(request: AutocompleteRequest): Promise<AutocompleteOption[]> {
    // For now, return empty array for generic fields
    // In the future, this could use AI to generate contextual suggestions
    return [];
  }

  private filterAndSort(
    suggestions: AutocompleteOption[], 
    query: string, 
    limit?: number
  ): AutocompleteOption[] {
    const filtered = suggestions.filter(s => 
      s.value.toLowerCase().includes(query.toLowerCase()) ||
      s.label.toLowerCase().includes(query.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.value.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      const bExact = b.value.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      
      if (aExact !== bExact) return bExact - aExact;
      
      // Then by frequency
      return b.frequency - a.frequency;
    });

    return limit ? sorted.slice(0, limit) : sorted;
  }

  private getCacheKey(request: AutocompleteRequest): string {
    return `${request.fieldType}_${request.userId}_${request.tenantId || 'global'}`;
  }

  private isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey);
    return expiry ? Date.now() < expiry : false;
  }

  private inferDomainFromCompany(companyName: string): string {
    // Simple domain inference - in reality, this would be more sophisticated
    return companyName.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 10) + '.com';
  }
}

export const smartAutocompleteService = SmartAutocompleteService.getInstance();
