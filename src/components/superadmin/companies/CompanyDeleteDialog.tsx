
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, AlertCircle } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCompanyPeopleRelationship } from '@/hooks/useCompanyPeopleRelationship';

interface CompanyDeleteDialogProps {
  company: Company | null;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  isOpen: boolean;
}

const CompanyDeleteDialog: React.FC<CompanyDeleteDialogProps> = ({
  company,
  onClose,
  onConfirm,
  companyName,
  isOpen,
}) => {
  const [checking, setChecking] = useState(false);
  const [hasRelationships, setHasRelationships] = useState(false);
  const { relationships } = useCompanyPeopleRelationship(company?.id);
  
  React.useEffect(() => {
    if (company && isOpen) {
      setChecking(true);
      setHasRelationships(relationships && relationships.length > 0);
      setChecking(false);
    }
  }, [company, relationships, isOpen]);

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
        
        {hasRelationships && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This company has {relationships?.length} people associated with it. Deleting it will remove all relationships.
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm}
            disabled={checking}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDeleteDialog;
