
-- Add parent company relationship and group structure fields to companies table
ALTER TABLE public.companies 
ADD COLUMN parent_company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
ADD COLUMN company_group_name text,
ADD COLUMN hierarchy_level integer DEFAULT 0;

-- Create index for better performance on parent company queries
CREATE INDEX idx_companies_parent_company_id ON public.companies(parent_company_id);
CREATE INDEX idx_companies_group_name ON public.companies(company_group_name);

-- Add constraint to prevent circular references (company cannot be its own parent)
ALTER TABLE public.companies 
ADD CONSTRAINT check_not_self_parent 
CHECK (id != parent_company_id);
