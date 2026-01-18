-- Create AI services table
CREATE TABLE IF NOT EXISTS public.ai_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    service_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    configuration JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    modules TEXT[] DEFAULT '{}',
    capabilities TEXT[] DEFAULT '{}',
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_services_tenant_id ON public.ai_services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_services_service_type ON public.ai_services(service_type);
CREATE INDEX IF NOT EXISTS idx_ai_services_category ON public.ai_services(category);
CREATE INDEX IF NOT EXISTS idx_ai_services_is_active ON public.ai_services(is_active);

-- Create updated_at trigger
CREATE TRIGGER update_ai_services_updated_at
    BEFORE UPDATE ON public.ai_services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.ai_services ENABLE ROW LEVEL SECURITY;

-- Policy for users to view services in their tenant
CREATE POLICY "Users can view AI services in their tenant" ON public.ai_services
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

-- Policy for users to insert services in their tenant
CREATE POLICY "Users can create AI services in their tenant" ON public.ai_services
    FOR INSERT WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

-- Policy for users to update services in their tenant
CREATE POLICY "Users can update AI services in their tenant" ON public.ai_services
    FOR UPDATE USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    );

-- Policy for users to delete services in their tenant
CREATE POLICY "Users can delete AI services in their tenant" ON public.ai_services
    FOR DELETE USING (
        tenant_id IN (
            SELECT tenant_id FROM public.user_tenants 
            WHERE user_id = auth.uid()
        )
    ); 