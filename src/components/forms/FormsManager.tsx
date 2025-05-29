
import React, { useState } from 'react';
import { Plus, Search, Settings, Eye, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFormDefinitions, useDeleteFormDefinition } from '@/hooks/forms/useFormDefinitions';
import { FormDefinition } from '@/types/form-builder';
import CreateFormDialog from './CreateFormDialog';
import FormBuilderDialog from './FormBuilderDialog';
import { useToast } from '@/hooks/use-toast';

const FormsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const { data: forms = [], isLoading } = useFormDefinitions();
  const deleteFormMutation = useDeleteFormDefinition();
  const { toast } = useToast();

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p className="text-gray-600">Create and manage dynamic forms</p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{form.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {form.description || 'No description'}
                  </CardDescription>
                </div>
                <Badge variant={form.is_active ? 'default' : 'secondary'}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </Badge>
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
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No forms found</div>
          <Button onClick={handleCreateNew}>Create your first form</Button>
        </div>
      )}

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
