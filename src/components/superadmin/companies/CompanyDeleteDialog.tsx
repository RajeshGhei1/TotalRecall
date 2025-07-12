
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { useCompanies } from '@/hooks/useCompanies';
import { toast } from 'sonner';

interface CompanyDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  allCompanies: Company[];
  bulkDeleteIds?: string[];
  onBulkDelete?: () => void;
}

const CompanyDeleteDialog: React.FC<CompanyDeleteDialogProps> = ({
  isOpen,
  onClose,
  company,
  allCompanies,
  bulkDeleteIds,
  onBulkDelete,
}) => {
  const { deleteCompany } = useCompanies();
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Check if this is a bulk delete operation
  const isBulkDelete = !company && bulkDeleteIds && bulkDeleteIds.length > 0;
  const bulkCompanies = isBulkDelete 
    ? allCompanies.filter(c => bulkDeleteIds.includes(c.id))
    : [];

  // Find child companies for single delete
  const childCompanies = company 
    ? allCompanies.filter(c => c.parent_company_id === company.id)
    : [];

  const handleDelete = async () => {
    if (isBulkDelete && onBulkDelete) {
      setIsDeleting(true);
      try {
        await onBulkDelete();
        onClose();
      } catch (error) {
        console.error('Bulk delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    } else if (company) {
      setIsDeleting(true);
      try {
        await deleteCompany.mutateAsync(company.id);
        toast.success('Company deleted successfully');
        onClose();
      } catch (error: unknown) {
        toast.error(`Failed to delete company: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getDialogTitle = () => {
    if (isBulkDelete) {
      return `Delete ${bulkDeleteIds!.length} Companies`;
    }
    return 'Delete Company';
  };

  const getDialogDescription = () => {
    if (isBulkDelete) {
      return `Are you sure you want to delete these ${bulkDeleteIds!.length} companies? This action cannot be undone.`;
    }
    return `Are you sure you want to delete "${company?.name}"? This action cannot be undone.`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-left">
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isBulkDelete ? (
            <div className="space-y-2">
              <p className="font-medium">Companies to be deleted:</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {bulkCompanies.map((comp) => (
                  <div key={comp.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{comp.name}</span>
                    {comp.industry1 && (
                      <Badge variant="outline" className="text-xs">
                        {comp.industry1}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {company && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{company.name}</h4>
                      {company.industry1 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {company.industry1}
                        </p>
                      )}
                      {company.location && (
                        <p className="text-sm text-muted-foreground">
                          {company.location}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline">
                      Level {company.hierarchy_level || 0}
                    </Badge>
                  </div>
                </div>
              )}

              {childCompanies.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <p className="font-medium text-amber-700">
                      Warning: Child Companies Found
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This company has {childCompanies.length} child companies. Deleting this company will also affect the hierarchy structure.
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {childCompanies.map((child) => (
                      <div key={child.id} className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
                        <span className="text-sm">{child.name}</span>
                        <Badge variant="outline" className="text-xs">
                          Level {child.hierarchy_level || 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            loading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDeleteDialog;
