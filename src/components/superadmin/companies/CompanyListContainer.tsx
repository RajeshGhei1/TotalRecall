
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import CompanySearch from './CompanySearch';
import CompanyTable from './CompanyTable';
import CompanyDeleteDialog from './CompanyDeleteDialog';

const CompanyListContainer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  
  const { companies, isLoading, refetch } = useCompanies();
  
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
    navigate('/superadmin/companies/add');
  };

  const handleEdit = (companyId: string) => {
    navigate(`/superadmin/companies/edit/${companyId}`);
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
        company={companyToDelete}
        companyName={companyToDelete?.name || ''}
        isOpen={!!companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default CompanyListContainer;
