-- Create AI agents table for storing agent configurations
CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('cognitive', 'predictive', 'automation', 'analysis', 'deep_research', 'custom')),
  capabilities JSONB DEFAULT '[]'::jsonb,
  model_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'maintenance')),
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique names within a tenant
  UNIQUE(tenant_id, name)
);

-- Create AI agent activity logs table
CREATE TABLE public.ai_agent_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  tenant_id UUID REFERENCES public.tenants(id),
  action TEXT NOT NULL,
  request_data JSONB DEFAULT '{}'::jsonb,
  response_data JSONB DEFAULT '{}'::jsonb,
  duration_ms INTEGER,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,6),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'timeout')),
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI agent configurations table for tenant-specific settings
CREATE TABLE public.ai_agent_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one configuration per agent per tenant
  UNIQUE(agent_id, tenant_id)
);

-- Create indexes for better performance
CREATE INDEX idx_ai_agents_tenant_id ON public.ai_agents(tenant_id);
CREATE INDEX idx_ai_agents_agent_type ON public.ai_agents(agent_type);
CREATE INDEX idx_ai_agents_status ON public.ai_agents(status);
CREATE INDEX idx_ai_agents_created_by ON public.ai_agents(created_by);
CREATE INDEX idx_ai_agents_created_at ON public.ai_agents(created_at);

CREATE INDEX idx_ai_agent_activity_logs_agent_id ON public.ai_agent_activity_logs(agent_id);
CREATE INDEX idx_ai_agent_activity_logs_tenant_id ON public.ai_agent_activity_logs(tenant_id);
CREATE INDEX idx_ai_agent_activity_logs_user_id ON public.ai_agent_activity_logs(user_id);
CREATE INDEX idx_ai_agent_activity_logs_created_at ON public.ai_agent_activity_logs(created_at);
CREATE INDEX idx_ai_agent_activity_logs_status ON public.ai_agent_activity_logs(status);

CREATE INDEX idx_ai_agent_configurations_agent_id ON public.ai_agent_configurations(agent_id);
CREATE INDEX idx_ai_agent_configurations_tenant_id ON public.ai_agent_configurations(tenant_id);
CREATE INDEX idx_ai_agent_configurations_active ON public.ai_agent_configurations(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_agents
CREATE POLICY "Super admins can manage all AI agents" 
  ON public.ai_agents 
  FOR ALL 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Tenant admins can manage their tenant's AI agents" 
  ON public.ai_agents 
  FOR ALL 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their tenant's AI agents" 
  ON public.ai_agents 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create AI agents for their tenant" 
  ON public.ai_agents 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for ai_agent_activity_logs
CREATE POLICY "Super admins can view all activity logs" 
  ON public.ai_agent_activity_logs 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Tenant admins can view their tenant's activity logs" 
  ON public.ai_agent_activity_logs 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own activity logs" 
  ON public.ai_agent_activity_logs 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert activity logs" 
  ON public.ai_agent_activity_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Create RLS policies for ai_agent_configurations
CREATE POLICY "Super admins can manage all configurations" 
  ON public.ai_agent_configurations 
  FOR ALL 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Tenant admins can manage their tenant's configurations" 
  ON public.ai_agent_configurations 
  FOR ALL 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their tenant's configurations" 
  ON public.ai_agent_configurations 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

-- Create triggers for updated_at columns
CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agent_configurations_updated_at
  BEFORE UPDATE ON public.ai_agent_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default AI agents for demonstration
INSERT INTO public.ai_agents (name, description, agent_type, capabilities, model_config, status, tenant_id, created_by) VALUES
(
  'Cognitive Assistant',
  'General-purpose AI assistant for cognitive tasks and decision support',
  'cognitive',
  '["conversation", "support", "guidance", "problem_solving", "analysis"]',
  '{"temperature": 0.7, "max_tokens": 1000, "model_preference": "gpt-4o-mini"}',
  'active',
  NULL,
  NULL
),
(
  'Predictive Analytics Engine',
  'AI agent specialized in forecasting and predictive analytics',
  'predictive',
  '["prediction", "analytics", "forecasting", "trend_analysis", "risk_assessment"]',
  '{"temperature": 0.3, "max_tokens": 1500, "model_preference": "gpt-4o"}',
  'active',
  NULL,
  NULL
),
(
  'Workflow Automation Agent',
  'AI agent for process automation and workflow optimization',
  'automation',
  '["automation", "process_optimization", "workflow", "task_routing", "scheduling"]',
  '{"temperature": 0.2, "max_tokens": 800, "model_preference": "gpt-4o-mini"}',
  'active',
  NULL,
  NULL
),
(
  'Data Analysis Specialist',
  'AI agent for data analysis and insights generation',
  'analysis',
  '["analysis", "insights", "reporting", "data_mining", "pattern_recognition"]',
  '{"temperature": 0.4, "max_tokens": 2000, "model_preference": "gpt-4o"}',
  'active',
  NULL,
  NULL
),
(
  'Deep Research Agent',
  'AI agent for comprehensive research and investigation tasks',
  'deep_research',
  '["deep_research", "multi_source_analysis", "comprehensive_reporting", "market_intelligence", "investigation"]',
  '{"temperature": 0.5, "max_tokens": 3000, "model_preference": "gpt-4o"}',
  'active',
  NULL,
  NULL
); 