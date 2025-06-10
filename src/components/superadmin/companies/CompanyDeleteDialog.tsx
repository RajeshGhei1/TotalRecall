
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, AlertCircle, Building2, Users, Network } from 'lucide-react';
import { Company } from '@/hooks/useCompanies';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCompanyDeletion } from '@/hooks/useCompanyDeletion';
import { Badge } from '@/components/ui/badge';

interface CompanyDeleteDialogProps {
  company: Company | null;
  onClose: () => void;
  isOpen: boolean;
  allCompanies: Company[];
}

const CompanyDeleteDialog: React.FC<CompanyDeleteDialogProps> = ({
  company,
  onClose,
  isOpen,
  allCompanies,
}) => {
  const [deletionInfo, setDeletionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { deleteCompany, checkDeletionInfo, isDeleting } = useCompanyDeletion();
  
  useEffect(() => {
    if (company && isOpen) {
      setLoading(true);
      checkDeletionInfo(company, allCompanies)
        .then(setDeletionInfo)
        .finally(() => setLoading(false));
    }
  }, [company, isOpen, allCompanies]);

  const handleConfirmDelete = async () => {
    if (!company) return;
    
    try {
      await deleteCompany.mutateAsync(company);
      onClose();
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Company
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{company.name}</span>?
            This action cannot be undone and will permanently remove the company and all associated data.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="py-4 text-center text-sm text-gray-500">
            Checking deletion requirements...
          </div>
        ) : deletionInfo && (
          <div className="space-y-4">
            {/* Impact Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Network className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-sm font-medium">{deletionInfo.childCompaniesCount}</div>
                <div className="text-xs text-gray-500">Child Companies</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-sm font-medium">{deletionInfo.branchOfficesCount}</div>
                <div className="text-xs text-gray-500">Branch Offices</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-sm font-medium">{deletionInfo.relationshipsCount}</div>
                <div className="text-xs text-gray-500">People Links</div>
              </div>
            </div>

            {/* Warnings */}
            {deletionInfo.warnings.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">This deletion will:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {deletionInfo.warnings.map((warning: string, index: number) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Special handling for child companies */}
            {deletionInfo.hasChildCompanies && (
              <Alert>
                <Network className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Child companies will be updated:</div>
                    <div className="text-sm">
                      All child companies will have their parent company reference removed and their hierarchy level reset to 0.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleConfirmDelete}
            disabled={loading || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Company'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDeleteDialog;
