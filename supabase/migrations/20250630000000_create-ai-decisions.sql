-- Create AI decision system tables

-- 1. Decision Rules Table
CREATE TABLE public.ai_decision_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('approval', 'classification', 'routing', 'scoring', 'custom')),
  module_context TEXT NOT NULL, -- e.g., 'ats', 'people', 'forms', 'general'
  conditions JSONB NOT NULL DEFAULT '[]', -- Array of condition objects
  actions JSONB NOT NULL DEFAULT '[]', -- Array of action objects
  priority INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  approval_threshold NUMERIC(3,2) DEFAULT 0.8, -- Confidence threshold for auto-approval
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Decision Instances Table
CREATE TABLE public.ai_decision_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES public.ai_decision_rules(id) ON DELETE CASCADE,
  decision_type TEXT NOT NULL,
  context_data JSONB NOT NULL, -- Input data that triggered the decision
  ai_analysis JSONB, -- AI's analysis and reasoning
  confidence_score NUMERIC(3,2), -- AI confidence (0.0 to 1.0)
  decision_result TEXT NOT NULL, -- 'approved', 'rejected', 'pending', 'escalated'
  decision_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Decision Approvals Table
CREATE TABLE public.ai_decision_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_instance_id UUID REFERENCES public.ai_decision_instances(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES public.profiles(id),
  approval_status TEXT NOT NULL CHECK (approval_status IN ('pending', 'approved', 'rejected', 'escalated')),
  approval_notes TEXT,
  approval_reason TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Decision Workflows Table
CREATE TABLE public.ai_decision_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('sequential', 'parallel', 'conditional')),
  steps JSONB NOT NULL, -- Array of workflow steps
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Decision Analytics Table
CREATE TABLE public.ai_decision_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES public.ai_decision_rules(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_decisions INTEGER DEFAULT 0,
  approved_decisions INTEGER DEFAULT 0,
  rejected_decisions INTEGER DEFAULT 0,
  pending_decisions INTEGER DEFAULT 0,
  escalated_decisions INTEGER DEFAULT 0,
  avg_confidence_score NUMERIC(3,2) DEFAULT 0,
  avg_processing_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(rule_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_ai_decision_rules_tenant ON public.ai_decision_rules(tenant_id);
CREATE INDEX idx_ai_decision_rules_module ON public.ai_decision_rules(module_context);
CREATE INDEX idx_ai_decision_rules_active ON public.ai_decision_rules(is_active);
CREATE INDEX idx_ai_decision_rules_type ON public.ai_decision_rules(rule_type);

CREATE INDEX idx_ai_decision_instances_tenant ON public.ai_decision_instances(tenant_id);
CREATE INDEX idx_ai_decision_instances_rule ON public.ai_decision_instances(rule_id);
CREATE INDEX idx_ai_decision_instances_result ON public.ai_decision_instances(decision_result);
CREATE INDEX idx_ai_decision_instances_created ON public.ai_decision_instances(created_at);

CREATE INDEX idx_ai_decision_approvals_instance ON public.ai_decision_approvals(decision_instance_id);
CREATE INDEX idx_ai_decision_approvals_status ON public.ai_decision_approvals(approval_status);
CREATE INDEX idx_ai_decision_approvals_approver ON public.ai_decision_approvals(approver_id);

CREATE INDEX idx_ai_decision_workflows_tenant ON public.ai_decision_workflows(tenant_id);
CREATE INDEX idx_ai_decision_workflows_active ON public.ai_decision_workflows(is_active);

CREATE INDEX idx_ai_decision_analytics_rule_date ON public.ai_decision_analytics(rule_id, date);
CREATE INDEX idx_ai_decision_analytics_tenant_date ON public.ai_decision_analytics(tenant_id, date);

-- Enable Row Level Security
ALTER TABLE public.ai_decision_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decision_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decision_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decision_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decision_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_decision_rules
CREATE POLICY "Tenant admins can manage their tenant's decision rules"
  ON public.ai_decision_rules
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view their tenant's decision rules"
  ON public.ai_decision_rules
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ai_decision_instances
CREATE POLICY "Tenant admins can manage their tenant's decision instances"
  ON public.ai_decision_instances
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view their tenant's decision instances"
  ON public.ai_decision_instances
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ai_decision_approvals
CREATE POLICY "Users can manage their own approvals"
  ON public.ai_decision_approvals
  FOR ALL
  USING (approver_id = auth.uid());

CREATE POLICY "Tenant admins can view all approvals in their tenant"
  ON public.ai_decision_approvals
  FOR SELECT
  USING (
    decision_instance_id IN (
      SELECT id FROM public.ai_decision_instances
      WHERE tenant_id IN (
        SELECT tenant_id FROM public.user_tenants
        WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
      )
    )
  );

-- RLS Policies for ai_decision_workflows
CREATE POLICY "Tenant admins can manage their tenant's workflows"
  ON public.ai_decision_workflows
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view their tenant's workflows"
  ON public.ai_decision_workflows
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ai_decision_analytics
CREATE POLICY "Tenant admins can view their tenant's analytics"
  ON public.ai_decision_analytics
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_ai_decision_rules_updated_at
  BEFORE UPDATE ON public.ai_decision_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_decision_approvals_updated_at
  BEFORE UPDATE ON public.ai_decision_approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_decision_workflows_updated_at
  BEFORE UPDATE ON public.ai_decision_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default decision rules
INSERT INTO public.ai_decision_rules (tenant_id, name, description, rule_type, module_context, conditions, actions, priority, created_by) VALUES
  (NULL, 'High-Value Deal Approval', 'Automatically approve deals above threshold, escalate others', 'approval', 'general', 
   '[{"field": "deal_value", "operator": ">=", "value": 100000}]', 
   '[{"action": "approve", "reason": "High-value deal meets auto-approval criteria"}]', 
   100, NULL),
  (NULL, 'Candidate Skill Match', 'Route candidates based on skill requirements', 'routing', 'ats', 
   '[{"field": "skill_match_percentage", "operator": ">=", "value": 80}]', 
   '[{"action": "route", "target": "senior_recruiter", "reason": "High skill match"}]', 
   200, NULL),
  (NULL, 'Form Validation', 'Validate form submissions for completeness', 'classification', 'forms', 
   '[{"field": "completion_percentage", "operator": ">=", "value": 90}]', 
   '[{"action": "classify", "category": "complete", "reason": "Form is sufficiently complete"}]', 
   300, NULL);

-- Enable realtime for decision tables
ALTER TABLE public.ai_decision_instances REPLICA IDENTITY FULL;
ALTER TABLE public.ai_decision_approvals REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_decision_instances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_decision_approvals;
