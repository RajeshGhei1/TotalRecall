
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompanyForm } from './CompanyForm';
import { CompanyFormValues } from './schema';

interface CreateCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormValues) => void;
  isSubmitting: boolean;
}

const CreateCompanyDialog: React.FC<CreateCompanyDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Add a new company to the JobMojo.ai platform.
          </DialogDescription>
        </DialogHeader>

        <CompanyForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCompanyDialog;
