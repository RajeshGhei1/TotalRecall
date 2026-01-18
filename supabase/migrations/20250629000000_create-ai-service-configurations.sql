-- Create ai_service_configurations table for per-tenant, per-service AI service settings
CREATE TABLE public.ai_service_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL, -- e.g., 'email-response-generator'
  enabled BOOLEAN NOT NULL DEFAULT false,
  selected_model TEXT NOT NULL,
  api_key_encrypted TEXT, -- encrypted API key
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, service_id)
);

-- Enable Row Level Security
ALTER TABLE public.ai_service_configurations ENABLE ROW LEVEL SECURITY;

-- RLS: Tenant admins can manage their tenant's service configs
CREATE POLICY "Tenant admins can manage their tenant's AI service configs"
  ON public.ai_service_configurations
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants                           
      WHERE user_id = auth.uid() AND user_role IN ('tenant_admin', 'super_admin')
    )
  );

-- RLS: Users can view their tenant's service configs
CREATE POLICY "Users can view their tenant's AI service configs"
  ON public.ai_service_configurations
  FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.user_tenants
      WHERE user_id = auth.uid()
    )
  );

-- Trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION update_ai_service_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_service_configurations_updated_at
  BEFORE UPDATE ON public.ai_service_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_service_configurations_updated_at(); 