
-- Create table: module_access_logs
CREATE TABLE IF NOT EXISTS public.module_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  module_id TEXT,
  access_type TEXT, -- allowed | denied | upgraded
  access_source TEXT, -- subscription | override | developer_mode
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create table: developer_overrides
CREATE TABLE IF NOT EXISTS public.developer_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_name TEXT,
  tenant_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_module_access_logs_tenant_user ON public.module_access_logs(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_module_access_logs_created_at ON public.module_access_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_developer_overrides_user ON public.developer_overrides(user_id);
CREATE INDEX IF NOT EXISTS idx_developer_overrides_active ON public.developer_overrides(is_active);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.module_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_overrides ENABLE ROW LEVEL SECURITY;

-- RLS policies for module_access_logs (super admins can see all, users can see their own)
CREATE POLICY "Super admins can view all module access logs" 
  ON public.module_access_logs 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Users can view their own module access logs" 
  ON public.module_access_logs 
  FOR SELECT 
  USING (user_id = auth.uid());

-- RLS policies for developer_overrides (super admins only)
CREATE POLICY "Super admins can manage developer overrides" 
  ON public.developer_overrides 
  FOR ALL 
  USING (public.is_current_user_super_admin());
