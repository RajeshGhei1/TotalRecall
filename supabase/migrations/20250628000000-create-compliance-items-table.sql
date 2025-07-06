-- Create compliance_items table for security compliance tracking
CREATE TABLE public.compliance_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework TEXT NOT NULL, -- e.g., 'GDPR', 'SOC 2', 'ISO 27001'
    requirement TEXT NOT NULL, -- e.g., 'Data Processing Records'
    status TEXT NOT NULL CHECK (status IN ('compliant', 'partial', 'non_compliant')),
    last_audit DATE NOT NULL,
    next_review DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for compliance_items
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;

-- Policy: Super admins can view and manage all compliance items
CREATE POLICY "Super admins can manage compliance items"
    ON public.compliance_items
    FOR ALL
    USING (auth.role() = 'super_admin'); 