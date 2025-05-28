
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTenantModules } from '@/hooks/modules/useTenantModules';
import { SystemModule } from '@/hooks/modules/useSystemModules';

const assignModuleSchema = z.object({
  tenant_id: z.string().min(1, "Tenant is required"),
  module_id: z.string().min(1, "Module is required"),
  is_enabled: z.boolean(),
  expires_at: z.string().optional()
});

type AssignModuleFormData = z.infer<typeof assignModuleSchema>;

interface AssignModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: SystemModule[];
  tenants: Array<{ id: string; name: string; }>;
}

const AssignModuleDialog: React.FC<AssignModuleDialogProps> = ({
  open,
  onOpenChange,
  modules,
  tenants
}) => {
  const { assignModule } = useTenantModules();
  
  const form = useForm<AssignModuleFormData>({
    resolver: zodResolver(assignModuleSchema),
    defaultValues: {
      tenant_id: '',
      module_id: '',
      is_enabled: true,
      expires_at: ''
    }
  });

  const onSubmit = async (data: AssignModuleFormData) => {
    try {
      const assignmentData = {
        tenant_id: data.tenant_id,
        module_id: data.module_id,
        is_enabled: data.is_enabled,
        expires_at: data.expires_at || undefined
      };
      
      await assignModule.mutateAsync(assignmentData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error assigning module:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Module to Tenant</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant">Tenant</Label>
            <Select 
              value={form.watch('tenant_id')}
              onValueChange={(value) => form.setValue('tenant_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.tenant_id && (
              <p className="text-sm text-red-500">{form.formState.errors.tenant_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">Module</Label>
            <Select 
              value={form.watch('module_id')}
              onValueChange={(value) => form.setValue('module_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    <div className="flex flex-col">
                      <span>{module.name}</span>
                      <span className="text-xs text-muted-foreground">{module.category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.module_id && (
              <p className="text-sm text-red-500">{form.formState.errors.module_id.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_enabled"
              checked={form.watch('is_enabled')}
              onCheckedChange={(checked) => form.setValue('is_enabled', checked)}
            />
            <Label htmlFor="is_enabled">Enable Module</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              {...form.register('expires_at')}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={assignModule.isPending}
            >
              {assignModule.isPending ? 'Assigning...' : 'Assign Module'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModuleDialog;
