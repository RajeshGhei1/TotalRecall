
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateFormDefinition } from '@/hooks/forms/useFormDefinitions';
import { useSystemModules } from '@/hooks/useSystemModules';
import { FormDefinition } from '@/types/form-builder';
import { Loader2 } from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';

interface CreateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (form: FormDefinition) => void;
}

const CreateFormDialog: React.FC<CreateFormDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility_scope: 'global' as 'global' | 'tenant_specific' | 'module_specific',
    access_level: 'authenticated' as 'public' | 'authenticated' | 'role_based',
    required_modules: [] as string[],
  });

  const { selectedTenantId } = useTenantContext();
  const { data: modules = [] } = useSystemModules();
  const createFormMutation = useCreateFormDefinition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    try {
      const newForm = await createFormMutation.mutateAsync({
        name: formData.name,
        slug,
        description: formData.description || null,
        tenant_id: formData.visibility_scope === 'tenant_specific' ? selectedTenantId : null,
        visibility_scope: formData.visibility_scope,
        access_level: formData.access_level,
        required_modules: formData.required_modules,
        is_active: true,
        settings: {},
      });

      onSuccess(newForm);
      onClose();
      setFormData({
        name: '',
        description: '',
        visibility_scope: 'global',
        access_level: 'authenticated',
        required_modules: [],
      });
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      required_modules: checked
        ? [...prev.required_modules, moduleId]
        : prev.required_modules.filter(id => id !== moduleId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Create a new dynamic form with customizable fields and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Form Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter form name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description of the form"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visibility_scope">Visibility Scope</Label>
                <Select
                  value={formData.visibility_scope}
                  onValueChange={(value: 'global' | 'tenant_specific' | 'module_specific') =>
                    setFormData(prev => ({ ...prev, visibility_scope: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="tenant_specific">Tenant Specific</SelectItem>
                    <SelectItem value="module_specific">Module Specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="access_level">Access Level</Label>
                <Select
                  value={formData.access_level}
                  onValueChange={(value: 'public' | 'authenticated' | 'role_based') =>
                    setFormData(prev => ({ ...prev, access_level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="authenticated">Authenticated Users</SelectItem>
                    <SelectItem value="role_based">Role Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.visibility_scope === 'module_specific' && (
              <div>
                <Label>Required Modules</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={module.id}
                        checked={formData.required_modules.includes(module.id)}
                        onCheckedChange={(checked) => handleModuleToggle(module.id, !!checked)}
                      />
                      <Label htmlFor={module.id} className="text-sm">
                        {module.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.visibility_scope === 'tenant_specific' && selectedTenantId && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  This form will be created for the currently selected tenant context.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFormMutation.isPending || !formData.name.trim()}>
              {createFormMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Form'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormDialog;
