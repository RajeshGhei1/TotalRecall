
-- Remove the two less developed modules from the database
-- This will clean up company_data_access and business_contacts_data_access modules

-- Step 1: Remove module permissions for the two modules
DELETE FROM public.module_permissions 
WHERE module_name IN ('company_data_access', 'business_contacts_data_access');

-- Step 2: Remove any module access logs for these modules
DELETE FROM public.module_access_logs 
WHERE module_id IN ('company_data_access', 'business_contacts_data_access');

-- Step 3: Remove module dependencies that reference these modules
DELETE FROM public.module_dependencies 
WHERE module_id IN ('company_data_access', 'business_contacts_data_access')
   OR dependency_module_id IN ('company_data_access', 'business_contacts_data_access');

-- Step 4: Remove the modules from system_modules table
DELETE FROM public.system_modules 
WHERE name IN ('company_data_access', 'business_contacts_data_access');

-- Verification query to confirm cleanup
SELECT name, category, description, is_active 
FROM public.system_modules 
WHERE category IN ('business', 'core') 
ORDER BY name;
