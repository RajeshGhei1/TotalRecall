-- Phase III: tighten subscription access policies

-- Ensure RLS is enabled
ALTER TABLE public.tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Remove anonymous access
REVOKE ALL ON public.tenant_subscriptions FROM anon;
REVOKE ALL ON public.user_subscriptions FROM anon;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_current_user_tenant_member(p_tenant_id uuid)
RETURNS boolean
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
      FROM public.user_tenants ut
     WHERE ut.user_id = auth.uid()
       AND ut.tenant_id = p_tenant_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_tenant_admin(p_tenant_id uuid)
RETURNS boolean
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.is_current_user_super_admin()
     OR EXISTS (
          SELECT 1
            FROM public.user_tenants ut
           WHERE ut.user_id = auth.uid()
             AND ut.tenant_id = p_tenant_id
             AND ut.user_role IN ('tenant_admin', 'super_admin')
        );
$$;

-- tenant_subscriptions policies
DROP POLICY IF EXISTS "Tenant members can view tenant subscriptions" ON public.tenant_subscriptions;
CREATE POLICY "Tenant members can view tenant subscriptions"
  ON public.tenant_subscriptions
  FOR SELECT
  USING (public.is_current_user_tenant_member(tenant_id) OR public.is_current_user_super_admin());

DROP POLICY IF EXISTS "Tenant admins can manage tenant subscriptions" ON public.tenant_subscriptions;
CREATE POLICY "Tenant admins can manage tenant subscriptions"
  ON public.tenant_subscriptions
  FOR ALL
  USING (public.is_current_user_tenant_admin(tenant_id))
  WITH CHECK (public.is_current_user_tenant_admin(tenant_id));

-- user_subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_current_user_tenant_admin(tenant_id)
    OR public.is_current_user_super_admin()
  );

DROP POLICY IF EXISTS "Tenant admins can manage user subscriptions" ON public.user_subscriptions;
CREATE POLICY "Tenant admins can manage user subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (public.is_current_user_tenant_admin(tenant_id))
  WITH CHECK (public.is_current_user_tenant_admin(tenant_id));

