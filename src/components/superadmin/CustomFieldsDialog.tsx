
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomFieldsManager } from '@/components/customFields';

interface CustomFieldsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
}

const CustomFieldsDialog = ({
  isOpen,
  onClose,
  tenantId,
  tenantName,
}: CustomFieldsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Custom Fields - {tenantName}</DialogTitle>
          <DialogDescription>
            Define custom fields that can be filled when creating or editing this tenant.
          </DialogDescription>
        </DialogHeader>

        <CustomFieldsManager tenantId={tenantId} />
      </DialogContent>
    </Dialog>
  );
};

export default CustomFieldsDialog;
