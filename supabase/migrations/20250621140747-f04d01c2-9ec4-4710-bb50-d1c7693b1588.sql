
-- Register the Companies module in the system_modules table
INSERT INTO public.system_modules (
  name,
  version,
  description,
  category,
  is_active,
  dependencies,
  created_at,
  updated_at
) VALUES (
  'companies',
  '1.0.0',
  'Comprehensive company management and relationship tracking with advanced features including hierarchical relationships, bulk operations, and analytics',
  'business',
  true,
  ARRAY[]::text[],
  now(),
  now()
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Register the People/Contacts module in the system_modules table
INSERT INTO public.system_modules (
  name,
  version,
  description,
  category,
  is_active,
  dependencies,
  created_at,
  updated_at
) VALUES (
  'people',
  '1.0.0',
  'Advanced people and contact management system with talent database, business contacts, and relationship tracking capabilities',
  'business',
  true,
  ARRAY[]::text[],
  now(),
  now()
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Enable module permissions for all subscription plans (using INSERT with conditional check)
INSERT INTO public.module_permissions (
  plan_id,
  module_name,
  is_enabled,
  created_at
) 
SELECT 
  sp.id as plan_id,
  'companies' as module_name,
  true as is_enabled,
  now() as created_at
FROM public.subscription_plans sp
WHERE NOT EXISTS (
  SELECT 1 FROM public.module_permissions mp 
  WHERE mp.plan_id = sp.id AND mp.module_name = 'companies'
);

INSERT INTO public.module_permissions (
  plan_id,
  module_name,
  is_enabled,
  created_at
) 
SELECT 
  sp.id as plan_id,
  'people' as module_name,
  true as is_enabled,
  now() as created_at
FROM public.subscription_plans sp
WHERE NOT EXISTS (
  SELECT 1 FROM public.module_permissions mp 
  WHERE mp.plan_id = sp.id AND mp.module_name = 'people'
);
