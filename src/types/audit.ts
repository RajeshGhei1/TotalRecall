
export interface AuditLog {
  id: string;
  user_id: string;
  tenant_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  module_name?: string;
  additional_context?: Record<string, unknown>;
  created_at: string;
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
  severity?: 'low' | 'medium' | 'high' | 'critical';
  module_name?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface UserSessionFilters {
  user_id?: string;
  tenant_id?: string;
  is_active?: boolean;
  login_method?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}
