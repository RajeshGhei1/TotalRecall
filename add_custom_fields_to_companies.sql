-- Add Custom Fields feature to Companies Module
-- Run this in Supabase SQL Editor

-- Add custom-fields to companies module
INSERT INTO public.module_features (
  module_name, 
  feature_id, 
  feature_name, 
  feature_description, 
  feature_category, 
  is_premium_feature, 
  sort_order
) VALUES (
  'companies', 
  'custom-fields', 
  'Custom Fields', 
  'Create and manage custom field types for companies with validation and conditional logic', 
  'data_management', 
  false, 
  3
) ON CONFLICT (module_name, feature_id) DO UPDATE SET
  feature_name = EXCLUDED.feature_name,
  feature_description = EXCLUDED.feature_description,
  updated_at = now();

-- Verify the addition
SELECT 
  module_name,
  feature_id,
  feature_name,
  feature_description,
  feature_category,
  is_premium_feature
FROM public.module_features 
WHERE module_name = 'companies'
ORDER BY sort_order;

-- Success message
SELECT '✅ Custom Fields successfully added to Companies module!' as result; 