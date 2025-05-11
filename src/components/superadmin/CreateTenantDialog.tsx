
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExtendedTenantForm } from '@/components/superadmin/tenant-form';

interface CreateTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const CreateTenantDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateTenantDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Add a new organization to the JobMojo.ai platform.
          </DialogDescription>
        </DialogHeader>

        <ExtendedTenantForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenantDialog;
