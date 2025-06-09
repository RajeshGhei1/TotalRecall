
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/hooks/useCompanies';

export const useCompanyActions = (refetch: () => void, createCompany: any) => {
  const navigate = useNavigate();
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleAddCompany = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (companyId: string) => {
    navigate(`/superadmin/companies/${companyId}`);
  };

  const handleViewDetails = (companyId: string) => {
    navigate(`/superadmin/companies/${companyId}`);
  };

  const handleDelete = (company: Company) => {
    setCompanyToDelete(company);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;
    
    try {
      // Delete any company relationships first
      const { error: relationshipsError } = await supabase
        .from('company_relationships')
        .delete()
        .eq('company_id', companyToDelete.id);
        
      if (relationshipsError) throw relationshipsError;
      
      // Then delete the company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyToDelete.id);
        
      if (error) throw error;
      
      toast.success(`${companyToDelete.name} deleted successfully`);
      refetch();
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(`Failed to delete company: ${error.message}`);
    } finally {
      setCompanyToDelete(null);
    }
  };

  const handleCreateCompany = async (data: any) => {
    try {
      await createCompany.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Company created successfully');
      refetch();
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(`Failed to create company: ${error.message}`);
    }
  };

  return {
    companyToDelete,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    setCompanyToDelete,
    handleAddCompany,
    handleEdit,
    handleViewDetails,
    handleDelete,
    handleConfirmDelete,
    handleCreateCompany,
  };
};
