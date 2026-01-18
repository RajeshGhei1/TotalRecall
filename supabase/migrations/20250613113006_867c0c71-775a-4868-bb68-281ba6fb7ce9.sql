
-- Create documentation_updates table for storing real-time documentation changes
CREATE TABLE public.documentation_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_path TEXT NOT NULL,
  content TEXT,
  update_type TEXT NOT NULL CHECK (update_type IN ('auto', 'manual')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.documentation_updates ENABLE ROW LEVEL SECURITY;

-- Create policy for super admins to access all documentation updates
CREATE POLICY "Super admins can manage documentation updates" 
  ON public.documentation_updates 
  FOR ALL 
  USING (public.is_current_user_super_admin());

-- Add updated_at trigger
CREATE TRIGGER update_documentation_updates_updated_at
  BEFORE UPDATE ON public.documentation_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
