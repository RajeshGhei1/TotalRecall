-- Fix Module Classification
-- This script corrects the overly broad classification that assigned 8 modules as super_admin
-- Only 3 core Super Admin modules should be classified as super_admin type

-- ==========================================
-- STEP 1: Reclassify incorrectly assigned modules
-- ==========================================

-- Move these modules to Foundation (they are core infrastructure)
UPDATE public.system_modules 
SET type = 'foundation' 
WHERE name IN (
  'Core Dashboard',
  'Cognitive Assistance', 
  'Dashboard Widget',
  'Knowledge Synthesis'
);

-- Move this module to Business (it's business functionality)
UPDATE public.system_modules 
SET type = 'business' 
WHERE name = 'Workflow Automation';

-- ==========================================
-- STEP 2: Ensure only 3 core Super Admin modules remain
-- ==========================================

-- Reset all modules to business first (except the 3 core ones)
UPDATE public.system_modules 
SET type = 'business' 
WHERE name NOT IN (
  'System Administration Suite',
  'Module Registry & Deployment', 
  'Enterprise Monitoring & Audit'
);

-- Set the 3 core Super Admin modules
UPDATE public.system_modules 
SET type = 'super_admin' 
WHERE name IN (
  'System Administration Suite',
  'Module Registry & Deployment', 
  'Enterprise Monitoring & Audit'
);

-- ==========================================
-- STEP 3: Verify the classification
-- ==========================================

-- Show final classification results
SELECT 
  type,
  COUNT(*) as module_count,
  STRING_AGG(name, ', ' ORDER BY name) as module_names
FROM public.system_modules 
WHERE is_active = true
GROUP BY type
ORDER BY 
  CASE type 
    WHEN 'super_admin' THEN 1
    WHEN 'foundation' THEN 2
    WHEN 'business' THEN 3
  END;

-- Show Super Admin modules specifically
SELECT 
  name,
  category,
  type,
  description
FROM public.system_modules 
WHERE type = 'super_admin' 
  AND is_active = true
ORDER BY name;
