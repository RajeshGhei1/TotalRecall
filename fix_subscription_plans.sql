-- Fix Subscription Plans - Run this in Supabase SQL Editor
-- This script creates the missing subscription_plans table and populates it with sample data

-- Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL,
  price_annually NUMERIC(10,2),
  base_price_monthly NUMERIC(10,2),
  base_price_annually NUMERIC(10,2),
  use_module_pricing BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('recruitment', 'employer', 'talent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_plans_plan_type ON public.subscription_plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON public.subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_price_monthly ON public.subscription_plans(price_monthly);

-- Clear existing data and insert fresh subscription plans
DELETE FROM public.subscription_plans;

INSERT INTO public.subscription_plans (name, description, price_monthly, price_annually, plan_type, is_active) VALUES
('Basic Plan', 'Essential features for small teams and startups', 29.00, 290.00, 'employer', true),
('Professional Plan', 'Advanced features for growing businesses', 99.00, 990.00, 'employer', true),
('Enterprise Plan', 'Full features for large organizations', 299.00, 2990.00, 'employer', true),
('Starter Plan', 'Basic recruitment tools for small agencies', 49.00, 490.00, 'recruitment', true),
('Growth Plan', 'Advanced recruitment features for growing agencies', 149.00, 1490.00, 'recruitment', true),
('Talent Plus', 'Premium features for talent professionals', 79.00, 790.00, 'talent', true);

-- Create module_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.module_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  limits JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_id, module_name)
);

-- Create indexes for module_permissions
CREATE INDEX IF NOT EXISTS idx_module_permissions_plan_id ON public.module_permissions(plan_id);
CREATE INDEX IF NOT EXISTS idx_module_permissions_module_name ON public.module_permissions(module_name);

-- Clear existing module permissions and create fresh ones
DELETE FROM public.module_permissions;

-- Enable basic modules for all plans
INSERT INTO public.module_permissions (plan_id, module_name, is_enabled, limits)
SELECT 
  sp.id as plan_id,
  'User Management' as module_name,
  true as is_enabled,
  '{"max_users": 5}'::jsonb as limits
FROM public.subscription_plans sp;

-- Enable companies module for all plans
INSERT INTO public.module_permissions (plan_id, module_name, is_enabled, limits)
SELECT 
  sp.id as plan_id,
  'companies' as module_name,
  true as is_enabled,
  '{"max_companies": 100}'::jsonb as limits
FROM public.subscription_plans sp;

-- Enable people module for all plans
INSERT INTO public.module_permissions (plan_id, module_name, is_enabled, limits)
SELECT 
  sp.id as plan_id,
  'people' as module_name,
  true as is_enabled,
  '{"max_contacts": 500}'::jsonb as limits
FROM public.subscription_plans sp;

-- Add comments for documentation
COMMENT ON TABLE public.subscription_plans IS 'Subscription plan definitions with pricing and features';
COMMENT ON TABLE public.module_permissions IS 'Module access permissions for each subscription plan';

-- Verify the data was inserted correctly
SELECT 'Subscription Plans Created:' as status, COUNT(*) as count FROM public.subscription_plans;
SELECT 'Module Permissions Created:' as status, COUNT(*) as count FROM public.module_permissions;
