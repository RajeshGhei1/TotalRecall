
-- Add branch_office_id to company_relationships table to link people to specific office locations
ALTER TABLE public.company_relationships 
ADD COLUMN IF NOT EXISTS branch_office_id UUID REFERENCES public.company_branch_offices(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_company_relationships_branch_office_id 
ON public.company_relationships(branch_office_id);

-- Update the existing placeholder company_id records to NULL so they don't cause issues
UPDATE public.company_relationships 
SET company_id = NULL 
WHERE company_id = '00000000-0000-0000-0000-000000000000';

-- Make company_id nullable since not all relationships may have a company initially
ALTER TABLE public.company_relationships 
ALTER COLUMN company_id DROP NOT NULL;
