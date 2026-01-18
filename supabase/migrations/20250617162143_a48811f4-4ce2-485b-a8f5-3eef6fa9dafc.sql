
-- Create module_registry table for storing module packages and metadata
CREATE TABLE public.module_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('core', 'business', 'recruitment', 'analytics', 'ai', 'integration', 'communication', 'custom')),
  author TEXT NOT NULL,
  license TEXT DEFAULT 'MIT',
  homepage TEXT,
  repository TEXT,
  
  -- Dependencies and compatibility
  dependencies JSONB DEFAULT '[]'::jsonb,
  peer_dependencies JSONB DEFAULT '[]'::jsonb,
  min_core_version TEXT NOT NULL DEFAULT '1.0.0',
  max_core_version TEXT,
  
  -- Module structure
  entry_point TEXT NOT NULL,
  manifest_data JSONB NOT NULL,
  
  -- Access control
  required_permissions JSONB DEFAULT '[]'::jsonb,
  subscription_tiers JSONB DEFAULT '[]'::jsonb,
  
  -- Module lifecycle
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'deprecated', 'rejected')),
  load_order INTEGER DEFAULT 0,
  auto_load BOOLEAN DEFAULT false,
  can_unload BOOLEAN DEFAULT true,
  
  -- Package info
  package_size INTEGER,
  package_hash TEXT,
  package_url TEXT,
  
  -- Ratings and metrics
  download_count INTEGER DEFAULT 0,
  rating_average NUMERIC(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_by UUID,
  approved_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  
  UNIQUE(module_id, version)
);

-- Create module_dependencies table for tracking relationships
CREATE TABLE public.module_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL,
  module_version TEXT NOT NULL,
  dependency_module_id TEXT NOT NULL,
  dependency_version_constraint TEXT NOT NULL DEFAULT '*',
  dependency_type TEXT NOT NULL DEFAULT 'runtime' CHECK (dependency_type IN ('runtime', 'development', 'peer', 'optional')),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  FOREIGN KEY (module_id, module_version) REFERENCES public.module_registry(module_id, version) ON DELETE CASCADE
);

-- Create module_ratings table for user ratings and reviews
CREATE TABLE public.module_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL,
  module_version TEXT NOT NULL,
  user_id UUID NOT NULL,
  tenant_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_content TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(module_id, module_version, user_id),
  FOREIGN KEY (module_id, module_version) REFERENCES public.module_registry(module_id, version) ON DELETE CASCADE
);

-- Create module_installations table for tracking installations
CREATE TABLE public.module_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL,
  module_version TEXT NOT NULL,
  tenant_id UUID NOT NULL,
  installed_by UUID,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'failed', 'updating')),
  configuration JSONB DEFAULT '{}'::jsonb,
  installed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(module_id, tenant_id),
  FOREIGN KEY (module_id, module_version) REFERENCES public.module_registry(module_id, version) ON DELETE CASCADE
);

-- Create module_performance_metrics table for real-time monitoring
CREATE TABLE public.module_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL,
  tenant_id UUID,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Performance metrics
  load_time_avg_ms INTEGER DEFAULT 0,
  memory_usage_avg_mb NUMERIC(10,2) DEFAULT 0,
  cpu_usage_avg_percent NUMERIC(5,2) DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  request_count INTEGER DEFAULT 0,
  response_time_avg_ms INTEGER DEFAULT 0,
  
  -- Usage metrics
  active_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  feature_usage JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(module_id, tenant_id, metric_date)
);

-- Create indexes for better performance
CREATE INDEX idx_module_registry_module_id ON public.module_registry(module_id);
CREATE INDEX idx_module_registry_category ON public.module_registry(category);
CREATE INDEX idx_module_registry_status ON public.module_registry(status);
CREATE INDEX idx_module_registry_created_at ON public.module_registry(created_at);
CREATE INDEX idx_module_dependencies_module ON public.module_dependencies(module_id, module_version);
CREATE INDEX idx_module_ratings_module ON public.module_ratings(module_id, module_version);
CREATE INDEX idx_module_installations_tenant ON public.module_installations(tenant_id);
CREATE INDEX idx_module_performance_tenant_date ON public.module_performance_metrics(tenant_id, metric_date);

-- Add Row Level Security
ALTER TABLE public.module_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for module_registry
CREATE POLICY "Anyone can view published modules" 
  ON public.module_registry 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Super admins can manage all modules" 
  ON public.module_registry 
  FOR ALL 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Users can manage their own modules" 
  ON public.module_registry 
  FOR ALL 
  USING (created_by = auth.uid());

-- Create RLS policies for module_dependencies
CREATE POLICY "Anyone can view module dependencies" 
  ON public.module_dependencies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Super admins can manage dependencies" 
  ON public.module_dependencies 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- Create RLS policies for module_ratings
CREATE POLICY "Anyone can view module ratings" 
  ON public.module_ratings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own ratings" 
  ON public.module_ratings 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ratings" 
  ON public.module_ratings 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own ratings" 
  ON public.module_ratings 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create RLS policies for module_installations
CREATE POLICY "Super admins can view all installations" 
  ON public.module_installations 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Super admins can manage installations" 
  ON public.module_installations 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- Create RLS policies for module_performance_metrics
CREATE POLICY "Super admins can view all performance metrics" 
  ON public.module_performance_metrics 
  FOR SELECT 
  USING (public.is_current_user_super_admin());

CREATE POLICY "Super admins can manage performance metrics" 
  ON public.module_performance_metrics 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- Add triggers for updated_at
CREATE TRIGGER update_module_registry_updated_at
  BEFORE UPDATE ON public.module_registry
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_ratings_updated_at
  BEFORE UPDATE ON public.module_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_installations_updated_at
  BEFORE UPDATE ON public.module_installations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
