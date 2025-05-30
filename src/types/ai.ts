
export type AIAgentType = 'cognitive' | 'predictive' | 'automation' | 'analysis';
export type AIAgentStatus = 'active' | 'inactive' | 'training' | 'error';

export interface AIAgent {
  id: string;
  name: string;
  type: AIAgentType;
  description?: string;
  capabilities: string[];
  model_config: Record<string, any>;
  performance_metrics: Record<string, any>;
  status: AIAgentStatus;
  tenant_id?: string;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserInteraction {
  id: string;
  user_id: string;
  tenant_id?: string;
  interaction_type: string;
  context: Record<string, any>;
  metadata: Record<string, any>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AIDecision {
  id: string;
  agent_id: string;
  user_id: string;
  tenant_id?: string;
  context: Record<string, any>;
  decision: Record<string, any>;
  confidence_score: number;
  reasoning?: string[];
  outcome_feedback?: Record<string, any>;
  was_accepted?: boolean;
  created_at: string;
}

export interface AIInsight {
  id: string;
  agent_id: string;
  tenant_id?: string;
  insight_type: string;
  source_entities: any[];
  insight_data: Record<string, any>;
  confidence_score?: number;
  applicable_modules?: string[];
  expiry_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BehavioralPattern {
  id: string;
  user_id: string;
  tenant_id?: string;
  pattern_type: string;
  pattern_data: Record<string, any>;
  frequency_score?: number;
  last_occurrence?: string;
  created_at: string;
  updated_at: string;
}

export interface AIContext {
  user_id: string;
  tenant_id?: string;
  module: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  session_data?: Record<string, any>;
}

export interface AIRequest {
  request_id: string;
  agent_id: string;
  context: AIContext;
  parameters: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface AIResponse {
  request_id: string;
  agent_id: string;
  result: any;
  confidence_score: number;
  reasoning?: string[];
  suggestions?: string[];
  error?: string;
}
