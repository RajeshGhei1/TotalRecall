
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

export interface UserSessionFilters {
  user_id?: string;
  tenant_id?: string;
  is_active?: boolean;
  login_method?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  topDevices: Array<{ device: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  sessionsByDay: Record<string, number>;
}
