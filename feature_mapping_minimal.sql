-- Feature-Module Mapping System - MINIMAL SAFE VERSION
-- This version only creates tables and inserts data - NO SECURITY POLICIES

-- Create the main mapping table
CREATE TABLE IF NOT EXISTS public.module_features (
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
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique constraint only if table was just created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'module_features_module_name_feature_id_key'
  ) THEN
    ALTER TABLE public.module_features 
    ADD CONSTRAINT module_features_module_name_feature_id_key 
    UNIQUE(module_name, feature_id);
  END IF;
END $$;

-- Create tenant feature overrides table
CREATE TABLE IF NOT EXISTS public.tenant_feature_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  module_name TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL,
  override_reason TEXT,
  override_type TEXT DEFAULT 'admin',
  expires_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique constraint for overrides
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tenant_feature_overrides_tenant_id_module_name_feature_id_key'
  ) THEN
    ALTER TABLE public.tenant_feature_overrides 
    ADD CONSTRAINT tenant_feature_overrides_tenant_id_module_name_feature_id_key 
    UNIQUE(tenant_id, module_name, feature_id);
  END IF;
END $$;

-- Create feature usage analytics table
CREATE TABLE IF NOT EXISTS public.feature_usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  module_name TEXT NOT NULL,
  feature_id TEXT NOT NULL,
  user_id UUID,
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  session_duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create basic indexes for performance
CREATE INDEX IF NOT EXISTS idx_module_features_module_name ON public.module_features(module_name);
CREATE INDEX IF NOT EXISTS idx_module_features_feature_id ON public.module_features(feature_id);
CREATE INDEX IF NOT EXISTS idx_tenant_feature_overrides_tenant_module ON public.tenant_feature_overrides(tenant_id, module_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_analytics_tenant_feature ON public.feature_usage_analytics(tenant_id, module_name, feature_id);

-- Insert the feature data
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

-- ATS Core Module Features
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

-- Success message
SELECT 
  COUNT(*) as features_created,
  'Feature tables and data created successfully! 🚀' as message
FROM public.module_features; 