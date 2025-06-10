
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import CompanySearch from './CompanySearch';
import CompanyTable from './CompanyTable';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import CreateCompanyDialog from './CreateCompanyDialog';

const CompanyListContainer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { companies, isLoading, refetch, createCompany } = useCompanies();
  
  // Filter companies based on search term
  const filteredCompanies = companies?.filter(company => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      company.name?.toLowerCase().includes(searchLower) ||
      company.industry?.toLowerCase().includes(searchLower) ||
      company.location?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleAddCompany = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (companyId: string) => {
    // For now, navigate to view details - edit functionality can be added later
    navigate(`/superadmin/companies/${companyId}`);
  };

  const handleViewDetails = (companyId: string) => {
    navigate(`/superadmin/companies/${companyId}`);
  };

  const handleDelete = (company: Company) => {
    setCompanyToDelete(company);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <CompanySearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddCompany={handleAddCompany}
      />
      
      <CompanyTable 
        companies={filteredCompanies}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />
      
      <CompanyDeleteDialog
        isOpen={!!companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        company={companyToDelete}
        allCompanies={companies || []}
      />

      <CreateCompanyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCompany}
        isSubmitting={createCompany.isPending}
      />
    </>
  );
};

export default CompanyListContainer;
