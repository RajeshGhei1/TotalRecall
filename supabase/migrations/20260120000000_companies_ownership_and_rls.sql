-- Phase 1: Companies ownership + RLS hardening

-- Add ownership columns
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS owner_type text NOT NULL DEFAULT 'platform',
ADD COLUMN IF NOT EXISTS owner_id uuid;

-- Constraints for ownership semantics
ALTER TABLE public.companies
  DROP CONSTRAINT IF EXISTS companies_owner_type_check,
  ADD CONSTRAINT companies_owner_type_check
    CHECK (owner_type IN ('tenant', 'platform', 'app'));

ALTER TABLE public.companies
  DROP CONSTRAINT IF EXISTS companies_owner_tenant_check,
  ADD CONSTRAINT companies_owner_tenant_check
    CHECK (owner_type <> 'tenant' OR tenant_id IS NOT NULL);

ALTER TABLE public.companies
  DROP CONSTRAINT IF EXISTS companies_owner_platform_check,
  ADD CONSTRAINT companies_owner_platform_check
    CHECK (owner_type <> 'platform' OR tenant_id IS NULL);

ALTER TABLE public.companies
  DROP CONSTRAINT IF EXISTS companies_owner_app_check,
  ADD CONSTRAINT companies_owner_app_check
    CHECK (owner_type <> 'app' OR owner_id IS NOT NULL);

-- Optional: app ownership references system_modules
ALTER TABLE public.companies
  DROP CONSTRAINT IF EXISTS companies_owner_app_fk,
  ADD CONSTRAINT companies_owner_app_fk
    FOREIGN KEY (owner_id) REFERENCES public.system_modules(id) ON DELETE SET NULL;

-- Backfill existing rows to platform ownership for safety
UPDATE public.companies
SET owner_type = 'platform'
WHERE owner_type IS NULL;

-- Ensure RLS is enabled
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Remove permissive policy
DROP POLICY IF EXISTS "Enable all access to companies" ON public.companies;

-- Read access: tenant members can read tenant-owned rows; super admins can read all
DROP POLICY IF EXISTS "Tenant members can view tenant companies" ON public.companies;
CREATE POLICY "Tenant members can view tenant companies"
  ON public.companies
  FOR SELECT
  USING (
    public.is_current_user_super_admin()
    OR (owner_type = 'tenant' AND public.is_current_user_tenant_member(tenant_id))
  );

-- Write access: tenant admins manage tenant-owned rows
DROP POLICY IF EXISTS "Tenant admins can manage tenant companies" ON public.companies;
CREATE POLICY "Tenant admins can manage tenant companies"
  ON public.companies
  FOR ALL
  USING (
    owner_type = 'tenant'
    AND public.is_current_user_tenant_admin(tenant_id)
  )
  WITH CHECK (
    owner_type = 'tenant'
    AND public.is_current_user_tenant_admin(tenant_id)
  );

-- Write access: super admins manage any row
DROP POLICY IF EXISTS "Super admins can manage companies" ON public.companies;
CREATE POLICY "Super admins can manage companies"
  ON public.companies
  FOR ALL
  USING (public.is_current_user_super_admin())
  WITH CHECK (public.is_current_user_super_admin());

-- Indexes for ownership filters
CREATE INDEX IF NOT EXISTS idx_companies_tenant_id ON public.companies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_companies_owner_type ON public.companies(owner_type);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);

