
-- Step 1: Add created_by column to saved_reports
ALTER TABLE public.saved_reports 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);

-- Update existing records to set created_by (using a default super admin if available)
UPDATE public.saved_reports 
SET created_by = (
  SELECT id FROM public.profiles WHERE role = 'super_admin' LIMIT 1
) 
WHERE created_by IS NULL;

-- Step 2: Create form_change_history table
CREATE TABLE public.form_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.form_definitions(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.profiles(id),
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'updated', 'deleted', 'published', 'unpublished')),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 3: Create report_change_history table
CREATE TABLE public.report_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.saved_reports(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.profiles(id),
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'updated', 'deleted', 'executed')),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 4: Enable RLS on all tables
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_change_history ENABLE ROW LEVEL SECURITY;

-- Step 5: Create security helper functions
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Step 6: Create RLS policies for saved_reports
CREATE POLICY "Users can view their own reports" 
  ON public.saved_reports 
  FOR SELECT 
  USING (created_by = public.get_current_user_id() OR public.is_current_user_super_admin());

CREATE POLICY "Users can create their own reports" 
  ON public.saved_reports 
  FOR INSERT 
  WITH CHECK (created_by = public.get_current_user_id());

CREATE POLICY "Users can update their own reports" 
  ON public.saved_reports 
  FOR UPDATE 
  USING (created_by = public.get_current_user_id() OR public.is_current_user_super_admin());

CREATE POLICY "Users can delete their own reports" 
  ON public.saved_reports 
  FOR DELETE 
  USING (created_by = public.get_current_user_id() OR public.is_current_user_super_admin());

-- Step 7: Create RLS policies for form_change_history
CREATE POLICY "Users can view their own form changes" 
  ON public.form_change_history 
  FOR SELECT 
  USING (changed_by = public.get_current_user_id() OR public.is_current_user_super_admin());

CREATE POLICY "System can insert form change history" 
  ON public.form_change_history 
  FOR INSERT 
  WITH CHECK (true);

-- Step 8: Create RLS policies for report_change_history
CREATE POLICY "Users can view their own report changes" 
  ON public.report_change_history 
  FOR SELECT 
  USING (changed_by = public.get_current_user_id() OR public.is_current_user_super_admin());

CREATE POLICY "System can insert report change history" 
  ON public.report_change_history 
  FOR INSERT 
  WITH CHECK (true);

-- Step 9: Create audit trigger functions
CREATE OR REPLACE FUNCTION public.log_form_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.form_change_history (
      form_id, changed_by, change_type, new_values, ip_address, user_agent, session_id
    ) VALUES (
      NEW.id, 
      NEW.created_by, 
      'created', 
      row_to_json(NEW),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent',
      current_setting('request.jwt.claims', true)::json->>'session_id'
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.form_change_history (
      form_id, changed_by, change_type, old_values, new_values, ip_address, user_agent, session_id
    ) VALUES (
      NEW.id, 
      auth.uid(), 
      'updated', 
      row_to_json(OLD),
      row_to_json(NEW),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent',
      current_setting('request.jwt.claims', true)::json->>'session_id'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.form_change_history (
      form_id, changed_by, change_type, old_values, ip_address, user_agent, session_id
    ) VALUES (
      OLD.id, 
      auth.uid(), 
      'deleted', 
      row_to_json(OLD),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent',
      current_setting('request.jwt.claims', true)::json->>'session_id'
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_report_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.report_change_history (
      report_id, changed_by, change_type, new_values, ip_address, user_agent, session_id
    ) VALUES (
      NEW.id, 
      NEW.created_by, 
      'created', 
      row_to_json(NEW),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent',
      current_setting('request.jwt.claims', true)::json->>'session_id'
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.report_change_history (
      report_id, changed_by, change_type, old_values, new_values, ip_address, user_agent, session_id
    ) VALUES (
      NEW.id, 
      auth.uid(), 
      'updated', 
      row_to_json(OLD),
      row_to_json(NEW),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent',
      current_setting('request.jwt.claims', true)::json->>'session_id'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.report_change_history (
      report_id, changed_by, change_type, old_values, ip_address, user_agent, session_id
    ) VALUES (
      OLD.id, 
      auth.uid(), 
      'deleted', 
      row_to_json(OLD),
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent',
      current_setting('request.jwt.claims', true)::json->>'session_id'
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Step 10: Create triggers
CREATE TRIGGER form_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.form_definitions
  FOR EACH ROW EXECUTE FUNCTION public.log_form_changes();

CREATE TRIGGER report_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.saved_reports
  FOR EACH ROW EXECUTE FUNCTION public.log_report_changes();

-- Step 11: Create performance indexes
CREATE INDEX idx_form_change_history_form_id ON public.form_change_history(form_id);
CREATE INDEX idx_form_change_history_changed_by ON public.form_change_history(changed_by);
CREATE INDEX idx_form_change_history_changed_at ON public.form_change_history(changed_at);

CREATE INDEX idx_report_change_history_report_id ON public.report_change_history(report_id);
CREATE INDEX idx_report_change_history_changed_by ON public.report_change_history(changed_by);
CREATE INDEX idx_report_change_history_changed_at ON public.report_change_history(changed_at);

CREATE INDEX idx_saved_reports_created_by ON public.saved_reports(created_by);
