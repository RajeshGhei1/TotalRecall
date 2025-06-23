
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
  // Core Dashboard is now optional - not required for basic navigation
  { 
    id: 'dashboard',
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/tenant-admin/dashboard',
    requiresModule: 'core_dashboard' // Fixed: use actual module name
  },
  { 
    id: 'predictive-insights',
    label: 'Predictive Insights', 
    icon: TrendingUp, 
    href: '/tenant-admin/predictive-insights',
    requiresModule: 'predictive_insights'
  },
  { 
    id: 'intelligent-workflows',
    label: 'Intelligent Workflows', 
    icon: Zap, 
    href: '/tenant-admin/intelligent-workflows',
    requiresModule: 'workflow_management'
  },
  { 
    id: 'smart-talent-matching',
    label: 'AI Talent Matching', 
    icon: Target, 
    href: '/tenant-admin/smart-talent-matching',
    requiresModule: 'ats_core'
  },
  { 
    id: 'ats-dashboard',
    label: 'ATS Dashboard', 
    icon: UserCheck, 
    href: '/tenant-admin/ats/dashboard',
    requiresModule: 'ats_core'
  },
  { 
    id: 'ats-jobs',
    label: 'Jobs Management', 
    icon: Briefcase, 
    href: '/tenant-admin/ats/jobs',
    requiresModule: 'ats_core'
  },
  { 
    id: 'ats-candidates',
    label: 'Candidates', 
    icon: Users2, 
    href: '/tenant-admin/ats/candidates',
    requiresModule: 'ats_core'
  },
  { 
    id: 'ats-talent',
    label: 'Talent Pool', 
    icon: Users2, 
    href: '/tenant-admin/ats/talent',
    requiresModule: 'ats_core'
  },
  { 
    id: 'ats-pipeline',
    label: 'Applications Pipeline', 
    icon: GitBranch, 
    href: '/tenant-admin/ats/pipeline',
    requiresModule: 'ats_core'
  },
  { 
    id: 'talent-database',
    label: 'Talent Database', 
    icon: Database, 
    href: '/tenant-admin/talent-database',
    requiresModule: 'talent_database'
  },
  { 
    id: 'companies',
    label: 'Companies', 
    icon: Building2, 
    href: '/tenant-admin/companies',
    requiresModule: 'companies' // Fixed: correct module name
  },
  { 
    id: 'contacts',
    label: 'Contacts', 
    icon: Users, 
    href: '/tenant-admin/contacts',
    requiresModule: 'people' // Fixed: correct module name
  },
  { 
    id: 'linkedin-integration',
    label: 'LinkedIn Integration', 
    icon: Users, 
    href: '/tenant-admin/linkedin-integration',
    requiresModule: 'linkedin_integration'
  },
  { 
    id: 'smart-talent-analytics',
    label: 'Smart Talent Analytics', 
    icon: Brain, 
    href: '/tenant-admin/smart-talent-analytics',
    requiresModule: 'smart_talent_analytics' // Removed artificial Core Dashboard dependency
  },
  // Settings is now always accessible - no module requirement
  { 
    id: 'settings',
    label: 'Settings', 
    icon: Settings, 
    href: '/tenant-admin/settings'
    // No requiresModule - Settings should always be accessible
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

  // Get module access for each module using correct names
  const { data: dashboardAccess } = useUnifiedModuleAccess(currentTenantId, 'core_dashboard', user?.id);
  const { data: predictiveAccess } = useUnifiedModuleAccess(currentTenantId, 'predictive_insights', user?.id);
  const { data: workflowAccess } = useUnifiedModuleAccess(currentTenantId, 'workflow_management', user?.id);
  const { data: atsAccess } = useUnifiedModuleAccess(currentTenantId, 'ats_core', user?.id);
  const { data: talentDatabaseAccess } = useUnifiedModuleAccess(currentTenantId, 'talent_database', user?.id);
  const { data: companiesAccess } = useUnifiedModuleAccess(currentTenantId, 'companies', user?.id);
  const { data: peopleAccess } = useUnifiedModuleAccess(currentTenantId, 'people', user?.id);
  const { data: analyticsAccess } = useUnifiedModuleAccess(currentTenantId, 'smart_talent_analytics', user?.id);
  const { data: linkedinAccess } = useUnifiedModuleAccess(currentTenantId, 'linkedin_integration', user?.id);

  console.log('Navigation Debug - Module Access:', {
    currentTenantId,
    dashboard: dashboardAccess?.hasAccess,
    ats: atsAccess?.hasAccess,
    talentDatabase: talentDatabaseAccess?.hasAccess,
    companies: companiesAccess?.hasAccess,
    people: peopleAccess?.hasAccess,
    analytics: analyticsAccess?.hasAccess
  });

  // Filter navigation items based on module access
  const filteredNavItems = defaultNavItems.filter(item => {
    // Settings has no module requirement - always show
    if (!item.requiresModule) {
      console.log(`Item ${item.id} has no module requirement, showing it`);
      return true;
    }

    console.log(`Checking access for ${item.id} (module: ${item.requiresModule})`);

    switch (item.requiresModule) {
      case 'core_dashboard':
        return dashboardAccess?.hasAccess === true;
      case 'predictive_insights':
        return predictiveAccess?.hasAccess === true;
      case 'workflow_management':
        return workflowAccess?.hasAccess === true;
      case 'ats_core':
        return atsAccess?.hasAccess === true;
      case 'talent_database':
        const hasAccess = talentDatabaseAccess?.hasAccess === true;
        console.log(`Talent Database access check: ${hasAccess}`, talentDatabaseAccess);
        return hasAccess;
      case 'companies':
        return companiesAccess?.hasAccess === true;
      case 'people':
        return peopleAccess?.hasAccess === true;
      case 'smart_talent_analytics':
        return analyticsAccess?.hasAccess === true;
      case 'linkedin_integration':
        return linkedinAccess?.hasAccess === true;
      default:
        console.warn(`Unknown module requirement: ${item.requiresModule}`);
        return false;
    }
  });

  console.log('Filtered nav items:', filteredNavItems.map(item => ({ id: item.id, label: item.label, module: item.requiresModule })));

  // Always show at least Settings - don't redirect to upgrade if user has basic access
  const hasAnyAccess = filteredNavItems.length > 0;
  
  if (!hasAnyAccess && currentTenantId) {
    // Show minimal navigation for tenants without any subscription
    return useNavigationPreferences('tenant_admin', [
      { 
        id: 'settings',
        label: 'Settings', 
        icon: Settings, 
        href: '/tenant-admin/settings'
      },
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
