
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

const editModuleSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  version: z.string().optional(),
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
      form.reset({
        name: module.name,
        description: module.description || '',
        category: module.category,
        version: module.version || '1.0.0',
        is_active: module.is_active,
        default_limits: module.default_limits || {},
        dependencies: module.dependencies || []
      });
    }
  }, [module, form]);

  const categories = [
    { value: 'core', label: 'Core' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'recruitment', label: 'Recruitment' },
    { value: 'talent', label: 'Talent Management' }
  ];

  const onSubmit = async (data: EditModuleFormData) => {
    if (!module) return;
    
    try {
      await updateModule.mutateAsync({ id: module.id, updates: data });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  if (!module) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Module Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="e.g., Advanced Analytics"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Brief description of the module functionality"
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                {...form.register('version')}
                placeholder="1.0.0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Active Module</Label>
          </div>

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
