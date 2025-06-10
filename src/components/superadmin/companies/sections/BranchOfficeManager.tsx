
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BranchOfficeForm } from './BranchOfficeForm';
import { BranchOfficesList } from './BranchOfficesList';
import { useBranchOffices, BranchOffice, BranchOfficeFormData } from '@/hooks/useBranchOffices';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BranchOfficeManagerProps {
  companyId: string;
  companyName: string;
}

export const BranchOfficeManager: React.FC<BranchOfficeManagerProps> = ({
  companyId,
  companyName,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState<BranchOffice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    branchOffices,
    isLoading,
    createBranchOffice,
    updateBranchOffice,
    deleteBranchOffice,
  } = useBranchOffices(companyId);

  const handleSubmit = async (data: BranchOfficeFormData) => {
    try {
      if (editingOffice) {
        await updateBranchOffice.mutateAsync({
          id: editingOffice.id,
          data,
        });
      } else {
        await createBranchOffice.mutateAsync({
          companyId,
          data,
        });
      }
      
      setShowForm(false);
      setEditingOffice(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleEdit = (office: BranchOffice) => {
    setEditingOffice(office);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteBranchOffice.mutateAsync(id);
    setDeleteConfirm(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOffice(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">Loading branch offices...</div>
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <BranchOfficeForm
        initialData={editingOffice || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createBranchOffice.isPending || updateBranchOffice.isPending}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <CardTitle>Branch Offices</CardTitle>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch Office
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BranchOfficesList
            branchOffices={branchOffices}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteConfirm(id)}
          />
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch Office</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this branch office? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
