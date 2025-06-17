
-- Step 1: Remove duplicate/obsolete module entries
DELETE FROM public.system_modules 
WHERE name IN (
  'ai-recruitment-assistant',
  'job-posting-management', 
  'candidate-scoring-engine',
  'smart_talent_analytics',
  'Smart Talent Analytics'
);

-- Step 2: Clean up related tables - Remove module permissions for deleted modules
DELETE FROM public.module_permissions 
WHERE module_name IN (
  'ai-recruitment-assistant',
  'job-posting-management',
  'candidate-scoring-engine', 
  'smart_talent_analytics',
  'Smart Talent Analytics'
);

-- Step 3: Clean up module pricing entries for deleted modules
DELETE FROM public.module_pricing 
WHERE module_name IN (
  'ai-recruitment-assistant',
  'job-posting-management',
  'candidate-scoring-engine',
  'smart_talent_analytics', 
  'Smart Talent Analytics'
);

-- Step 4: Insert the correct Smart Talent Analytics module entry
INSERT INTO public.system_modules (
  name,
  description,
  category,
  is_active,
  version,
  dependencies,
  default_limits
) VALUES (
  'smart-talent-analytics',
  'AI-powered talent analytics with predictive insights, pattern analysis, and talent matching',
  'analytics',
  true,
  '1.0.0',
  ARRAY['ats-core', 'talent-database'],
  '{
    "max_analytics_reports": 50,
    "max_ai_insights": 100,
    "max_pattern_analyses": 25
  }'::jsonb
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  version = EXCLUDED.version,
  dependencies = EXCLUDED.dependencies,
  default_limits = EXCLUDED.default_limits,
  updated_at = now();
