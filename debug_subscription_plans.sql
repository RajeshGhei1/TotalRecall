-- Debug Subscription Plans - Run this to check what's happening
-- This will help us identify the exact issue

-- 1. Check if subscription_plans table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_plans') 
    THEN '✅ subscription_plans table EXISTS'
    ELSE '❌ subscription_plans table MISSING'
  END as table_status;

-- 2. Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscription_plans' 
ORDER BY ordinal_position;

-- 3. Check if there's any data
SELECT 
  'Data Count:' as info,
  COUNT(*) as total_rows
FROM public.subscription_plans;

-- 4. Show all data in subscription_plans
SELECT 
  id,
  name,
  plan_type,
  price_monthly,
  price_annually,
  is_active,
  created_at
FROM public.subscription_plans
ORDER BY created_at;

-- 5. Check if there are any errors in the table
SELECT 
  'Table Status:' as info,
  CASE 
    WHEN COUNT(*) = 0 THEN '❌ Table is EMPTY'
    WHEN COUNT(*) > 0 THEN '✅ Table has ' || COUNT(*) || ' rows'
    ELSE '❌ Error accessing table'
  END as status
FROM public.subscription_plans;

-- 6. Check RLS (Row Level Security) policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'subscription_plans';

-- 7. Check if we can insert a test record
INSERT INTO public.subscription_plans (name, description, price_monthly, price_annually, plan_type, is_active) 
VALUES ('Test Plan', 'Test subscription plan', 1.00, 10.00, 'employer', true)
ON CONFLICT (name) DO NOTHING;

-- 8. Verify the test record was inserted
SELECT 
  'Test Insert:' as info,
  COUNT(*) as count
FROM public.subscription_plans 
WHERE name = 'Test Plan';
