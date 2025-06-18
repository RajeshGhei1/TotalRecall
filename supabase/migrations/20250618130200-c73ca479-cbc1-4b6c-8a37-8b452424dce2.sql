
-- Extend system_modules table with missing ModuleManifest fields
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'MIT';
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS homepage TEXT;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS repository TEXT;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS peer_dependencies JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS min_core_version TEXT DEFAULT '1.0.0';
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS max_core_version TEXT;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS entry_point TEXT DEFAULT 'index.tsx';
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS routes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS components JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS hooks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS required_permissions JSONB DEFAULT '["read"]'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS subscription_tiers JSONB DEFAULT '["basic", "pro", "enterprise"]'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS resource_limits JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS load_order INTEGER DEFAULT 100;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS auto_load BOOLEAN DEFAULT false;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS can_unload BOOLEAN DEFAULT true;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS development_mode BOOLEAN DEFAULT false;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS hot_reload BOOLEAN DEFAULT true;
ALTER TABLE public.system_modules ADD COLUMN IF NOT EXISTS sandboxed BOOLEAN DEFAULT false;

-- Create module_templates table for storing reusable module templates
CREATE TABLE IF NOT EXISTS public.module_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'custom',
  tags JSONB DEFAULT '[]'::jsonb,
  manifest_template JSONB NOT NULL DEFAULT '{}'::jsonb,
  files JSONB NOT NULL DEFAULT '{}'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  is_built_in BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create module_deployments table for tracking deployment history
CREATE TABLE IF NOT EXISTS public.module_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL,
  version TEXT NOT NULL,
  deployment_type TEXT NOT NULL DEFAULT 'install', -- install, update, rollback, uninstall
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, failed, rolled_back
  tenant_id UUID,
  deployed_by UUID,
  deployment_config JSONB DEFAULT '{}'::jsonb,
  deployment_log JSONB DEFAULT '[]'::jsonb,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  rolled_back_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create module_registry_cache for compiled/processed modules
CREATE TABLE IF NOT EXISTS public.module_registry_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL,
  version TEXT NOT NULL,
  cache_key TEXT NOT NULL UNIQUE,
  compiled_manifest JSONB NOT NULL,
  processed_files JSONB DEFAULT '{}'::jsonb,
  dependency_tree JSONB DEFAULT '[]'::jsonb,
  validation_result JSONB NOT NULL,
  cache_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_name, version)
);

-- Create module_settings table for module-specific configuration
CREATE TABLE IF NOT EXISTS public.module_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL,
  tenant_id UUID,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT DEFAULT 'string',
  is_encrypted BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_name, tenant_id, setting_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_modules_category ON public.system_modules(category);
CREATE INDEX IF NOT EXISTS idx_system_modules_active ON public.system_modules(is_active);
CREATE INDEX IF NOT EXISTS idx_system_modules_load_order ON public.system_modules(load_order);
CREATE INDEX IF NOT EXISTS idx_module_templates_category ON public.module_templates(category);
CREATE INDEX IF NOT EXISTS idx_module_templates_active ON public.module_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_module_deployments_module ON public.module_deployments(module_name, version);
CREATE INDEX IF NOT EXISTS idx_module_deployments_status ON public.module_deployments(status);
CREATE INDEX IF NOT EXISTS idx_module_deployments_tenant ON public.module_deployments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_module_registry_cache_module ON public.module_registry_cache(module_name, version);
CREATE INDEX IF NOT EXISTS idx_module_settings_module_tenant ON public.module_settings(module_name, tenant_id);

-- Add Row Level Security
ALTER TABLE public.module_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_registry_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for module_templates
CREATE POLICY "Anyone can view active templates" 
  ON public.module_templates 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Super admins can manage all templates" 
  ON public.module_templates 
  FOR ALL 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Users can manage their own templates" 
  ON public.module_templates 
  FOR ALL 
  USING (created_by = auth.uid());

-- RLS policies for module_deployments
CREATE POLICY "Super admins can view all deployments" 
  ON public.module_deployments 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Super admins can manage deployments" 
  ON public.module_deployments 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- RLS policies for module_registry_cache
CREATE POLICY "Super admins can manage registry cache" 
  ON public.module_registry_cache 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- RLS policies for module_settings
CREATE POLICY "Super admins can manage all module settings" 
  ON public.module_settings 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- Add triggers for updated_at
CREATE TRIGGER update_module_templates_updated_at
  BEFORE UPDATE ON public.module_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_deployments_updated_at
  BEFORE UPDATE ON public.module_deployments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_registry_cache_updated_at
  BEFORE UPDATE ON public.module_registry_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_settings_updated_at
  BEFORE UPDATE ON public.module_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert built-in module templates
INSERT INTO public.module_templates (template_id, name, description, category, tags, manifest_template, files, is_built_in) VALUES
('basic-widget', 'Basic Widget', 'A simple widget module template', 'widget', '["widget", "basic", "template"]'::jsonb, 
 '{"category": "custom", "author": "Developer", "license": "MIT", "dependencies": [], "requiredPermissions": ["read"], "subscriptionTiers": ["basic", "pro", "enterprise"]}'::jsonb,
 '{"index.tsx": "import React from ''react'';\nimport { Card, CardContent, CardHeader, CardTitle } from ''@/components/ui/card'';\n\ninterface BasicWidgetProps {\n  title?: string;\n  content?: string;\n}\n\nconst BasicWidget: React.FC<BasicWidgetProps> = ({ \n  title = ''Basic Widget'', \n  content = ''This is a basic widget module.'' \n}) => {\n  return (\n    <Card>\n      <CardHeader>\n        <CardTitle>{title}</CardTitle>\n      </CardHeader>\n      <CardContent>\n        <p>{content}</p>\n      </CardContent>\n    </Card>\n  );\n};\n\nexport default BasicWidget;"}'::jsonb,
 true),
('analytics-dashboard', 'Analytics Dashboard', 'An analytics dashboard module template', 'analytics', '["analytics", "dashboard", "charts"]'::jsonb,
 '{"category": "analytics", "author": "Developer", "license": "MIT", "dependencies": ["core-dashboard"], "requiredPermissions": ["read", "analytics_access"], "subscriptionTiers": ["pro", "enterprise"]}'::jsonb,
 '{"index.tsx": "import React from ''react'';\nimport { Card, CardContent, CardHeader, CardTitle } from ''@/components/ui/card'';\nimport { BarChart3, TrendingUp, Users, Target } from ''lucide-react'';\n\nconst AnalyticsDashboard: React.FC = () => {\n  return (\n    <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4\">\n      {/* Analytics cards content */}\n    </div>\n  );\n};\n\nexport default AnalyticsDashboard;"}'::jsonb,
 true)
ON CONFLICT (template_id) DO NOTHING;

-- Update existing system_modules with some default values
UPDATE public.system_modules 
SET 
  author = COALESCE(author, 'System'),
  license = COALESCE(license, 'MIT'),
  entry_point = COALESCE(entry_point, 'index.tsx'),
  required_permissions = COALESCE(required_permissions, '["read"]'::jsonb),
  subscription_tiers = COALESCE(subscription_tiers, '["basic", "pro", "enterprise"]'::jsonb),
  load_order = COALESCE(load_order, 100),
  auto_load = COALESCE(auto_load, false),
  can_unload = COALESCE(can_unload, true),
  hot_reload = COALESCE(hot_reload, true)
WHERE author IS NULL OR license IS NULL OR entry_point IS NULL;
