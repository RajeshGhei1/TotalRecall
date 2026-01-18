
-- Remove the industry column from companies table as it's redundant
-- We now use industry1, industry2, industry3 for hierarchical industry classification
ALTER TABLE public.companies DROP COLUMN IF EXISTS industry;
