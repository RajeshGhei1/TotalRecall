import { supabase } from '@/integrations/supabase/client';

export interface AIDecisionRule {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  rule_type: 'approval' | 'classification' | 'routing' | 'scoring' | 'custom';
  module_context: string;
  conditions: unknown[];
  actions: unknown[];
  priority: number;
  is_active: boolean;
  requires_approval: boolean;
  approval_threshold: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AIDecisionInstance {
  id: string;
  tenant_id: string;
  rule_id: string;
  decision_type: string;
  context_data: any;
  ai_analysis?: any;
  confidence_score?: number;
  decision_result: 'approved' | 'rejected' | 'pending' | 'escalated';
  decision_reason?: string;
  metadata: any;
  created_at: string;
  processed_at?: string;
  completed_at?: string;
}

export interface AIDecisionApproval {
  id: string;
  decision_instance_id: string;
  approver_id: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'escalated';
  approval_notes?: string;
  approval_reason?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AIDecisionWorkflow {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  workflow_type: 'sequential' | 'parallel' | 'conditional';
  steps: unknown[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDecisionRuleRequest {
  name: string;
  description?: string;
  rule_type: AIDecisionRule['rule_type'];
  module_context: string;
  conditions: unknown[];
  actions: unknown[];
  priority?: number;
  requires_approval?: boolean;
  approval_threshold?: number;
}

export interface UpdateDecisionRuleRequest {
  name?: string;
  description?: string;
  conditions?: unknown[];
  actions?: unknown[];
  priority?: number;
  is_active?: boolean;
  requires_approval?: boolean;
  approval_threshold?: number;
}

export interface CreateDecisionInstanceRequest {
  rule_id: string;
  decision_type: string;
  context_data: any;
  metadata?: any;
}

export class AIDecisionService {
  // Decision Rules Management
  async getDecisionRules(tenantId: string): Promise<AIDecisionRule[]> {
    const { data, error } = await supabase
      .from('ai_decision_rules')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('priority', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async getDecisionRule(ruleId: string): Promise<AIDecisionRule | null> {
    const { data, error } = await supabase
      .from('ai_decision_rules')
      .select('*')
      .eq('id', ruleId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createDecisionRule(tenantId: string, ruleData: CreateDecisionRuleRequest): Promise<AIDecisionRule> {
    const { data, error } = await supabase
      .from('ai_decision_rules')
      .insert({
        tenant_id: tenantId,
        ...ruleData,
        priority: ruleData.priority || 100,
        requires_approval: ruleData.requires_approval || false,
        approval_threshold: ruleData.approval_threshold || 0.8
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateDecisionRule(ruleId: string, updates: UpdateDecisionRuleRequest): Promise<AIDecisionRule> {
    const { data, error } = await supabase
      .from('ai_decision_rules')
      .update(updates)
      .eq('id', ruleId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteDecisionRule(ruleId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_decision_rules')
      .delete()
      .eq('id', ruleId);
    if (error) throw error;
  }

  // Decision Instances Management
  async getDecisionInstances(tenantId: string, limit = 50): Promise<AIDecisionInstance[]> {
    const { data, error } = await supabase
      .from('ai_decision_instances')
      .select(`
        *,
        ai_decision_rules(name, rule_type)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async getDecisionInstance(instanceId: string): Promise<AIDecisionInstance | null> {
    const { data, error } = await supabase
      .from('ai_decision_instances')
      .select(`
        *,
        ai_decision_rules(name, rule_type),
        ai_decision_approvals(*)
      `)
      .eq('id', instanceId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createDecisionInstance(tenantId: string, instanceData: CreateDecisionInstanceRequest): Promise<AIDecisionInstance> {
    const { data, error } = await supabase
      .from('ai_decision_instances')
      .insert({
        tenant_id: tenantId,
        ...instanceData,
        decision_result: 'pending',
        metadata: instanceData.metadata || {}
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateDecisionInstance(instanceId: string, updates: Partial<AIDecisionInstance>): Promise<AIDecisionInstance> {
    const { data, error } = await supabase
      .from('ai_decision_instances')
      .update(updates)
      .eq('id', instanceId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Decision Approvals Management
  async getDecisionApprovals(instanceId: string): Promise<AIDecisionApproval[]> {
    const { data, error } = await supabase
      .from('ai_decision_approvals')
      .select('*')
      .eq('decision_instance_id', instanceId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async createDecisionApproval(approvalData: Omit<AIDecisionApproval, 'id' | 'created_at' | 'updated_at'>): Promise<AIDecisionApproval> {
    const { data, error } = await supabase
      .from('ai_decision_approvals')
      .insert(approvalData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateDecisionApproval(approvalId: string, updates: Partial<AIDecisionApproval>): Promise<AIDecisionApproval> {
    const { data, error } = await supabase
      .from('ai_decision_approvals')
      .update(updates)
      .eq('id', approvalId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Decision Workflows Management
  async getDecisionWorkflows(tenantId: string): Promise<AIDecisionWorkflow[]> {
    const { data, error } = await supabase
      .from('ai_decision_workflows')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // AI Decision Processing
  async processDecision(instanceId: string): Promise<AIDecisionInstance> {
    // Get the decision instance and its rule
    const instance = await this.getDecisionInstance(instanceId);
    if (!instance) throw new Error('Decision instance not found');

    const rule = await this.getDecisionRule(instance.rule_id);
    if (!rule) throw new Error('Decision rule not found');

    // Simulate AI processing (in real implementation, this would call actual AI services)
    const aiAnalysis = await this.simulateAIAnalysis(instance.context_data, rule);
    const confidenceScore = aiAnalysis.confidence;
    const decisionResult = this.determineDecisionResult(confidenceScore, rule);

    // Update the instance with AI analysis results
    const updates: Partial<AIDecisionInstance> = {
      ai_analysis: aiAnalysis,
      confidence_score: confidenceScore,
      decision_result: decisionResult,
      decision_reason: aiAnalysis.reason,
      processed_at: new Date().toISOString()
    };

    if (decisionResult !== 'pending') {
      updates.completed_at = new Date().toISOString();
    }

    return await this.updateDecisionInstance(instanceId, updates);
  }

  private async simulateAIAnalysis(contextData: any, rule: AIDecisionRule): Promise<unknown> {
    // Simulate AI analysis based on rule conditions
    const conditions = rule.conditions;
    let confidence = 0.5; // Base confidence
    let reason = '';

    // Simple condition evaluation (in real implementation, this would use actual AI)
    for (const condition of conditions) {
      const fieldValue = contextData[condition.field];
      const conditionMet = this.evaluateCondition(fieldValue, condition.operator, condition.value);
      
      if (conditionMet) {
        confidence += 0.3;
        reason += `Condition "${condition.field} ${condition.operator} ${condition.value}" met. `;
      } else {
        confidence -= 0.1;
        reason += `Condition "${condition.field} ${condition.operator} ${condition.value}" not met. `;
      }
    }

    // Clamp confidence between 0 and 1
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      confidence,
      reason: reason.trim(),
      analysis_timestamp: new Date().toISOString(),
      conditions_evaluated: conditions.length
    };
  }

  private evaluateCondition(fieldValue: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case '>=':
        return fieldValue >= expectedValue;
      case '>':
        return fieldValue > expectedValue;
      case '<=':
        return fieldValue <= expectedValue;
      case '<':
        return fieldValue < expectedValue;
      case '==':
        return fieldValue === expectedValue;
      case '!=':
        return fieldValue !== expectedValue;
      case 'contains':
        return String(fieldValue).includes(String(expectedValue));
      case 'starts_with':
        return String(fieldValue).startsWith(String(expectedValue));
      case 'ends_with':
        return String(fieldValue).endsWith(String(expectedValue));
      default:
        return false;
    }
  }

  private determineDecisionResult(confidence: number, rule: AIDecisionRule): AIDecisionInstance['decision_result'] {
    if (confidence >= rule.approval_threshold) {
      return rule.requires_approval ? 'pending' : 'approved';
    } else if (confidence >= 0.3) {
      return 'pending';
    } else {
      return 'rejected';
    }
  }

  // Analytics
  async getDecisionAnalytics(tenantId: string, ruleId?: string, days = 30): Promise<unknown> {
    const { data, error } = await supabase
      .from('ai_decision_analytics')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}

export const aiDecisionService = new AIDecisionService();