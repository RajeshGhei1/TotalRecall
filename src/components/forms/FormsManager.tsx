import React, { useState } from 'react';
import { Plus, Search, Settings, Eye, Trash2, Edit, Filter, Building2, Globe, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormDefinitions, useDeleteFormDefinition } from '@/hooks/forms/useFormDefinitions';
import { FormDefinition } from '@/types/form-builder';
import CreateFormDialog from './CreateFormDialog';
import FormBuilderDialog from './FormBuilderDialog';
import FormPlacementManager from './placement/FormPlacementManager';
import { useToast } from '@/hooks/use-toast';
import { useTenantContext } from '@/contexts/TenantContext';
import { useTenants } from '@/hooks/useTenants';
import { useSystemModules } from '@/hooks/useSystemModules';

const FormsManager = () => {
  const [activeMainTab, setActiveMainTab] = useState('forms');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');

  const { selectedTenantId, selectedTenantName } = useTenantContext();
  const { data: forms = [], isLoading } = useFormDefinitions(selectedTenantId);
  const { tenants } = useTenants();
  const { data: modules = [] } = useSystemModules();
  const deleteFormMutation = useDeleteFormDefinition();
  const { toast } = useToast();

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisibility = visibilityFilter === 'all' || form.visibility_scope === visibilityFilter;
    const matchesAccess = accessFilter === 'all' || form.access_level === accessFilter;
    
    return matchesSearch && matchesVisibility && matchesAccess;
  });

  const handleEditForm = (form: FormDefinition) => {
    setSelectedForm(form);
    setIsBuilderOpen(true);
  };

  const handleDeleteForm = async (form: FormDefinition) => {
    if (window.confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone.`)) {
      try {
        await deleteFormMutation.mutateAsync(form.id);
      } catch (error) {
        console.error('Failed to delete form:', error);
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedForm(null);
    setIsCreateDialogOpen(true);
  };

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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms Manager</h1>
          <p className="text-gray-600">Create and manage dynamic forms with deployment configuration</p>
          {selectedTenantId && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <Building2 className="inline h-4 w-4 mr-1" />
                Current tenant context: <strong>{selectedTenantName}</strong>
              </p>
            </div>
          )}
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </div>

      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forms">Form Definitions</TabsTrigger>
          <TabsTrigger value="placements">Form Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          <div className="mb-6 space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="tenant_specific">Tenant Specific</SelectItem>
                  <SelectItem value="module_specific">Module Specific</SelectItem>
                </SelectContent>
              </Select>

              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Access Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="authenticated">Authenticated</SelectItem>
                  <SelectItem value="role_based">Role Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => {
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
                          onClick={() => handleEditForm(form)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteForm(form)}
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

          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {forms.length === 0 ? 'No forms found' : 'No forms match your filters'}
              </div>
              <Button onClick={handleCreateNew}>Create your first form</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="placements" className="space-y-6">
          <FormPlacementManager />
        </TabsContent>
      </Tabs>

      <CreateFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={(form) => {
          setIsCreateDialogOpen(false);
          setSelectedForm(form);
          setIsBuilderOpen(true);
        }}
      />

      <FormBuilderDialog
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        form={selectedForm}
      />
    </div>
  );
};

export default FormsManager;
