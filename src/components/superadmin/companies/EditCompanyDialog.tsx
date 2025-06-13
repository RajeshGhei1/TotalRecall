
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Company } from '@/hooks/useCompanies';

interface EditCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({
  isOpen,
  onClose,
  company,
  onSubmit,
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: company.name || '',
      website: company.website || '',
      email: company.email || '',
      phone: company.phone || '',
      location: company.location || '',
      description: company.description || '',
      industry1: company.industry1 || '',
      size: company.size || '',
      founded: company.founded || '',
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the company information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Company name is required' })}
                error={errors.name?.message}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...register('website')}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
              />
            </div>

            <div>
              <Label htmlFor="industry1">Primary Industry</Label>
              <Input
                id="industry1"
                {...register('industry1')}
              />
            </div>

            <div>
              <Label htmlFor="size">Company Size</Label>
              <Input
                id="size"
                {...register('size')}
              />
            </div>

            <div>
              <Label htmlFor="founded">Founded Year</Label>
              <Input
                id="founded"
                type="number"
                {...register('founded')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
