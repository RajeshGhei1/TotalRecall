-- Phase 2: audit logging for company bulk imports

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to log bulk import events
CREATE OR REPLACE FUNCTION public.log_companies_bulk_import(
  p_tenant_id uuid,
  p_owner_type text,
  p_total integer,
  p_inserted integer,
  p_skipped integer,
  p_errors jsonb DEFAULT '[]'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    tenant_id,
    action,
    entity_type,
    entity_id,
    additional_context
  ) VALUES (
    auth.uid(),
    p_tenant_id,
    'companies.bulk_import',
    'companies',
    NULL,
    jsonb_build_object(
      'owner_type', p_owner_type,
      'total', p_total,
      'inserted', p_inserted,
      'skipped', p_skipped,
      'errors', p_errors
    )
  );
END;
$$;

