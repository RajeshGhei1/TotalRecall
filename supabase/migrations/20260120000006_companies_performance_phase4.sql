-- Phase 4: performance & observability for companies analytics

-- Rate limit event tracking
CREATE TABLE IF NOT EXISTS public.rate_limit_events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_user_action_created
  ON public.rate_limit_events(user_id, action, created_at DESC);

ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their rate limit events" ON public.rate_limit_events;
CREATE POLICY "Users can insert their rate limit events"
  ON public.rate_limit_events
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Super admins can view rate limit events" ON public.rate_limit_events;
CREATE POLICY "Super admins can view rate limit events"
  ON public.rate_limit_events
  FOR SELECT
  USING (public.is_current_user_super_admin());

CREATE OR REPLACE FUNCTION public.enforce_rate_limit(p_action text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rate_limit integer := 100;
  recent_count integer := 0;
BEGIN
  SELECT setting_value::integer
  INTO rate_limit
  FROM public.global_settings
  WHERE setting_key = 'rate_limit_requests_per_minute'
  LIMIT 1;

  IF rate_limit IS NULL THEN
    rate_limit := 100;
  END IF;

  SELECT COUNT(*)
  INTO recent_count
  FROM public.rate_limit_events
  WHERE user_id = auth.uid()
    AND action = p_action
    AND created_at >= now() - interval '1 minute';

  IF recent_count >= rate_limit THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before retrying.';
  END IF;

  INSERT INTO public.rate_limit_events (user_id, action)
  VALUES (auth.uid(), p_action);
END;
$$;

-- Analytics RPC helpers
CREATE OR REPLACE FUNCTION public.get_companies_summary(
  p_scope text,
  p_tenant_id uuid,
  p_filters jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH scoped_companies AS (
  SELECT c.*
  FROM public.companies c
  WHERE (p_scope = 'all' OR c.owner_type = p_scope)
    AND (
      p_tenant_id IS NULL
      OR (
        (c.owner_type = 'tenant' AND c.tenant_id = p_tenant_id)
        OR (c.owner_type IN ('platform', 'app') AND EXISTS (
          SELECT 1
          FROM public.company_data_allocations a
          WHERE a.company_id = c.id
            AND a.tenant_id = p_tenant_id
        ))
      )
    )
    AND (coalesce(p_filters->>'searchTerm', '') = ''
      OR c.name ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.domain ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.email ILIKE '%' || (p_filters->>'searchTerm') || '%')
    AND (coalesce(p_filters->>'industry', '') = ''
      OR c.industry1 = (p_filters->>'industry')
      OR c.industry2 = (p_filters->>'industry')
      OR c.industry3 = (p_filters->>'industry'))
    AND (coalesce(p_filters->>'location', '') = '' OR c.location = (p_filters->>'location'))
    AND (coalesce(p_filters->>'size', '') = '' OR c.size = (p_filters->>'size'))
    AND (coalesce(p_filters->>'hierarchyLevel', '') = '' OR c.hierarchy_level::text = (p_filters->>'hierarchyLevel'))
    AND (coalesce(p_filters#>>'{dateRange,from}', '') = '' OR c.created_at >= (p_filters#>>'{dateRange,from}')::timestamptz)
    AND (coalesce(p_filters#>>'{dateRange,to}', '') = '' OR c.created_at <= (p_filters#>>'{dateRange,to}')::timestamptz)
)
SELECT jsonb_build_object(
  'total', count(*),
  'withWebsite', count(*) FILTER (WHERE coalesce(c.website, c.domain) IS NOT NULL AND btrim(coalesce(c.website, c.domain)) <> ''),
  'withDescription', count(*) FILTER (WHERE c.description IS NOT NULL AND btrim(c.description) <> '')
)
FROM scoped_companies c;
$$;

CREATE OR REPLACE FUNCTION public.get_companies_distribution(
  p_scope text,
  p_tenant_id uuid,
  p_dimension text,
  p_filters jsonb DEFAULT '{}'::jsonb,
  p_top integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH scoped_companies AS (
  SELECT c.*
  FROM public.companies c
  WHERE (p_scope = 'all' OR c.owner_type = p_scope)
    AND (
      p_tenant_id IS NULL
      OR (
        (c.owner_type = 'tenant' AND c.tenant_id = p_tenant_id)
        OR (c.owner_type IN ('platform', 'app') AND EXISTS (
          SELECT 1
          FROM public.company_data_allocations a
          WHERE a.company_id = c.id
            AND a.tenant_id = p_tenant_id
        ))
      )
    )
    AND (coalesce(p_filters->>'searchTerm', '') = ''
      OR c.name ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.domain ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.email ILIKE '%' || (p_filters->>'searchTerm') || '%')
    AND (coalesce(p_filters->>'industry', '') = ''
      OR c.industry1 = (p_filters->>'industry')
      OR c.industry2 = (p_filters->>'industry')
      OR c.industry3 = (p_filters->>'industry'))
    AND (coalesce(p_filters->>'location', '') = '' OR c.location = (p_filters->>'location'))
    AND (coalesce(p_filters->>'size', '') = '' OR c.size = (p_filters->>'size'))
    AND (coalesce(p_filters->>'hierarchyLevel', '') = '' OR c.hierarchy_level::text = (p_filters->>'hierarchyLevel'))
    AND (coalesce(p_filters#>>'{dateRange,from}', '') = '' OR c.created_at >= (p_filters#>>'{dateRange,from}')::timestamptz)
    AND (coalesce(p_filters#>>'{dateRange,to}', '') = '' OR c.created_at <= (p_filters#>>'{dateRange,to}')::timestamptz)
),
dimensioned AS (
  SELECT CASE
    WHEN p_dimension = 'industry1' THEN c.industry1
    WHEN p_dimension = 'size' THEN c.size
    WHEN p_dimension = 'location' THEN c.location
    WHEN p_dimension = 'country' THEN c.country
    WHEN p_dimension = 'region' THEN c.region
    ELSE NULL
  END AS name
  FROM scoped_companies c
)
SELECT COALESCE(
  jsonb_agg(jsonb_build_object('name', name, 'count', count) ORDER BY count DESC),
  '[]'::jsonb
)
FROM (
  SELECT name, COUNT(*) AS count
  FROM dimensioned
  WHERE name IS NOT NULL AND btrim(name) <> ''
  GROUP BY name
  ORDER BY count DESC
  LIMIT p_top
) results;
$$;

CREATE OR REPLACE FUNCTION public.get_companies_growth(
  p_scope text,
  p_tenant_id uuid,
  p_filters jsonb DEFAULT '{}'::jsonb,
  p_months integer DEFAULT 12
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH date_bounds AS (
  SELECT
    COALESCE((p_filters#>>'{dateRange,from}')::timestamptz, now() - (p_months || ' months')::interval) AS start_date,
    COALESCE((p_filters#>>'{dateRange,to}')::timestamptz, now()) AS end_date
),
scoped_companies AS (
  SELECT c.*
  FROM public.companies c, date_bounds d
  WHERE c.created_at >= d.start_date
    AND c.created_at <= d.end_date
    AND (p_scope = 'all' OR c.owner_type = p_scope)
    AND (
      p_tenant_id IS NULL
      OR (
        (c.owner_type = 'tenant' AND c.tenant_id = p_tenant_id)
        OR (c.owner_type IN ('platform', 'app') AND EXISTS (
          SELECT 1
          FROM public.company_data_allocations a
          WHERE a.company_id = c.id
            AND a.tenant_id = p_tenant_id
        ))
      )
    )
),
monthly_counts AS (
  SELECT date_trunc('month', created_at)::date AS month, COUNT(*) AS total
  FROM scoped_companies
  GROUP BY month
  ORDER BY month
),
with_cumulative AS (
  SELECT month,
         total,
         SUM(total) OVER (ORDER BY month) AS cumulative
  FROM monthly_counts
)
SELECT COALESCE(
  jsonb_agg(jsonb_build_object(
    'period', to_char(month, 'Mon YYYY'),
    'total', total,
    'cumulative', cumulative
  ) ORDER BY month),
  '[]'::jsonb
)
FROM with_cumulative;
$$;

CREATE OR REPLACE FUNCTION public.get_companies_data_completeness(
  p_scope text,
  p_tenant_id uuid,
  p_filters jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH scoped_companies AS (
  SELECT c.*
  FROM public.companies c
  WHERE (p_scope = 'all' OR c.owner_type = p_scope)
    AND (
      p_tenant_id IS NULL
      OR (
        (c.owner_type = 'tenant' AND c.tenant_id = p_tenant_id)
        OR (c.owner_type IN ('platform', 'app') AND EXISTS (
          SELECT 1
          FROM public.company_data_allocations a
          WHERE a.company_id = c.id
            AND a.tenant_id = p_tenant_id
        ))
      )
    )
    AND (coalesce(p_filters->>'searchTerm', '') = ''
      OR c.name ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.domain ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.email ILIKE '%' || (p_filters->>'searchTerm') || '%')
    AND (coalesce(p_filters->>'industry', '') = ''
      OR c.industry1 = (p_filters->>'industry')
      OR c.industry2 = (p_filters->>'industry')
      OR c.industry3 = (p_filters->>'industry'))
    AND (coalesce(p_filters->>'location', '') = '' OR c.location = (p_filters->>'location'))
    AND (coalesce(p_filters->>'size', '') = '' OR c.size = (p_filters->>'size'))
    AND (coalesce(p_filters->>'hierarchyLevel', '') = '' OR c.hierarchy_level::text = (p_filters->>'hierarchyLevel'))
    AND (coalesce(p_filters#>>'{dateRange,from}', '') = '' OR c.created_at >= (p_filters#>>'{dateRange,from}')::timestamptz)
    AND (coalesce(p_filters#>>'{dateRange,to}', '') = '' OR c.created_at <= (p_filters#>>'{dateRange,to}')::timestamptz)
),
counts AS (
  SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE email IS NOT NULL AND btrim(email) <> '') AS email,
    COUNT(*) FILTER (WHERE phone IS NOT NULL AND btrim(phone) <> '') AS phone,
    COUNT(*) FILTER (WHERE website IS NOT NULL AND btrim(website) <> '') AS website,
    COUNT(*) FILTER (WHERE description IS NOT NULL AND btrim(description) <> '') AS description,
    COUNT(*) FILTER (WHERE COALESCE(industry1, industry2, industry3, industry) IS NOT NULL AND btrim(COALESCE(industry1, industry2, industry3, industry)) <> '') AS industry,
    COUNT(*) FILTER (WHERE size IS NOT NULL AND btrim(size) <> '') AS size,
    COUNT(*) FILTER (WHERE location IS NOT NULL AND btrim(location) <> '') AS location,
    COUNT(*) FILTER (WHERE linkedin IS NOT NULL AND btrim(linkedin) <> '') AS linkedin,
    COUNT(*) FILTER (WHERE founded IS NOT NULL) AS founded,
    COUNT(*) FILTER (WHERE country IS NOT NULL AND btrim(country) <> '') AS country
  FROM scoped_companies
)
SELECT jsonb_build_array(
  jsonb_build_object('field', 'email', 'label', 'Email', 'filled', email, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(email::numeric / total * 100) END),
  jsonb_build_object('field', 'phone', 'label', 'Phone', 'filled', phone, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(phone::numeric / total * 100) END),
  jsonb_build_object('field', 'website', 'label', 'Website', 'filled', website, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(website::numeric / total * 100) END),
  jsonb_build_object('field', 'description', 'label', 'Description', 'filled', description, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(description::numeric / total * 100) END),
  jsonb_build_object('field', 'industry', 'label', 'Industry', 'filled', industry, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(industry::numeric / total * 100) END),
  jsonb_build_object('field', 'size', 'label', 'Company Size', 'filled', size, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(size::numeric / total * 100) END),
  jsonb_build_object('field', 'location', 'label', 'Location', 'filled', location, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(location::numeric / total * 100) END),
  jsonb_build_object('field', 'linkedin', 'label', 'LinkedIn', 'filled', linkedin, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(linkedin::numeric / total * 100) END),
  jsonb_build_object('field', 'founded', 'label', 'Founded Year', 'filled', founded, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(founded::numeric / total * 100) END),
  jsonb_build_object('field', 'country', 'label', 'Country', 'filled', country, 'total', total, 'percentage', CASE WHEN total = 0 THEN 0 ELSE round(country::numeric / total * 100) END)
)
FROM counts;
$$;

CREATE OR REPLACE FUNCTION public.get_companies_hierarchy_stats(
  p_scope text,
  p_tenant_id uuid,
  p_filters jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH scoped_companies AS (
  SELECT c.*
  FROM public.companies c
  WHERE (p_scope = 'all' OR c.owner_type = p_scope)
    AND (
      p_tenant_id IS NULL
      OR (
        (c.owner_type = 'tenant' AND c.tenant_id = p_tenant_id)
        OR (c.owner_type IN ('platform', 'app') AND EXISTS (
          SELECT 1
          FROM public.company_data_allocations a
          WHERE a.company_id = c.id
            AND a.tenant_id = p_tenant_id
        ))
      )
    )
    AND (coalesce(p_filters->>'searchTerm', '') = ''
      OR c.name ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.domain ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.email ILIKE '%' || (p_filters->>'searchTerm') || '%')
    AND (coalesce(p_filters->>'industry', '') = ''
      OR c.industry1 = (p_filters->>'industry')
      OR c.industry2 = (p_filters->>'industry')
      OR c.industry3 = (p_filters->>'industry'))
    AND (coalesce(p_filters->>'location', '') = '' OR c.location = (p_filters->>'location'))
    AND (coalesce(p_filters->>'size', '') = '' OR c.size = (p_filters->>'size'))
    AND (coalesce(p_filters->>'hierarchyLevel', '') = '' OR c.hierarchy_level::text = (p_filters->>'hierarchyLevel'))
    AND (coalesce(p_filters#>>'{dateRange,from}', '') = '' OR c.created_at >= (p_filters#>>'{dateRange,from}')::timestamptz)
    AND (coalesce(p_filters#>>'{dateRange,to}', '') = '' OR c.created_at <= (p_filters#>>'{dateRange,to}')::timestamptz)
),
level_counts AS (
  SELECT hierarchy_level AS level, COUNT(*) AS count
  FROM scoped_companies
  GROUP BY hierarchy_level
)
SELECT jsonb_build_object(
  'levels', COALESCE(jsonb_agg(jsonb_build_object('level', level, 'count', count) ORDER BY level), '[]'::jsonb),
  'parentCount', COUNT(*) FILTER (WHERE parent_company_id IS NULL),
  'subsidiaryCount', COUNT(*) FILTER (WHERE parent_company_id IS NOT NULL),
  'maxDepth', COALESCE(MAX(hierarchy_level), 0),
  'groupCount', COUNT(*) FILTER (WHERE company_group_name IS NOT NULL AND btrim(company_group_name) <> '')
)
FROM scoped_companies
LEFT JOIN level_counts ON true;
$$;

CREATE OR REPLACE FUNCTION public.get_companies_people_stats(
  p_scope text,
  p_tenant_id uuid,
  p_filters jsonb DEFAULT '{}'::jsonb,
  p_top integer DEFAULT 10
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH scoped_companies AS (
  SELECT c.*
  FROM public.companies c
  WHERE (p_scope = 'all' OR c.owner_type = p_scope)
    AND (
      p_tenant_id IS NULL
      OR (
        (c.owner_type = 'tenant' AND c.tenant_id = p_tenant_id)
        OR (c.owner_type IN ('platform', 'app') AND EXISTS (
          SELECT 1
          FROM public.company_data_allocations a
          WHERE a.company_id = c.id
            AND a.tenant_id = p_tenant_id
        ))
      )
    )
    AND (coalesce(p_filters->>'searchTerm', '') = ''
      OR c.name ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.domain ILIKE '%' || (p_filters->>'searchTerm') || '%'
      OR c.email ILIKE '%' || (p_filters->>'searchTerm') || '%')
    AND (coalesce(p_filters->>'industry', '') = ''
      OR c.industry1 = (p_filters->>'industry')
      OR c.industry2 = (p_filters->>'industry')
      OR c.industry3 = (p_filters->>'industry'))
    AND (coalesce(p_filters->>'location', '') = '' OR c.location = (p_filters->>'location'))
    AND (coalesce(p_filters->>'size', '') = '' OR c.size = (p_filters->>'size'))
    AND (coalesce(p_filters->>'hierarchyLevel', '') = '' OR c.hierarchy_level::text = (p_filters->>'hierarchyLevel'))
    AND (coalesce(p_filters#>>'{dateRange,from}', '') = '' OR c.created_at >= (p_filters#>>'{dateRange,from}')::timestamptz)
    AND (coalesce(p_filters#>>'{dateRange,to}', '') = '' OR c.created_at <= (p_filters#>>'{dateRange,to}')::timestamptz)
),
relationships AS (
  SELECT cr.company_id, cr.person_id
  FROM public.company_relationships cr
  JOIN scoped_companies sc ON sc.id = cr.company_id
),
top_companies AS (
  SELECT sc.id, sc.name, COUNT(*) AS count
  FROM relationships r
  JOIN scoped_companies sc ON sc.id = r.company_id
  GROUP BY sc.id, sc.name
  ORDER BY COUNT(*) DESC
  LIMIT p_top
)
SELECT jsonb_build_object(
  'companyCount', COUNT(DISTINCT r.company_id),
  'peopleCount', COUNT(DISTINCT r.person_id),
  'relationshipCount', COUNT(*) ,
  'topCompanies', COALESCE(jsonb_agg(jsonb_build_object('id', id, 'name', name, 'count', count) ORDER BY count DESC), '[]'::jsonb)
)
FROM relationships r
LEFT JOIN top_companies tc ON true;
$$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_companies_owner_type_tenant_id
  ON public.companies(owner_type, tenant_id);

CREATE INDEX IF NOT EXISTS idx_companies_created_at
  ON public.companies(created_at);

CREATE INDEX IF NOT EXISTS idx_company_relationships_company_id
  ON public.company_relationships(company_id);

CREATE INDEX IF NOT EXISTS idx_company_relationships_person_id
  ON public.company_relationships(person_id);

