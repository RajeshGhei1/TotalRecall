
-- Create entity_versions table for comprehensive version control
CREATE TABLE public.entity_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report')),
  entity_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  data_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  change_summary TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  approval_status TEXT CHECK (approval_status IN ('draft', 'pending_approval', 'approved', 'rejected')) DEFAULT 'draft',
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  UNIQUE(entity_type, entity_id, version_number)
);

-- Create workflow_approvals table for approval processes
CREATE TABLE public.workflow_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report')),
  entity_id UUID NOT NULL,
  version_id UUID NOT NULL REFERENCES public.entity_versions(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  workflow_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real_time_sessions table for user presence
CREATE TABLE public.real_time_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report')),
  entity_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('active', 'away', 'editing')) DEFAULT 'active',
  cursor_position JSONB,
  current_section TEXT,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, session_id, entity_type, entity_id)
);

-- Create real_time_notifications table
CREATE TABLE public.real_time_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('change_detected', 'conflict_warning', 'approval_request', 'version_published', 'user_joined', 'user_left')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('form', 'report')),
  entity_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium'
);

-- Enable RLS on all new tables
ALTER TABLE public.entity_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_notifications ENABLE ROW LEVEL SECURITY;

-- Create helper function for entity access checking
CREATE OR REPLACE FUNCTION public.can_access_entity(p_entity_type TEXT, p_entity_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  IF p_entity_type = 'form' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.form_definitions fd 
      WHERE fd.id = p_entity_id 
      AND (fd.created_by = auth.uid() OR public.is_current_user_super_admin())
    );
  ELSIF p_entity_type = 'report' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.saved_reports sr 
      WHERE sr.id = p_entity_id 
      AND (sr.created_by = auth.uid() OR public.is_current_user_super_admin())
    );
  END IF;
  
  RETURN false;
END;
$$;

-- Create RLS policies for entity_versions
CREATE POLICY "Users can view versions of entities they can access" 
  ON public.entity_versions 
  FOR SELECT 
  USING (public.can_access_entity(entity_type, entity_id));

CREATE POLICY "Users can create versions of entities they own" 
  ON public.entity_versions 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

-- Create RLS policies for workflow_approvals
CREATE POLICY "Users can view approval requests they're involved in" 
  ON public.workflow_approvals 
  FOR SELECT 
  USING (
    requested_by = auth.uid() 
    OR reviewed_by = auth.uid() 
    OR public.is_current_user_super_admin()
  );

CREATE POLICY "Users can create approval requests for their entities" 
  ON public.workflow_approvals 
  FOR INSERT 
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Reviewers can update approval requests" 
  ON public.workflow_approvals 
  FOR UPDATE 
  USING (reviewed_by = auth.uid() OR public.is_current_user_super_admin());

-- Create RLS policies for real_time_sessions
CREATE POLICY "Users can manage their own sessions" 
  ON public.real_time_sessions 
  FOR ALL 
  USING (user_id = auth.uid());

CREATE POLICY "Users can view sessions for entities they access" 
  ON public.real_time_sessions 
  FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR public.is_current_user_super_admin()
    OR public.can_access_entity(entity_type, entity_id)
  );

-- Create RLS policies for real_time_notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.real_time_notifications 
  FOR SELECT 
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can create notifications" 
  ON public.real_time_notifications 
  FOR INSERT 
  WITH CHECK (sender_id = auth.uid() OR sender_id IS NULL);

CREATE POLICY "Users can update their own notifications" 
  ON public.real_time_notifications 
  FOR UPDATE 
  USING (recipient_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_entity_versions_entity ON public.entity_versions(entity_type, entity_id);
CREATE INDEX idx_entity_versions_version ON public.entity_versions(entity_type, entity_id, version_number);
CREATE INDEX idx_entity_versions_published ON public.entity_versions(entity_type, entity_id, is_published);

CREATE INDEX idx_workflow_approvals_entity ON public.workflow_approvals(entity_type, entity_id);
CREATE INDEX idx_workflow_approvals_status ON public.workflow_approvals(status);
CREATE INDEX idx_workflow_approvals_requested_by ON public.workflow_approvals(requested_by);

CREATE INDEX idx_real_time_sessions_entity ON public.real_time_sessions(entity_type, entity_id);
CREATE INDEX idx_real_time_sessions_user ON public.real_time_sessions(user_id);
CREATE INDEX idx_real_time_sessions_active ON public.real_time_sessions(entity_type, entity_id, status);

CREATE INDEX idx_real_time_notifications_recipient ON public.real_time_notifications(recipient_id);
CREATE INDEX idx_real_time_notifications_unread ON public.real_time_notifications(recipient_id, is_read);

-- Create functions for version management
CREATE OR REPLACE FUNCTION public.get_next_version_number(p_entity_type TEXT, p_entity_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version
  FROM public.entity_versions
  WHERE entity_type = p_entity_type AND entity_id = p_entity_id;
  
  RETURN next_version;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_version(p_version_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_version RECORD;
BEGIN
  -- Get version details
  SELECT * INTO target_version 
  FROM public.entity_versions 
  WHERE id = p_version_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Version not found';
  END IF;
  
  -- Unpublish previous versions
  UPDATE public.entity_versions 
  SET is_published = false 
  WHERE entity_type = target_version.entity_type 
    AND entity_id = target_version.entity_id 
    AND is_published = true;
  
  -- Publish the target version
  UPDATE public.entity_versions 
  SET is_published = true, 
      approval_status = 'approved',
      approved_by = auth.uid(),
      approved_at = now()
  WHERE id = p_version_id;
  
  RETURN true;
END;
$$;

-- Create cleanup function for old sessions
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.real_time_sessions 
  WHERE last_seen < (now() - INTERVAL '1 hour');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Enable realtime for collaboration tables
ALTER TABLE public.real_time_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.real_time_notifications REPLICA IDENTITY FULL;
ALTER TABLE public.entity_versions REPLICA IDENTITY FULL;
ALTER TABLE public.workflow_approvals REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.real_time_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.real_time_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.entity_versions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_approvals;
