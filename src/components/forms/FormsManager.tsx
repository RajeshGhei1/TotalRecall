
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormDefinitions, useDeleteFormDefinition } from '@/hooks/forms/useFormDefinitions';
import { FormDefinition } from '@/types/form-builder';
import { useTenantContext } from '@/contexts/TenantContext';
import { useTenants } from '@/hooks/useTenants';
import { useSystemModules } from '@/hooks/useSystemModules';

// Import section components
import FormsHeader from './sections/FormsHeader';
import FormsFilters from './sections/FormsFilters';
import FormsListSection from './sections/FormsListSection';
import EmptyFormsState from './sections/EmptyFormsState';
import LoadingState from './sections/LoadingState';

// Import dialog components
import CreateFormDialog from './CreateFormDialog';
import FormBuilderDialog from './FormBuilderDialog';

// Import tab content components
import FormPlacementManager from './placement/FormPlacementManager';
import FormAnalyticsDashboard from './analytics/FormAnalyticsDashboard';
import FormWorkflowManager from './workflow/FormWorkflowManager';

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

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <FormsHeader
        selectedTenantId={selectedTenantId}
        selectedTenantName={selectedTenantName}
        onCreateNew={handleCreateNew}
      />

      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forms">Form Definitions</TabsTrigger>
          <TabsTrigger value="placements">Form Placements</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          <FormsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            visibilityFilter={visibilityFilter}
            onVisibilityFilterChange={setVisibilityFilter}
            accessFilter={accessFilter}
            onAccessFilterChange={setAccessFilter}
          />

          <FormsListSection
            forms={filteredForms}
            onEditForm={handleEditForm}
            onDeleteForm={handleDeleteForm}
            deleteFormMutation={deleteFormMutation}
            tenants={tenants}
            modules={modules}
          />

          <EmptyFormsState
            formsLength={forms.length}
            filteredFormsLength={filteredForms.length}
            onCreateNew={handleCreateNew}
          />
        </TabsContent>

        <TabsContent value="placements" className="space-y-6">
          <FormPlacementManager />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <FormWorkflowManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <FormAnalyticsDashboard />
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
