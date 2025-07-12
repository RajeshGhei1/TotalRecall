
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

  private filterByTriggers(placements: unknown[], context?: Record<string, any>): FormPlacement[] {
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

  // Track form analytics events
  async trackFormEvent(
    formId: string,
    eventType: 'form_view' | 'form_start' | 'form_submit' | 'form_abandon',
    placementId?: string,
    responseId?: string,
    eventData?: Record<string, any>,
    tenantId?: string
  ) {
    try {
      const { error } = await supabase
        .from('form_response_analytics')
        .insert({
          form_id: formId,
          placement_id: placementId,
          response_id: responseId,
          event_type: eventType,
          event_data: eventData || {},
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          session_id: this.getSessionId(),
          tenant_id: tenantId
        });

      if (error) {
        console.error('Error tracking form event:', error);
      }
    } catch (error) {
      console.error('Failed to track form event:', error);
    }
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

    // Track form submission event
    await this.trackFormEvent(formId, 'form_submit', placementId, data.id, responseData, tenantId);

    // Trigger workflows
    await this.triggerWorkflows(formId, data.id, responseData);

    // Clear cache to ensure fresh data on next fetch
    this.clearCache();

    return data;
  }

  // Execute workflows for form responses
  async triggerWorkflows(formId: string, responseId: string, responseData: Record<string, any>) {
    try {
      // Fetch active workflows for this form
      const { data: workflows, error } = await supabase
        .from('form_workflows')
        .select('*')
        .eq('form_id', formId)
        .eq('is_active', true);

      if (error || !workflows) {
        console.error('Error fetching workflows:', error);
        return;
      }

      // Execute each workflow
      for (const workflow of workflows) {
        await this.executeWorkflow(workflow, responseId, responseData);
      }
    } catch (error) {
      console.error('Error triggering workflows:', error);
    }
  }

  private async executeWorkflow(workflow: any, responseId: string, responseData: Record<string, any>) {
    try {
      // Create execution log
      const { data: executionLog, error: logError } = await supabase
        .from('workflow_execution_logs')
        .insert({
          workflow_id: workflow.id,
          response_id: responseId,
          execution_status: 'running',
          step_results: []
        })
        .select()
        .single();

      if (logError) {
        console.error('Error creating execution log:', logError);
        return;
      }

      const stepResults: Record<string, any>[] = [];

      // Execute workflow steps
      for (const step of workflow.workflow_steps) {
        try {
          const result = await this.executeWorkflowStep(step, responseData);
          stepResults.push({ step, result, status: 'completed' });
        } catch (stepError) {
          console.error('Error executing workflow step:', stepError);
          stepResults.push({ step, error: stepError, status: 'failed' });
        }
      }

      // Update execution log
      await supabase
        .from('workflow_execution_logs')
        .update({
          execution_status: 'completed',
          step_results: stepResults,
          completed_at: new Date().toISOString()
        })
        .eq('id', executionLog.id);

    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  }

  private async executeWorkflowStep(step: any, responseData: Record<string, any>) {
    switch (step.type) {
      case 'notification':
        return await this.executeNotificationStep(step, responseData);
      case 'data_processing':
        return await this.executeDataProcessingStep(step, responseData);
      case 'webhook':
        return await this.executeWebhookStep(step, responseData);
      default:
        console.log('Unsupported workflow step type:', step.type);
        return { message: 'Step type not implemented' };
    }
  }

  private async executeNotificationStep(step: any, responseData: Record<string, any>) {
    // This would integrate with email/SMS services
    console.log('Executing notification step:', step, responseData);
    return { message: 'Notification sent', action: step.action };
  }

  private async executeDataProcessingStep(step: any, responseData: Record<string, any>) {
    // This would process the data according to the step configuration
    console.log('Executing data processing step:', step, responseData);
    return { message: 'Data processed', action: step.action };
  }

  private async executeWebhookStep(step: any, responseData: Record<string, any>) {
    // This would call external webhooks
    console.log('Executing webhook step:', step, responseData);
    return { message: 'Webhook called', action: step.action };
  }

  private getSessionId(): string {
    // Generate or get session ID for tracking
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('form_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('form_session_id', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  }

  clearCache() {
    this.cache.clear();
  }
}

export const formIntegrationService = FormIntegrationService.getInstance();
