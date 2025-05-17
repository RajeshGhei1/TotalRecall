
import { User } from "@/types/user";

export interface TenantUserAssociation {
  id: string;
  user_id: string;
  tenant_id: string;
  user_role: string;
  department: string | null;
  user: User;
}

export type UserRole = 'tenant_admin' | 'manager' | 'recruiter' | 'user';

export interface TenantUserManagerProps {
  tenantId: string;
  tenantName: string;
  isOpen: boolean;
  onClose: () => void;
}
