-- Test Subscription Plans - Run this to verify the fix worked
-- This script checks if the subscription_plans table exists and has data

-- Check if subscription_plans table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_plans') 
    THEN '✅ subscription_plans table exists'
    ELSE '❌ subscription_plans table missing'
  END as table_status;

-- Check subscription plans data
SELECT 
  '📊 Subscription Plans Count:' as info,
  COUNT(*) as total_plans,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_plans
FROM public.subscription_plans;

-- Show all subscription plans
SELECT 
  name,
  plan_type,
  price_monthly,
  price_annually,
  is_active,
  created_at
FROM public.subscription_plans
ORDER BY plan_type, price_monthly;

-- Check module permissions
SELECT 
  '🔐 Module Permissions Count:' as info,
  COUNT(*) as total_permissions
FROM public.module_permissions;

-- Show module permissions by plan
SELECT 
  sp.name as plan_name,
  sp.plan_type,
  mp.module_name,
  mp.is_enabled,
  mp.limits
FROM public.subscription_plans sp
LEFT JOIN public.module_permissions mp ON sp.id = mp.plan_id
ORDER BY sp.name, mp.module_name;
