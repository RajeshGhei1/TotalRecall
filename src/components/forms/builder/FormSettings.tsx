
import React from 'react';
import { FormDefinition } from '@/types/form-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useUpdateFormDefinition } from '@/hooks/forms/useFormDefinitions';

interface FormSettingsProps {
  form: FormDefinition;
}

interface SettingsFormData {
  name: string;
  description: string;
  is_active: boolean;
  slug: string;
}

const FormSettings: React.FC<FormSettingsProps> = ({ form }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SettingsFormData>({
    defaultValues: {
      name: form.name,
      description: form.description || '',
      is_active: form.is_active,
      slug: form.slug,
    },
  });

  const updateFormMutation = useUpdateFormDefinition();
  const isActive = watch('is_active');

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateFormMutation.mutateAsync({
        id: form.id,
        updates: {
          name: data.name,
          description: data.description || undefined,
          is_active: data.is_active,
          slug: data.slug,
        },
      });
    } catch (error) {
      console.error('Failed to update form settings:', error);
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Form Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Form name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  {...register('slug', { required: 'Slug is required' })}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active Status</Label>
                  <div className="text-sm text-gray-500">
                    Controls whether the form is available for submissions
                  </div>
                </div>
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
              </div>

              <Button 
                type="submit" 
                disabled={updateFormMutation.isPending}
                className="w-full"
              >
                {updateFormMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Advanced form settings will be available in future updates.</p>
              <p className="text-sm mt-2">
                This will include submission limits, access controls, and integrations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormSettings;
