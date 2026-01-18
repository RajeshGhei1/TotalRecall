-- Phase II: security fixes and missing RPCs

-- Tighten saved_reports access
DROP POLICY IF EXISTS "Allow all actions on saved_reports" ON public.saved_reports;
REVOKE ALL ON public.saved_reports FROM anon;

-- Ensure module_features has proper RLS
ALTER TABLE public.module_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view module features" ON public.module_features;
CREATE POLICY "Anyone can view module features"
  ON public.module_features
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Super admins can manage module features" ON public.module_features;
CREATE POLICY "Super admins can manage module features"
  ON public.module_features
  FOR ALL
  USING (public.is_current_user_super_admin())
  WITH CHECK (public.is_current_user_super_admin());

-- Missing RPC: check_module_access
CREATE OR REPLACE FUNCTION public.check_module_access(
  p_tenant_id uuid,
  p_module_name text,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE(has_access boolean, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resolved_user_id uuid := COALESCE(p_user_id, auth.uid());
  resolved_plan_id uuid;
BEGIN
  IF resolved_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  SELECT plan_id
    INTO resolved_plan_id
    FROM public.resolve_user_subscription(resolved_user_id, p_tenant_id)
    LIMIT 1;

  IF resolved_plan_id IS NULL THEN
    RETURN QUERY SELECT false, 'no_subscription';
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
      FROM public.module_permissions
     WHERE plan_id = resolved_plan_id
       AND module_name = p_module_name
       AND is_enabled = true
  ) THEN
    RETURN QUERY SELECT true, 'allowed';
  ELSE
    RETURN QUERY SELECT false, 'module_disabled';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.check_module_access(uuid, text, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.check_module_access(uuid, text, uuid) TO authenticated;

-- Missing RPC: execute_custom_query (restricted to super admins, SELECT-only)
CREATE OR REPLACE FUNCTION public.execute_custom_query(query_text text)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_current_user_super_admin() THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  IF query_text IS NULL OR length(trim(query_text)) = 0 THEN
    RAISE EXCEPTION 'Query text is required';
  END IF;

  IF position(';' IN query_text) > 0 THEN
    RAISE EXCEPTION 'Multiple statements are not allowed';
  END IF;

  IF lower(trim(query_text)) NOT LIKE 'select%' THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;

  RETURN QUERY EXECUTE format('SELECT to_jsonb(t) FROM (%s) AS t', query_text);
END;
$$;

REVOKE ALL ON FUNCTION public.execute_custom_query(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.execute_custom_query(text) TO authenticated;

