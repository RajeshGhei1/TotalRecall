
-- Update development modules with more realistic progress percentages
UPDATE public.system_modules 
SET development_stage = '{"stage": "beta", "progress": 85, "milestones": ["requirements_defined", "development_complete", "testing_in_progress", "documentation_partial"], "requirements": ["final_testing", "documentation_complete"]}'::jsonb,
    maturity_status = 'beta'
WHERE name IN (
  'Business Contacts',
  'Company Database',
  'Talent Management',
  'Recruitment Pipeline'
) AND maturity_status != 'production';

-- Advanced modules (70-80% complete, moving to beta)
UPDATE public.system_modules 
SET development_stage = '{"stage": "beta", "progress": 75, "milestones": ["requirements_defined", "development_complete", "testing_started"], "requirements": ["testing_complete", "documentation", "performance_optimization"]}'::jsonb,
    maturity_status = 'beta'
WHERE name IN (
  'Advanced Analytics',
  'Communication Hub',
  'Workflow Designer',
  'Integration Framework'
) AND maturity_status != 'production';

-- Mid-stage modules (50-60% complete, staying in alpha)
UPDATE public.system_modules 
SET development_stage = '{"stage": "alpha", "progress": 55, "milestones": ["requirements_defined", "prototype_created", "core_features_implemented"], "requirements": ["feature_completion", "testing", "documentation"]}'::jsonb
WHERE name IN (
  'Enterprise Operations Suite',
  'Analytics & Insights',
  'Marketplace & Community'
) AND maturity_status != 'production';

-- Early stage modules (25-35% complete, staying in alpha)
UPDATE public.system_modules 
SET development_stage = '{"stage": "alpha", "progress": 30, "milestones": ["requirements_defined", "prototype_created"], "requirements": ["core_development", "testing", "documentation"]}'::jsonb
WHERE name IN (
  'User & Access Management',
  'Social Media Integration',
  'Email Management'
) AND maturity_status != 'production';

-- Planning stage modules (10-15% complete, back to planning)
UPDATE public.system_modules 
SET development_stage = '{"stage": "planning", "progress": 15, "milestones": ["requirements_defined"], "requirements": ["design_specification", "development", "testing", "documentation"]}'::jsonb,
    maturity_status = 'planning'
WHERE name IN (
  'AI Agent Management',
  'Predictive Analytics',
  'Real-time Collaboration'
) AND maturity_status != 'production';
