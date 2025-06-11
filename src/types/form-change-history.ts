
export interface FormChangeHistory {
  id: string;
  form_id: string;
  changed_by?: string;
  change_type: 'created' | 'updated' | 'deleted' | 'published' | 'unpublished';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  changed_at: string;
  change_reason?: string;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface ReportChangeHistory {
  id: string;
  report_id: string;
  changed_by?: string;
  change_type: 'created' | 'updated' | 'deleted' | 'executed';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  changed_at: string;
  change_reason?: string;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}
