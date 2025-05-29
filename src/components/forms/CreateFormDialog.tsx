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
import { Loader2, AlertCircle } from 'lucide-react';
import { useTenantContext } from '@/contexts/TenantContext';
import TenantSelector from './TenantSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQueryClient } from '@tanstack/react-query';

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
    target_tenant_id: null as string | null,
  });

  const { selectedTenantId } = useTenantContext();
  const { data: modules = [] } = useSystemModules();
  const createFormMutation = useCreateFormDefinition();
  const queryClient = useQueryClient();

  const isFormValid = () => {
    if (!formData.name.trim()) return false;
    
    if (formData.visibility_scope === 'tenant_specific' && !formData.target_tenant_id) {
      return false;
    }
    
    if (formData.visibility_scope === 'module_specific' && formData.required_modules.length === 0) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    try {
      const newForm = await createFormMutation.mutateAsync({
        name: formData.name,
        slug,
        description: formData.description || null,
        tenant_id: formData.visibility_scope === 'tenant_specific' ? formData.target_tenant_id : null,
        visibility_scope: formData.visibility_scope,
        access_level: formData.access_level,
        required_modules: formData.required_modules,
        is_active: true,
        settings: {},
      });

      // Invalidate form options cache to include the new form
      await queryClient.invalidateQueries({ queryKey: ['available-form-options'] });

      onSuccess(newForm);
      onClose();
      setFormData({
        name: '',
        description: '',
        visibility_scope: 'global',
        access_level: 'authenticated',
        required_modules: [],
        target_tenant_id: null,
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

  const handleVisibilityScopeChange = (value: 'global' | 'tenant_specific' | 'module_specific') => {
    setFormData(prev => ({
      ...prev,
      visibility_scope: value,
      target_tenant_id: value === 'tenant_specific' ? prev.target_tenant_id : null,
      required_modules: value === 'module_specific' ? prev.required_modules : [],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                <Label htmlFor="visibility_scope">Visibility Scope *</Label>
                <Select
                  value={formData.visibility_scope}
                  onValueChange={handleVisibilityScopeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (All Tenants)</SelectItem>
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

            {/* Tenant Selection for Tenant Specific Forms */}
            {formData.visibility_scope === 'tenant_specific' && (
              <div className="space-y-3">
                <TenantSelector
                  value={formData.target_tenant_id}
                  onChange={(tenantId) => setFormData(prev => ({ ...prev, target_tenant_id: tenantId }))}
                  required={true}
                />
                {!formData.target_tenant_id && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please select a tenant for this tenant-specific form.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Module Selection for Module Specific Forms */}
            {formData.visibility_scope === 'module_specific' && (
              <div className="space-y-3">
                <Label>Required Modules *</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
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
                {formData.required_modules.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please select at least one module for this module-specific form.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Context Information */}
            {formData.visibility_scope === 'global' && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  This form will be available to all tenants across the platform.
                </p>
              </div>
            )}

            {selectedTenantId && formData.visibility_scope !== 'tenant_specific' && (
              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <p className="text-sm text-amber-800">
                  Note: You're currently in a tenant context, but this form's scope will apply platform-wide.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createFormMutation.isPending || !isFormValid()}
            >
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
