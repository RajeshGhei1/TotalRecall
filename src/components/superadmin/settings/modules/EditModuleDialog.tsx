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
import { useSystemModules } from '@/hooks/useSystemModules';
import { toast } from '@/hooks/use-toast';
import ModuleDependencySelector from './ModuleDependencySelector';
import ModuleLimitsEditor from './ModuleLimitsEditor';

const editModuleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  version: z.string().min(1, "Version is required"),
  is_active: z.boolean(),
  default_limits: z.record(z.any()).optional(),
  dependencies: z.array(z.string()).optional()
});

type EditModuleFormData = z.infer<typeof editModuleSchema>;

interface EditModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: any;
}

const EditModuleDialog: React.FC<EditModuleDialogProps> = ({ open, onOpenChange, module }) => {
  const { updateModule } = useSystemModules();
  
  const form = useForm<EditModuleFormData>({
    resolver: zodResolver(editModuleSchema),
    defaultValues: {
      name: module?.name || '',
      description: module?.description || '',
      category: module?.category || '',
      version: module?.version || '1.0.0',
      is_active: module?.is_active || true,
      default_limits: module?.default_limits || {},
      dependencies: module?.dependencies || []
    }
  });

  React.useEffect(() => {
    if (module) {
      console.log('Setting form values for module:', module);
      console.log('Module dependencies:', module.dependencies);
      
      form.reset({
        name: module.name,
        description: module.description || '',
        category: module.category,
        version: module.version || '1.0.0',
        is_active: module.is_active,
        default_limits: module.default_limits || {},
        dependencies: Array.isArray(module.dependencies) ? module.dependencies : []
      });
    }
  }, [module, form]);

  const categories = [
    { value: 'core', label: 'Core' },
    { value: 'business', label: 'Business' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' },
    { value: 'configuration', label: 'Configuration' },
    { value: 'system-admin', label: 'System Admin' },
    { value: 'tenant-admin', label: 'Tenant Admin' }
  ];

  const onSubmit = async (data: EditModuleFormData) => {
    if (!module) return;
    
    try {
      console.log('Submitting module update with data:', data);
      console.log('Dependencies being saved:', data.dependencies);
      
      const updates = {
        name: data.name,
        description: data.description || '',
        category: data.category,
        version: data.version || '1.0.0',
        is_active: data.is_active,
        default_limits: data.default_limits || {},
        dependencies: data.dependencies || []
      };
      
      console.log('Final updates object:', updates);
      
      await updateModule.mutateAsync({ id: module.id, updates });
      
      toast({
        title: "Module Updated",
        description: `${data.name} has been updated successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the module. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDependenciesChange = (dependencies: string[]) => {
    console.log('Dependencies changed to:', dependencies);
    form.setValue('dependencies', dependencies);
  };

  if (!module) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Module - {module.name}</DialogTitle>
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
            onDependenciesChange={handleDependenciesChange}
            currentModuleName={module.name}
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
              disabled={updateModule.isPending}
            >
              {updateModule.isPending ? 'Updating...' : 'Update Module'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModuleDialog;
