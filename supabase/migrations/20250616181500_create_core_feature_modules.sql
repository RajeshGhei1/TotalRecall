
-- Create core feature modules that should be subscription-gated
INSERT INTO public.system_modules (name, description, category, is_active, version, default_limits, pricing_tier, monthly_price, annual_price) VALUES
('Dashboard Analytics', 'Advanced dashboard with analytics and insights', 'analytics', true, '1.0.0', '{"max_widgets": 10, "data_retention_days": 30}', 'professional', 15.00, 150.00),
('Predictive Insights', 'AI-powered predictive analytics and business insights', 'analytics', true, '1.0.0', '{"max_predictions": 100, "historical_data_months": 12}', 'professional', 25.00, 250.00),
('Workflow Management', 'Intelligent workflow automation and management', 'automation', true, '1.0.0', '{"max_workflows": 20, "max_steps_per_workflow": 50}', 'professional', 20.00, 200.00),
('User Management', 'Basic user and tenant management capabilities', 'core', true, '1.0.0', '{"max_users": 5}', 'basic', 0.00, 0.00)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  version = EXCLUDED.version,
  default_limits = EXCLUDED.default_limits,
  pricing_tier = EXCLUDED.pricing_tier,
  monthly_price = EXCLUDED.monthly_price,
  annual_price = EXCLUDED.annual_price;

-- Create a Basic User Management subscription plan
INSERT INTO public.subscription_plans (name, description, price_monthly, price_annually, is_active, plan_type) VALUES
('Basic User Management', 'Free basic plan with user management capabilities only', 0.00, 0.00, true, 'employer')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_annually = EXCLUDED.price_annually,
  is_active = EXCLUDED.is_active,
  plan_type = EXCLUDED.plan_type;

-- Get the Basic User Management plan ID and assign the User Management module
DO $$
DECLARE
  basic_plan_id uuid;
BEGIN
  SELECT id INTO basic_plan_id 
  FROM public.subscription_plans 
  WHERE name = 'Basic User Management';
  
  IF basic_plan_id IS NOT NULL THEN
    INSERT INTO public.module_permissions (plan_id, module_name, is_enabled, limits)
    VALUES (basic_plan_id, 'User Management', true, '{"max_users": 5}')
    ON CONFLICT (plan_id, module_name) DO UPDATE SET
      is_enabled = EXCLUDED.is_enabled,
      limits = EXCLUDED.limits;
  END IF;
END $$;
