
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface CompanyDeleteDialogProps {
  company: any | null;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  isOpen: boolean; // Added isOpen prop
}

const CompanyDeleteDialog: React.FC<CompanyDeleteDialogProps> = ({
  company,
  onClose,
  onConfirm,
  companyName,
  isOpen, // Added isOpen prop
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Company
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{companyName}</span>?
            This action cannot be undone and will permanently remove the company and all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDeleteDialog;
