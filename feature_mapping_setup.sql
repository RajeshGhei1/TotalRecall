-- Feature-Module Mapping System Setup (SAFE VERSION)
-- Copy and paste this entire content into Supabase SQL Editor
-- This version has NO destructive elements

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
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(module_name, feature_id)
);

-- Create tenant feature overrides table
CREATE TABLE IF NOT EXISTS public.tenant_feature_overrides (
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
  
  UNIQUE(tenant_id, module_name, feature_id)
);

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

-- Enable RLS only if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'module_features' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.module_features ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'tenant_feature_overrides' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.tenant_feature_overrides ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'feature_usage_analytics' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.feature_usage_analytics ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS Policies using CREATE OR REPLACE (safe)
DO $$
BEGIN
  -- Policy for anyone to view module features
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'module_features' 
    AND policyname = 'Anyone can view module features'
  ) THEN
    CREATE POLICY "Anyone can view module features" 
      ON public.module_features 
      FOR SELECT 
      USING (true);
  END IF;

  -- Policy for super admins to manage module features
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'module_features' 
    AND policyname = 'Super admins can manage module features'
  ) THEN
    CREATE POLICY "Super admins can manage module features" 
      ON public.module_features 
      FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.user_tenants ut
          WHERE ut.user_id = auth.uid() 
          AND ut.role = 'super_admin'
        )
      );
  END IF;

  -- Policy for tenant admins to view their feature overrides
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tenant_feature_overrides' 
    AND policyname = 'Tenant admins can view their feature overrides'
  ) THEN
    CREATE POLICY "Tenant admins can view their feature overrides" 
      ON public.tenant_feature_overrides 
      FOR SELECT 
      USING (
        tenant_id IN (
          SELECT tenant_id FROM public.user_tenants 
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
      );
  END IF;

  -- Policy for tenant admins to manage their feature overrides
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tenant_feature_overrides' 
    AND policyname = 'Tenant admins can manage their feature overrides'
  ) THEN
    CREATE POLICY "Tenant admins can manage their feature overrides" 
      ON public.tenant_feature_overrides 
      FOR ALL 
      USING (
        tenant_id IN (
          SELECT tenant_id FROM public.user_tenants 
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
      );
  END IF;

  -- Policy for users to view their tenant's feature analytics
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'feature_usage_analytics' 
    AND policyname = 'Users can view their tenant feature analytics'
  ) THEN
    CREATE POLICY "Users can view their tenant feature analytics" 
      ON public.feature_usage_analytics 
      FOR SELECT 
      USING (
        tenant_id IN (
          SELECT tenant_id FROM public.user_tenants 
          WHERE user_id = auth.uid()
        )
      );
  END IF;

  -- Policy for system to insert feature usage analytics
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'feature_usage_analytics' 
    AND policyname = 'System can insert feature usage analytics'
  ) THEN
    CREATE POLICY "System can insert feature usage analytics" 
      ON public.feature_usage_analytics 
      FOR INSERT 
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_module_features_module_name ON public.module_features(module_name);
CREATE INDEX IF NOT EXISTS idx_module_features_feature_id ON public.module_features(feature_id);
CREATE INDEX IF NOT EXISTS idx_module_features_category ON public.module_features(feature_category);
CREATE INDEX IF NOT EXISTS idx_tenant_feature_overrides_tenant_module ON public.tenant_feature_overrides(tenant_id, module_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_analytics_tenant_feature ON public.feature_usage_analytics(tenant_id, module_name, feature_id);

-- Populate with current features
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
SELECT 'Feature-Module Mapping System successfully created! 🚀' as result; 