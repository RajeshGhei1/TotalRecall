-- Phase 3: tenant allocation for platform/app-owned company data

CREATE TABLE IF NOT EXISTS public.company_data_allocations (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  allocation_type text NOT NULL DEFAULT 'subscription',
  allocated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  allocated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  notes text,
  PRIMARY KEY (id),
  CONSTRAINT company_data_allocations_unique UNIQUE (company_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_company_data_allocations_tenant_id
  ON public.company_data_allocations(tenant_id);

CREATE INDEX IF NOT EXISTS idx_company_data_allocations_company_id
  ON public.company_data_allocations(company_id);

ALTER TABLE public.company_data_allocations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant members can view allocated company data" ON public.company_data_allocations;
CREATE POLICY "Tenant members can view allocated company data"
  ON public.company_data_allocations
  FOR SELECT
  USING (
    public.is_current_user_super_admin()
    OR public.is_current_user_tenant_member(tenant_id)
  );

DROP POLICY IF EXISTS "Super admins manage company data allocations" ON public.company_data_allocations;
CREATE POLICY "Super admins manage company data allocations"
  ON public.company_data_allocations
  FOR ALL
  USING (public.is_current_user_super_admin())
  WITH CHECK (public.is_current_user_super_admin());

DROP POLICY IF EXISTS "Tenant members can view allocated companies" ON public.companies;
CREATE POLICY "Tenant members can view allocated companies"
  ON public.companies
  FOR SELECT
  USING (
    public.is_current_user_super_admin()
    OR (
      owner_type IN ('platform', 'app')
      AND EXISTS (
        SELECT 1
          FROM public.company_data_allocations a
         WHERE a.company_id = companies.id
           AND public.is_current_user_tenant_member(a.tenant_id)
      )
    )
  );

CREATE OR REPLACE FUNCTION public.allocate_company_to_tenant(
  p_company_id uuid,
  p_tenant_id uuid,
  p_allocation_type text DEFAULT 'subscription',
  p_expires_at timestamptz DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_current_user_super_admin() THEN
    RAISE EXCEPTION 'Only super admins can allocate company data';
  END IF;

  INSERT INTO public.company_data_allocations (
    company_id,
    tenant_id,
    allocation_type,
    allocated_by,
    expires_at,
    notes
  ) VALUES (
    p_company_id,
    p_tenant_id,
    coalesce(p_allocation_type, 'subscription'),
    auth.uid(),
    p_expires_at,
    p_notes
  )
  ON CONFLICT (company_id, tenant_id)
  DO UPDATE SET
    allocation_type = EXCLUDED.allocation_type,
    allocated_by = EXCLUDED.allocated_by,
    allocated_at = now(),
    expires_at = EXCLUDED.expires_at,
    notes = EXCLUDED.notes;
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_company_allocation(
  p_company_id uuid,
  p_tenant_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_current_user_super_admin() THEN
    RAISE EXCEPTION 'Only super admins can revoke company allocations';
  END IF;

  DELETE FROM public.company_data_allocations
   WHERE company_id = p_company_id
     AND tenant_id = p_tenant_id;
END;
$$;

