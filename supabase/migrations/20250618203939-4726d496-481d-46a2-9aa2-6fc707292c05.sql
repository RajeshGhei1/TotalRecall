
-- Add maturity tracking fields to system_modules table
ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS maturity_status TEXT NOT NULL DEFAULT 'planning' 
CHECK (maturity_status IN ('planning', 'alpha', 'beta', 'production'));

ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS development_stage JSONB DEFAULT '{"stage": "planning", "progress": 0, "milestones": [], "requirements": []}'::jsonb;

ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS promoted_to_production_at TIMESTAMPTZ;

ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS promoted_by UUID;

-- Set the 10 functional modules to production status
UPDATE public.system_modules 
SET maturity_status = 'production', 
    promoted_to_production_at = now(),
    development_stage = '{"stage": "production", "progress": 100, "milestones": ["requirements_defined", "development_complete", "testing_complete", "production_ready"], "requirements": []}'::jsonb
WHERE name IN (
  'Company Database',
  'Business Contacts', 
  'ATS Core',
  'User Management',
  'Talent Database',
  'Core Dashboard',
  'Smart Talent Analytics',
  'Document Management',
  'AI Orchestration',
  'Custom Field Management'
);

-- Set all other modules to development status
UPDATE public.system_modules 
SET maturity_status = 'alpha',
    development_stage = '{"stage": "alpha", "progress": 25, "milestones": ["requirements_defined", "prototype_created"], "requirements": ["complete_development", "testing", "documentation"]}'::jsonb
WHERE name NOT IN (
  'Company Database',
  'Business Contacts', 
  'ATS Core',
  'User Management',
  'Talent Database',
  'Core Dashboard',
  'Smart Talent Analytics',
  'Document Management',
  'AI Orchestration',
  'Custom Field Management'
) AND is_active = true;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_system_modules_maturity_status ON public.system_modules(maturity_status);

-- Add foreign key constraint for promoted_by
ALTER TABLE public.system_modules 
ADD CONSTRAINT fk_system_modules_promoted_by 
FOREIGN KEY (promoted_by) REFERENCES public.profiles(id);
