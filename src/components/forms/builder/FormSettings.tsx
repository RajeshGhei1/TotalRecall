
import React from 'react';
import { FormDefinition } from '@/types/form-builder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useUpdateFormDefinition } from '@/hooks/forms/useFormDefinitions';
import FormModuleAssignments from '../FormModuleAssignments';

interface FormSettingsProps {
  form: FormDefinition;
}

const FormSettings: React.FC<FormSettingsProps> = ({ form }) => {
  const updateFormMutation = useUpdateFormDefinition();

  const handleFieldUpdate = async (field: string, value: any) => {
    try {
      await updateFormMutation.mutateAsync({
        id: form.id,
        updates: { [field]: value },
      });
    } catch (error) {
      console.error('Failed to update form:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Form Settings</h2>
        <p className="text-muted-foreground">Configure form properties and access controls.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the form's basic details and metadata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="form-name">Form Name</Label>
              <Input
                id="form-name"
                value={form.name}
                onChange={(e) => handleFieldUpdate('name', e.target.value)}
                placeholder="Enter form name"
              />
            </div>

            <div>
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                value={form.description || ''}
                onChange={(e) => handleFieldUpdate('description', e.target.value)}
                placeholder="Form description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="form-slug">Slug</Label>
              <Input
                id="form-slug"
                value={form.slug}
                onChange={(e) => handleFieldUpdate('slug', e.target.value)}
                placeholder="form-slug"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="form-active">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Whether this form is available for submissions
                </p>
              </div>
              <Switch
                id="form-active"
                checked={form.is_active}
                onCheckedChange={(checked) => handleFieldUpdate('is_active', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
            <CardDescription>
              Configure who can access and submit this form.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="visibility-scope">Visibility Scope</Label>
              <Select
                value={form.visibility_scope}
                onValueChange={(value) => handleFieldUpdate('visibility_scope', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">
                    <div className="flex flex-col">
                      <span>Global</span>
                      <span className="text-xs text-muted-foreground">Available to all tenants</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="tenant_specific">
                    <div className="flex flex-col">
                      <span>Tenant Specific</span>
                      <span className="text-xs text-muted-foreground">Limited to specific tenant</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="module_specific">
                    <div className="flex flex-col">
                      <span>Module Specific</span>
                      <span className="text-xs text-muted-foreground">Requires specific modules</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="access-level">Access Level</Label>
              <Select
                value={form.access_level}
                onValueChange={(value) => handleFieldUpdate('access_level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex flex-col">
                      <span>Public</span>
                      <span className="text-xs text-muted-foreground">Anyone can access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="authenticated">
                    <div className="flex flex-col">
                      <span>Authenticated</span>
                      <span className="text-xs text-muted-foreground">Logged in users only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="role_based">
                    <div className="flex flex-col">
                      <span>Role Based</span>
                      <span className="text-xs text-muted-foreground">Specific roles only</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Current Scope</Label>
              <div className="flex gap-2 mt-1">
                <Badge variant={form.visibility_scope === 'global' ? 'default' : 'secondary'}>
                  {form.visibility_scope === 'global' ? 'Global' : 
                   form.visibility_scope === 'tenant_specific' ? 'Tenant Specific' : 'Module Specific'}
                </Badge>
                <Badge variant={form.access_level === 'public' ? 'destructive' : 'outline'}>
                  {form.access_level === 'public' ? 'Public' : 
                   form.access_level === 'authenticated' ? 'Authenticated' : 'Role Based'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Assignments */}
      <FormModuleAssignments form={form} />
    </div>
  );
};

export default FormSettings;
