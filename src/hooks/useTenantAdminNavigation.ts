
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase,
  UserCheck,
  Settings, 
  BarChart3,
  Brain,
  Calendar,
  FileText,
  Users2
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';
import { useUnifiedModuleAccess } from '@/hooks/subscriptions/useUnifiedModuleAccess';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const defaultNavItems: NavItem[] = [
  { 
    id: 'dashboard',
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/tenant-admin/dashboard'
  },
  { 
    id: 'ats',
    label: 'Applicant Tracking', 
    icon: UserCheck, 
    href: '/tenant-admin/ats',
    requiresModule: 'ats_core'
  },
  { 
    id: 'jobs',
    label: 'Jobs', 
    icon: Briefcase, 
    href: '/tenant-admin/jobs',
    requiresModule: 'ats_core'
  },
  { 
    id: 'talent',
    label: 'Talent Pool', 
    icon: Users2, 
    href: '/tenant-admin/talent',
    requiresModule: 'ats_core'
  },
  { 
    id: 'companies',
    label: 'Companies', 
    icon: Building2, 
    href: '/tenant-admin/companies'
  },
  { 
    id: 'contacts',
    label: 'Contacts', 
    icon: Users, 
    href: '/tenant-admin/contacts'
  },
  { 
    id: 'smart-talent-analytics',
    label: 'Smart Talent Analytics', 
    icon: Brain, 
    href: '/tenant-admin/smart-talent-analytics',
    requiresModule: 'smart_talent_analytics'
  },
  { 
    id: 'settings',
    label: 'Settings', 
    icon: Settings, 
    href: '/tenant-admin/settings'
  },
];

export const useTenantAdminNavigation = () => {
  const { user, bypassAuth } = useAuth();
  
  // Get current tenant ID
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'mock-tenant-id' };
      }
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user || bypassAuth,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  // Get module access for ATS Core
  const { data: atsAccess } = useUnifiedModuleAccess(currentTenantId, 'ats_core', user?.id);
  
  // Get module access for Smart Talent Analytics
  const { data: analyticsAccess } = useUnifiedModuleAccess(currentTenantId, 'smart_talent_analytics', user?.id);

  // Filter navigation items based on module access
  const filteredNavItems = defaultNavItems.filter(item => {
    if (!item.requiresModule) {
      return true; // Always show items that don't require modules
    }

    if (item.requiresModule === 'ats_core') {
      return atsAccess?.hasAccess === true;
    }

    if (item.requiresModule === 'smart_talent_analytics') {
      return analyticsAccess?.hasAccess === true;
    }

    return true;
  });

  return useNavigationPreferences('tenant_admin', filteredNavItems);
};
