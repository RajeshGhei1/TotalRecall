-- Phase 2: enforce unique CIN and assign platform TR IDs

-- Ensure TR ID sequence exists
CREATE SEQUENCE IF NOT EXISTS public.tr_id_sequence;

-- Generator for platform IDs
CREATE OR REPLACE FUNCTION public.generate_tr_id(entity_prefix text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  next_id bigint;
  tr_id text;
BEGIN
  SELECT nextval('public.tr_id_sequence') INTO next_id;
  tr_id := 'TR-' || entity_prefix || '-' || lpad(next_id::text, 8, '0');
  RETURN tr_id;
END;
$$;

-- Assign TR IDs on insert
CREATE OR REPLACE FUNCTION public.assign_tr_id_companies()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('COM');
  END IF;
  RETURN NEW;
END;
$$;

-- Backfill existing companies without TR IDs
UPDATE public.companies
SET tr_id = public.generate_tr_id('COM')
WHERE tr_id IS NULL;

-- Normalize empty CINs to NULL to avoid unique index conflicts
UPDATE public.companies
SET cin = NULL
WHERE cin IS NOT NULL
  AND btrim(cin) = '';

-- Deduplicate CINs (case-insensitive) by clearing CIN on newer duplicates
WITH ranked AS (
  SELECT id,
         row_number() OVER (PARTITION BY lower(cin) ORDER BY created_at ASC, id ASC) AS rn
  FROM public.companies
  WHERE cin IS NOT NULL
)
UPDATE public.companies c
SET cin = NULL
FROM ranked r
WHERE c.id = r.id
  AND r.rn > 1;

-- Ensure trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trigger_assign_tr_id_companies'
  ) THEN
    CREATE TRIGGER trigger_assign_tr_id_companies
    BEFORE INSERT ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.assign_tr_id_companies();
  END IF;
END $$;

-- Unique TR ID
CREATE UNIQUE INDEX IF NOT EXISTS companies_tr_id_key ON public.companies (tr_id);

-- Unique CIN (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS companies_cin_key
  ON public.companies (lower(cin))
  WHERE cin IS NOT NULL;

