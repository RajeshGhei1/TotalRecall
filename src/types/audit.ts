
export interface AuditLog {
  id: string;
  user_id?: string;
  tenant_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  session_id?: string;
  request_id?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  module_name?: string;
  additional_context?: Record<string, any>;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
  tenants?: {
    id: string;
    name: string;
  };
}

export interface UserSession {
  id: string;
  user_id: string;
  tenant_id?: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  login_at: string;
  logout_at?: string;
  last_activity_at?: string;
  is_active: boolean;
  login_method: string;
  device_info?: Record<string, any>;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
  tenants?: {
    id: string;
    name: string;
  };
}

export interface AuditLogFilters {
  user_id?: string;
  tenant_id?: string;
  action?: string;
  entity_type?: string;
  severity?: string;
  module_name?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}
