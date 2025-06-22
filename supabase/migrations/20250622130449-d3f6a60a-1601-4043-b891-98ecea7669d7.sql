
-- Create contact_types table
CREATE TABLE public.contact_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'users',
  color TEXT NOT NULL DEFAULT '#3B82F6',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.contact_types ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_types
CREATE POLICY "Allow all users to read contact types"
  ON public.contact_types
  FOR SELECT
  USING (true);

CREATE POLICY "Allow super admins to manage contact types"
  ON public.contact_types
  FOR ALL
  USING (public.is_current_user_super_admin());

-- Insert default contact types
INSERT INTO public.contact_types (name, description, icon, color, is_default) VALUES
  ('Client', 'Business clients and customers', 'users', '#10B981', true),
  ('Vendor', 'Service providers and suppliers', 'truck', '#F59E0B', false),
  ('Partner', 'Business partners and collaborators', 'building', '#3B82F6', false),
  ('Lead', 'Potential customers and prospects', 'shopping-cart', '#8B5CF6', false);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_contact_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_types_updated_at
  BEFORE UPDATE ON public.contact_types
  FOR EACH ROW
  EXECUTE function public.update_contact_types_updated_at();
