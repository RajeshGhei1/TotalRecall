-- Phase 2: server-side validation for company imports

CREATE OR REPLACE FUNCTION public.validate_companies_import(p_rows jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row jsonb;
  idx integer := 0;
  errors jsonb := '[]'::jsonb;
  duplicates jsonb := '[]'::jsonb;
  seen_cins text[] := ARRAY[]::text[];
  existing_cins text[];
  cin_val text;
  name_val text;
BEGIN
  SELECT array_agg(lower(cin)) INTO existing_cins
  FROM public.companies
  WHERE cin IS NOT NULL;

  IF existing_cins IS NULL THEN
    existing_cins := ARRAY[]::text[];
  END IF;

  FOR row IN SELECT * FROM jsonb_array_elements(p_rows)
  LOOP
    idx := idx + 1;
    name_val := trim(coalesce(row->>'name', ''));
    cin_val := lower(trim(coalesce(row->>'cin', '')));

    IF name_val = '' THEN
      errors := errors || jsonb_build_array(jsonb_build_object(
        'row', idx,
        'field', 'name',
        'message', 'Company name is required'
      ));
    END IF;

    IF cin_val = '' THEN
      errors := errors || jsonb_build_array(jsonb_build_object(
        'row', idx,
        'field', 'cin',
        'message', 'Company CIN is required'
      ));
    ELSE
      IF cin_val = ANY(seen_cins) THEN
        duplicates := duplicates || jsonb_build_array(jsonb_build_object(
          'row', idx,
          'field', 'cin',
          'message', 'Duplicate CIN in import batch',
          'cin', cin_val
        ));
      ELSIF cin_val = ANY(existing_cins) THEN
        duplicates := duplicates || jsonb_build_array(jsonb_build_object(
          'row', idx,
          'field', 'cin',
          'message', 'CIN already exists',
          'cin', cin_val
        ));
      END IF;

      seen_cins := array_append(seen_cins, cin_val);
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'errors', errors,
    'duplicates', duplicates
  );
END;
$$;

