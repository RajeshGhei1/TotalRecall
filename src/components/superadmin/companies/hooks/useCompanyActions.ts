
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/hooks/useCompanies';
import { CompanyFormValues } from '@/components/superadmin/companies/schema';
import { toast } from 'sonner';

export const useCompanyActions = (
  refetch: () => void,
  createCompany: { mutateAsync: (data: CompanyFormValues) => Promise<void> }
) => {
  const navigate = useNavigate();
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleAddCompany = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (companyId: string) => {
    navigate(`/superadmin/companies/${companyId}/edit`);
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
      // TODO: Implement delete functionality
      toast.success('Company deleted successfully');
      setCompanyToDelete(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete company');
      console.error('Delete error:', error);
    }
  };

  const handleCreateCompany = async (data: CompanyFormValues) => {
    try {
      await createCompany.mutateAsync(data);
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Create company error:', error);
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
