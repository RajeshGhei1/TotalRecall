
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
  Users2,
  Zap,
  TrendingUp,
  Target,
  ClipboardList,
  GitBranch,
  Database
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
    href: '/tenant-admin/dashboard',
    requiresModule: 'Dashboard Analytics'
  },
  { 
    id: 'predictive-insights',
    label: 'Predictive Insights', 
    icon: TrendingUp, 
    href: '/tenant-admin/predictive-insights',
    requiresModule: 'Predictive Insights'
  },
  { 
    id: 'intelligent-workflows',
    label: 'Intelligent Workflows', 
    icon: Zap, 
    href: '/tenant-admin/intelligent-workflows',
    requiresModule: 'Workflow Management'
  },
  { 
    id: 'smart-talent-matching',
    label: 'AI Talent Matching', 
    icon: Target, 
    href: '/tenant-admin/smart-talent-matching',
    requiresModule: 'ATS Core'
  },
  { 
    id: 'ats-dashboard',
    label: 'ATS Dashboard', 
    icon: UserCheck, 
    href: '/tenant-admin/ats/dashboard',
    requiresModule: 'ATS Core'
  },
  { 
    id: 'ats-jobs',
    label: 'Jobs Management', 
    icon: Briefcase, 
    href: '/tenant-admin/ats/jobs',
    requiresModule: 'ATS Core'
  },
  { 
    id: 'ats-candidates',
    label: 'Candidates', 
    icon: Users2, 
    href: '/tenant-admin/ats/candidates',
    requiresModule: 'ATS Core'
  },
  { 
    id: 'ats-talent',
    label: 'Talent Pool', 
    icon: Users2, 
    href: '/tenant-admin/ats/talent',
    requiresModule: 'ATS Core'
  },
  { 
    id: 'ats-pipeline',
    label: 'Applications Pipeline', 
    icon: GitBranch, 
    href: '/tenant-admin/ats/pipeline',
    requiresModule: 'ATS Core'
  },
  { 
    id: 'talent-database',
    label: 'Talent Database', 
    icon: Database, 
    href: '/tenant-admin/talent-database',
    requiresModule: 'talent-database'
  },
  { 
    id: 'companies',
    label: 'Companies', 
    icon: Building2, 
    href: '/tenant-admin/companies',
    requiresModule: 'company_data_access'
  },
  { 
    id: 'contacts',
    label: 'Contacts', 
    icon: Users, 
    href: '/tenant-admin/contacts',
    requiresModule: 'business_contacts_data_access'
  },
  { 
    id: 'linkedin-integration',
    label: 'LinkedIn Integration', 
    icon: Users, 
    href: '/tenant-admin/linkedin-integration',
    requiresModule: 'LinkedIn Integration'
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
    href: '/tenant-admin/settings',
    requiresModule: 'User Management'
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

  // Get module access for each required module
  const { data: dashboardAccess } = useUnifiedModuleAccess(currentTenantId, 'Dashboard Analytics', user?.id);
  const { data: predictiveAccess } = useUnifiedModuleAccess(currentTenantId, 'Predictive Insights', user?.id);
  const { data: workflowAccess } = useUnifiedModuleAccess(currentTenantId, 'Workflow Management', user?.id);
  const { data: userMgmtAccess } = useUnifiedModuleAccess(currentTenantId, 'User Management', user?.id);
  const { data: atsAccess } = useUnifiedModuleAccess(currentTenantId, 'ATS Core', user?.id);
  const { data: talentDatabaseAccess } = useUnifiedModuleAccess(currentTenantId, 'talent-database', user?.id);
  const { data: companiesAccess } = useUnifiedModuleAccess(currentTenantId, 'company_data_access', user?.id);
  const { data: contactsAccess } = useUnifiedModuleAccess(currentTenantId, 'business_contacts_data_access', user?.id);
  const { data: analyticsAccess } = useUnifiedModuleAccess(currentTenantId, 'smart_talent_analytics', user?.id);
  const { data: linkedinAccess } = useUnifiedModuleAccess(currentTenantId, 'LinkedIn Integration', user?.id);

  // Filter navigation items based on module access
  const filteredNavItems = defaultNavItems.filter(item => {
    if (!item.requiresModule) {
      return true; // Always show items that don't require modules
    }

    switch (item.requiresModule) {
      case 'Dashboard Analytics':
        return dashboardAccess?.hasAccess === true;
      case 'Predictive Insights':
        return predictiveAccess?.hasAccess === true;
      case 'Workflow Management':
        return workflowAccess?.hasAccess === true;
      case 'User Management':
        return userMgmtAccess?.hasAccess === true;
      case 'ATS Core':
        return atsAccess?.hasAccess === true;
      case 'talent-database':
        return talentDatabaseAccess?.hasAccess === true;
      case 'company_data_access':
        return companiesAccess?.hasAccess === true;
      case 'business_contacts_data_access':
        return contactsAccess?.hasAccess === true;
      case 'smart_talent_analytics':
        return analyticsAccess?.hasAccess === true;
      case 'LinkedIn Integration':
        return linkedinAccess?.hasAccess === true;
      default:
        return true;
    }
  });

  // If no access to any modules, show basic user management only
  const hasAnyAccess = filteredNavItems.length > 0;
  
  if (!hasAnyAccess && currentTenantId) {
    // Show minimal navigation for tenants without any subscription
    return useNavigationPreferences('tenant_admin', [
      { 
        id: 'upgrade',
        label: 'Upgrade Plan', 
        icon: TrendingUp, 
        href: '/tenant-admin/upgrade'
      }
    ]);
  }

  return useNavigationPreferences('tenant_admin', filteredNavItems);
};
