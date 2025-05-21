
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CompanyDeleteDialogProps {
  company: Company | null;
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean; // Added missing prop
  companyName?: string; // Added missing prop
}

const CompanyDeleteDialog: React.FC<CompanyDeleteDialogProps> = ({
  company,
  onClose,
  onConfirm,
  isOpen,
  companyName
}) => {
  const queryClient = useQueryClient();
  const displayName = companyName || company?.name || '';
  const isDialogOpen = isOpen !== undefined ? isOpen : !!company;

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      onConfirm();
      
      toast.success("Company Deleted", {
        description: "The company has been successfully removed."
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: `Failed to delete company: ${error.message}`
      });
    },
  });

  const confirmDelete = () => {
    if (company) {
      deleteMutation.mutate(company.id);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {displayName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDeleteDialog;
