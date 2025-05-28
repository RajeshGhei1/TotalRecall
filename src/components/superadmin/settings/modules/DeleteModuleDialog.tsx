
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { useSystemModules } from '@/hooks/modules/useSystemModules';

interface DeleteModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: any;
}

const DeleteModuleDialog: React.FC<DeleteModuleDialogProps> = ({ 
  open, 
  onOpenChange, 
  module 
}) => {
  const { deleteModule } = useSystemModules();

  const handleDelete = async () => {
    if (!module) return;
    
    try {
      await deleteModule.mutateAsync(module.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  if (!module) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Module</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the module "{module.name}"? This action cannot be undone.
            All subscription plans using this module will need to be updated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteModule.isPending}
          >
            {deleteModule.isPending ? 'Deleting...' : 'Delete Module'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModuleDialog;
