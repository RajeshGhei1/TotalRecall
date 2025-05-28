
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ModulePermissionsManagerProps {
  planId: string;
}

const AVAILABLE_MODULES = [
  {
    name: 'job_posting',
    label: 'Job Posting',
    description: 'Create and manage job postings',
    defaultLimits: { max_active_jobs: 10 }
  },
  {
    name: 'application_management',
    label: 'Application Management',
    description: 'Track and manage job applications',
    defaultLimits: { max_applications_per_job: 100 }
  },
  {
    name: 'advanced_analytics',
    label: 'Advanced Analytics',
    description: 'Detailed reporting and insights',
    defaultLimits: {}
  },
  {
    name: 'custom_fields',
    label: 'Custom Fields',
    description: 'Create custom data fields',
    defaultLimits: { max_custom_fields: 20 }
  },
  {
    name: 'api_access',
    label: 'API Access',
    description: 'Access to REST APIs',
    defaultLimits: { requests_per_hour: 1000 }
  },
  {
    name: 'integration_marketplace',
    label: 'Integration Marketplace',
    description: 'Third-party integrations',
    defaultLimits: { max_integrations: 5 }
  },
  {
    name: 'interview_scheduling',
    label: 'Interview Scheduling',
    description: 'Schedule and manage interviews',
    defaultLimits: {}
  },
  {
    name: 'candidate_sourcing',
    label: 'Candidate Sourcing',
    description: 'AI-powered candidate sourcing',
    defaultLimits: { sourcing_credits: 100 }
  }
];

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
        <CardHeader>
          <CardTitle>Module Permissions</CardTitle>
        </CardHeader>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Module Permissions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure which modules are available for this plan
          </p>
        </div>
        <Button 
          onClick={() => savePermissionsMutation.mutate()}
          disabled={savePermissionsMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {savePermissionsMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {AVAILABLE_MODULES.map((module) => {
          const moduleConfig = permissions[module.name] || {};
          const isEnabled = moduleConfig.is_enabled || false;
          const limits = moduleConfig.limits || {};

          return (
            <div key={module.name} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{module.label}</h4>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => 
                    updateModulePermission(module.name, 'is_enabled', checked)
                  }
                />
              </div>

              {isEnabled && Object.keys(module.defaultLimits).length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  {Object.entries(module.defaultLimits).map(([limitKey, defaultValue]) => (
                    <div key={limitKey} className="space-y-2">
                      <Label className="text-xs capitalize">
                        {limitKey.replace(/_/g, ' ')}
                      </Label>
                      <Input
                        type="number"
                        value={limits[limitKey] || defaultValue}
                        onChange={(e) => 
                          updateModuleLimit(module.name, limitKey, parseInt(e.target.value) || 0)
                        }
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ModulePermissionsManager;
