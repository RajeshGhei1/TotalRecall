
-- Check and update ALL non-production modules with proper development stages
-- First, let's see what modules actually exist and update them all

-- Update all modules that aren't production with proper development stages
UPDATE public.system_modules 
SET 
  development_stage = CASE 
    -- High-progress beta modules (80-85%)
    WHEN name IN ('Business Contacts', 'Company Database', 'Talent Management', 'Recruitment Pipeline') THEN
      jsonb_build_object(
        'stage', 'beta',
        'progress', 85,
        'milestones', jsonb_build_array('requirements_defined', 'development_complete', 'testing_in_progress', 'documentation_partial'),
        'requirements', jsonb_build_array('final_testing', 'documentation_complete')
      )
    -- Medium-progress beta modules (70-75%)
    WHEN name IN ('Advanced Analytics', 'Communication Hub', 'Workflow Designer', 'Integration Framework') THEN
      jsonb_build_object(
        'stage', 'beta',
        'progress', 75,
        'milestones', jsonb_build_array('requirements_defined', 'development_complete', 'testing_started'),
        'requirements', jsonb_build_array('testing_complete', 'documentation', 'performance_optimization')
      )
    -- Alpha modules with good progress (50-55%)
    WHEN name IN ('Enterprise Operations Suite', 'Analytics & Insights', 'Marketplace & Community') THEN
      jsonb_build_object(
        'stage', 'alpha',
        'progress', 55,
        'milestones', jsonb_build_array('requirements_defined', 'prototype_created', 'core_features_implemented'),
        'requirements', jsonb_build_array('feature_completion', 'testing', 'documentation')
      )
    -- Early development modules (30-35%)
    WHEN name IN ('User & Access Management', 'Social Media Integration', 'Email Management', 'Social Media Outreach', 'Email Communication', 'LinkedIn Integration', 'Knowledge Synthesis', 'Cognitive Assistance') THEN
      jsonb_build_object(
        'stage', 'alpha',
        'progress', 32,
        'milestones', jsonb_build_array('requirements_defined', 'prototype_created'),
        'requirements', jsonb_build_array('core_development', 'testing', 'documentation')
      )
    -- Planning stage modules (10-20%)
    WHEN name IN ('AI Agent Management', 'Predictive Analytics', 'Real-time Collaboration') THEN
      jsonb_build_object(
        'stage', 'planning',
        'progress', 18,
        'milestones', jsonb_build_array('requirements_defined'),
        'requirements', jsonb_build_array('design_specification', 'development', 'testing', 'documentation')
      )
    -- All other non-production modules
    ELSE
      jsonb_build_object(
        'stage', 'alpha',
        'progress', 28,
        'milestones', jsonb_build_array('requirements_defined', 'prototype_created'),
        'requirements', jsonb_build_array('complete_development', 'testing', 'documentation')
      )
  END,
  maturity_status = CASE 
    WHEN name IN ('Business Contacts', 'Company Database', 'Talent Management', 'Recruitment Pipeline', 'Advanced Analytics', 'Communication Hub', 'Workflow Designer', 'Integration Framework') THEN 'beta'
    WHEN name IN ('Enterprise Operations Suite', 'Analytics & Insights', 'Marketplace & Community', 'User & Access Management', 'Social Media Integration', 'Email Management', 'Social Media Outreach', 'Email Communication', 'LinkedIn Integration', 'Knowledge Synthesis', 'Cognitive Assistance') THEN 'alpha'
    WHEN name IN ('AI Agent Management', 'Predictive Analytics', 'Real-time Collaboration') THEN 'planning'
    ELSE 'alpha'
  END
WHERE maturity_status != 'production';

-- Also ensure any modules with NULL or empty development_stage get updated
UPDATE public.system_modules 
SET development_stage = jsonb_build_object(
  'stage', 'alpha',
  'progress', 25,
  'milestones', jsonb_build_array('requirements_defined'),
  'requirements', jsonb_build_array('development', 'testing', 'documentation')
)
WHERE development_stage IS NULL 
   OR development_stage = '{}'::jsonb 
   OR NOT (development_stage ? 'progress');
