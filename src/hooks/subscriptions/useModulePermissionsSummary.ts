
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSystemModules } from '@/hooks/useSystemModules';

export interface ModulePermissionSummary {
  totalModules: number;
  enabledModules: number;
  enabledPercentage: number;
  keyLimitations: string[];
  moduleDetails: Array<{
    name: string;
    label: string;
    isEnabled: boolean;
    limits: Record<string, any>;
  }>;
}

interface ModulePermissionRecord {
  id: string;
  plan_id: string;
  module_name: string;
  is_enabled: boolean;
  limits: Record<string, any> | null;
  created_at: string;
}

export const useModulePermissionsSummary = (planId: string) => {
  const { data: systemModules } = useSystemModules();

  return useQuery({
    queryKey: ['module-permissions-summary', planId],
    queryFn: async (): Promise<ModulePermissionSummary> => {
      const { data: permissions, error } = await (supabase as any)
        .from('module_permissions')
        .select('*')
        .eq('plan_id', planId);

      if (error) throw error;

      // Use dynamic modules from database instead of static list
      const availableModules = (systemModules || [])
        .filter(module => module.is_active)
        .map(module => ({
          name: module.name,
          label: module.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: module.description || `${module.category} module`,
          defaultLimits: module.default_limits || {}
        }));

      const permissionsMap = new Map(
        (permissions as ModulePermissionRecord[])?.map((perm) => [perm.module_name, perm]) || []
      );

      const moduleDetails = availableModules.map((module) => {
        const permission = permissionsMap.get(module.name);
        return {
          name: module.name,
          label: module.label,
          isEnabled: permission?.is_enabled || false,
          limits: permission?.limits || {}
        };
      });

      const enabledModules = moduleDetails.filter(m => m.isEnabled).length;
      const totalModules = availableModules.length;
      const enabledPercentage = totalModules > 0 ? Math.round((enabledModules / totalModules) * 100) : 0;

      // Extract key limitations
      const keyLimitations: string[] = [];
      moduleDetails.forEach((module) => {
        if (module.isEnabled && Object.keys(module.limits).length > 0) {
          Object.entries(module.limits).forEach(([key, value]) => {
            if (value && typeof value === 'number') {
              const formattedKey = key.replace(/_/g, ' ').toLowerCase();
              keyLimitations.push(`${value} ${formattedKey}`);
            }
          });
        }
      });

      return {
        totalModules,
        enabledModules,
        enabledPercentage,
        keyLimitations: keyLimitations.slice(0, 3), // Show top 3 limitations
        moduleDetails
      };
    },
    enabled: !!planId && !!systemModules
  });
};
