
export type AIAgentType = 'cognitive' | 'predictive' | 'automation' | 'analysis' | 'deep_research';
export type AIAgentStatus = 'active' | 'inactive' | 'training' | 'error';
export type ModuleAIAssignmentType = 'direct' | 'preferred';

export interface AIAgent {
  id: string;
  name: string;
  type: AIAgentType;
  description?: string;
  capabilities: string[];
  model_config: Record<string, unknown>;
  performance_metrics: Record<string, unknown>;
  status: AIAgentStatus;
  tenant_id?: string;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleAIAssignment {
  id: string;
  module_id: string;
  agent_id: string;
  tenant_id?: string;
  assignment_type: ModuleAIAssignmentType;
  priority: number;
  is_active: boolean;
  performance_weights: {
    accuracy: number;
    speed: number;
    cost: number;
  };
  token_budget_override?: number;
  assigned_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ModuleAIAssignmentMetrics {
  id: string;
  assignment_id: string;
  metric_date: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time_ms: number;
  total_cost: number;
  accuracy_score: number;
  user_satisfaction_score: number;
  created_at: string;
  updated_at: string;
}

export interface UserInteraction {
  id: string;
  user_id: string;
  tenant_id?: string;
  interaction_type: string;
  context: Record<string, unknown>;
  metadata: Record<string, unknown>;
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
  context: Record<string, unknown>;
  decision: Record<string, unknown>;
  confidence_score: number;
  reasoning?: string[];
  outcome_feedback?: Record<string, unknown>;
  was_accepted?: boolean;
  created_at: string;
}

export interface AIInsight {
  id: string;
  agent_id: string;
  tenant_id?: string;
  insight_type: string;
  source_entities: Record<string, unknown>[];
  insight_data: Record<string, unknown>;
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
  pattern_data: Record<string, unknown>;
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
  session_data?: Record<string, unknown>;
}

export interface AIRequest {
  request_id: string;
  agent_id: string;
  context: AIContext;
  parameters: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface AIResponse {
  request_id: string;
  agent_id: string;
  result: Record<string, unknown>;
  confidence_score: number;
  reasoning?: string[];
  suggestions?: string[];
  error?: string;
}
