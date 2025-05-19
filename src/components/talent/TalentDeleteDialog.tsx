
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Talent } from "@/types/talent";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TalentDeleteDialogProps {
  talent: Talent | null;
  onClose: () => void;
  onConfirm: () => void;
}

const TalentDeleteDialog: React.FC<TalentDeleteDialogProps> = ({
  talent,
  onClose,
  onConfirm
}) => {
  // Delete talent mutation
  const deleteMutation = useMutation({
    mutationFn: async (talentId: string) => {
      const { error } = await supabase
        .from('talents')
        .delete()
        .eq('id', talentId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      onConfirm();
      
      toast.success("Talent Deleted", {
        description: "The talent has been successfully removed."
      });
    },
    onError: (error) => {
      toast.error("Error", {
        description: `Failed to delete talent: ${error.message}`
      });
    },
  });

  const confirmDelete = () => {
    if (talent) {
      deleteMutation.mutate(talent.id);
    }
  };

  return (
    <Dialog open={!!talent} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {talent?.full_name}? This action cannot be undone.
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

export default TalentDeleteDialog;
