
-- Create module_repository table for storing module packages and metadata
CREATE TABLE public.module_repository (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  version TEXT NOT NULL,
  package_hash TEXT NOT NULL,
  size INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'deployed')),
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  deployed_at TIMESTAMP WITH TIME ZONE,
  validation_result JSONB NOT NULL DEFAULT '{"isValid": true, "errors": [], "warnings": [], "compatibilityIssues": []}',
  download_url TEXT,
  rollback_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_module_repository_module_id ON public.module_repository(module_id);
CREATE INDEX idx_module_repository_status ON public.module_repository(status);
CREATE INDEX idx_module_repository_version ON public.module_repository(module_id, version);

-- Add Row Level Security
ALTER TABLE public.module_repository ENABLE ROW LEVEL SECURITY;

-- Create policies for module repository access
CREATE POLICY "Super admins can manage module repository" 
  ON public.module_repository 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_module_repository_updated_at
  BEFORE UPDATE ON public.module_repository
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
