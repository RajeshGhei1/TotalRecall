
-- First, let's see what modules currently exist in the system
SELECT name, category, description, is_active 
FROM public.system_modules 
WHERE category IN ('recruitment', 'talent', 'analytics') 
OR name LIKE '%talent%' 
OR name LIKE '%recruitment%' 
OR name LIKE '%ats%' 
OR name LIKE '%candidate%' 
OR name LIKE '%job%'
ORDER BY category, name;

-- Clean up any remaining obsolete recruitment-related modules that shouldn't exist
DELETE FROM public.system_modules 
WHERE name IN (
  'recruitment-dashboard',
  'candidate-management',
  'job-management',
  'interview-scheduling',
  'talent-sourcing',
  'applicant-tracking',
  'recruitment-analytics',
  'hiring-workflow',
  'candidate-database',
  'job-board-integration',
  'resume-parsing',
  'interview-feedback',
  'offer-management',
  'onboarding-automation'
);

-- Also clean up related module permissions and pricing
DELETE FROM public.module_permissions 
WHERE module_name IN (
  'recruitment-dashboard',
  'candidate-management', 
  'job-management',
  'interview-scheduling',
  'talent-sourcing',
  'applicant-tracking',
  'recruitment-analytics',
  'hiring-workflow',
  'candidate-database',
  'job-board-integration',
  'resume-parsing',
  'interview-feedback',
  'offer-management',
  'onboarding-automation'
);

DELETE FROM public.module_pricing 
WHERE module_name IN (
  'recruitment-dashboard',
  'candidate-management',
  'job-management', 
  'interview-scheduling',
  'talent-sourcing',
  'applicant-tracking',
  'recruitment-analytics',
  'hiring-workflow',
  'candidate-database',
  'job-board-integration',
  'resume-parsing',
  'interview-feedback',
  'offer-management',
  'onboarding-automation'
);

-- Ensure we only have the correct three recruitment modules
-- Verify and update the three modules we want to keep
UPDATE public.system_modules 
SET 
  is_active = true,
  category = 'recruitment'
WHERE name = 'ats-core';

UPDATE public.system_modules 
SET 
  is_active = true,
  category = 'recruitment' 
WHERE name = 'talent-database';

UPDATE public.system_modules 
SET 
  is_active = true,
  category = 'analytics'
WHERE name = 'smart-talent-analytics';
