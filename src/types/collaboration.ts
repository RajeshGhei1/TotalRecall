
export interface RealTimeSession {
  id: string;
  user_id: string;
  session_id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  joined_at: string;
  last_seen: string;
  status: 'active' | 'away' | 'editing';
  cursor_position?: {
    x: number;
    y: number;
    section?: string;
  };
  current_section?: string;
  metadata: Record<string, any>;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface RealTimeNotification {
  id: string;
  recipient_id: string;
  sender_id?: string;
  notification_type: 'change_detected' | 'conflict_warning' | 'approval_request' | 'version_published' | 'user_joined' | 'user_left';
  entity_type: 'form' | 'report';
  entity_id: string;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface EntityVersion {
  id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  version_number: number;
  data_snapshot: Record<string, any>;
  created_at: string;
  created_by: string;
  change_summary?: string;
  is_published: boolean;
  approval_status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface WorkflowApproval {
  id: string;
  entity_type: 'form' | 'report';
  entity_id: string;
  version_id: string;
  requested_by: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  workflow_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConflictDetection {
  type: 'data_conflict' | 'concurrent_edit' | 'version_mismatch';
  message: string;
  timestamp: string;
  conflicting_users?: string[];
  affected_sections?: string[];
  resolution_options?: {
    action: string;
    description: string;
  }[];
}
