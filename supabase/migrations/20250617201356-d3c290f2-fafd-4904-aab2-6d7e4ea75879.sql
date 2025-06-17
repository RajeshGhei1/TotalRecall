
-- Check for any remaining AI or recruitment assistant related modules
SELECT name, category, description, is_active 
FROM public.system_modules 
WHERE name ILIKE '%ai%recruitment%' 
   OR name ILIKE '%recruitment%assistant%' 
   OR name ILIKE '%ai%assistant%'
   OR name = 'ai-recruitment-assistant'
ORDER BY name;

-- Remove the AI Recruitment Assistant module and any variants
DELETE FROM public.system_modules 
WHERE name IN (
  'ai-recruitment-assistant',
  'AI Recruitment Assistant',
  'recruitment-assistant',
  'ai_recruitment_assistant'
) OR name ILIKE '%ai%recruitment%assistant%';

-- Clean up related permissions and pricing for AI recruitment assistant
DELETE FROM public.module_permissions 
WHERE module_name IN (
  'ai-recruitment-assistant',
  'AI Recruitment Assistant', 
  'recruitment-assistant',
  'ai_recruitment_assistant'
) OR module_name ILIKE '%ai%recruitment%assistant%';

DELETE FROM public.module_pricing 
WHERE module_name IN (
  'ai-recruitment-assistant',
  'AI Recruitment Assistant',
  'recruitment-assistant', 
  'ai_recruitment_assistant'
) OR module_name ILIKE '%ai%recruitment%assistant%';

-- Final verification - show only the modules that should remain
SELECT name, category, description, is_active 
FROM public.system_modules 
WHERE name IN ('ats-core', 'talent-database', 'smart-talent-analytics')
ORDER BY name;
