
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormDefinition } from '@/types/form-builder';
import { Edit, Trash2, Building2, Package, Globe } from 'lucide-react';

interface FormsListSectionProps {
  forms: FormDefinition[];
  onEditForm: (form: FormDefinition) => void;
  onDeleteForm: (form: FormDefinition) => void;
  deleteFormMutation: any;
  tenants: any[];
  modules: any[];
}

const FormsListSection: React.FC<FormsListSectionProps> = ({
  forms,
  onEditForm,
  onDeleteForm,
  deleteFormMutation,
  tenants,
  modules
}) => {
  const getVisibilityBadgeVariant = (scope: string) => {
    switch (scope) {
      case 'global': return 'default';
      case 'tenant_specific': return 'secondary';
      case 'module_specific': return 'outline';
      default: return 'secondary';
    }
  };

  const getAccessBadgeVariant = (level: string) => {
    switch (level) {
      case 'public': return 'destructive';
      case 'authenticated': return 'default';
      case 'role_based': return 'secondary';
      default: return 'secondary';
    }
  };

  const getVisibilityIcon = (scope: string) => {
    switch (scope) {
      case 'global': return Globe;
      case 'tenant_specific': return Building2;
      case 'module_specific': return Package;
      default: return Globe;
    }
  };

  const getTenantName = (tenantId: string | null) => {
    if (!tenantId) return null;
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant?.name || 'Unknown Tenant';
  };

  const getModuleNames = (moduleIds: string[]) => {
    if (!moduleIds || moduleIds.length === 0) return [];
    return modules
      .filter(m => moduleIds.includes(m.id))
      .map(m => m.name);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => {
        const VisibilityIcon = getVisibilityIcon(form.visibility_scope);
        const tenantName = getTenantName(form.tenant_id);
        const moduleNames = getModuleNames(form.required_modules || []);

        return (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <VisibilityIcon className="h-4 w-4" />
                    {form.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {form.description || 'No description'}
                  </CardDescription>
                </div>
                <Badge variant={form.is_active ? 'default' : 'secondary'}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant={getVisibilityBadgeVariant(form.visibility_scope)}>
                    {form.visibility_scope === 'global' ? 'Global' : 
                     form.visibility_scope === 'tenant_specific' ? 'Tenant' : 'Module'}
                  </Badge>
                  <Badge variant={getAccessBadgeVariant(form.access_level)}>
                    {form.access_level === 'public' ? 'Public' : 
                     form.access_level === 'authenticated' ? 'Auth' : 'Role'}
                  </Badge>
                </div>

                {form.visibility_scope === 'tenant_specific' && tenantName && (
                  <div className="text-xs text-muted-foreground">
                    <Building2 className="inline h-3 w-3 mr-1" />
                    Assigned to: {tenantName}
                  </div>
                )}
                
                {form.visibility_scope === 'module_specific' && moduleNames.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <Package className="inline h-3 w-3 mr-1" />
                    Modules: {moduleNames.join(', ')}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Created {new Date(form.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditForm(form)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteForm(form)}
                    disabled={deleteFormMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FormsListSection;
