
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSystemModules } from '@/hooks/modules/useSystemModules';
import ModuleDependencySelector from './ModuleDependencySelector';
import ModuleLimitsEditor from './ModuleLimitsEditor';

const createModuleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  version: z.string().min(1, "Version is required"),
  is_active: z.boolean(),
  default_limits: z.record(z.any()).optional(),
  dependencies: z.array(z.string()).optional()
});

type CreateModuleFormData = z.infer<typeof createModuleSchema>;

interface CreateModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateModuleDialog: React.FC<CreateModuleDialogProps> = ({ open, onOpenChange }) => {
  const { createModule } = useSystemModules();
  
  const form = useForm<CreateModuleFormData>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      version: '1.0.0',
      is_active: true,
      default_limits: {},
      dependencies: []
    }
  });

  const categories = [
    { value: 'core', label: 'Core' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' },
    { value: 'configuration', label: 'Configuration' },
    { value: 'system-admin', label: 'System Admin' },
    { value: 'tenant-admin', label: 'Tenant Admin' }
  ];

  const onSubmit = async (data: CreateModuleFormData) => {
    try {
      const moduleData = {
        name: data.name,
        description: data.description || '',
        category: data.category,
        version: data.version || '1.0.0',
        is_active: data.is_active,
        default_limits: data.default_limits || {},
        dependencies: data.dependencies || []
      };
      
      await createModule.mutateAsync(moduleData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="e.g., Smart Talent Analytics"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                {...form.register('version')}
                placeholder="1.0.0"
              />
              {form.formState.errors.version && (
                <p className="text-sm text-red-500">{form.formState.errors.version.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Brief description of the module functionality"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={form.watch('category')}
                onValueChange={(value) => form.setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-7">
              <Switch
                id="is_active"
                checked={form.watch('is_active')}
                onCheckedChange={(checked) => form.setValue('is_active', checked)}
              />
              <Label htmlFor="is_active">Active Module</Label>
            </div>
          </div>

          <ModuleDependencySelector
            selectedDependencies={form.watch('dependencies') || []}
            onDependenciesChange={(dependencies) => form.setValue('dependencies', dependencies)}
          />

          <ModuleLimitsEditor
            limits={form.watch('default_limits') || {}}
            onLimitsChange={(limits) => form.setValue('default_limits', limits)}
            category={form.watch('category')}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createModule.isPending}
            >
              {createModule.isPending ? 'Creating...' : 'Create Module'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModuleDialog;
