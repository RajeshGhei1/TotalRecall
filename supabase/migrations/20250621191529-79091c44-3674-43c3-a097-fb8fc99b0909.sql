
-- Update AI Orchestration module to development status
UPDATE public.system_modules 
SET 
  development_stage = jsonb_build_object(
    'stage', 'alpha',
    'progress', 30,
    'promoted_at', null,
    'promoted_from', 'planning'
  ),
  updated_at = now()
WHERE name = 'ai_orchestration';

-- Also update any existing progress tracking to reflect the realistic state
INSERT INTO public.module_progress_tracking (
  module_id,
  overall_progress,
  code_completion,
  test_coverage,
  feature_completion,
  documentation_completion,
  quality_score,
  last_updated
) VALUES (
  'ai_orchestration',
  30,
  25,
  10,
  35,
  20,
  15,
  now()
)
ON CONFLICT (module_id) 
DO UPDATE SET 
  overall_progress = 30,
  code_completion = 25,
  test_coverage = 10,
  feature_completion = 35,
  documentation_completion = 20,
  quality_score = 15,
  last_updated = now();
