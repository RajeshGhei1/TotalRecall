
-- Create the company_branch_offices table
CREATE TABLE IF NOT EXISTS public.company_branch_offices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  branch_type TEXT NOT NULL,
  gst_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_headquarters BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.company_branch_offices ENABLE ROW LEVEL SECURITY;

-- Create policies for company_branch_offices
CREATE POLICY "Users can view company branch offices" ON public.company_branch_offices
  FOR SELECT USING (true);

CREATE POLICY "Users can insert company branch offices" ON public.company_branch_offices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update company branch offices" ON public.company_branch_offices
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete company branch offices" ON public.company_branch_offices
  FOR DELETE USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_company_branch_offices_company_id ON public.company_branch_offices(company_id);
