
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
    requiresModule: 'Core Dashboard'
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
    requiresModule: 'Talent Database'
  },
  { 
    id: 'companies',
    label: 'Companies', 
    icon: Building2, 
    href: '/tenant-admin/companies',
    requiresModule: 'Company Database'
  },
  { 
    id: 'contacts',
    label: 'Contacts', 
    icon: Users, 
    href: '/tenant-admin/contacts',
    requiresModule: 'Business Contacts'
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
    requiresModule: 'Advanced Analytics'
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
  const { data: dashboardAccess } = useUnifiedModuleAccess(currentTenantId, 'Core Dashboard', user?.id);
  const { data: predictiveAccess } = useUnifiedModuleAccess(currentTenantId, 'Predictive Insights', user?.id);
  const { data: workflowAccess } = useUnifiedModuleAccess(currentTenantId, 'Workflow Management', user?.id);
  const { data: userMgmtAccess } = useUnifiedModuleAccess(currentTenantId, 'User Management', user?.id);
  const { data: atsAccess } = useUnifiedModuleAccess(currentTenantId, 'ATS Core', user?.id);
  const { data: talentDatabaseAccess } = useUnifiedModuleAccess(currentTenantId, 'Talent Database', user?.id);
  const { data: companiesAccess } = useUnifiedModuleAccess(currentTenantId, 'Company Database', user?.id);
  const { data: contactsAccess } = useUnifiedModuleAccess(currentTenantId, 'Business Contacts', user?.id);
  const { data: analyticsAccess } = useUnifiedModuleAccess(currentTenantId, 'Advanced Analytics', user?.id);
  const { data: linkedinAccess } = useUnifiedModuleAccess(currentTenantId, 'LinkedIn Integration', user?.id);

  // Add debugging
  console.log('Navigation Debug:', {
    currentTenantId,
    talentDatabaseAccess,
    allAccess: {
      dashboard: dashboardAccess?.hasAccess,
      ats: atsAccess?.hasAccess,
      talentDatabase: talentDatabaseAccess?.hasAccess,
      companies: companiesAccess?.hasAccess
    }
  });

  // Filter navigation items based on module access
  const filteredNavItems = defaultNavItems.filter(item => {
    if (!item.requiresModule) {
      console.log(`Item ${item.id} has no module requirement, showing it`);
      return true; // Always show items that don't require modules
    }

    console.log(`Checking access for ${item.id} (module: ${item.requiresModule})`);

    switch (item.requiresModule) {
      case 'Core Dashboard':
        return dashboardAccess?.hasAccess === true;
      case 'Predictive Insights':
        return predictiveAccess?.hasAccess === true;
      case 'Workflow Management':
        return workflowAccess?.hasAccess === true;
      case 'User Management':
        return userMgmtAccess?.hasAccess === true;
      case 'ATS Core':
        return atsAccess?.hasAccess === true;
      case 'Talent Database':
        const hasAccess = talentDatabaseAccess?.hasAccess === true;
        console.log(`Talent Database access check: ${hasAccess}`, talentDatabaseAccess);
        return hasAccess;
      case 'Company Database':
        return companiesAccess?.hasAccess === true;
      case 'Business Contacts':
        return contactsAccess?.hasAccess === true;
      case 'Advanced Analytics':
        return analyticsAccess?.hasAccess === true;
      case 'LinkedIn Integration':
        return linkedinAccess?.hasAccess === true;
      default:
        console.warn(`Unknown module requirement: ${item.requiresModule}`);
        return true;
    }
  });

  console.log('Filtered nav items:', filteredNavItems.map(item => ({ id: item.id, label: item.label, module: item.requiresModule })));

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
