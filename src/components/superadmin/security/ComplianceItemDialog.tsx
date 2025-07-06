import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { ComplianceItem } from '@/hooks/useComplianceItems';

interface ComplianceItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: Omit<ComplianceItem, 'id'>) => void;
  initialData?: ComplianceItem | null;
  loading?: boolean;
}

export const ComplianceItemDialog: React.FC<ComplianceItemDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  loading,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<ComplianceItem, 'id'>>({
    defaultValues: initialData || {
      framework: '',
      requirement: '',
      status: 'compliant',
      last_audit: '',
      next_review: '',
    },
  });

  useEffect(() => {
    reset(initialData || {
      framework: '',
      requirement: '',
      status: 'compliant',
      last_audit: '',
      next_review: '',
    });
  }, [initialData, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Compliance Item' : 'Add Compliance Item'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the compliance item details.' : 'Enter details for the new compliance item.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Framework</label>
            <Input {...register('framework', { required: 'Framework is required' })} placeholder="e.g. GDPR" />
            {errors.framework && <span className="text-red-500 text-xs">{errors.framework.message}</span>}
          </div>
          <div>
            <label className="block mb-1">Requirement</label>
            <Input {...register('requirement', { required: 'Requirement is required' })} placeholder="e.g. Data Processing Records" />
            {errors.requirement && <span className="text-red-500 text-xs">{errors.requirement.message}</span>}
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <select {...register('status', { required: 'Status is required' })} className="w-full border rounded px-2 py-2">
              <option value="compliant">Compliant</option>
              <option value="partial">Partial</option>
              <option value="non_compliant">Non Compliant</option>
            </select>
            {errors.status && <span className="text-red-500 text-xs">{errors.status.message}</span>}
          </div>
          <div>
            <label className="block mb-1">Last Audit</label>
            <Input type="date" {...register('last_audit', { required: 'Last audit date is required' })} />
            {errors.last_audit && <span className="text-red-500 text-xs">{errors.last_audit.message}</span>}
          </div>
          <div>
            <label className="block mb-1">Next Review</label>
            <Input type="date" {...register('next_review', { required: 'Next review date is required' })} />
            {errors.next_review && <span className="text-red-500 text-xs">{errors.next_review.message}</span>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Add')}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 