
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ModulePermissionCard, 
  ModulePermissionsHeader, 
  AVAILABLE_MODULES 
} from './module-permissions';

interface ModulePermissionsManagerProps {
  planId: string;
}

const ModulePermissionsManager: React.FC<ModulePermissionsManagerProps> = ({ planId }) => {
  const [permissions, setPermissions] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingPermissions, isLoading } = useQuery({
    queryKey: ['module-permissions', planId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('module_permissions')
        .select('*')
        .eq('plan_id', planId);

      if (error) throw error;
      
      const permissionsMap: Record<string, any> = {};
      data?.forEach((perm: any) => {
        permissionsMap[perm.module_name] = {
          is_enabled: perm.is_enabled,
          limits: perm.limits || {}
        };
      });
      
      setPermissions(permissionsMap);
      return data;
    }
  });

  const savePermissionsMutation = useMutation({
    mutationFn: async () => {
      // Delete existing permissions for this plan
      await (supabase as any)
        .from('module_permissions')
        .delete()
        .eq('plan_id', planId);

      // Insert new permissions
      const permissionsToInsert = Object.entries(permissions).map(([moduleName, config]) => ({
        plan_id: planId,
        module_name: moduleName,
        is_enabled: config.is_enabled || false,
        limits: config.limits || null
      }));

      if (permissionsToInsert.length > 0) {
        const { error } = await (supabase as any)
          .from('module_permissions')
          .insert(permissionsToInsert);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-permissions', planId] });
      toast({
        title: "Success",
        description: "Module permissions saved successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save permissions",
        variant: "destructive"
      });
    }
  });

  const updateModulePermission = (moduleName: string, field: string, value: any) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [field]: value
      }
    }));
  };

  const updateModuleLimit = (moduleName: string, limitKey: string, value: any) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        limits: {
          ...prev[moduleName]?.limits,
          [limitKey]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <ModulePermissionsHeader 
          onSave={() => {}} 
          isSaving={false} 
        />
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <ModulePermissionsHeader 
        onSave={() => savePermissionsMutation.mutate()}
        isSaving={savePermissionsMutation.isPending}
      />
      <CardContent className="space-y-6">
        {AVAILABLE_MODULES.map((module) => {
          const moduleConfig = permissions[module.name] || {};
          const isEnabled = moduleConfig.is_enabled || false;
          const limits = moduleConfig.limits || {};

          return (
            <ModulePermissionCard
              key={module.name}
              module={module}
              isEnabled={isEnabled}
              limits={limits}
              onToggleEnabled={(checked) => 
                updateModulePermission(module.name, 'is_enabled', checked)
              }
              onUpdateLimit={(limitKey, value) =>
                updateModuleLimit(module.name, limitKey, value)
              }
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ModulePermissionsManager;
