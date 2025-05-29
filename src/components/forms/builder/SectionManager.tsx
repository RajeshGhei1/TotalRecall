
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
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useCreateFormSection } from '@/hooks/forms/useFormSections';

interface SectionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
}

interface SectionFormData {
  name: string;
  description: string;
  is_collapsible: boolean;
}

const SectionManager: React.FC<SectionManagerProps> = ({
  isOpen,
  onClose,
  formId,
}) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<SectionFormData>({
    defaultValues: {
      is_collapsible: false,
    },
  });
  
  const createSectionMutation = useCreateFormSection();
  const isCollapsible = watch('is_collapsible');

  const onSubmit = async (data: SectionFormData) => {
    try {
      const sectionData = {
        form_id: formId,
        name: data.name,
        description: data.description || undefined,
        is_collapsible: data.is_collapsible,
        sort_order: 0,
      };

      await createSectionMutation.mutateAsync(sectionData);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Form Section</DialogTitle>
          <DialogDescription>
            Organize your form fields into logical sections.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Section Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Section name is required' })}
              placeholder="Enter section name"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of this section"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_collapsible"
              checked={isCollapsible}
              onCheckedChange={(checked) => setValue('is_collapsible', !!checked)}
            />
            <Label htmlFor="is_collapsible">Make this section collapsible</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createSectionMutation.isPending}
            >
              {createSectionMutation.isPending ? 'Creating...' : 'Create Section'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionManager;
