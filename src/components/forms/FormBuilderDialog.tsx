
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormDefinition } from '@/types/form-builder';
import FormBuilder from './FormBuilder';

interface FormBuilderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: FormDefinition | null;
}

const FormBuilderDialog: React.FC<FormBuilderDialogProps> = ({
  isOpen,
  onClose,
  form,
}) => {
  if (!form) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Form Builder - {form.name}</DialogTitle>
        </DialogHeader>
        <div className="h-[calc(90vh-100px)] overflow-hidden">
          <FormBuilder form={form} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormBuilderDialog;
