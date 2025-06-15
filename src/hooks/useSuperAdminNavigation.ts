
import { 
  BarChart2,
  Building2, 
  CircleDollarSign, 
  LayoutDashboard, 
  Settings, 
  Store, 
  Users,
  Users2,
  PieChart,
  Package,
  Cog,
  TrendingUp,
  Brain,
  Zap,
  Shield,
  Activity,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useNavigationPreferences, NavItem } from './useNavigationPreferences';
import { ModuleAccessService } from '@/services/moduleAccessService';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Core Super Admin items (always available)
const coreNavItems: NavItem[] = [
  { 
    id: 'tenants',
    label: 'Tenants', 
    icon: Store, 
    href: '/superadmin/tenants'
  },
  { 
    id: 'users',
    label: 'Tenant Users', 
    icon: Users, 
    href: '/superadmin/users'
  },
  { 
    id: 'subscription-plans',
    label: 'Subscription Plans', 
    icon: Package, 
    href: '/superadmin/subscription-plans'
  },
  { 
    id: 'security-dashboard',
    label: 'Security Dashboard', 
    icon: Shield, 
    href: '/superadmin/security-dashboard'
  },
  { 
    id: 'audit-logs',
    label: 'Audit Logs', 
    icon: Shield, 
    href: '/superadmin/audit-logs'
  },
  { 
    id: 'global-settings',
    label: 'Global Settings', 
    icon: Cog, 
    href: '/superadmin/global-settings'
  },
  { 
    id: 'settings',
    label: 'System Settings', 
    icon: Settings, 
    href: '/superadmin/settings'
  },
];

// Module-based items (subscription controlled)
const moduleNavItems: NavItem[] = [
  { 
    id: 'analytics',
    label: 'BI Dashboard', 
    icon: BarChart2, 
    href: '/superadmin/analytics',
    requiresModule: 'bi_dashboard'
  },
  { 
    id: 'advanced-analytics',
    label: 'Advanced Analytics', 
    icon: BarChart3, 
    href: '/superadmin/advanced-analytics',
    requiresModule: 'advanced_analytics'
  },
  { 
    id: 'companies',
    label: 'Companies', 
    icon: Building2, 
    href: '/superadmin/companies',
    requiresModule: 'companies'
  },
  { 
    id: 'people',
    label: 'Business Contacts', 
    icon: Users2, 
    href: '/superadmin/people',
    requiresModule: 'people_contacts'
  },
  { 
    id: 'documentation',
    label: 'Documentation', 
    icon: BookOpen, 
    href: '/superadmin/documentation',
    requiresModule: 'documentation'
  },
  { 
    id: 'ai-orchestration',
    label: 'AI Orchestration', 
    icon: Brain, 
    href: '/superadmin/ai-orchestration',
    requiresModule: 'ai_orchestration'
  },
  { 
    id: 'ai-analytics',
    label: 'AI Analytics', 
    icon: Zap, 
    href: '/superadmin/ai-analytics',
    requiresModule: 'ai_analytics'
  },
  { 
    id: 'user-activity',
    label: 'User Activity', 
    icon: Activity, 
    href: '/superadmin/user-activity',
    requiresModule: 'user_activity'
  },
];

export const useSuperAdminNavigation = () => {
  const { user, bypassAuth } = useAuth();
  
  // Get current tenant for super admin (usually they have a default tenant context)
  const { data: tenantData } = useQuery({
    queryKey: ['superAdminTenantContext', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'super-admin-context' };
      }
      
      if (!user) return null;
      
      // For super admin, we might want to use a default tenant or allow switching
      // For now, just return a super admin context
      return { tenant_id: 'super-admin-context' };
    },
    enabled: !!user || bypassAuth,
  });

  // Check module access for all module-based items
  const { data: moduleAccess } = useQuery({
    queryKey: ['superAdminModuleAccess', tenantData?.tenant_id],
    queryFn: async () => {
      if (!tenantData?.tenant_id) return {};
      
      const accessResults: Record<string, boolean> = {};
      
      // Check access for each module
      for (const item of moduleNavItems) {
        if (item.requiresModule) {
          try {
            const result = await ModuleAccessService.isModuleEnabled(
              tenantData.tenant_id, 
              item.requiresModule
            );
            accessResults[item.requiresModule] = result.enabled;
          } catch (error) {
            console.error(`Error checking access for ${item.requiresModule}:`, error);
            accessResults[item.requiresModule] = false;
          }
        }
      }
      
      return accessResults;
    },
    enabled: !!tenantData?.tenant_id,
  });

  // Filter module items based on access
  const filteredModuleItems = moduleNavItems.filter(item => 
    !item.requiresModule || moduleAccess?.[item.requiresModule] === true
  );

  const allNavItems = [...coreNavItems, ...filteredModuleItems];
  
  return useNavigationPreferences('super_admin', allNavItems);
};
