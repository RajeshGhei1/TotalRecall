
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_annually: number;
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
  limits: Record<string, any> | null;
  created_at: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  billing_cycle: 'monthly' | 'annually';
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  subscription_plans?: SubscriptionPlan;
}

export interface ModuleAccess {
  module_name: string;
  is_enabled: boolean;
  limits: Record<string, any> | null;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  module: ModuleAccess | null;
  plan: SubscriptionPlan | null;
  subscription: TenantSubscription | null;
}
