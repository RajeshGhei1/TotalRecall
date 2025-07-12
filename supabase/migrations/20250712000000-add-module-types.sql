-- Add module type system for three-tier architecture
-- Super Admin | Foundation | Business modules

-- Step 1: Add type column to system_modules table
ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'business' 
CHECK (type IN ('super_admin', 'foundation', 'business'));

-- Step 2: Create index for performance
CREATE INDEX IF NOT EXISTS idx_system_modules_type 
ON public.system_modules(type);

-- Step 3: Add helpful comment
COMMENT ON COLUMN public.system_modules.type IS 
'Module type: super_admin (platform management), foundation (core dependencies), business (specialized features)';

-- Step 4: Classify existing modules into three types

-- Super Admin Modules - System administration and platform management
UPDATE public.system_modules 
SET type = 'super_admin' 
WHERE name ILIKE '%admin%' 
   OR name ILIKE '%tenant%' 
   OR name ILIKE '%user%' 
   OR name ILIKE '%global%'
   OR name ILIKE '%security%'
   OR name ILIKE '%audit%'
   OR name ILIKE '%setting%'
   OR category = 'core_system';

-- Foundation Modules - Core platform modules that others depend on
-- Includes: Core data entities, AI services, shared infrastructure
UPDATE public.system_modules 
SET type = 'foundation' 
WHERE name IN ('companies', 'people', 'core_dashboard', 'talent_database', 'authentication', 'contact_form')
   OR name ILIKE '%ai_%' 
   OR name ILIKE '%ai%agent%'
   OR name ILIKE '%ai%service%'
   OR name ILIKE '%ai%orchestration%'
   OR name ILIKE '%ai%analytics%'
   OR category IN ('ai_tools', 'ai_analytics', 'ai_automation', 'ai_cognitive', 'ai_core', 'ai_knowledge');

-- Business Modules - Specialized business functionality that depends on foundation
-- Includes: ATS Core, Sales Pipeline, Marketing Automation, Financial Operations, etc.
-- These modules leverage foundation modules (Companies, People, AI Services) to provide business value
-- (Business is the default type, so no explicit update needed for most modules)

-- Step 5: Show final classification
DO $$
DECLARE
    super_admin_count INTEGER;
    foundation_count INTEGER;
    business_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO super_admin_count FROM public.system_modules WHERE type = 'super_admin';
    SELECT COUNT(*) INTO foundation_count FROM public.system_modules WHERE type = 'foundation';
    SELECT COUNT(*) INTO business_count FROM public.system_modules WHERE type = 'business';
    SELECT COUNT(*) INTO total_count FROM public.system_modules;
    
    RAISE NOTICE '=== THREE-TIER MODULE ARCHITECTURE ===';
    RAISE NOTICE 'Super Admin Modules: % modules', super_admin_count;
    RAISE NOTICE 'Foundation Modules:  % modules', foundation_count;
    RAISE NOTICE 'Business Modules:    % modules', business_count;
    RAISE NOTICE 'Total Modules:       % modules', total_count;
    RAISE NOTICE '=====================================';
END $$; 