-- Simple Fix for Subscription Plans - Run this in Supabase SQL Editor
-- This script creates the subscription_plans table and populates it without conflicts

-- Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS public.subscription_plans CASCADE;

-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
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
CREATE INDEX idx_subscription_plans_plan_type ON public.subscription_plans(plan_type);
CREATE INDEX idx_subscription_plans_is_active ON public.subscription_plans(is_active);
CREATE INDEX idx_subscription_plans_price_monthly ON public.subscription_plans(price_monthly);

-- Insert subscription plans (no conflicts since we dropped the table)
INSERT INTO public.subscription_plans (name, description, price_monthly, price_annually, plan_type, is_active) VALUES
('Basic Plan', 'Essential features for small teams and startups', 29.00, 290.00, 'employer', true),
('Professional Plan', 'Advanced features for growing businesses', 99.00, 990.00, 'employer', true),
('Enterprise Plan', 'Full features for large organizations', 299.00, 2990.00, 'employer', true),
('Starter Plan', 'Basic recruitment tools for small agencies', 49.00, 490.00, 'recruitment', true),
('Growth Plan', 'Advanced recruitment features for growing agencies', 149.00, 1490.00, 'recruitment', true),
('Talent Plus', 'Premium features for talent professionals', 79.00, 790.00, 'talent', true);

-- Create module_permissions table
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

-- Insert module permissions for all plans
INSERT INTO public.module_permissions (plan_id, module_name, is_enabled, limits)
SELECT 
  sp.id as plan_id,
  'User Management' as module_name,
  true as is_enabled,
  '{"max_users": 5}'::jsonb as limits
FROM public.subscription_plans sp;

INSERT INTO public.module_permissions (plan_id, module_name, is_enabled, limits)
SELECT 
  sp.id as plan_id,
  'companies' as module_name,
  true as is_enabled,
  '{"max_companies": 100}'::jsonb as limits
FROM public.subscription_plans sp;

INSERT INTO public.module_permissions (plan_id, module_name, is_enabled, limits)
SELECT 
  sp.id as plan_id,
  'people' as module_name,
  true as is_enabled,
  '{"max_contacts": 500}'::jsonb as limits
FROM public.subscription_plans sp;

-- Verify the data was inserted correctly
SELECT 'Subscription Plans Created:' as status, COUNT(*) as count FROM public.subscription_plans;
SELECT 'Module Permissions Created:' as status, COUNT(*) as count FROM public.module_permissions;

-- Show all subscription plans
SELECT 
  id,
  name,
  plan_type,
  price_monthly,
  price_annually,
  is_active
FROM public.subscription_plans
ORDER BY plan_type, price_monthly;
