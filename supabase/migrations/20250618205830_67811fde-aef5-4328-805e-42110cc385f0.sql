
-- First, let's check what's actually in the database and then update it properly
-- Update all modules that still have old development_stage data

-- Update Beta stage modules (should be 75-85% complete)
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'beta',
  'progress', 85,
  'milestones', jsonb_build_array('requirements_defined', 'development_complete', 'testing_in_progress', 'documentation_partial'),
  'requirements', jsonb_build_array('final_testing', 'documentation_complete')
),
maturity_status = 'beta'
WHERE name IN (
  'Business Contacts',
  'Company Database', 
  'Talent Management',
  'Recruitment Pipeline'
);

-- Update Advanced Analytics to 75% (beta)
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'beta',
  'progress', 75,
  'milestones', jsonb_build_array('requirements_defined', 'development_complete', 'testing_started'),
  'requirements', jsonb_build_array('testing_complete', 'documentation', 'performance_optimization')
),
maturity_status = 'beta'
WHERE name = 'Advanced Analytics';

-- Update other beta modules to 75%
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'beta',
  'progress', 75,
  'milestones', jsonb_build_array('requirements_defined', 'development_complete', 'testing_started'),
  'requirements', jsonb_build_array('testing_complete', 'documentation', 'performance_optimization')
),
maturity_status = 'beta'
WHERE name IN (
  'Communication Hub',
  'Workflow Designer',
  'Integration Framework'
);

-- Update Alpha stage modules (50-60% complete)
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'alpha',
  'progress', 55,
  'milestones', jsonb_build_array('requirements_defined', 'prototype_created', 'core_features_implemented'),
  'requirements', jsonb_build_array('feature_completion', 'testing', 'documentation')
),
maturity_status = 'alpha'
WHERE name IN (
  'Enterprise Operations Suite',
  'Analytics & Insights',
  'Marketplace & Community'
);

-- Update early alpha modules (30% complete)
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'alpha',
  'progress', 30,
  'milestones', jsonb_build_array('requirements_defined', 'prototype_created'),
  'requirements', jsonb_build_array('core_development', 'testing', 'documentation')
),
maturity_status = 'alpha'
WHERE name IN (
  'User & Access Management',
  'Social Media Integration',
  'Email Management',
  'Social Media Outreach',
  'Email Communication',
  'LinkedIn Integration',
  'Knowledge Synthesis',
  'Cognitive Assistance'
);

-- Update planning stage modules (15% complete)
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'planning',
  'progress', 15,
  'milestones', jsonb_build_array('requirements_defined'),
  'requirements', jsonb_build_array('design_specification', 'development', 'testing', 'documentation')
),
maturity_status = 'planning'
WHERE name IN (
  'AI Agent Management',
  'Predictive Analytics',
  'Real-time Collaboration'
);

-- Update any remaining modules that might have been missed
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'alpha',
  'progress', 25,
  'milestones', jsonb_build_array('requirements_defined', 'prototype_created'),
  'requirements', jsonb_build_array('complete_development', 'testing', 'documentation')
),
maturity_status = 'alpha'
WHERE maturity_status != 'production' 
AND (development_stage IS NULL OR development_stage::text = '{}' OR NOT development_stage ? 'progress');
