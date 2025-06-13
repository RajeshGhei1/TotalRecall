
-- Create a sequence for TR IDs to ensure uniqueness across all entities
CREATE SEQUENCE IF NOT EXISTS public.tr_id_sequence START 1000000;

-- Function to generate TR ID with entity prefix
CREATE OR REPLACE FUNCTION public.generate_tr_id(entity_prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_id bigint;
  tr_id text;
BEGIN
  -- Get next sequence value
  SELECT nextval('public.tr_id_sequence') INTO next_id;
  
  -- Format as TR-{PREFIX}-{PADDED_NUMBER}
  tr_id := 'TR-' || entity_prefix || '-' || lpad(next_id::text, 8, '0');
  
  RETURN tr_id;
END;
$$;

-- Add TR ID columns to existing tables
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS tr_id text UNIQUE;

ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS tr_id text UNIQUE;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tr_id text UNIQUE;

ALTER TABLE public.people 
ADD COLUMN IF NOT EXISTS tr_id text UNIQUE;

-- Create indexes for TR ID columns for fast lookups
CREATE INDEX IF NOT EXISTS idx_companies_tr_id ON public.companies(tr_id);
CREATE INDEX IF NOT EXISTS idx_tenants_tr_id ON public.tenants(tr_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tr_id ON public.profiles(tr_id);
CREATE INDEX IF NOT EXISTS idx_people_tr_id ON public.people(tr_id);

-- Functions to generate TR IDs for existing records without TR IDs
CREATE OR REPLACE FUNCTION public.backfill_tr_ids()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update companies without TR IDs
  UPDATE public.companies 
  SET tr_id = public.generate_tr_id('COM')
  WHERE tr_id IS NULL;
  
  -- Update tenants without TR IDs
  UPDATE public.tenants 
  SET tr_id = public.generate_tr_id('TEN')
  WHERE tr_id IS NULL;
  
  -- Update profiles without TR IDs
  UPDATE public.profiles 
  SET tr_id = public.generate_tr_id('USR')
  WHERE tr_id IS NULL;
  
  -- Update people without TR IDs
  UPDATE public.people 
  SET tr_id = public.generate_tr_id('PEO')
  WHERE tr_id IS NULL;
END;
$$;

-- Execute backfill for existing records
SELECT public.backfill_tr_ids();

-- Triggers to automatically assign TR IDs for new records
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

CREATE OR REPLACE FUNCTION public.assign_tr_id_tenants()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('TEN');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_tr_id_profiles()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('USR');
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_tr_id_people()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tr_id IS NULL THEN
    NEW.tr_id := public.generate_tr_id('PEO');
  END IF;
  RETURN NEW;
END;
$$;

-- Create triggers for automatic TR ID assignment
DROP TRIGGER IF EXISTS trigger_assign_tr_id_companies ON public.companies;
CREATE TRIGGER trigger_assign_tr_id_companies
  BEFORE INSERT ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_tr_id_companies();

DROP TRIGGER IF EXISTS trigger_assign_tr_id_tenants ON public.tenants;
CREATE TRIGGER trigger_assign_tr_id_tenants
  BEFORE INSERT ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_tr_id_tenants();

DROP TRIGGER IF EXISTS trigger_assign_tr_id_profiles ON public.profiles;
CREATE TRIGGER trigger_assign_tr_id_profiles
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_tr_id_profiles();

DROP TRIGGER IF EXISTS trigger_assign_tr_id_people ON public.people;
CREATE TRIGGER trigger_assign_tr_id_people
  BEFORE INSERT ON public.people
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_tr_id_people();

-- Function to search entities by TR ID across all tables
CREATE OR REPLACE FUNCTION public.find_entity_by_tr_id(p_tr_id text)
RETURNS TABLE(
  entity_type text,
  entity_id uuid,
  entity_name text,
  tr_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 'company'::text, c.id, c.name, c.tr_id
  FROM public.companies c
  WHERE c.tr_id = p_tr_id
  
  UNION ALL
  
  SELECT 'tenant'::text, t.id, t.name, t.tr_id
  FROM public.tenants t
  WHERE t.tr_id = p_tr_id
  
  UNION ALL
  
  SELECT 'user'::text, p.id, COALESCE(p.full_name, p.email), p.tr_id
  FROM public.profiles p
  WHERE p.tr_id = p_tr_id
  
  UNION ALL
  
  SELECT 'person'::text, pe.id, (pe.first_name || ' ' || pe.last_name), pe.tr_id
  FROM public.people pe
  WHERE pe.tr_id = p_tr_id;
END;
$$;

-- Add constraints to ensure TR IDs follow the correct format
ALTER TABLE public.companies 
ADD CONSTRAINT chk_companies_tr_id_format 
CHECK (tr_id ~ '^TR-COM-[0-9]{8}$');

ALTER TABLE public.tenants 
ADD CONSTRAINT chk_tenants_tr_id_format 
CHECK (tr_id ~ '^TR-TEN-[0-9]{8}$');

ALTER TABLE public.profiles 
ADD CONSTRAINT chk_profiles_tr_id_format 
CHECK (tr_id ~ '^TR-USR-[0-9]{8}$');

ALTER TABLE public.people 
ADD CONSTRAINT chk_people_tr_id_format 
CHECK (tr_id ~ '^TR-PEO-[0-9]{8}$');
