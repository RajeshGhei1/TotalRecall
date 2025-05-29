
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useCreateFormDefinition } from '@/hooks/forms/useFormDefinitions';
import { FormDefinition } from '@/types/form-builder';

interface CreateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (form: FormDefinition) => void;
}

interface FormData {
  name: string;
  description: string;
  slug: string;
}

const CreateFormDialog: React.FC<CreateFormDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>();
  const createFormMutation = useCreateFormDefinition();
  
  const watchedName = watch('name');

  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedName, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = {
        name: data.name,
        description: data.description || undefined,
        slug: data.slug,
        is_active: true,
        settings: {},
      };

      const newForm = await createFormMutation.mutateAsync(formData);
      reset();
      onSuccess(newForm);
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Create a new dynamic form to collect and manage data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Form Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Form name is required' })}
              placeholder="Enter form name"
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
              placeholder="form-url-slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the form"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createFormMutation.isPending}
            >
              {createFormMutation.isPending ? 'Creating...' : 'Create Form'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormDialog;
