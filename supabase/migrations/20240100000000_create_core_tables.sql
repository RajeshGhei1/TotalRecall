-- Core baseline tables and enums required by subsequent migrations
-- This mirrors the live schema for foundational entities.

CREATE TYPE public.application_status AS ENUM (
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected'
);

CREATE TYPE public.user_role AS ENUM (
  'user',
  'tenant_admin',
  'super_admin'
);

CREATE TABLE IF NOT EXISTS public.companies (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  domain text,
  description text,
  website text,
  industry text,
  size text,
  location text,
  email text,
  phone text,
  linkedin text,
  twitter text,
  facebook text,
  founded integer,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  cin text,
  companystatus text,
  registeredofficeaddress text,
  registrationdate timestamptz,
  registeredemailaddress text,
  noofdirectives text,
  globalregion text,
  country text,
  region text,
  holocation text,
  industry1 text,
  industry2 text,
  industry3 text,
  companysector text,
  companytype text,
  entitytype text,
  noofemployee text,
  segmentaspernumberofemployees text,
  turnover text,
  segmentasperturnover text,
  turnoveryear text,
  yearofestablishment text,
  paidupcapital text,
  segmentasperpaidupcapital text,
  areaofspecialize text,
  serviceline text,
  verticles text,
  companyprofile text,
  parent_company_id uuid,
  company_group_name text,
  hierarchy_level integer DEFAULT 0,
  tr_id text,
  CONSTRAINT check_not_self_parent CHECK (id <> parent_company_id),
  CONSTRAINT chk_companies_tr_id_format CHECK (tr_id ~ '^TR-COM-[0-9]{8}$'),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.people (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  type text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  location text,
  tr_id text,
  CONSTRAINT chk_people_tr_id_format CHECK (tr_id ~ '^TR-PEO-[0-9]{8}$'),
  CONSTRAINT people_type_check CHECK (type IN ('talent', 'contact')),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  domain text,
  registration_date timestamptz,
  tr_id text,
  CONSTRAINT chk_tenants_tr_id_format CHECK (tr_id ~ '^TR-TEN-[0-9]{8}$'),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  password_last_changed timestamptz DEFAULT now(),
  password_meets_policy boolean DEFAULT false,
  policy_check_required boolean DEFAULT true,
  last_policy_check timestamptz,
  tr_id text,
  CONSTRAINT chk_profiles_tr_id_format CHECK (tr_id ~ '^TR-USR-[0-9]{8}$'),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_tenants (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_role text DEFAULT 'user'::text,
  manager_id uuid,
  department text,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.applications (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  job_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  status public.application_status DEFAULT 'applied'::public.application_status,
  applied_at timestamptz DEFAULT now() NOT NULL,
  cover_letter text,
  ai_match_score numeric,
  ai_match_reasons jsonb DEFAULT '[]'::jsonb,
  recruiter_notes text,
  interview_feedback jsonb DEFAULT '[]'::jsonb,
  next_action text,
  next_action_date date,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  tenant_id uuid,
  CONSTRAINT applications_ai_match_score_check CHECK ((ai_match_score >= 0) AND (ai_match_score <= 100)),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.saved_reports (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  entity text NOT NULL,
  columns jsonb DEFAULT '[]'::jsonb NOT NULL,
  filters jsonb DEFAULT '[]'::jsonb NOT NULL,
  group_by text,
  aggregation jsonb DEFAULT '[]'::jsonb,
  visualization_type text DEFAULT 'table'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.form_definitions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  tenant_id uuid,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_active boolean DEFAULT true NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  visibility_scope text DEFAULT 'global'::text,
  required_modules jsonb DEFAULT '[]'::jsonb,
  access_level text DEFAULT 'authenticated'::text,
  CONSTRAINT form_definitions_access_level_check CHECK (access_level IN ('public', 'authenticated', 'role_based')),
  CONSTRAINT form_definitions_visibility_scope_check CHECK (visibility_scope IN ('global', 'tenant_specific', 'module_specific')),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_interactions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid,
  tenant_id uuid,
  interaction_type text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  session_id text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.dropdown_option_categories (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.dropdown_options (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  category_id uuid NOT NULL,
  value text NOT NULL,
  label text NOT NULL,
  is_default boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.module_pricing (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  module_name text NOT NULL,
  base_price_monthly numeric(10,2) DEFAULT 0 NOT NULL,
  base_price_annually numeric(10,2) DEFAULT 0 NOT NULL,
  tier_pricing jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.company_relationships (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  person_id uuid NOT NULL,
  company_id uuid,
  role text NOT NULL,
  relationship_type text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  reports_to uuid,
  branch_office_id uuid,
  CONSTRAINT company_relationships_relationship_type_check CHECK (relationship_type IN ('employment', 'business_contact')),
  PRIMARY KEY (id)
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

