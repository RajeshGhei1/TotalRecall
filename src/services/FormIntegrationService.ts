
import { supabase } from '@/integrations/supabase/client';
import { FormPlacement, FormTrigger, FormDefinition } from '@/types/form-builder';
import { Database } from '@/integrations/supabase/types';

type DeploymentLocation = Database['public']['Enums']['deployment_location'];

export class FormIntegrationService {
  private static instance: FormIntegrationService;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): FormIntegrationService {
    if (!FormIntegrationService.instance) {
      FormIntegrationService.instance = new FormIntegrationService();
    }
    return FormIntegrationService.instance;
  }

  async getFormsForLocation(
    location: DeploymentLocation, 
    tenantId?: string, 
    context?: Record<string, any>
  ): Promise<FormPlacement[]> {
    const cacheKey = `${location}-${tenantId || 'global'}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return this.filterByTriggers(cached.data, context);
      }
    }

    // Fetch from database
    let query = supabase
      .from('form_placements')
      .select(`
        *,
        form_definitions(*),
        form_deployment_points!inner(*),
        form_triggers(*)
      `)
      .eq('status', 'active')
      .eq('form_deployment_points.location', location);

    if (tenantId) {
      query = query.or(`tenant_id.eq.${tenantId},tenant_id.is.null`);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching forms for location:', error);
      throw error;
    }

    // Cache the result
    this.cache.set(cacheKey, {
      data: data || [],
      timestamp: Date.now()
    });

    return this.filterByTriggers(data || [], context);
  }

  private filterByTriggers(placements: any[], context?: Record<string, any>): FormPlacement[] {
    if (!context) return placements;

    return placements.filter(placement => {
      if (!placement.form_triggers || placement.form_triggers.length === 0) {
        return true; // No triggers means always show
      }

      return placement.form_triggers.some((trigger: FormTrigger) => {
        if (!trigger.is_active) return false;
        return this.evaluateTrigger(trigger, context);
      });
    });
  }

  private evaluateTrigger(trigger: FormTrigger, context: Record<string, any>): boolean {
    const conditions = trigger.trigger_conditions;

    switch (trigger.trigger_type) {
      case 'page_load':
        return true; // Always trigger on page load if active

      case 'user_action':
        return context.action === conditions.action;

      case 'conditional':
        return this.evaluateConditions(conditions, context);

      case 'scheduled':
        return this.evaluateSchedule(conditions);

      case 'manual':
        return context.manual === true;

      default:
        return false;
    }
  }

  private evaluateConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    if (!conditions.rules) return true;

    return conditions.rules.every((rule: any) => {
      const contextValue = context[rule.field];
      const ruleValue = rule.value;

      switch (rule.operator) {
        case 'equals':
          return contextValue === ruleValue;
        case 'not_equals':
          return contextValue !== ruleValue;
        case 'contains':
          return String(contextValue).includes(String(ruleValue));
        case 'greater_than':
          return Number(contextValue) > Number(ruleValue);
        case 'less_than':
          return Number(contextValue) < Number(ruleValue);
        default:
          return false;
      }
    });
  }

  private evaluateSchedule(conditions: Record<string, any>): boolean {
    const now = new Date();
    
    if (conditions.start_date && new Date(conditions.start_date) > now) {
      return false;
    }
    
    if (conditions.end_date && new Date(conditions.end_date) < now) {
      return false;
    }

    if (conditions.time_range) {
      const currentHour = now.getHours();
      return currentHour >= conditions.time_range.start && currentHour <= conditions.time_range.end;
    }

    return true;
  }

  async submitFormResponse(
    formId: string,
    placementId: string,
    responseData: Record<string, any>,
    tenantId?: string,
    userId?: string
  ) {
    const { data, error } = await supabase
      .from('form_responses')
      .insert({
        form_id: formId,
        placement_id: placementId,
        tenant_id: tenantId,
        submitted_by: userId,
        response_data: responseData,
        status: 'completed',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting form response:', error);
      throw error;
    }

    // Clear cache to ensure fresh data on next fetch
    this.clearCache();

    return data;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const formIntegrationService = FormIntegrationService.getInstance();
