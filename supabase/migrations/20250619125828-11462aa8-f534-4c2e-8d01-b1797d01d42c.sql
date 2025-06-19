
-- Create module progress tracking table
CREATE TABLE public.module_progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL,
  code_completion NUMERIC NOT NULL DEFAULT 0,
  test_coverage NUMERIC NOT NULL DEFAULT 0,
  feature_completion NUMERIC NOT NULL DEFAULT 0,
  documentation_completion NUMERIC NOT NULL DEFAULT 0,
  quality_score NUMERIC NOT NULL DEFAULT 0,
  overall_progress NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metrics_data JSONB NOT NULL DEFAULT '{
    "total_files_planned": 0,
    "files_implemented": 0,
    "total_tests_planned": 0,
    "tests_written": 0,
    "tests_passing": 0,
    "features_planned": 0,
    "features_completed": 0,
    "docs_sections_planned": 0,
    "docs_sections_completed": 0,
    "code_review_score": 0,
    "bug_count": 0,
    "performance_score": 0
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(module_id)
);

-- Create module progress history table
CREATE TABLE public.module_progress_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  old_value NUMERIC,
  new_value NUMERIC NOT NULL,
  increment_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  change_reason TEXT
);

-- Create function to update module progress
CREATE OR REPLACE FUNCTION public.update_module_progress(
  p_module_id TEXT,
  p_metric_type TEXT,
  p_increment_value NUMERIC,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_record RECORD;
  new_metrics JSONB;
  new_overall_progress NUMERIC;
BEGIN
  -- Get current progress record
  SELECT * INTO current_record 
  FROM public.module_progress_tracking 
  WHERE module_id = p_module_id;
  
  -- Initialize if doesn't exist
  IF NOT FOUND THEN
    INSERT INTO public.module_progress_tracking (module_id) VALUES (p_module_id);
    SELECT * INTO current_record 
    FROM public.module_progress_tracking 
    WHERE module_id = p_module_id;
  END IF;
  
  -- Update specific metric
  IF p_metric_type = 'code' THEN
    UPDATE public.module_progress_tracking 
    SET code_completion = GREATEST(0, LEAST(100, code_completion + p_increment_value)),
        last_updated = now()
    WHERE module_id = p_module_id;
  ELSIF p_metric_type = 'test' THEN
    UPDATE public.module_progress_tracking 
    SET test_coverage = GREATEST(0, LEAST(100, test_coverage + p_increment_value)),
        last_updated = now()
    WHERE module_id = p_module_id;
  ELSIF p_metric_type = 'feature' THEN
    UPDATE public.module_progress_tracking 
    SET feature_completion = GREATEST(0, LEAST(100, feature_completion + p_increment_value)),
        last_updated = now()
    WHERE module_id = p_module_id;
  ELSIF p_metric_type = 'documentation' THEN
    UPDATE public.module_progress_tracking 
    SET documentation_completion = GREATEST(0, LEAST(100, documentation_completion + p_increment_value)),
        last_updated = now()
    WHERE module_id = p_module_id;
  ELSIF p_metric_type = 'quality' THEN
    UPDATE public.module_progress_tracking 
    SET quality_score = GREATEST(0, LEAST(100, quality_score + p_increment_value)),
        last_updated = now()
    WHERE module_id = p_module_id;
  END IF;
  
  -- Recalculate overall progress (weighted average)
  SELECT 
    (code_completion * 0.35 + test_coverage * 0.25 + feature_completion * 0.25 + documentation_completion * 0.10 + quality_score * 0.05)
  INTO new_overall_progress
  FROM public.module_progress_tracking 
  WHERE module_id = p_module_id;
  
  -- Update overall progress
  UPDATE public.module_progress_tracking 
  SET overall_progress = new_overall_progress,
      updated_at = now()
  WHERE module_id = p_module_id;
  
  -- Log the change
  INSERT INTO public.module_progress_history (
    module_id, metric_type, old_value, new_value, increment_value, metadata, created_by
  ) VALUES (
    p_module_id, 
    p_metric_type, 
    CASE 
      WHEN p_metric_type = 'code' THEN current_record.code_completion
      WHEN p_metric_type = 'test' THEN current_record.test_coverage
      WHEN p_metric_type = 'feature' THEN current_record.feature_completion
      WHEN p_metric_type = 'documentation' THEN current_record.documentation_completion
      WHEN p_metric_type = 'quality' THEN current_record.quality_score
    END,
    CASE 
      WHEN p_metric_type = 'code' THEN current_record.code_completion + p_increment_value
      WHEN p_metric_type = 'test' THEN current_record.test_coverage + p_increment_value
      WHEN p_metric_type = 'feature' THEN current_record.feature_completion + p_increment_value
      WHEN p_metric_type = 'documentation' THEN current_record.documentation_completion + p_increment_value
      WHEN p_metric_type = 'quality' THEN current_record.quality_score + p_increment_value
    END,
    p_increment_value,
    p_metadata,
    auth.uid()
  );
END;
$$;

-- Create function to initialize module progress
CREATE OR REPLACE FUNCTION public.initialize_module_progress(
  p_module_id TEXT,
  p_planning_data JSONB
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.module_progress_tracking (
    module_id,
    metrics_data
  ) VALUES (
    p_module_id,
    p_planning_data
  )
  ON CONFLICT (module_id) 
  DO UPDATE SET 
    metrics_data = p_planning_data,
    updated_at = now();
END;
$$;

-- Insert initial data for existing system modules
INSERT INTO public.module_progress_tracking (module_id, code_completion, test_coverage, feature_completion, documentation_completion, quality_score, overall_progress, metrics_data)
SELECT 
  name,
  CASE 
    WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 90
    ELSE 25
  END,
  CASE 
    WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 85
    ELSE 20
  END,
  CASE 
    WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 95
    ELSE 30
  END,
  CASE 
    WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 80
    ELSE 15
  END,
  CASE 
    WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 85
    ELSE 25
  END,
  CASE 
    WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 88.5
    ELSE 24.5
  END,
  jsonb_build_object(
    'total_files_planned', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 20 ELSE 12 END,
    'files_implemented', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 18 ELSE 3 END,
    'total_tests_planned', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 50 ELSE 25 END,
    'tests_written', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 45 ELSE 8 END,
    'tests_passing', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 42 ELSE 5 END,
    'features_planned', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 15 ELSE 10 END,
    'features_completed', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 14 ELSE 3 END,
    'docs_sections_planned', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 10 ELSE 8 END,
    'docs_sections_completed', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 8 ELSE 1 END,
    'code_review_score', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 85 ELSE 60 END,
    'bug_count', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 2 ELSE 8 END,
    'performance_score', CASE WHEN name IN ('Company Database', 'Business Contacts', 'ATS Core', 'User Management', 'Talent Database', 'Core Dashboard', 'Smart Talent Analytics', 'Document Management', 'AI Orchestration', 'Custom Field Management') THEN 90 ELSE 70 END
  )
FROM public.system_modules
WHERE maturity_status != 'production'
ON CONFLICT (module_id) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_module_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER module_progress_tracking_updated_at
  BEFORE UPDATE ON public.module_progress_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_module_progress_updated_at();

-- Enable RLS
ALTER TABLE public.module_progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all operations for authenticated users" ON public.module_progress_tracking
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON public.module_progress_history
  FOR ALL USING (auth.role() = 'authenticated');
