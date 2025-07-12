
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_annually: number;
  base_price_monthly?: number;
  base_price_annually?: number;
  use_module_pricing?: boolean;
  is_active: boolean;
  plan_type: 'recruitment' | 'employer' | 'talent';
  created_at: string;
  updated_at: string;
}

export interface ModulePermission {
  id: string;
  plan_id: string;
  module_name: string;
  is_enabled: boolean;
  limits: Record<string, unknown> | null;
  created_at: string;
}

export interface ModulePricing {
  id: string;
  module_name: string;
  base_price_monthly: number;
  base_price_annually: number;
  tier_pricing: unknown[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  billing_cycle: 'monthly' | 'annually';
  subscription_level?: 'tenant' | 'fallback';
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  subscription_plans?: SubscriptionPlan;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tenant_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  billing_cycle: 'monthly' | 'annually';
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  assigned_by?: string;
  subscription_plans?: SubscriptionPlan;
}

export interface ResolvedSubscription {
  subscription_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  subscription_type: 'user' | 'tenant';
  starts_at: string;
  ends_at: string | null;
}

export interface ModuleAccess {
  module_name: string;
  is_enabled: boolean;
  limits: Record<string, unknown> | null;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  module: ModuleAccess | null;
  plan: SubscriptionPlan | null;
  subscription: TenantSubscription | UserSubscription | null;
  subscriptionType: 'user' | 'tenant' | null;
}
