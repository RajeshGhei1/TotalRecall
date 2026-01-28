-- Phase 2.5: transactional bulk import RPC for companies

CREATE OR REPLACE FUNCTION public.import_companies_bulk(
  p_rows jsonb,
  p_owner_type text,
  p_tenant_id uuid,
  p_skip_duplicates boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  errors jsonb := '[]'::jsonb;
  duplicates jsonb := '[]'::jsonb;
  owner_type text := lower(coalesce(p_owner_type, ''));
  total_count integer := 0;
  inserted_count integer := 0;
  skipped_count integer := 0;
  name_val text;
  cin_val text;
  row_record record;
  status_text text;
BEGIN
  IF p_rows IS NULL OR jsonb_typeof(p_rows) <> 'array' THEN
    RAISE EXCEPTION 'p_rows must be a jsonb array';
  END IF;

  total_count := jsonb_array_length(p_rows);

  IF owner_type NOT IN ('tenant', 'platform', 'app') THEN
    RAISE EXCEPTION 'Invalid owner_type';
  END IF;

  IF owner_type = 'tenant' AND p_tenant_id IS NULL THEN
    RAISE EXCEPTION 'tenant_id is required for tenant ownership';
  END IF;

  IF owner_type = 'platform' AND p_tenant_id IS NOT NULL THEN
    RAISE EXCEPTION 'tenant_id must be null for platform ownership';
  END IF;

  CREATE TEMP TABLE tmp_companies_import (
    row_index integer,
    data jsonb,
    cin text
  ) ON COMMIT DROP;

  INSERT INTO tmp_companies_import (row_index, data, cin)
  SELECT ordinality, value, lower(trim(coalesce(value->>'cin', '')))
  FROM jsonb_array_elements(p_rows) WITH ORDINALITY;

  FOR row_record IN
    SELECT row_index, data, cin
    FROM tmp_companies_import
  LOOP
    name_val := trim(coalesce(row_record.data->>'name', ''));
    cin_val := row_record.cin;

    IF name_val = '' THEN
      errors := errors || jsonb_build_array(jsonb_build_object(
        'row', row_record.row_index,
        'field', 'name',
        'message', 'Company name is required'
      ));
    END IF;

    IF cin_val = '' THEN
      errors := errors || jsonb_build_array(jsonb_build_object(
        'row', row_record.row_index,
        'field', 'cin',
        'message', 'Company CIN is required'
      ));
    END IF;
  END LOOP;

  duplicates := duplicates || coalesce((
    SELECT jsonb_agg(jsonb_build_object(
      'row', row_index,
      'field', 'cin',
      'message', 'Duplicate CIN in import batch',
      'cin', cin
    ))
    FROM (
      SELECT row_index, cin
      FROM tmp_companies_import
      WHERE cin <> ''
        AND cin IN (
          SELECT cin
          FROM tmp_companies_import
          WHERE cin <> ''
          GROUP BY cin
          HAVING count(*) > 1
        )
    ) dup
  ), '[]'::jsonb);

  duplicates := duplicates || coalesce((
    SELECT jsonb_agg(jsonb_build_object(
      'row', t.row_index,
      'field', 'cin',
      'message', 'CIN already exists',
      'cin', t.cin
    ))
    FROM tmp_companies_import t
    WHERE t.cin <> ''
      AND EXISTS (
        SELECT 1
        FROM public.companies c
        WHERE lower(c.cin) = t.cin
      )
  ), '[]'::jsonb);

  IF jsonb_array_length(errors) > 0 THEN
    PERFORM public.log_companies_bulk_import(
      p_tenant_id,
      owner_type,
      total_count,
      0,
      total_count,
      errors
    );

    RETURN jsonb_build_object(
      'status', 'failed',
      'total', total_count,
      'inserted', 0,
      'skipped', total_count,
      'errors', errors,
      'duplicates', duplicates
    );
  END IF;

  IF jsonb_array_length(duplicates) > 0 AND NOT p_skip_duplicates THEN
    PERFORM public.log_companies_bulk_import(
      p_tenant_id,
      owner_type,
      total_count,
      0,
      jsonb_array_length(duplicates),
      duplicates
    );

    RETURN jsonb_build_object(
      'status', 'failed',
      'total', total_count,
      'inserted', 0,
      'skipped', jsonb_array_length(duplicates),
      'errors', '[]'::jsonb,
      'duplicates', duplicates
    );
  END IF;

  IF jsonb_array_length(duplicates) > 0 THEN
    DELETE FROM tmp_companies_import
    WHERE cin <> ''
      AND cin IN (
        SELECT cin
        FROM tmp_companies_import
        GROUP BY cin
        HAVING count(*) > 1
      )
      AND row_index NOT IN (
        SELECT min(row_index)
        FROM tmp_companies_import
        GROUP BY cin
        HAVING count(*) > 1
      );

    DELETE FROM tmp_companies_import t
    WHERE t.cin <> ''
      AND EXISTS (
        SELECT 1
        FROM public.companies c
        WHERE lower(c.cin) = t.cin
      );
  END IF;

  INSERT INTO public.companies (
    name,
    domain,
    website,
    email,
    phone,
    description,
    location,
    size,
    founded,
    linkedin,
    twitter,
    facebook,
    cin,
    companystatus,
    registeredofficeaddress,
    registrationdate,
    registeredemailaddress,
    noofdirectives,
    globalregion,
    country,
    region,
    holocation,
    industry1,
    industry2,
    industry3,
    companysector,
    companytype,
    entitytype,
    noofemployee,
    segmentaspernumberofemployees,
    turnover,
    segmentasperturnover,
    turnoveryear,
    yearofestablishment,
    paidupcapital,
    segmentasperpaidupcapital,
    companyprofile,
    areaofspecialize,
    serviceline,
    verticles,
    parent_company_id,
    company_group_name,
    hierarchy_level,
    owner_type,
    tenant_id
  )
  SELECT
    coalesce(data->>'name', ''),
    coalesce(data->>'domain', ''),
    coalesce(data->>'website', ''),
    nullif(data->>'email', ''),
    nullif(data->>'phone', ''),
    nullif(data->>'description', ''),
    nullif(data->>'location', ''),
    nullif(data->>'size', ''),
    nullif(data->>'founded', '')::integer,
    nullif(data->>'linkedin', ''),
    nullif(data->>'twitter', ''),
    nullif(data->>'facebook', ''),
    nullif(data->>'cin', ''),
    nullif(data->>'companystatus', ''),
    nullif(data->>'registeredofficeaddress', ''),
    nullif(data->>'registrationdate', '')::timestamptz,
    nullif(data->>'registeredemailaddress', ''),
    nullif(data->>'noofdirectives', ''),
    nullif(data->>'globalregion', ''),
    nullif(data->>'country', ''),
    nullif(data->>'region', ''),
    nullif(data->>'holocation', ''),
    nullif(data->>'industry1', ''),
    nullif(data->>'industry2', ''),
    nullif(data->>'industry3', ''),
    nullif(data->>'companysector', ''),
    nullif(data->>'companytype', ''),
    nullif(data->>'entitytype', ''),
    nullif(data->>'noofemployee', ''),
    nullif(data->>'segmentaspernumberofemployees', ''),
    nullif(data->>'turnover', ''),
    nullif(data->>'segmentasperturnover', ''),
    nullif(data->>'turnoveryear', ''),
    nullif(data->>'yearofestablishment', ''),
    nullif(data->>'paidupcapital', ''),
    nullif(data->>'segmentasperpaidupcapital', ''),
    nullif(data->>'companyprofile', ''),
    nullif(data->>'areaofspecialize', ''),
    nullif(data->>'serviceline', ''),
    nullif(data->>'verticles', ''),
    nullif(data->>'parent_company_id', '')::uuid,
    nullif(data->>'company_group_name', ''),
    coalesce(nullif(data->>'hierarchy_level', '')::integer, 0),
    owner_type,
    p_tenant_id
  FROM tmp_companies_import;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  skipped_count := total_count - inserted_count;
  status_text := CASE WHEN skipped_count > 0 THEN 'partial' ELSE 'completed' END;

  PERFORM public.log_companies_bulk_import(
    p_tenant_id,
    owner_type,
    total_count,
    inserted_count,
    skipped_count,
    duplicates
  );

  RETURN jsonb_build_object(
    'status', status_text,
    'total', total_count,
    'inserted', inserted_count,
    'skipped', skipped_count,
    'errors', errors,
    'duplicates', duplicates
  );
END;
$$;

