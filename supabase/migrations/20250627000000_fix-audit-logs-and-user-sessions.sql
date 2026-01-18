-- Create audit_logs table for comprehensive audit trail
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  module_name TEXT,
  additional_context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_sessions table for login tracking
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  logout_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  login_method TEXT DEFAULT 'email',
  device_info JSONB DEFAULT '{}',
  location_info JSONB DEFAULT '{}',
  session_duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit_logs
CREATE POLICY "Super admins can view all audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Tenant admins can view their tenant's audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view their own audit logs" 
  ON public.audit_logs 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert audit logs" 
  ON public.audit_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Create RLS policies for user_sessions
CREATE POLICY "Super admins can view all user sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Tenant admins can view their tenant's user sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

CREATE POLICY "Users can view their own sessions" 
  ON public.user_sessions 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions" 
  ON public.user_sessions 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert user sessions" 
  ON public.user_sessions 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_severity ON public.audit_logs(severity);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_tenant_id ON public.user_sessions(tenant_id);
CREATE INDEX idx_user_sessions_login_at ON public.user_sessions(login_at);
CREATE INDEX idx_user_sessions_is_active ON public.user_sessions(is_active);
CREATE INDEX idx_user_sessions_login_method ON public.user_sessions(login_method);

-- Create the log_audit_event function
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_user_id UUID,
  p_tenant_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_old_values JSONB,
  p_new_values JSONB,
  p_ip_address INET,
  p_user_agent TEXT,
  p_session_id TEXT,
  p_severity TEXT,
  p_module_name TEXT,
  p_additional_context JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    tenant_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    session_id,
    severity,
    module_name,
    additional_context
  ) VALUES (
    p_user_id,
    p_tenant_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent,
    p_session_id,
    p_severity,
    p_module_name,
    p_additional_context
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Create function to log user login
CREATE OR REPLACE FUNCTION public.log_user_login(
  p_user_id UUID,
  p_tenant_id UUID,
  p_ip_address INET,
  p_user_agent TEXT,
  p_login_method TEXT DEFAULT 'email'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id UUID;
  device_info JSONB;
BEGIN
  -- Extract device information from user agent
  device_info := jsonb_build_object(
    'type', CASE 
      WHEN p_user_agent ILIKE '%mobile%' THEN 'mobile'
      WHEN p_user_agent ILIKE '%tablet%' THEN 'tablet'
      ELSE 'desktop'
    END,
    'browser', CASE 
      WHEN p_user_agent ILIKE '%chrome%' THEN 'Chrome'
      WHEN p_user_agent ILIKE '%firefox%' THEN 'Firefox'
      WHEN p_user_agent ILIKE '%safari%' THEN 'Safari'
      WHEN p_user_agent ILIKE '%edge%' THEN 'Edge'
      ELSE 'Unknown'
    END,
    'os', CASE 
      WHEN p_user_agent ILIKE '%windows%' THEN 'Windows'
      WHEN p_user_agent ILIKE '%mac%' THEN 'macOS'
      WHEN p_user_agent ILIKE '%linux%' THEN 'Linux'
      WHEN p_user_agent ILIKE '%android%' THEN 'Android'
      WHEN p_user_agent ILIKE '%ios%' THEN 'iOS'
      ELSE 'Unknown'
    END
  );

  -- Create new session
  INSERT INTO public.user_sessions (
    user_id,
    tenant_id,
    ip_address,
    user_agent,
    login_method,
    device_info
  ) VALUES (
    p_user_id,
    p_tenant_id,
    p_ip_address,
    p_user_agent,
    p_login_method,
    device_info
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Create function to log user logout
CREATE OR REPLACE FUNCTION public.log_user_logout(p_session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_record RECORD;
BEGIN
  -- Get session details
  SELECT * INTO session_record 
  FROM public.user_sessions 
  WHERE id = p_session_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Update session with logout time and calculate duration
  UPDATE public.user_sessions 
  SET 
    logout_at = now(),
    is_active = false,
    session_duration_minutes = EXTRACT(EPOCH FROM (now() - login_at)) / 60,
    updated_at = now()
  WHERE id = p_session_id;
  
  RETURN true;
END;
$$;

-- Create function to get active users count
CREATE OR REPLACE FUNCTION public.get_active_users_count(p_tenant_id UUID DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  active_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO active_count
  FROM public.user_sessions
  WHERE is_active = true
    AND (p_tenant_id IS NULL OR tenant_id = p_tenant_id)
    AND login_at > (now() - INTERVAL '24 hours');
  
  RETURN COALESCE(active_count, 0);
END;
$$;

-- Create function to get user login history
CREATE OR REPLACE FUNCTION public.get_user_login_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  session_id UUID,
  login_at TIMESTAMP WITH TIME ZONE,
  logout_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  ip_address INET,
  login_method TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id as session_id,
    us.login_at,
    us.logout_at,
    us.session_duration_minutes,
    us.ip_address,
    us.login_method,
    us.device_info->>'type' as device_type,
    us.device_info->>'browser' as browser,
    us.device_info->>'os' as os
  FROM public.user_sessions us
  WHERE us.user_id = p_user_id
  ORDER BY us.login_at DESC
  LIMIT p_limit;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_sessions_updated_at();

-- Enable realtime for audit logs and user sessions
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;
ALTER TABLE public.user_sessions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_sessions; 