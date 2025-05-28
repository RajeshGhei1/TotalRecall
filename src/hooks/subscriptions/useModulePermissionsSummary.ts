
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AVAILABLE_MODULES } from '@/components/superadmin/subscriptions/module-permissions';

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

export const useModulePermissionsSummary = (planId: string) => {
  return useQuery({
    queryKey: ['module-permissions-summary', planId],
    queryFn: async (): Promise<ModulePermissionSummary> => {
      const { data: permissions, error } = await (supabase as any)
        .from('module_permissions')
        .select('*')
        .eq('plan_id', planId);

      if (error) throw error;

      const permissionsMap = new Map(
        permissions?.map((perm: any) => [perm.module_name, perm]) || []
      );

      const moduleDetails = AVAILABLE_MODULES.map((module) => {
        const permission = permissionsMap.get(module.name);
        return {
          name: module.name,
          label: module.label,
          isEnabled: permission?.is_enabled || false,
          limits: permission?.limits || {}
        };
      });

      const enabledModules = moduleDetails.filter(m => m.isEnabled).length;
      const totalModules = AVAILABLE_MODULES.length;
      const enabledPercentage = Math.round((enabledModules / totalModules) * 100);

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
    enabled: !!planId
  });
};
