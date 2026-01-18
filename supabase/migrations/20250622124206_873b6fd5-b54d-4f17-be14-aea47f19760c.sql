
-- Insert progress tracking record for the companies module
INSERT INTO public.module_progress_tracking (
  module_id,
  code_completion,
  test_coverage,
  feature_completion,
  documentation_completion,
  quality_score,
  overall_progress,
  metrics_data
) VALUES (
  'companies',
  92,
  85,
  95,
  80,
  88,
  90.5,
  jsonb_build_object(
    'total_files_planned', 25,
    'files_implemented', 23,
    'total_tests_planned', 60,
    'tests_written', 51,
    'tests_passing', 48,
    'features_planned', 20,
    'features_completed', 19,
    'docs_sections_planned', 10,
    'docs_sections_completed', 8,
    'code_review_score', 88,
    'bug_count', 2,
    'performance_score', 90
  )
)
ON CONFLICT (module_id) DO UPDATE SET
  code_completion = EXCLUDED.code_completion,
  test_coverage = EXCLUDED.test_coverage,
  feature_completion = EXCLUDED.feature_completion,
  documentation_completion = EXCLUDED.documentation_completion,
  quality_score = EXCLUDED.quality_score,
  overall_progress = EXCLUDED.overall_progress,
  metrics_data = EXCLUDED.metrics_data,
  updated_at = now();
