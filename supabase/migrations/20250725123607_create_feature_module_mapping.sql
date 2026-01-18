-- Create Feature-to-Module Mapping System
-- This provides granular feature control while maintaining module-level access as primary gate

-- Main mapping table: which features belong to which modules
CREATE TABLE public.module_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  is_enabled_by_default BOOLEAN DEFAULT true,
  is_premium_feature BOOLEAN DEFAULT false,
  feature_category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(module_name, feature_id),
  
  -- Ensure module exists in system_modules table
  CONSTRAINT fk_module_features_module 
    FOREIGN KEY (module_name) 
    REFERENCES public.system_modules(name) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

-- Optional: Feature-level overrides per tenant (for custom configurations)
CREATE TABLE public.tenant_feature_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  module_name TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL,
  override_reason TEXT,
  override_type TEXT DEFAULT 'admin' CHECK (override_type IN ('admin', 'subscription', 'trial', 'beta')),
  expires_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(tenant_id, module_name, feature_id),
  
  -- Foreign key constraints
  CONSTRAINT fk_tenant_feature_overrides_tenant 
    FOREIGN KEY (tenant_id) 
    REFERENCES public.tenants(id) 
    ON DELETE CASCADE,
  CONSTRAINT fk_tenant_feature_overrides_module_feature 
    FOREIGN KEY (module_name, feature_id) 
    REFERENCES public.module_features(module_name, feature_id) 
    ON DELETE CASCADE
);

-- Feature usage analytics table
CREATE TABLE public.feature_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  module_name TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  user_id UUID,
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  session_duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Composite index for efficient querying
  CONSTRAINT fk_feature_usage_tenant 
    FOREIGN KEY (tenant_id) 
    REFERENCES public.tenants(id) 
    ON DELETE CASCADE,
  CONSTRAINT fk_feature_usage_module_feature 
    FOREIGN KEY (module_name, feature_id) 
    REFERENCES public.module_features(module_name, feature_id) 
    ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE public.module_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_feature_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for module_features (readable by all authenticated users)
CREATE POLICY "Anyone can view module features" 
  ON public.module_features 
  FOR SELECT 
  USING (true);

CREATE POLICY "Super admins can manage module features" 
  ON public.module_features 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- RLS Policies for tenant_feature_overrides
CREATE POLICY "Tenant admins can view their feature overrides" 
  ON public.tenant_feature_overrides 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

CREATE POLICY "Tenant admins can manage their feature overrides" 
  ON public.tenant_feature_overrides 
  FOR ALL 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

CREATE POLICY "Super admins can manage all feature overrides" 
  ON public.tenant_feature_overrides 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- RLS Policies for feature_usage_analytics
CREATE POLICY "Users can view their tenant's feature analytics" 
  ON public.feature_usage_analytics 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert feature usage analytics" 
  ON public.feature_usage_analytics 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Super admins can view all feature analytics" 
  ON public.feature_usage_analytics 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

-- Create indexes for performance
CREATE INDEX idx_module_features_module_name ON public.module_features(module_name);
CREATE INDEX idx_module_features_feature_id ON public.module_features(feature_id);
CREATE INDEX idx_module_features_category ON public.module_features(feature_category);
CREATE INDEX idx_tenant_feature_overrides_tenant_module ON public.tenant_feature_overrides(tenant_id, module_name);
CREATE INDEX idx_feature_usage_analytics_tenant_feature ON public.feature_usage_analytics(tenant_id, module_name, feature_id);
CREATE INDEX idx_feature_usage_analytics_last_used ON public.feature_usage_analytics(last_used_at);

-- Create updated_at trigger for module_features
CREATE OR REPLACE FUNCTION public.update_module_features_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_module_features_updated_at
    BEFORE UPDATE ON public.module_features
    FOR EACH ROW EXECUTE FUNCTION public.update_module_features_updated_at();

-- Create updated_at trigger for tenant_feature_overrides
CREATE OR REPLACE FUNCTION public.update_tenant_feature_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tenant_feature_overrides_updated_at
    BEFORE UPDATE ON public.tenant_feature_overrides
    FOR EACH ROW EXECUTE FUNCTION public.update_tenant_feature_overrides_updated_at();

-- Populate with current implemented features from TotalRecall
-- Ensure referenced modules exist in system_modules
INSERT INTO public.system_modules (name, description, category, is_active, version, default_limits)
VALUES
  ('forms_templates', 'Forms and templates', 'forms', true, '1.0.0', '{}'::jsonb),
  ('analytics', 'Analytics', 'analytics', true, '1.0.0', '{}'::jsonb),
  ('data_management', 'Data management', 'data', true, '1.0.0', '{}'::jsonb),
  ('integrations', 'Integrations', 'integrations', true, '1.0.0', '{}'::jsonb),
  ('ai_core', 'AI core', 'ai', true, '1.0.0', '{}'::jsonb),
  ('ats_core', 'ATS core', 'recruitment', true, '1.0.0', '{}'::jsonb),
  ('companies', 'Companies', 'crm', true, '1.0.0', '{}'::jsonb),
  ('people', 'People', 'crm', true, '1.0.0', '{}'::jsonb)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.module_features (module_name, feature_id, feature_name, feature_description, feature_category, is_premium_feature, sort_order) VALUES

-- Forms & Templates Module Features
('forms_templates', 'form-builder', 'Form Builder', 'Comprehensive drag-and-drop form builder with field palette, sections, preview, and settings', 'form_management', false, 1),
('forms_templates', 'custom-fields', 'Custom Fields', 'Create and manage custom field types with validation and conditional logic', 'form_management', false, 2),
('forms_templates', 'dropdown-options-management', 'Dropdown Options Management', 'Manage dropdown categories and options with drag-and-drop ordering', 'data_management', false, 3),
('forms_templates', 'smart-form-suggestions', 'Smart Form Suggestions', 'AI-powered form field suggestions and auto-completion', 'ai_forms', true, 4),

-- Analytics Module Features  
('analytics', 'dashboard-builder', 'Dashboard Builder', 'Widget-based dashboard creation with data sources, layout configuration, and real-time updates', 'analytics', false, 1),
('analytics', 'report-builder', 'Report Builder', 'Dynamic report creation with entity selection, column configuration, filters, and visualizations', 'analytics', false, 2),

-- Data Management Module Features
('data_management', 'bulk-upload-download', 'Bulk Upload/Download', 'Upload and download data in bulk with CSV/Excel support, duplicate detection, and progress tracking', 'data_management', false, 1),

-- Integration Module Features
('integrations', 'linkedin-enrichment', 'LinkedIn Profile Enrichment', 'Automated LinkedIn data enrichment for profiles and companies', 'integrations', true, 1),

-- AI Core Module Features
('ai_core', 'ai-email-response-generator', 'AI Email Response Generator', 'Generate personalized email responses using AI capabilities', 'ai_communication', true, 1),
('ai_core', 'content-analysis-service', 'Content Analysis Service', 'Analyze and extract insights from various content types', 'ai_analytics', true, 2),

-- ATS Core Module Features (examples - you can add more)
('ats_core', 'job-management', 'Job Management', 'Create and manage job postings with requirements and descriptions', 'recruitment', false, 1),
('ats_core', 'candidate-tracking', 'Candidate Tracking', 'Track candidates through recruitment pipeline stages', 'recruitment', false, 2),
('ats_core', 'interview-scheduling', 'Interview Scheduling', 'Schedule and manage interviews with calendar integration', 'recruitment', false, 3),

-- Companies Module Features
('companies', 'company-profiles', 'Company Profiles', 'Comprehensive company profile management with org charts', 'crm', false, 1),
('companies', 'company-relationships', 'Company Relationships', 'Manage complex company relationships and hierarchies', 'crm', false, 2),

-- People Module Features
('people', 'contact-management', 'Contact Management', 'Manage people and contact information with enrichment capabilities', 'crm', false, 1),
('people', 'skills-tracking', 'Skills Tracking', 'Track and manage people skills and competencies', 'talent', false, 2)

ON CONFLICT (module_name, feature_id) DO UPDATE SET
  feature_name = EXCLUDED.feature_name,
  feature_description = EXCLUDED.feature_description,
  feature_category = EXCLUDED.feature_category,
  is_premium_feature = EXCLUDED.is_premium_feature,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Add helpful comments
COMMENT ON TABLE public.module_features IS 'Maps features to modules - primary inventory of all available features';
COMMENT ON TABLE public.tenant_feature_overrides IS 'Allows per-tenant customization of feature availability beyond subscription level';
COMMENT ON TABLE public.feature_usage_analytics IS 'Tracks feature usage patterns for analytics and optimization';

COMMENT ON COLUMN public.module_features.is_premium_feature IS 'Whether this feature requires premium subscription tier';
COMMENT ON COLUMN public.tenant_feature_overrides.override_type IS 'Reason for override: admin decision, subscription upgrade, trial access, beta testing';
COMMENT ON COLUMN public.tenant_feature_overrides.expires_at IS 'When this override expires (null = permanent)'; 